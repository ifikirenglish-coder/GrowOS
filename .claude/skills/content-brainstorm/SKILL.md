---
name: content-brainstorm
description: "Brainstorm content ideas through interview. Builds your content bank for newsletters, social media, YouTube, articles, and more."
argument-hint: "[topic or idea]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Content Brainstorm

**Purpose:** Generate content ideas for all platforms through personal interviews, trend scanning, and an ongoing content bank.
**When to use:** When you need fresh content ideas, whether for a quick weekly check-in or a deep monthly session.
**Output:** Ideas saved to `[active-business]/content-ideas.md`, ready to pick from when creating content.

---

## Platform Tags

| Tag | Platform |
|-----|----------|
| `[NL]` | Newsletter / Email |
| `[TW]` | Twitter / X |
| `[LI]` | LinkedIn |
| `[FB]` | Facebook |
| `[IG]` | Instagram |
| `[VID]` | Video / YouTube |
| `[ART]` | Article / Blog post |
| `[ALL]` | Multi-platform |

## Intent Types

TEACH / HOT TAKE / STORY / ENGAGE / PROOF / OBSERVE / PROMOTE

---

## Step 0 — Load Context

Load these files before starting:

1. `[active-business]/brand.md` (Section 4: Brand Voice) — writing voice
2. `[active-business]/lessons.md` — rules from past feedback
3. `[active-business]/audiences/` — who you're writing for
4. `[active-business]/content-ideas.md` — current content bank (create from template if it doesn't exist)

If `content-ideas.md` doesn't exist yet, copy from `brands/_template/content-ideas.md` to `[active-business]/content-ideas.md`.

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Mode Selection

Ask using AskUserQuestion: "Quick session (10-15 min) or deep dive (30-45 min)?"

- **Quick** → Go to Step 2Q
- **Deep** → Go to Step 2D
- If unclear, default to quick

---

## Quick Session (~10-15 min)

### Step 2Q — Adaptive Interview

Present all 5 questions as a group (not one at a time):

1. What happened this week that surprised you?
2. Any conversations or interactions that stuck with you?
3. What are you working on or struggling with right now?
4. Did you read, watch, or learn anything interesting?
5. Anything frustrating you about your industry right now?

**Adaptive rule:** When an answer sparks something interesting, go deeper. Ask follow-ups like:
- "Tell me more about that. What specifically stood out?"
- "Why do you think that matters to your audience?"
- "Is there a lesson or principle behind that?"
- "Has something similar happened before?"
- "Could you walk me through the specifics?"

Stop when the well runs dry or after 10-15 minutes of conversation.

**Critical: Save everything with maximum detail.** Capture exact words, specific examples, little nuances, and personal stories. Not just summaries. This raw material is what makes content authentic later. More detail is always better. If in doubt, save it.

→ Go to Step 3

---

## Deep Dive Session (~30-45 min)

### Step 2D — Content Bank Review

Load `[active-business]/content-ideas.md` and analyze:

- How many Ready to Write ideas exist? Break down by platform tag.
- Which platform tags are underrepresented?
- Any stale ideas (added 4+ weeks ago, never used)?
- Anything in Raw Material that's ripened into a real idea?

Brief the user: "You have X ready ideas. [Platform] is well-covered. [Platform] is thin. Here are some raw notes from past sessions that might be worth developing: [list]."

If stale ideas exist, ask: "These have been sitting for a while. Still relevant or should we archive them?" (list the stale ones)

### Step 2D-2 — Extended Interview

Start with the same 5 questions from Step 2Q (present as a group), then go deeper with:

- Any client or customer interactions or feedback recently?
- Decisions you made recently and why?
- Anything that changed your mind about something?
- If you could sit your audience down for 5 minutes, what would you tell them?
- Upcoming launches, events, or milestones?

Spend more time on follow-ups. Intentionally explore areas that fill content bank gaps identified in the review.

**Save all interview material with maximum detail.** Exact words, specific examples, nuances, personal stories.

→ Go to Step 3

---

## Step 3 — Idea Generation

From the interview material, generate content ideas with full metadata.

**Key principle:** A single insight can become multiple format ideas. For example, "I had a client who doubled their email open rate" could become:
- `[NL]` A newsletter deep-dive on what they changed
- `[TW]` A tweet thread breaking down the 3 key moves
- `[LI]` A case study post with the before/after
- `[VID]` A YouTube short walking through the process

For each idea, use this format:

```
- [TAGS] Topic or angle
  - Hook: opening line or angle
  - Story/proof: what personal experience or result supports this?
  - Audience: who this resonates with most
  - Why now: timeliness or relevance
  - Intent type: TEACH / HOT TAKE / STORY / ENGAGE / PROOF / OBSERVE / PROMOTE
```

**Story capture:** If the user shared a personal story or anecdote during the interview, save the full details inside the idea entry under "Story/proof". Include exact words, context, emotions, and specifics. No separate story files needed.

**For quick sessions:** Generate 3-8 ideas depending on how rich the interview was. 0-2 fully developed ideas is fine if the session was light.

**For deep sessions:** Generate 8-15 ideas. Aim for coverage across multiple platforms and intent types.

Present all ideas grouped by platform tag for review. Ask: "Want to adjust any of these? Add angles? Drop any that don't feel right?"

---

## Step 4 — Optional Trend Scan

Ask: "Want me to do a quick scan of what's trending in your space?"

**If yes:**
- Use web search to scan current trends relevant to the brand's industry
- Filter through: "Would your audience care about this?"
- Present 2-3 trends with:
  - What's happening
  - Why it matters to the audience
  - A content angle the user could take
- If any trend pairs well with interview material, combine them into an idea

**If no:** Skip to Step 5.

---

## Step 5 — Save to Content Bank

Save ideas to `[active-business]/content-ideas.md`:

- Fully developed ideas (hook, story, audience, why now, intent type) → **Ready to Write** section
- Raw notes and half-baked thoughts → **Raw Material** section
- All entries include today's date

**For deep sessions only:** Also clean up the bank:
- Promote any Raw Material that became real ideas during the session
- Archive stale ideas the user confirmed are no longer relevant (move to Used with note "archived")
- Ensure every Ready to Write idea has complete metadata

Tell the user: "Added X ideas to your content bank (Y ready to write, Z raw material)."

---

## Step 6 — Next Steps

Present a summary and next actions:

"Your content bank now has X ready ideas. When you're ready to use them:"

- `/newsletter-write` to write an email (pulls [NL] and [ALL] ideas)
- `/social-plan` to plan a week of posts (pulls [TW], [LI], [FB], [IG] ideas)
- `/social-write` for a quick post
- `/article-write` for a deep-dive article (pulls [ART] and [ALL] ideas)
- `/youtube-prepare` to plan a video (pulls [VID] and [ALL] ideas)

---

## Rules

- The personal interview is the core of this process. Never skip it.
- Save interview material with MAXIMUM detail (exact words, specific examples, nuances).
- No fabrication. Use `[PLACEHOLDER]` if info is missing.
- `/humanize` is NOT needed here. This is ideation, not content creation.
- Use AskUserQuestion for all decisions.
- Trend scanning is a supplement, not a requirement. Don't push it.
- Quick sessions producing 0-2 ideas is fine. Don't force ideas that aren't there.
- Deep sessions should always produce 8+ ideas minimum.
- When saving raw material, include enough context that it makes sense weeks later.
