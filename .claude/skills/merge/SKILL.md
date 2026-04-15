---
name: merge
description: "Merge GrowOS skills, rules, and settings into an existing Claude Code project. Non-destructive. Use when user says 'merge', 'integrate', 'add to my project', or 'install skills'."
argument-hint: "[path to existing project]"
user-invocable: true
---

# /merge — Integrate GrowOS Into Existing Project

Copies GrowOS skills, rules, and settings into an existing Claude Code project folder without overriding any of the user's work. Designed for users who already have their own `.claude/` setup.

**Trigger:** `/merge`, "merge into my project", "integrate GrowOS", "add skills to my project", "install skills"
**Duration:** 1-2 minutes

---

## Step 1 — Get Target Project Path

Ask the user:

"Where's your existing Claude Code project? Give me the full folder path."

Use AskUserQuestion with options:
- "Let me type the path" (default)
- "It's this folder" (if they're running from their existing project)

Validate the path exists. Check for a `.claude/` folder inside it. If no `.claude/` folder, ask: "This folder doesn't have a .claude/ setup yet. Want me to create one?"

Store the target path as `[target]`.

---

## Step 2 — Scan for Conflicts

Before copying anything, check what already exists:

1. List all folders in `[target]/.claude/skills/`
2. List all files in `[target]/.claude/rules/`
3. Read `[target]/.claude/settings.json` if it exists

Build a conflict report:
- **Skills that already exist** (same folder name in both GrowOS and target)
- **Rules that already exist** (same filename)
- **Settings conflicts** (permissions that differ)

---

## Step 3 — Present Merge Plan

Show the user what will happen:

```
Merge plan:
- Skills to add: [N] new skills (list names)
- Skills to skip: [N] already exist (list names)
- Rules to add: [N] new rules
- Settings: [merge/skip/create]
```

For conflicting skills, ask:

"These skills already exist in your project. What should I do?"

Options via AskUserQuestion:
- **"Skip them"** (keep user's versions, don't touch)
- **"Replace with GrowOS versions"** (back up originals first)
- **"Let me pick one by one"** (show each conflict individually)

---

## Step 4 — Copy Skills

For each GrowOS skill to be merged:

1. Check if `[target]/.claude/skills/[skill-name]/` exists
2. If it exists and user chose "skip," skip it
3. If it exists and user chose "replace," first copy original to `[target]/.claude/skills/[skill-name]/SKILL.backup-before-merge.md`, then copy GrowOS version
4. If it doesn't exist, copy the full skill folder

Copy from the GrowOS `.claude/skills/` directory. Only copy `SKILL.md` files (not backup files).

```bash
# For each skill to merge:
mkdir -p "[target]/.claude/skills/[skill-name]"
cp "SKILL.md" "[target]/.claude/skills/[skill-name]/SKILL.md"
```

---

## Step 5 — Copy Rules

For each rule file in GrowOS `.claude/rules/`:

1. Check if `[target]/.claude/rules/[filename]` exists
2. If it exists, show both versions and ask: "Your rule file differs. Keep yours, use GrowOS version, or merge both?"
3. If it doesn't exist, copy it

```bash
mkdir -p "[target]/.claude/rules"
cp "[rule-file]" "[target]/.claude/rules/[filename]"
```

---

## Step 6 — Merge Settings

Read `[target]/.claude/settings.json` (or create if missing).

Merge the GrowOS permissions into the existing settings:
- **Allow list:** Add any GrowOS permissions that aren't already in the user's allow list. Don't remove anything.
- **Deny list:** Add any GrowOS deny rules that aren't already present. Don't remove anything.

Show the user the proposed merged settings before saving:

```
Settings merge:
- Adding to allow: [list new permissions]
- Adding to deny: [list new deny rules]
- Keeping your existing: [list unchanged permissions]
```

Use AskUserQuestion to confirm before writing.

---

## Step 7 — Copy System References

Copy the `system/` folder to the target project:

```bash
cp -r "system/" "[target]/system/"
```

This gives them the reference files (headline-types, hook-types, email-types, social-post-types), browser helpers, business template, and config guides.

If `[target]/system/` already exists, ask before overwriting.

---

## Step 8 — Update CLAUDE.md (Optional)

Ask: "Want me to add GrowOS instructions to your project's CLAUDE.md?"

Options:
- **"Yes, append them"** — Add the GrowOS routing table and skill reference to the end of their existing CLAUDE.md
- **"No, I'll handle it"** — Skip this step
- **"Create a separate file"** — Save as `[target]/GROWOS.md` that their CLAUDE.md can reference

If appending, add a clear section header:

```markdown
---

## GrowOS Skills

[skill reference table from GrowOS CLAUDE.md]
```

---

## Step 9 — Summary

Present what was done:

```
Merge complete.

Added: [N] skills, [N] rules
Skipped: [N] existing skills (yours were kept)
Settings: [merged / created / unchanged]
System files: [copied / skipped]

Your existing work was not modified. To use GrowOS skills, just type the
slash command (e.g., /social-write) or describe what you need.
```

---

## Hard Rules

- **Never overwrite without asking.** Every conflict gets a user decision.
- **Always back up before replacing.** If the user chooses to replace an existing skill, back up the original first.
- **Don't modify user's CLAUDE.md without permission.** Only append if explicitly approved.
- **Don't delete anything.** This is an additive operation only.
- **Don't copy backup files.** Only copy active SKILL.md files, not `.backup-*` files.
- **AskUserQuestion for all decisions.**
