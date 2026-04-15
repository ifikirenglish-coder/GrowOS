---
name: social-write
description: "Write social posts for X, LinkedIn, and Facebook. Works in batch mode (from a weekly plan) or standalone (single post)."
argument-hint: "[topic or 'from plan']"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Social Write

**Purpose:** Write ready-to-publish social posts adapted per platform. Two modes: batch (from weekly plan) or standalone (single post).
**When to use:** When you need to write social posts, either from a plan or on the fly.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Load Context

Load these files before starting:

1. `brands/[active-brand]/voice.md` — writing voice
2. `brands/[active-brand]/lessons.md` — rules from past feedback
3. `system/references/social-post-types.md` — intent types and platform guidelines

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Detect Mode

**Batch mode:** Check `brands/[active-brand]/output/social/plans/` for the most recent weekly plan. If one exists for the current or upcoming week, ask: "I found your plan for week of [date]. Want me to write posts from this plan?"

**Standalone mode:** If no plan exists, or the user wants a single post, switch to standalone mode.

If the user said "from plan" or "write the posts" or similar, go straight to batch mode.

---

## Step 1b (Standalone) — Check Content Bank

In standalone mode, check `brands/[active-brand]/content-ideas.md` if it exists. Scan "Ready to Write" for ideas matching the target platform (use platform tags: `[TW]` for X, `[LI]` for LinkedIn, `[FB]` for Facebook, `[IG]` for Instagram, `[ALL]` for any).

If relevant ideas exist, suggest them: "I found these ideas in your content bank that could work: [list]. Want to use one, or do you have something specific?"

---

## Step 2 (Standalone) — Get Details

Ask:
1. "What's the topic or idea for this post?"
2. "Which intent type?" (Show the 7 types from `system/references/social-post-types.md` as options)
3. "Which platforms?" (X, LinkedIn, Facebook, or all)

---

## Step 2 (Batch) — Load the Plan

Load the most recent weekly plan. Show a summary of what's in it. Ask: "Want me to write all of these, or just specific days/platforms?"

Options:
- Write everything
- Write specific days (e.g., "just Monday and Tuesday")
- Write specific platforms (e.g., "just X posts")
- Write specific posts by picking from the plan

---

## Step 3 — Write the Posts

Write each post adapted to the target platform. Follow these platform rules:

### X (Twitter)
- Max 280 characters (hard limit)
- Short, punchy, conversational
- No links in the main tweet (add link as reply if needed)
- Use line breaks for readability
- No hashtags unless very relevant (1 max)
- Threads: if the topic needs more space, write as a thread (first tweet hooks, rest delivers)

### LinkedIn
- 900-1500 characters (sweet spot for engagement)
- Open with a strong hook line (this shows before "see more")
- Use short paragraphs (1-2 sentences each)
- More professional tone than X, but still conversational
- End with a question or clear takeaway
- No more than 3 hashtags at the bottom

### Facebook
- 300-800 characters (medium length)
- Casual, community-oriented tone
- Image suggestion included (describe what image would work)
- Can be slightly more personal than LinkedIn
- Questions and polls work well here

### All Platforms
- Match the brand's voice.md
- Match the intent type from the plan or user's choice
- No em dashes
- No fabricated data or results
- Grade 8 or lower reading level
- Reference stories from `brands/[active-brand]/stories/_index.md` only when documented

---

## Step 4 — Platform-Specific Polish

After writing, double-check each post against its platform rules:

- **X:** Verify character count is under 280. If over, tighten (don't just truncate).
- **LinkedIn:** Verify the first line hooks before the "see more" fold (~150 chars). Check total is 900-1500 chars.
- **Facebook:** Verify an image suggestion is included. Check tone is warm and approachable.

---

## Step 5 — Humanize

Run `/humanize` on all posts before presenting them.

Check for and fix:
- AI patterns (rule of three, vague openings, parallel structures)
- Generic phrasing that could be from any brand
- Too-polished writing that doesn't sound like a real person
- Unnatural hashtag usage

---

## Step 6 — Present Posts

Group posts by platform for easy review:

```
## X (Twitter)

### Monday — Value
[Post content]

### Wednesday — Observation
[Post content]

---

## LinkedIn

### Monday — Story
[Post content]

### Thursday — Authority
[Post content]

---

## Facebook

### Tuesday — Engagement
[Post content]
Image suggestion: [description]
```

After all posts, show a summary: total count per platform, intent type mix.

---

## Step 7 — Save

Save each platform's posts to its own file:

- `brands/[active-brand]/output/social/x/YYYY-MM-DD-slug.md`
- `brands/[active-brand]/output/social/linkedin/YYYY-MM-DD-slug.md`
- `brands/[active-brand]/output/social/facebook/YYYY-MM-DD-slug.md`

For batch mode, use the week date as slug (e.g., `2026-03-19-week.md`).
For standalone, use the topic as slug (e.g., `2026-03-19-why-simple-systems-win.md`).

Include metadata at the top of each file:

```markdown
---
platform: X
status: draft
date: YYYY-MM-DD
posts: 7
---
```

After saving:
- If any posts were based on content bank ideas, mark them as `[SCHEDULED YYYY-MM-DD]` in `brands/[active-brand]/content-ideas.md` or move to "Used" if they're now complete.
- Mention: "When you're ready to publish, run `/social-publish` to schedule these."

---

## Feedback Capture

After presenting all posts:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes to the affected posts
2. Add a concise, actionable rule to `brands/[active-brand]/lessons.md` under the social media section
3. Present the updated posts
