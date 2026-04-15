---
name: lead-magnet
description: "Plan and create lead magnets that grow your email list and qualify leads."
argument-hint: "[topic or type]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Lead Magnet

**Purpose:** Create a complete lead magnet with content and opt-in page copy. From idea to deliverable.
**When to use:** When you want to grow your email list, attract leads, or create a free resource for your audience.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Load Context

Load these files before starting:

1. `brands/[active-brand]/voice.md` — writing voice
2. `brands/[active-brand]/lessons.md` — rules from past feedback
3. The relevant audience persona from `brands/[active-brand]/audiences/` (ask which one if not obvious)

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Clarify the Goal

Use AskUserQuestion to understand what they're trying to accomplish:

"What's the main goal for this lead magnet?"
- **Grow email list** — attract new subscribers at the top of funnel
- **Qualify leads** — filter for people who are a good fit for your offer
- **Nurture existing audience** — deepen trust with people who already follow you

The goal shapes everything: type, depth, and how it connects to their paid offer.

---

## Step 2 — Suggest Lead Magnet Types

Based on their business and goal, suggest 3-4 lead magnet types that would work well. Present as options:

| Type | Best for | Example |
|------|----------|---------|
| **Checklist / Cheat sheet** | Quick win, easy to consume | "The 10-Point Launch Checklist" |
| **Template / Swipe file** | Saves time, immediately usable | "5 Email Templates That Convert" |
| **Mini-course / Email sequence** | Building trust over time | "3-Day [Topic] Bootcamp" |
| **Quiz / Assessment** | Engaging + qualifying leads | "What's Your [Topic] Score?" |
| **Case study / Report** | Proving credibility with data | "How We Got [Result] in [Time]" |
| **Free tool / Calculator** | Providing hands-on value | "ROI Calculator for [Their Thing]" |
| **Video training** | Building personal connection | "The [Topic] Masterclass" |

Recommend the top 1-2 based on their situation and explain why. Ask them to pick.

---

## Step 3 — Interview for Content

Use AskUserQuestion to get the raw material. Adapt questions based on the type they chose:

**Core questions (always ask):**
1. "What's the #1 quick win you can give someone?" The thing that makes them think "wow, this person really knows their stuff."
2. "What question do people always ask you?" The thing you explain over and over.
3. "What do you wish people understood before working with you?" The gap between where they are and being ready to buy.

**Follow-up questions (based on type):**
- For checklists/templates: "Walk me through the steps. What do most people miss?"
- For case studies: "Tell me the story. What was the starting point? What happened? What was the result?"
- For quizzes: "What are the 3-4 categories or outcomes someone could fall into?"
- For video training: "What's the one thing you'd teach if you only had 15 minutes?"

Push for specifics. Generic lead magnets don't convert.

---

## Step 4 — Create the Lead Magnet

### 4a. Title and Description

Create a benefit-driven title. It should be:
- Specific (numbers, timeframes, outcomes)
- Clear about what they get
- Clear about who it's for

Examples of good titles:
- "The 7-Step Checklist for [Specific Outcome]"
- "Steal My [Thing]: The Exact [Templates/Scripts/Framework] I Use to [Result]"
- "[Number] [Things] That [Outcome] (Without [Common Pain])"

Write a 1-2 sentence subtitle/description that amplifies the title.

### 4b. Full Content

Create the actual lead magnet content based on the type:

- **Checklist:** Numbered items with brief explanations. 7-15 items is the sweet spot.
- **Template/Swipe file:** Ready-to-use templates with fill-in-the-blank sections and examples.
- **Guide/Cheat sheet:** Organized sections with actionable takeaways. Keep it under 10 pages worth of content.
- **Email sequence:** Write 3-5 emails with subject lines, body copy, and CTAs.
- **Quiz:** Write the questions, answer options, and result descriptions.
- **Case study:** Tell the story with data points, before/after, and lessons.

### 4c. Landing Page Copy

Write the opt-in page text:
- **Headline** (benefit-driven)
- **Subheadline** (what they get + how fast)
- **3-5 bullet points** (what's inside, framed as benefits)
- **Social proof line** (if available, otherwise `[PLACEHOLDER]`)
- **CTA button text** (specific, not just "Submit")
- **Privacy line** (e.g., "No spam. Unsubscribe anytime.")

---

## Step 5 — Humanize

Run `/humanize` on all copy before presenting. Check for:
- AI-sounding language
- Em dashes (replace with periods, commas, or colons)
- Corporate buzzwords
- Vague promises
- Too-polished structure

---

## Step 6 — Present and Save

Present everything in chat: the lead magnet content and the landing page copy.

If the user wants to save, create the output folder:
- `brands/[active-brand]/output/lead-magnets/YYYY-MM-DD-slug/content.md` — the actual lead magnet
- `brands/[active-brand]/output/lead-magnets/YYYY-MM-DD-slug/landing-page-copy.md` — the opt-in page text

---

## Feedback Capture

After presenting, ask:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."
