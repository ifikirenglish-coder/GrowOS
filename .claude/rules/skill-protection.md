# Skill Protection Rules

These rules apply whenever modifying any file inside `.claude/skills/`.

---

## Auto-Backup Before Modification

Before editing or overwriting ANY `SKILL.md` file:

1. Copy the current version to `SKILL.backup-YYYY-MM-DD.md` in the same skill folder
2. If a backup with today's date already exists, append a counter: `SKILL.backup-YYYY-MM-DD-2.md`
3. Then make the modification
4. Tell the user: "Backed up previous version to SKILL.backup-{date}.md"

This applies to:
- Manual edits requested by the user
- Changes made by `/skill-creator`
- Changes made by `/update`
- Any other modification

**Exception:** The `/update` skill handles its own backup logic during system updates. Don't double-backup during updates.

---

## Customer-Created Skills

Skills that are NOT listed in `.claude/system-manifest.json` were created by the customer. These are theirs. Never modify or delete them without explicit permission.

---

## System Skills

Skills listed in `.claude/system-manifest.json` are maintained by GrowOS. Customers can modify them (the backup ensures nothing is lost), but updates may replace them with newer versions.
