# Updating GrowOS

When you receive a new GrowOS version, there's a built-in update tool that handles everything safely.

---

## The Easy Way: /update

1. Download the update zip file
2. Unzip it somewhere on your computer (e.g., Downloads)
3. Open your current GrowOS folder in Claude
4. Type: `/update ~/Downloads/GrowOS` (or wherever you unzipped it)

The update tool will:
- Show you what's new
- Replace system files automatically
- Back up any skills you've customized before touching them
- Ask you how to handle conflicts (update, keep yours, or merge both)
- Never touch your brand data, config, or custom skills you've created

---

## What's Yours vs What's Ours

**Your files (never replaced by updates):**

| Path | What it contains |
|------|-----------------|
| `brands/` | Your brand voices, lessons, audiences, stories, output |
| Custom skills you created | Any skill not shipped with GrowOS |

**System files (updated when new versions come out):**

| Path | What it contains |
|------|-----------------|
| `.claude/skills/` | GrowOS workflow skills (the slash commands) |
| `.claude/rules/` | Writing and quality rules |
| `system/references/` | Headline types, hook types, email types |
| `getting-started.md` | Setup instructions |
| `UPDATE.md` | This file |
| `system/VERSION` | Current version number |

---

## If You've Customized a Skill

No problem. When `/update` detects you've modified a GrowOS skill, it gives you three choices:

- **Update:** Replace with the new version (your version is backed up with a timestamp)
- **Keep:** Skip the update for this skill and keep your version
- **Merge:** Combine your changes with the new version (the tool will walk you through it)

Your customizations are always backed up before anything changes.

---

## If Something Breaks

If a skill stops working after an update, tell Claude: "The /skill-name skill isn't working. Can you check the paths?" Claude can usually fix it in seconds.

---

## Changelog

### v1.0.0 (Initial Release)
- 34 skills across 8 categories
- Brand template system with voice, lessons, audiences, stories, competitors
- Reference library (headlines, hooks, email types)
- Social post type framework with weekly schedule template
- Update system with smart conflict resolution
