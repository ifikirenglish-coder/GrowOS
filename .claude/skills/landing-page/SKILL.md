---
name: landing-page
description: "Create sales page copy with visual design direction. Headlines, hooks, full page structure, and layout notes."
argument-hint: "[offer name or URL]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Landing Page

**Purpose:** Write complete sales page copy with visual design direction. Covers headline generation, hook writing, full page structure, and section-by-section layout suggestions.
**When to use:** Sales pages, lead capture pages, product launch pages, webinar registration pages.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Context Loading

Load these files before starting:
- `[active-business]/brand.md (Section 4: Brand Voice)`
- `[active-business]/lessons.md`
- `system/references/headline-types.md`
- `system/references/hook-types.md`

To identify the active brand: check if CLAUDE.md lists an active brand. If multiple brands exist and none is specified, ask the user which brand they're working on.

---

## Step 1 — Load Offer Details

Check `[active-business]/output/offers/` for existing offer documents.

**If offer found:** Load it and confirm: "I found your offer document for [name]. I'll use this as the basis. Anything changed?"

**If no offer found:** Ask using AskUserQuestion:
1. "What are you selling? (product, service, course, program, lead magnet)"
2. "What's the price? (or is this a free lead capture page?)"
3. "What's the main promise or transformation?"
4. "What's included? (components, features, bonuses)"
5. "Is there a guarantee?"
6. "What do you want visitors to do? (buy, sign up, book a call, download)"

---

## Step 2 — Load Target Audience

Check `[active-business]/audiences/` for persona files.

**If personas exist:** Ask which one this page targets (or if it targets all of them).

**If no personas:** Ask:
1. "Who is this page for? Describe the person landing on it."
2. "What's their biggest frustration right now?"
3. "What have they already tried that didn't work?"

---

## Step 3 — Generate Headlines

Using `system/references/headline-types.md`, generate 9 headlines across different types:

- 2 Direct/Benefit headlines
- 2 Curiosity headlines
- 2 Problem-focused headlines
- 1 Social proof headline
- 1 How-to headline
- 1 Contrarian/Bold headline

**Score each headline** using this rubric (1-10 for each):
- **Clarity:** Does the reader instantly understand what this is about?
- **Specificity:** Are there concrete details (numbers, outcomes, timeframes)?
- **Emotional pull:** Does it trigger curiosity, desire, or fear of missing out?
- **Voice match:** Does it sound like the brand?

Present the **top 5** scored headlines. Ask: "Which headline speaks to you? Or want me to combine elements from multiple?"

---

## Step 4 — Write Hook Variants

After the user picks a headline, write 5 hook variants (the first 2-3 sentences below the headline):

Each hook should take a different angle:
1. **Pain hook** — Start with the problem
2. **Story hook** — Start with a mini-story or scenario
3. **Stat hook** — Start with a surprising number or fact (only if real data exists)
4. **Question hook** — Start with a question the reader is already asking themselves
5. **Bold claim hook** — Start with a direct, confident statement

Score each using the same rubric. Present all 5 with scores. Ask: "Which hook grabs you?"

---

## Step 5 — Write Full Sales Page

Using the chosen headline and hook, write the complete page following this structure:

### Section 1: Above the Fold
- Headline (chosen)
- Hook/subheadline (chosen)
- Brief supporting copy (1-2 sentences)
- Primary CTA button text
- Social proof element (if available): testimonial snippet, customer count, logos

### Section 2: Problem Agitation
- Describe the problem in the reader's words
- Show you understand their world
- Agitate: what happens if they don't solve this
- 3-5 specific pain points as bullet points

### Section 3: Solution Introduction
- Bridge from problem to solution
- Introduce the approach or method (not the product yet)
- Explain why this works when other things haven't

### Section 4: Features and Benefits
- List every component/feature
- For each: what it is + what it does for them (feature -> benefit)
- Use benefit-first formatting: lead with the outcome, then explain the feature

### Section 5: Proof
- Testimonials (real ones only, or `[PLACEHOLDER: testimonial]`)
- Case studies or results
- Credentials, experience, media mentions
- "As seen in" logos (if applicable)

### Section 6: Objection Handling
- Address 3-5 common objections
- Use "But what if..." or "You might be wondering..." format
- Turn each objection into a reason to buy

### Section 7: Offer Stack
- List everything included with individual value
- Bonuses (if any)
- Total value vs. actual price
- Make the price feel like a no-brainer

### Section 8: Guarantee
- State guarantee clearly
- Make it generous and specific
- Remove all remaining risk

### Section 9: Final CTA
- Restate the transformation
- Urgency (only if genuine: limited spots, deadline, price increase)
- CTA button text
- Final reassurance line below the button

### Section 10: FAQ
- 5-8 frequently asked questions
- Cover: who it's for, who it's not for, how it works, timing, support, refunds

**Writing rules:**
- Grade 8 or lower reading level
- Short paragraphs (2-3 sentences max)
- Conversational tone matching brand.md Section 4 (Brand Voice)
- No em dashes
- No fabricated stats, testimonials, or results. Use `[PLACEHOLDER]` where needed.
- Bullet points for scannable sections
- Bold key phrases for skimmers

---

## Step 6 — Visual Design Direction

Add design notes for each section. Include:

- **Layout:** Single column, two-column, centered, full-width
- **Visual emphasis:** What should be bold, colored, or highlighted
- **Image placeholders:** `[IMAGE: description of what should go here]`
- **Background treatment:** White, light gray, brand color accent, dark section for contrast
- **Spacing:** Generous (breathing room) vs. compact (urgency)
- **Typography notes:** Which text should be larger, which should be body size
- **Social proof display:** Grid of testimonials, single featured quote, logo bar
- **CTA styling:** Button color, size, surrounding whitespace

Format design notes as a block under each section:
```
> DESIGN: [layout and visual notes for this section]
```

---

## Step 7 — Quality Gate

Run `/humanize` on the complete page copy before presenting it.

Check for and fix:
- Marketing cliches ("unlock", "supercharge", "game-changing")
- Perfect parallel structures (vary the rhythm)
- AI tells: rule of three everywhere, "In today's fast-paced world..."
- Copy that sounds like a template instead of a real person talking
- Sections that are too long for web reading (break them up)

---

## Step 8 — Present Complete Page

Show the full sales page copy with design notes inline. Include at the top:
- Headline (final)
- Page type (sales page, lead capture, etc.)
- Target audience
- Estimated word count

---

## Step 9 — Save Output

Save to `[active-business]/output/landing-pages/YYYY-MM-DD-slug/`

Create three files:

**copy.md** — The complete sales page copy (clean, without design notes)

**headlines.md:**
```markdown
# Headline Options

## Chosen
[The selected headline]

## All Options (Scored)
| # | Headline | Clarity | Specificity | Emotion | Voice | Total |
|---|----------|---------|-------------|---------|-------|-------|
| 1 | ...      | X       | X           | X       | X     | XX    |
[all 9 headlines with scores]

## Hook Variants (Scored)
[all 5 hooks with scores, chosen one marked]
```

**design-notes.md** — Visual design direction extracted from the inline notes, organized by section.

---

## Feedback Capture

After presenting the page:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes to the copy
2. Add the lesson to `[active-business]/lessons.md` under the appropriate section
3. Show the updated version
