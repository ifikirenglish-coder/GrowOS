---
name: repurpose
description: "Turn one piece of content into multiple formats. Feed it a video transcript, article, newsletter, or podcast notes and get social posts, emails, carousels, video scripts, and more."
argument-hint: "[paste content, link a file, or describe what to repurpose]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Content Repurpose

**Purpose:** Take one piece of content and turn it into multiple formats for different platforms. Create once, distribute everywhere.
**When to use:** After creating any content (video, article, newsletter, podcast) and you want to squeeze more value from it.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Load Context

Load these files before starting:

1. `brands/[active-brand]/voice.md` — writing voice
2. `brands/[active-brand]/lessons.md` — rules from past feedback
3. `system/references/social-post-types.md` — social post intent types and platform guidelines
4. `system/references/hook-types.md` — hook formulas for headlines and openers

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Accept the Source Content

Accept content via:
- Pasted text in chat (transcript, article, email, notes)
- File reference (read the file)
- URL (fetch and extract the content)

If no content is provided, ask: "What content do you want to repurpose? Paste it, point me to a file, or give me a URL."

---

## Step 2 — Detect Format and Extract Core

Identify the source format:
- **Video transcript** — spoken content, may have timestamps, filler words, tangents
- **Article/blog post** — structured written content with headers and sections
- **Newsletter/email** — shorter, conversational, usually one core idea
- **Podcast notes/transcript** — conversational, may have multiple speakers
- **Social post** — short-form, may need expanding rather than condensing
- **Sales page/landing page** — persuasive copy with offers and proof
- **Other** — ask the user to describe what it is

Then extract the core elements:

1. **Main idea** — the single biggest takeaway (1 sentence)
2. **Key points** — 4-7 supporting points, insights, or arguments
3. **Stories/examples** — any specific anecdotes, case studies, or data points
4. **Quotes** — any strong lines that stand on their own
5. **CTA/next step** — what the original content asked the reader to do (if anything)

Present the extraction to the user: "Here's what I pulled from your [format]. Does this look right, or should I adjust the focus?"

---

## Step 3 — Choose Output Formats

Ask the user which formats they want. Present as a multi-select:

**Written:**
- A) X/Twitter posts (2-5 posts, different angles on the same content)
- B) LinkedIn post (1 long-form post, 900-1500 chars)
- C) Facebook post (1 medium-length post, 300-800 chars)
- D) Newsletter email (full email draft using one angle from the content)
- E) Article/blog post (long-form expansion if source is short, or fresh angle if source is long)

**Visual:**
- F) Carousel script (8-12 slides for Instagram/LinkedIn, text content only)
- G) Image quote cards (3-5 strong quotes formatted as standalone graphics)

**Video:**
- H) Short-form video script (30-60s Reel/Short/TikTok script with hook + body + CTA)
- I) Video talking points (bullet-point outline for recording a video on this topic)

**Email:**
- J) Email sequence teaser (1 email that drives traffic to the original content)

If the user says "everything" or "all": generate A, B, C, F, H, and J. Skip D and E (those are full production workflows better handled by `/newsletter-write` or `/article-write`).

---

## Step 4 — Generate Each Format

Write each selected format following these rules:

### General Rules (All Formats)
- Every format gets a DIFFERENT angle or hook. Don't repeat the same opening.
- Pull from different key points for each format. The goal is variety, not repetition.
- Match the brand's voice.md.
- No em dashes.
- No fabricated data or results.
- Grade 8 or lower reading level.
- Each piece should stand alone. A reader shouldn't need the original to understand it.

### X/Twitter Posts
- Each post takes ONE key point and makes it punchy
- Max 280 characters per post
- Vary the intent types: make one a TEACH, one a HOT TAKE, one an OBSERVE, etc.
- No links in the main tweet
- If the content has a strong contrarian angle, lead with that

### LinkedIn Post
- Hook line must work before the "see more" fold (~150 chars)
- Use the story or case study from the source content as the spine
- End with a question or takeaway
- 900-1500 characters

### Facebook Post
- Casual, conversational, community-oriented
- Include an image suggestion
- 300-800 characters
- Questions work well here

### Newsletter Email
- Follow the same structure as `/newsletter-write` (hook, one idea, CTA)
- Pick the most email-friendly angle (usually a story or observation)
- 300-600 words
- Don't just copy the original. Reframe it for an inbox reader.

### Carousel Script
- Slide 1: Hook (question or bold statement)
- Slides 2-9: One point per slide, short text (15-25 words per slide)
- Slide 10-12: Takeaway + CTA
- Write the text content only (design handled by `/visual-carousel`)
- Each slide should make the reader want to swipe to the next

### Image Quote Cards
- Pull the 3-5 strongest standalone lines from the source
- Each quote should work without any context
- Keep under 20 words per quote
- Note which quotes are most "shareable"

### Short-Form Video Script
- Hook (first 3 seconds, pattern interrupt)
- Setup (5-10 seconds, state the problem or question)
- Body (15-30 seconds, deliver the insight)
- CTA (5 seconds, what to do next)
- Total: 30-60 seconds when spoken
- Write as spoken words, not written text. Include pauses and emphasis cues.

### Video Talking Points
- 5-8 bullet points in logical order
- Each point has a 1-sentence summary + key detail to mention
- Opening hook suggestion
- Closing CTA suggestion
- Estimated recording time: 3-8 minutes

### Email Sequence Teaser
- Subject line (curiosity-driven, 4-8 words)
- Short email (150-250 words) that teases the content and links to it
- The email should give enough value to stand alone, but create curiosity for more

---

## Step 5 — Humanize

Run `/humanize` on ALL generated content before presenting.

Check for and fix:
- AI patterns (rule of three, parallel structures, even rhythm)
- Generic phrasing that could be from any brand
- Repetitive angles across formats (each should feel fresh)
- Social posts that sound like compressed articles instead of native posts

---

## Step 6 — Present Output

Group by format. For each piece, show:
- The format label
- The content
- Which key point(s) it's built from (so the user can see the variety)

At the end, show a summary:
```
REPURPOSE SUMMARY
Source: [format] — "[main idea in 5 words]"
Generated: [count] pieces across [count] formats
Angles used: [list the different hooks/angles]
```

---

## Step 7 — Save

Save all output to: `brands/[active-brand]/output/repurposed/YYYY-MM-DD-slug/`

Create one file per format:
- `x-posts.md`
- `linkedin.md`
- `facebook.md`
- `newsletter-draft.md`
- `carousel-script.md`
- `quote-cards.md`
- `video-script.md`
- `talking-points.md`
- `email-teaser.md`

Include metadata at the top of each file:

```markdown
---
source: "[original content title or description]"
format: [output format]
status: draft
date: YYYY-MM-DD
---
```

After saving: "These are all drafts. When you're ready, use `/social-publish` to schedule the social posts, or `/newsletter-publish` to send the email."

---

## Feedback Capture

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes to the affected pieces
2. Add a concise, actionable rule to `brands/[active-brand]/lessons.md` under the repurposing section
3. Present the updated versions
