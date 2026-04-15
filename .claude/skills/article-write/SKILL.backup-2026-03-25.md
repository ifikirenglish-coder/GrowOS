---
name: article-write
description: "Write long-form articles from research to polished draft. Includes topic development, outlining, interviewing, and section-by-section writing."
argument-hint: "[topic or idea]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Article Write

**Purpose:** Create in-depth, long-form articles that sound human and build authority. Covers the full workflow from topic selection through polished draft.
**When to use:** Blog posts, deep-dive articles, guest posts, thought leadership pieces.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Context Loading

Load these files before starting:
- `brands/[active-brand]/voice.md`
- `brands/[active-brand]/lessons.md`
- `system/references/hook-types.md`

To identify the active brand: check if CLAUDE.md lists an active brand. If multiple brands exist and none is specified, ask the user which brand they're working on.

---

## Step 0b — Check Content Bank

Load `brands/[active-brand]/content-ideas.md` if it exists. Scan the "Ready to Write" section for ideas tagged `[ART]` or `[ALL]`. Present the top options as starting points.

If article-ready ideas exist: "I found these article ideas in your content bank: [list with hooks and angles]. Want to develop one of these, or do you have a different topic?"

---

## Step 1 — Determine Topic

**If the user picked a content bank idea:** Use it. Move to Step 2.

**If the user provided a topic:** Confirm it and move on.

**If no topic:** Ask using AskUserQuestion:
"What do you want to write about? You can share:
- A specific topic or title idea
- A problem your audience has
- A question you keep getting asked
- A general theme (I'll help narrow it down)"

If the topic is vague, suggest 3 focused angles and let them pick.

---

## Step 2 — Research Phase

Ask the user what they already know about this topic:

"Before I start outlining, tell me what you know about this topic:
- What's your main argument or point of view?
- What do most people get wrong about this?
- Do you have any data, examples, or results to reference?
- Is there a specific audience segment this is for?"

Load `brands/[active-brand]/audiences/` if they mention a specific persona.

If they reference competitors or want to differentiate, check `brands/[active-brand]/competitors/` for positioning context.

---

## Step 3 — Create Outline

Build an outline with:
- **Working title** (2-3 options using hook patterns from `system/references/hook-types.md`)
- **Hook/intro approach** (which hook type, what it looks like)
- **Sections** (3-7 sections, each with a one-line summary of the key argument)
- **Key proof points** mapped to sections (stories, data, examples)
- **Closing approach** (CTA, takeaway, or call to action)
- **Estimated word count**

Present the outline and ask: "Does this structure work? Want to add, remove, or rearrange anything?"

Wait for approval before writing.

---

## Step 4 — Interview for Stories and Examples

Use AskUserQuestion to dig for personal stories and real examples:

1. "Do you have a personal experience related to [main topic]? Something that happened to you or a client?"
2. "Can you think of a specific before/after example? Someone who had the problem and solved it?"
3. "Any mistakes you've made related to this that readers could learn from?"
4. "Is there an analogy or comparison that helps explain your main point?"

Check `brands/[active-brand]/stories/` for documented stories that match the topic. If found, suggest them: "I found a story in your files about [topic]. Want to include it?"

Never invent stories. If the user doesn't have one, work with what they give or skip the story element.

---

## Step 5 — Write First Draft

Write the article section by section:

1. **Hook/Introduction** — Use the approved hook type. Get to the point in 2-3 short paragraphs max.
2. **Body sections** — Follow the outline. Each section should:
   - Open with a clear claim or transition
   - Support it with proof, examples, or stories from the interview
   - End with a bridge to the next section
3. **Conclusion** — Bring it home. Restate the core idea. Include a clear CTA if appropriate.

**Writing rules:**
- Grade 8 or lower reading level
- Short paragraphs (2-4 sentences max)
- Use subheadings to break up long sections
- Conversational tone throughout (match voice.md)
- No em dashes
- No fabricated stats, testimonials, or results. Use `[PLACEHOLDER]` if needed.
- Vary sentence length. Mix short punchy lines with longer explanations.

---

## Step 6 — Quality Gate

Run `/humanize` on the complete draft before presenting it.

Check for and fix:
- Rule of three patterns (AI loves grouping things in threes)
- Negative parallelisms ("not X, but Y" repeated)
- Vague AI filler ("In today's world...", "It's important to note...")
- Too-clean paragraph structure (every paragraph same length)
- Even rhythm without variation
- Marketing-copy phrasing that doesn't match the brand voice

---

## Step 7 — Present Complete Draft

Show the full article with:
- Title
- Estimated reading time
- Word count

---

## Step 8 — Save Output

Save to `brands/[active-brand]/output/articles/YYYY-MM-DD-slug/`

Create two files:

**article.md** — The complete article

**metadata.md:**
```markdown
# Article Metadata

- **Title:** [title]
- **Date:** [today]
- **Topic:** [topic summary]
- **Target audience:** [persona or description]
- **Word count:** [count]
- **Reading time:** ~[X] min
- **SEO notes:** [primary keyword, secondary keywords if discussed]
- **Status:** Draft
```

---

## Step 9 — Update Content Bank

If the article was based on an idea from `brands/[active-brand]/content-ideas.md`, move that idea from "Ready to Write" to the "Used" section with today's date:

```
- [ART] Topic (used YYYY-MM-DD, format: article)
```

---

## Feedback Capture

After presenting the draft:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes to the article
2. Add the lesson to `brands/[active-brand]/lessons.md` under the appropriate section
3. Show the updated version
