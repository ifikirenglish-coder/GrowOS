---
name: skill-creator
description: "Build custom workflows through guided conversation. Create your own slash commands for repetitive tasks."
argument-hint: "[what the skill should do]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Skill Creator

**Purpose:** Build custom Claude Code skills (slash commands) through an interview process. No coding needed.
**When to use:** When you have a repetitive workflow you want to automate.
**Output:** A new skill in `.claude/skills/[skill-name]/SKILL.md`

---

## Step 1 — Understand the Goal

Ask using AskUserQuestion:

"What do you want this skill to do? Describe the workflow in your own words. For example:
- 'I want to turn podcast transcripts into 5 social posts'
- 'I want to analyze any landing page and give me a report'
- 'I want to create email subject line variations'"

Follow up with:
1. "What's the input? (text you paste, a URL, a file, something else?)"
2. "What's the output? (a document, social posts, a report, something to copy-paste?)"
3. "Are there any rules or constraints? (tone, length, format, things to avoid)"

---

## Step 2 — Design the Workflow

Based on their answers, design a step-by-step workflow:

1. **Context Loading** — What files/references need to be loaded?
   - Always include: brand.md (Section 4: Brand Voice), lessons.md
   - Add skill-specific references if relevant

2. **Input Processing** — How to handle what the user provides
   - URL → fetch and extract
   - Pasted text → parse and analyze
   - Topic → research or brainstorm

3. **Main Work** — The core steps of the skill
   - Break into 3-7 clear steps
   - Each step should produce a visible result

4. **Quality Check** — If content is produced, add humanizer check

5. **Output** — Where and how to save
   - File path within brand output folder
   - Format template

6. **Feedback Loop** — Ask for feedback, apply + save lesson

Present the workflow to the user: "Here's the workflow I'd build. Each step happens in order:
[list steps]
Does this match what you're thinking?"

---

## Step 3 — Name and Configure

Ask:
1. "What should the command be? (e.g., `/podcast-to-social`)"
2. "A one-line description for the skill?"
3. "What trigger words should activate it? (e.g., 'podcast posts', 'transcript to social')"

---

## Step 4 — Build the Skill

Create the skill file at `.claude/skills/[skill-name]/SKILL.md` following the GrowOS conventions:

**Frontmatter:**
```yaml
---
name: [skill-name]
description: "[their description]"
argument-hint: "[appropriate hint]"
user-invocable: true
---
```

**Structure:**
- Step 0: Context Loading (brand.md Section 4: Brand Voice + lessons.md + any references)
- Steps 1-N: The workflow steps from Step 2
- Quality gate (if content skill): Run `/humanize`
- Output saving: `[active-business]/output/[category]/`
- Feedback capture: Ask for feedback, apply + save lesson

**Rules applied automatically:**
- No em dashes in examples or templates
- No fabrication instructions
- AskUserQuestion for decisions
- Conversational tone in all instructions

---

## Step 5 — Test

Tell the user: "Your skill is ready. Try it by typing `/[skill-name]` in a new message. If anything needs adjusting, just tell me and I'll update it."

If they test it and give feedback, update the skill file immediately.

---

## Tips for Users

- Skills are just markdown files. You can edit them directly in any text editor.
- Each skill lives in `.claude/skills/[name]/SKILL.md`
- Skills can reference other skills (e.g., "Run `/humanize`")
- The more specific your workflow steps, the more consistent the output
- Add examples of good/bad output to the skill to improve quality
