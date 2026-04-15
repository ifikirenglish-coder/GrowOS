---
name: youtube-prepare
description: "Research, plan, and script YouTube videos. From topic to teleprompter-ready script with production brief."
argument-hint: "[video topic or idea]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# YouTube Prepare

**Purpose:** Take a video topic from idea to a complete, teleprompter-ready script with research and production brief.
**When to use:** When you want to plan and script a YouTube video.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Load Context

Load these files before starting:

1. `brands/[active-brand]/voice.md` — writing voice
2. `brands/[active-brand]/lessons.md` — rules from past feedback
3. `system/references/hook-types.md` — hook formulas for the opening

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 0b — Check Content Bank

Load `brands/[active-brand]/content-ideas.md` if it exists. Scan the "Ready to Write" section for ideas tagged `[VID]` or `[ALL]`. Present the top options as starting points.

If video-ready ideas exist: "I found these video ideas in your content bank: [list with hooks and angles]. Want to develop one of these, or do you have a different topic?"

---

## Step 1 — Determine Video Topic

**If the user picked a content bank idea:** Use it. Move to Step 2.

**If the user provided a topic:** Use it. Move to Step 2.

**If no topic:** Help them find one. Check:

1. `brands/[active-brand]/audiences/` — what problems does the audience care about?
2. `brands/[active-brand]/output/` — recent content that could become a video
3. `brands/[active-brand]/stories/_index.md` — personal stories worth telling on camera

Suggest 3 video topic ideas with a one-line angle for each. Let the user pick or provide their own.

---

## Step 2 — Research Phase

Research the topic to find the best angle:

1. **Existing videos** — Search for videos on the same topic. What's already been covered?
2. **Gaps** — What's missing from existing content? What angle hasn't been taken?
3. **Audience questions** — What does the target audience actually want to know?
4. **Keywords** — What are people searching for related to this topic?

Summarize findings in a short research brief:
- Top 3-5 existing videos on the topic (title, channel, what they cover)
- The gap or unique angle for this video
- Target viewer and what they want to walk away with

Present this to the user before scripting.

---

## Step 3 — Plan Video Structure

Create the video outline:

### Hook (first 30 seconds)
- Use a formula from `system/references/hook-types.md`
- This is the most critical part. If the hook fails, nothing else matters.
- Open with a bold claim, surprising stat, relatable problem, or curiosity gap
- No "Hey guys, welcome back to my channel" openings

### Intro (30-60 seconds)
- Who you are (brief, 1 sentence)
- What the viewer will learn or get from this video
- Why they should keep watching (the payoff)

### Main Content (3-5 key points)
For each point:
- Clear headline/label
- Explanation with a concrete example or story
- Transition to next point

### CTA
- Subscribe reminder (if appropriate)
- Comment prompt (specific question, not generic "let me know what you think")
- Link to relevant resource (if applicable)

### Outro (15-30 seconds)
- Quick recap of the key takeaway (one sentence)
- Pointer to related video

Present the outline and get approval before writing the full script.

---

## Step 4 — Interview for Personal Stories

Use AskUserQuestion to gather authentic material:

- "Do you have a personal experience related to [topic]? A specific moment, result, or mistake?"
- "Any examples from your work or clients that illustrate the key points?"
- "Is there a before/after story we could use?"
- "Any data, numbers, or specific results you can share?"

Weave these into the script. Real stories and specific details make the difference between a forgettable video and one people share.

If the user doesn't have stories, note `[PERSONAL EXAMPLE NEEDED]` in the script where one would fit.

---

## Step 5 — Write the Script

Write a complete teleprompter-ready script. Formatting rules:

- **Short paragraphs** — 1-2 sentences max per paragraph
- **[PAUSE]** markers — for natural breathing pauses and emphasis moments
- **[B-ROLL: description]** markers — describe what should show on screen during voiceover
- **Bold text** — for words that should be emphasized when speaking
- Conversational language matching voice.md
- Grade 8 or lower reading level
- No em dashes
- No fabricated stats or claims. Use `[PLACEHOLDER]` for unverified data.

Script format:

```
## HOOK

[The opening 2-3 sentences that grab attention]

[PAUSE]

## INTRO

[Who you are, what they'll learn]

[B-ROLL: description of what to show]

## POINT 1: [Title]

[Script text...]

[PAUSE]

[B-ROLL: description]

...
```

Include an estimated read time. Target: 1 minute of script per 150-170 words spoken.

---

## Step 6 — Humanize

Run `/humanize` on the script before presenting it.

Check for and fix:
- Rule of three patterns (AI loves groups of three)
- Sentences that sound written, not spoken (read it out loud mentally)
- Overly polished transitions ("Now let's move on to..." or "Speaking of which...")
- Even paragraph lengths (vary them)
- Generic phrases that any channel could say (make it specific to this brand)

---

## Step 7 — Production Brief

Create a brief for filming:

```markdown
## Production Brief

**Video title (working):** [title]
**Estimated length:** [X minutes]
**Target audience:** [who this is for]

### Equipment
- Camera setup: [talking head / screen share / both]
- Lighting: [any special requirements]
- Audio: [mic recommendations if relevant]

### Location / Set
- [Where to film, any background considerations]

### Props / Visuals
- [Anything that needs to be on screen or held up]

### B-Roll Needed
- [List of all B-ROLL markers from the script]

### Delivery Notes
- [Energy level, pace, any performance notes]
```

---

## Step 8 — Save

Save to: `brands/[active-brand]/output/youtube/YYYY-MM-DD-slug/`

Create these files:
- `script.md` — the full teleprompter script
- `research.md` — research findings from Step 2
- `production-brief.md` — the filming brief from Step 7

---

## Step 9 — Update Content Bank

If the video was based on an idea from `brands/[active-brand]/content-ideas.md`, mark that idea as `[SCHEDULED YYYY-MM-DD]` in the Ready to Write section. (Don't move to Used yet, since the video still needs to be filmed and published.)

---

## Feedback Capture

After presenting the script:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes to the script
2. Add a concise, actionable rule to `brands/[active-brand]/lessons.md` under the YouTube section
3. Present the updated version
