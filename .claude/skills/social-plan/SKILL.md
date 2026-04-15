---
name: social-plan
description: "Plan a full week of social content across your active platforms. Generates a day-by-day schedule with topics, hooks, and intent types."
argument-hint: "[week start date or theme]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Social Plan

**Purpose:** Create a complete weekly social content plan with topics, intent types, and hooks for each platform.
**When to use:** When you need to plan what to post this week (or next week).

---

## Step 0 — Load Context

Load these files before starting:

1. `[active-business]/brand.md` (Section 4: Brand Voice) — writing voice
2. `[active-business]/lessons.md` — rules from past feedback
3. `system/references/social-post-types.md` — the 7 intent types and recommended weekly mix

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Platforms

Ask: "Which platforms are you active on this week?"

Options: X (Twitter), LinkedIn, Facebook, Instagram

If the brand has posted before, check `[active-business]/output/social/` for previous plans to infer their usual platforms.

Default to what they say. Don't push platforms they're not on.

---

## Step 1b — Check Content Bank

Load `[active-business]/content-ideas.md` if it exists. Scan the "Ready to Write" section for ideas tagged `[TW]`, `[LI]`, `[FB]`, `[IG]`, or `[ALL]`.

If ripe ideas exist, present them: "I found these social-ready ideas in your content bank: [list with tags and hooks]. Want to build the week around any of these?"

These ideas become starting points for the weekly plan. The user can pick some, all, or none.

---

## Step 2 — Weekly Context

Ask: "Anything specific happening this week? Launches, events, promotions, or themes you want to build around?"

Also check:
- `[active-business]/audiences/` — pain points and desires to address

If nothing specific, that's fine. The plan will be built from evergreen topics and audience needs.

---

## Step 3 — Generate the Weekly Plan

Using the 7 intent types from `system/references/social-post-types.md`, create a balanced weekly plan.

**Rules:**
- Spread intent types across the week (don't cluster all "Value" posts on Monday)
- Adapt post count per platform to what's reasonable:
  - X: 10-14 posts/week (1-2 per day)
  - LinkedIn: 3-5 posts/week
  - Facebook: 3-5 posts/week
  - Instagram: 3-5 posts/week
- Each post gets: a day, platform, intent type, topic/angle, and a rough hook idea
- Mix content that educates, entertains, and sells (heavy on the first two)
- If a launch or event was mentioned, build posts that lead up to and support it

---

## Step 4 — Present the Plan

Show the plan as a clear table:

```
| Day       | Platform  | Type          | Topic / Hook                          |
|-----------|-----------|---------------|---------------------------------------|
| Monday    | X         | Value         | [Topic + rough hook]                  |
| Monday    | LinkedIn  | Story         | [Topic + rough hook]                  |
| Tuesday   | X         | Observation   | [Topic + rough hook]                  |
| ...       | ...       | ...           | ...                                   |
```

After the table, add a brief summary:
- Total posts per platform
- Intent type distribution

---

## Step 5 — Adjust

Ask: "Want to swap any topics, change types, or add/remove posts? I can also shift the balance if you want more of one type."

Apply any changes the user requests. Present the updated plan.

Repeat until they're happy.

---

## Step 6 — Save

Save the final plan to: `[active-business]/output/social/plans/week-YYYY-MM-DD.md`

Use the Monday date of the planned week.

Include metadata at the top:

```markdown
---
week-of: YYYY-MM-DD
platforms: [X, LinkedIn, Facebook]
total-posts: 18
status: planned
---
```

After saving:
- Mark any content bank ideas that were included in the plan as `[SCHEDULED YYYY-MM-DD]` in `[active-business]/content-ideas.md` (keep them in Ready to Write, just add the tag).
- Mention: "When you're ready to write these posts, run `/social-write` and I'll use this plan as the starting point."

---

## Feedback Capture

After presenting the final plan:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your lessons.md so I remember next time."

If feedback is given:
1. Apply the changes to the plan
2. Add a concise, actionable rule to `[active-business]/lessons.md` under the social media section
3. Present the updated version
