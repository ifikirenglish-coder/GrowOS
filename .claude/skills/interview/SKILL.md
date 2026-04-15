---
name: interview
description: "In-depth interviewing to spec out products, features, processes, or content."
argument-hint: "[what to spec out]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Interview

**Purpose:** Conduct a structured interview to turn vague ideas into clear specs. Works for products, features, content pieces, processes, offers, or anything that needs thinking through.
**When to use:** When you need to think something through properly before building it.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Load Context

Load these files before starting:

1. `[active-business]/brand.md` (Section 4: Brand Voice) — writing voice (for the final document)
2. `[active-business]/lessons.md` — relevant rules and context

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — What Are We Speccing Out?

Use AskUserQuestion:

"What do you want to think through? This could be a product, feature, content piece, process, offer, business decision, or anything else that needs clarity."

Based on their answer, determine the interview depth:
- **Simple** (preference, small feature, content topic): 2-3 rounds
- **Medium** (new feature, process, content series): 3-5 rounds
- **Complex** (new product, business model, major decision): 5-7 rounds

---

## Step 2 — Structured Interview

Conduct the interview using AskUserQuestion. Follow this progression:

### Round 1: High-Level (What & Why)
- What is this exactly? Describe it like you're explaining it to someone new.
- Why are you building/doing this? What problem does it solve?
- Who is this for? Be specific.
- What does success look like?

### Round 2: Specifics (How & When)
- How does this work in practice? Walk me through it.
- What are the key components or steps?
- What's the timeline? Any deadlines?
- What constraints do you have? (Budget, time, tools, skills)

### Round 3: Edge Cases & Tradeoffs
- What would make this fail?
- What's the hardest part?
- What have you considered and rejected? Why?
- If you could only do ONE thing, what's the most important piece?

### Round 4+: Go Deeper (as needed)
For each answer, ask a follow-up that goes one level deeper. Look for:
- Assumptions that haven't been validated
- Decisions that seem arbitrary (ask why)
- Gaps between what they said and what they'd need
- Things they haven't thought about yet

**Track open questions.** If something comes up that you can't resolve yet, note it and circle back later.

---

## Step 3 — Mid-Interview Summary

After every 2-3 rounds, pause and summarize:

"Here's what I've captured so far:"
- [Key points organized by category]
- [Open questions that still need answers]

Ask: "Is this accurate? Anything I'm missing or getting wrong?"

This keeps the interview focused and gives the user a chance to correct course.

---

## Step 4 — Keep Going Until Complete

Continue the interview until:
- All the key questions have clear answers
- Open questions are resolved (or explicitly marked as TBD)
- The user feels like it's thorough enough

Don't rush to finish. A good spec prevents bad builds.

---

## Step 5 — Generate the Spec Document

Organize everything into a structured spec:

### Overview
What this is and why it matters. 2-3 sentences max.

### Requirements
Split into:
- **Must-have** — non-negotiable for v1
- **Nice-to-have** — would be great but can wait
- **Out of scope** — explicitly NOT included (prevents scope creep)

### How It Works
Step-by-step description of the thing in action. Written clearly enough that someone else could build it.

### Constraints & Tradeoffs
Decisions made and why. Budget, timeline, tool limitations, or other factors that shaped the spec.

### Open Questions
Anything still unresolved. For each, note why it's open and what's needed to resolve it.

### Recommended Next Steps
3-5 concrete actions to move forward. Ordered by priority.

---

## Step 6 — Present and Review

Present the full spec in chat. Ask:

"Does this capture everything? Want to adjust any requirements, add anything, or change priorities?"

Apply any changes.

---

## Step 7 — Save (Optional)

If the user wants to save, determine the best location based on the topic:

- General specs: `[active-business]/output/research/spec-YYYY-MM-DD-slug.md`
- Offer specs: `[active-business]/output/offers/[name]/spec.md`
- Content specs: `[active-business]/output/research/spec-YYYY-MM-DD-slug.md`
- Process specs: save wherever makes sense for the project

---

## Feedback Capture

After presenting, ask:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."
