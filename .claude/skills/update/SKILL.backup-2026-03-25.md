---
name: update
description: "Update GrowOS to a new version. Safely handles your customizations, backs up modified skills, and lets you choose how to handle conflicts."
argument-hint: "[path to update folder or zip]"
user-invocable: true
---

# /update — GrowOS Update

Safely update GrowOS system files while preserving all customer customizations.

---

## Step 0 — Find the Update

Ask the user where the update is. Accept either:
- A path to an **unzipped folder** (e.g., `~/Downloads/GrowOS`)
- A path to a **zip file** (e.g., `~/Downloads/GrowOS.zip`)

If they provide a zip, extract it to a temporary location first:
```bash
unzip -o "/path/to/GrowOS.zip" -d "/tmp/growos-update-$(date +%s)"
```

Verify the update folder is valid by checking it contains:
- A `VERSION` file
- A `.claude/system-manifest.json` file

If either is missing, tell the user: "This doesn't look like a GrowOS update. Make sure you're pointing to the right folder." and stop.

---

## Step 1 — Compare Versions

Read `VERSION` from both the current installation and the update folder.

Tell the user:
```
Current version: X.X.X
Update version:  Y.Y.Y
```

If the update version is the same or older, ask if they want to continue anyway. If they say no, stop.

---

## Step 2 — Read Both Manifests

Read `.claude/system-manifest.json` from both the current installation and the update.

The manifest lists every official GrowOS file with a checksum (fingerprint). This is how we know:
- Which files are official GrowOS files vs files you created
- Which files you've modified since the last update

---

## Step 3 — Classify Every Skill

For each skill in the **update manifest**, classify it:

### Check if it exists locally
- **No** → It's a NEW skill added in this update. Mark as `new`.

### Check if it exists in the current manifest
- **No** (exists on disk but not in current manifest) → This shouldn't happen, but treat as customer-modified. Mark as `conflict`.

### Compare checksums
Run `shasum -a 256` on the local file and compare to the **current** manifest's checksum:
- **Matches current manifest** → Customer hasn't touched it. Mark as `clean`.
- **Doesn't match** → Customer modified it. Mark as `modified`.

For `clean` skills, also check if the update actually changes anything:
- Compare current manifest checksum to update manifest checksum
- **Same** → No update needed. Mark as `unchanged`.
- **Different** → Mark as `updated`.

### Customer-created skills
Any skill on disk that's NOT in the update manifest AND NOT in the current manifest is a customer-created skill. Mark as `customer` (never touch).

---

## Step 4 — Classify System Files and Rules

Do the same classification for:
- Files in the `rules` section of the manifest (`.claude/rules/`)
- Files in the `files` section of the manifest (references, getting-started, etc.)

Same logic: `new`, `unchanged`, `clean` (safe to replace), `modified` (needs decision).

---

## Step 5 — Show the Update Summary

Present a clear summary using AskUserQuestion:

```
## GrowOS Update Summary (vX.X.X → vY.Y.Y)

### Skills
- X skills unchanged (no update needed)
- X skills will be updated (you haven't modified them)
- X new skills will be added
- X skills you've modified need your input (listed below)

### System Files
- X files will be updated
- X files you've modified need your input

### Your Custom Skills (untouched)
- /your-custom-skill-1
- /your-custom-skill-2
```

Ask: "Ready to proceed? I'll update the safe files first, then walk you through the ones you've modified."

---

## Step 6 — Apply Safe Updates

For all `clean` skills and files (customer hasn't modified them):
1. Copy the new version from the update folder, replacing the current one
2. Log what was updated

For all `new` skills and files:
1. Copy from the update folder
2. Log what was added

For `unchanged` items: skip (nothing to do).

Tell the user what was done:
```
Updated X skills, added Y new skills, updated Z system files.
```

---

## Step 7 — Handle Modified Skills (Interview)

For each `modified` skill, do the following one at a time:

### 7a — Show the Situation

Read three files:
1. The **customer's current version** (on disk)
2. The **new GrowOS version** (from update folder)
3. Identify what the customer changed (diff between current manifest's original and their version)

Briefly summarize:
- What the customer changed (e.g., "You added a step about checking inventory" or "You changed the tone instructions")
- What GrowOS changed in the update (e.g., "We improved the headline generation step and added a new quality check")

### 7b — Ask What They Want

Use AskUserQuestion with these options:

```
The /skill-name skill has changes from both sides:

**Your changes:** [brief summary]
**GrowOS update:** [brief summary]

How would you like to handle this?

A) Update to new GrowOS version (your changes will be backed up)
B) Keep your version (skip the GrowOS update for this skill)
C) Merge both (I'll combine your changes with the update)
```

### 7c — Execute Their Choice

**Option A (Update):**
1. Back up their version to `SKILL.backup-YYYY-MM-DD.md` in the same skill folder
2. Copy the new GrowOS version
3. Tell them: "Updated /skill-name. Your version is backed up at SKILL.backup-{date}.md"

**Option B (Keep):**
1. Do nothing to the skill file
2. Update the manifest checksum to match their current file (so future updates don't flag it again as modified, UNLESS the update changes this skill again)
   - Actually, DON'T update the manifest. Keep the original checksum so future updates still detect the divergence. The customer chose to keep their version and should be asked again next time.
3. Tell them: "Keeping your version of /skill-name."

**Option C (Merge):**
1. Back up their version to `SKILL.backup-YYYY-MM-DD.md`
2. Ask the customer: "Before I merge, can you tell me briefly why you made these changes? This helps me keep what matters."
3. Read all three versions carefully:
   - The original GrowOS version (what was shipped before their edits)
   - Their modified version (what they changed and why)
   - The new GrowOS version (what we updated and why)
4. Create a merged skill that:
   - Includes all improvements from the new GrowOS version
   - Preserves the customer's intentional changes
   - Resolves any conflicts intelligently based on the customer's explanation
5. Present the merged version to the customer for approval before saving
6. If they want changes, iterate until they're happy
7. Save the final merged version

---

## Step 8 — Handle Modified System Files

For modified rules and other system files, use the same A/B/C flow as skills. These are usually simpler (rules tend to be shorter), so the summaries can be brief.

**Exception:** Never offer to merge `.claude/settings.json`. Permissions are personal. Always keep the customer's version and just note if new permissions were added that they might want.

---

## Step 9 — Update Manifest and Version

1. Copy the new `system-manifest.json` from the update folder (this becomes the new baseline for future updates)
2. Copy the new `VERSION` file
3. If any skills were kept (Option B) or merged (Option C), note that their checksums will differ from the manifest — this is expected and will be flagged again in future updates

---

## Step 10 — Changelog

Read the `UPDATE.md` from the update folder. The changelog section lists what's new.

Present a friendly summary:
```
## What's New in vY.Y.Y

[Summary of changelog items in plain language]

Your custom skills and brand data are untouched. Everything should work as before.

If anything seems off, just tell me and I'll fix it.
```

---

## Step 11 — Cleanup

If a zip was extracted to a temp folder, delete it:
```bash
rm -rf /tmp/growos-update-*
```

---

## Error Handling

- If the update folder is missing expected files, stop and explain what's wrong
- If a checksum can't be computed, warn the user but continue (treat as modified to be safe)
- If a file copy fails, report it and continue with other files
- Never delete customer files. Ever.
