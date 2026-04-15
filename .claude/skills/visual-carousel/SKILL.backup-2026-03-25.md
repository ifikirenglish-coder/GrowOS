---
name: visual-carousel
description: "Create Instagram and LinkedIn carousels. Writes slide copy, designs layout, and renders images if Remotion is installed."
argument-hint: "[topic or content to turn into a carousel]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Visual Carousel

**Purpose:** Create scroll-stopping carousels for Instagram and LinkedIn. From topic to slide copy to rendered images.
**When to use:** You want to turn a lesson, tip, framework, or story into a carousel post.

---

## Step 0 — Context Loading

1. Load `brands/[active-brand]/voice.md` for brand colors, fonts, tone, and visual style.
2. Load `brands/[active-brand]/lessons.md` for any carousel or social media lessons.
3. **Check Remotion installation:** Look for `system/tools/video-animations/node_modules`. Set `remotion_available` = true or false.

---

## Step 1 — Topic and Platform

Ask: "What's the carousel about, and which platform?"

Options:
- **A) Instagram** — square (1080x1080) or portrait (1080x1350), 6-10 slides
- **B) LinkedIn** — landscape (1920x1080) or square (1080x1080), 5-8 slides
- **C) Both** — create versions for each

If the user has recent content (newsletters, articles, social posts), suggest repurposing:
"Want to turn one of your recent pieces into a carousel? Or start fresh with a new topic?"

---

## Step 2 — Core Message

Ask: "What's the one main point or lesson this carousel should convey?"

Also ask:
- Who is this for? (confirm audience or ask)
- What should someone do after reading it? (follow, save, visit link, DM)
- Any specific examples, numbers, or stories to include?

---

## Step 3 — Plan the Slides

Design the carousel structure:

**Instagram (6-10 slides):**
1. **Hook slide** — bold statement, question, or pattern interrupt that stops the scroll
2. **Context slide** — set up the problem or situation
3. **Content slides (3-6)** — one point per slide, build on each other
4. **Summary slide** — recap the key takeaway
5. **CTA slide** — clear action (save, follow, comment, link in bio)

**LinkedIn (5-8 slides):**
1. **Hook slide** — professional but attention-grabbing opener
2. **Content slides (3-5)** — one insight per slide, data-friendly
3. **Takeaway slide** — actionable summary
4. **CTA slide** — engage (comment your take, repost, follow for more)

Present the slide plan as a numbered list with one-line descriptions. Get approval before writing copy.

---

## Step 4 — Write Slide Copy

Write copy for each slide following these rules:
- **Large text, minimal words.** Each slide should be readable in 2-3 seconds.
- **One idea per slide.** Never cram.
- **Use the brand voice.** Conversational, not corporate.
- **Scannable formatting.** Short lines, bullet points where helpful.
- **Visual hierarchy.** Mark what's the headline vs. supporting text.

For each slide, provide:
- **Headline** (the big text)
- **Supporting text** (smaller, optional)
- **Design notes** (layout, emphasis, icon suggestions)

Run `/humanize` on all slide copy before presenting.

---

## Step 5 — Present the Carousel

Show the full carousel slide-by-slide:

```
--- Slide 1 (Hook) ---
Headline: [text]
Supporting: [text]
Design: [layout and color notes]

--- Slide 2 ---
Headline: [text]
Supporting: [text]
Design: [layout and color notes]

...
```

Include design recommendations:
- Background color for each slide (from brand palette)
- Font sizes (headline vs. body)
- Any icons, illustrations, or simple graphics
- Consistent visual elements across slides (border, logo placement, slide number)

Ask: "How does this look? Want to change any slides?"

---

## Step 6 — Render Images (if Remotion Available)

**If Remotion is available:**
- Build a Remotion composition that renders each slide as a static image
- Use brand colors and fonts from voice.md
- Render each slide as a PNG at the correct dimensions
- Save to the output folder

**If Remotion is NOT available:**
- Provide complete design specs the user can build in Canva, Figma, or similar:
  - Exact hex colors for backgrounds and text
  - Font names and sizes
  - Element positioning (centered, left-aligned, etc.)
  - Slide dimensions in pixels

---

## Step 7 — Save Output

Save to `brands/[active-brand]/output/social/carousels/[date]-[slug]/`:

- `carousel-copy.md` — all slide text, design notes, and caption
- Individual slide images (if rendered): `slide-01.png`, `slide-02.png`, etc.

Also write a suggested caption for the post:
- Hook line that drives opens
- Brief context
- CTA (save this, share with a friend, drop a comment)
- Relevant hashtags (5-10 for Instagram, 3-5 for LinkedIn)

Include the caption at the bottom of `carousel-copy.md`.

---

## Feedback

Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time.
