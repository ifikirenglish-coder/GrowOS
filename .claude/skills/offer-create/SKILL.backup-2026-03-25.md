---
name: offer-create
description: "Create positioned, belief-breaking offers with a Grand Slam framework."
argument-hint: "[product or offer name]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Offer Create

**Purpose:** Build a complete, persuasive offer from scratch using the Grand Slam Offer framework. Covers positioning, mechanism, stack, pricing, and guarantee.
**When to use:** When launching a new product, service, or program and you need a compelling offer.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Load Context

Load these files before starting:

1. `brands/[active-brand]/voice.md` — writing voice
2. `brands/[active-brand]/lessons.md` — rules from past feedback
3. The relevant audience persona from `brands/[active-brand]/audiences/` (ask which one if not obvious)

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Interview About the Offer

Use AskUserQuestion to gather the raw material. Ask these one at a time (or in small groups), following up on each answer:

1. **What are you selling?** (product, service, program, course, coaching, etc.)
2. **What's the main transformation or outcome?** What does the buyer's life look like after?
3. **Who is this for specifically?** The more specific, the better the offer.
4. **What have they already tried?** What solutions failed them before?
5. **What makes your approach different?** Why does yours work when others don't?
6. **What's the price point?** (or price range you're considering)

Follow up on anything vague. Push for specifics. The quality of the offer depends on the quality of the inputs.

---

## Step 2 — Grand Slam Offer Components

Using the interview answers, identify and present the four components:

### Dream Outcome
What they REALLY want (not the product, the result). Frame it in their words.

### Perceived Likelihood of Achievement
What proof, mechanism, or credibility makes them believe this will work for THEM? Not just "it works" but "it will work for me."

### Time Delay
How fast do they get the first result? How fast do they get the full result? Shorter = more valuable.

### Effort & Sacrifice
What do they have to give up or do? Less effort = more valuable. What pain do they avoid?

Present these four components to the user. Ask: "Does this capture it? Anything to add or change?"

---

## Step 3 — Design the Offer Stack

Build the stack from the Grand Slam components:

### Core Offer
The main thing they're buying. One clear sentence.

### Bonuses
2-4 bonuses that reduce effort, reduce time, or increase the likelihood of success. Each bonus should solve a specific obstacle.

For each bonus, include:
- Name (benefit-driven, not feature-driven)
- What it does
- Why it matters (which obstacle it removes)

### Guarantee
What removes the risk? Options to consider:
- Money-back guarantee (with or without conditions)
- Results guarantee (if X doesn't happen, Y)
- "Better than free" guarantee (they keep the bonuses even if they refund)
- No guarantee (sometimes the right call for high-ticket)

### Urgency / Scarcity
Only include if it's REAL. Options:
- Limited spots (if actually limited)
- Limited time (if actually closing)
- Price increase (if actually going up)
- Bonus deadline (if bonuses actually expire)

If there's no real urgency, skip it. Fake urgency destroys trust.

Present the full stack. Ask: "How does this look? Want to adjust anything?"

---

## Step 4 — Write the Offer

Write the offer in a persuasive, conversational format with these sections:

1. **Positioning statement** — One sentence that frames the offer. What category does this create or dominate?
2. **The problem** — Describe the pain in their audience's words. What they've tried. Why it hasn't worked.
3. **Your unique mechanism** — The HOW. Why your approach is different. Name the method/system/framework if possible.
4. **What they get** — The full stack with perceived value for each item. Core offer first, then bonuses.
5. **Who this is for / not for** — Qualification. Makes the right people lean in and the wrong people self-select out.
6. **Price anchoring** — What's the alternative cost? What would they pay for the result another way? Then reveal the price.
7. **Guarantee** — Remove the last objection.
8. **Call to action** — One clear next step.

---

## Step 5 — Humanize

Run `/humanize` on the full offer draft before presenting it. Check for:
- AI-sounding language
- Em dashes (replace with periods, commas, or colons)
- Corporate buzzwords
- Fake enthusiasm
- Too-clean structure

---

## Step 6 — Present and Save

Present the complete offer in chat.

If the user wants to save, create the output folder and save:
- `brands/[active-brand]/output/offers/[offer-name]/offer.md`

---

## Feedback Capture

After presenting, ask:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."
