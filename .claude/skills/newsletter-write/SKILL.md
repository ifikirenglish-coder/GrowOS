---
name: newsletter-write
description: "Write a newsletter from idea to polished draft. Picks email type, writes subject lines, drafts the email, and saves it."
argument-hint: "[topic or idea]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Newsletter Write

**Purpose:** Complete workflow from topic idea to polished newsletter draft, ready for review.
**When to use:** When you want to write a newsletter or email to your list.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Load Context

Load these files before starting:

1. `[active-business]/brand.md (Section 4: Brand Voice)` — writing voice
2. `[active-business]/lessons.md` — rules from past feedback
3. `system/references/email-types.md` — the 5 email type templates

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1a — Check Content Bank

Load `[active-business]/content-ideas.md` if it exists. Scan the "Ready to Write" section for ideas tagged `[NL]` or `[ALL]`. Present the top 3 most timely ideas as starting points (sorted by "Why now" relevance).

If the content bank has good options, present them: "I found these newsletter-ready ideas in your content bank: [list]. Want to use one, or do you have a different topic?"

---

## Step 1b — Get the Topic

**If the user picked a content bank idea:** Use it. Move to Step 2.

**If the user provided a topic or idea:** Use it. Move to Step 2.

**If no topic and no content bank ideas:** Help them find one. Check these sources:

1. `[active-business]/output/` — recent content that could be repurposed
2. Recent industry trends or common audience pain points from `[active-business]/audiences/`

Suggest 3 topic ideas. Let the user pick or provide their own.

---

## Step 2 — Choose Email Type

Present the 5 email types from `system/references/email-types.md`:

- **A) Value/Teaching** — Share a useful insight, framework, or how-to
- **B) Story-to-Lesson** — Personal story with a takeaway the reader can use
- **C) Observation** — Something you noticed + what it means for the reader
- **D) Case Study** — Real result or example broken down step by step
- **E) Curiosity** — Open a loop, challenge an assumption, provoke thought

Ask: "Which type fits this topic best? Pick one, or I'll suggest based on the topic."

If the user doesn't pick, auto-detect the best fit based on the topic and explain why.

---

## Step 3 — Write Subject Lines

Write 3 subject line options:

- 4-8 words each
- Curiosity-driven (the reader should want to open)
- No clickbait or false promises
- No ALL CAPS words
- Match the brand's voice

Present all 3 and let the user pick their favorite or ask for more options.

---

## Step 4 — Write the Draft

Follow the chosen email type template from `system/references/email-types.md`. Key rules:

- **Open strong.** First line should hook. No "Hey [Name]," or "I hope this email finds you well."
- **One idea per email.** Don't try to cover everything.
- **Conversational tone.** Match the brand's brand.md Section 4 (Brand Voice) exactly.
- **Grade 8 or lower** reading level.
- **No em dashes.** Use periods, commas, colons, or parentheses instead.
- **No fabrication.** Only use real stories and data. Use `[PLACEHOLDER]` for anything unverified.
- **End with a clear CTA** or thought-provoking question. Not both.
- **Sign off** using the brand's preferred sign-off from brand.md Section 4 (Brand Voice).

Target length: 300-600 words (readers skim, keep it tight).

---

## Step 5 — Humanize

Run `/humanize` on the draft before presenting it.

Check for and fix:
- Rule of three patterns (AI loves groups of three)
- Negative parallelisms
- Vague AI language ("In today's world...", "It's no secret that...")
- Too-clean structure (every paragraph the same length)
- Marketing-copy phrasing that sounds like a template
- Even rhythm without variation

---

## Step 6 — Present the Draft

Show the user:

1. **Selected subject line** (with the other options noted)
2. **The full email draft**
3. **Email type used** and why

Format the email clearly so they can read it as their subscribers would.

---

## Step 7 — Save

Save the draft to: `[active-business]/output/newsletters/drafts/YYYY-MM-DD-slug.md`

Use today's date and a short slug from the topic (e.g., `2026-03-19-why-simple-wins.md`).

Include metadata at the top of the file:

```markdown
---
subject: "The chosen subject line"
type: Value/Teaching (or whichever was chosen)
status: draft
date: YYYY-MM-DD
---
```

---

## Step 8 — Update Content Bank

If the newsletter was based on an idea from `[active-business]/content-ideas.md`, move that idea from "Ready to Write" to the "Used" section with today's date and format note:

```
- [NL] Topic (used YYYY-MM-DD, format: newsletter)
```

---

## Feedback Capture

After presenting the draft:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes to the draft
2. Add a concise, actionable rule to `[active-business]/lessons.md` under the newsletters section
3. Present the updated version
