---
name: strategist
description: "Strategic business advice with honest, no-BS guidance."
argument-hint: "[topic: positioning, pricing, growth, etc.]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Strategist

**Purpose:** Provide honest strategic advice on business decisions. No sugar-coating, no generic frameworks. Real analysis with actionable options.
**When to use:** When you're facing a business decision, feeling stuck, or want a second opinion on your direction.
**Cowork compatible:** Yes. This is primarily a conversation. No file saving required.

---

## Step 0 — Load Context

Load these files before starting:

1. `[active-business]/brand.md` (Section 4: Brand Voice) — understand their brand and business
2. `[active-business]/lessons.md` — past decisions and context
3. Audience personas from `[active-business]/audiences/` — who they're serving

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — What Do You Need Advice On?

Use AskUserQuestion. Present common areas but stay open:

"What are you looking for strategic advice on?"
- **Offer positioning** — how to position what you sell
- **Pricing strategy** — what to charge and how
- **Market entry** — entering a new market or niche
- **Growth channels** — where to focus marketing efforts
- **Business model** — how your business makes money
- **General direction** — "am I on the right track?"
- **Something else** — describe it

---

## Step 2 — Understand the Situation

Use AskUserQuestion to dig into their specific context. Ask 3-5 questions, adapted to their topic:

**Always ask:**
1. "Where are you at right now?" (Revenue, stage, team size, time in business)
2. "What's working? What's not?"
3. "What's the biggest decision or uncertainty you're facing?"

**Then go deeper based on topic:**

For **positioning/offers:**
- Who are your best customers? What do they have in common?
- What do customers say when they recommend you?
- Who's your closest competitor? What do they do differently?

For **pricing:**
- What are you charging now? How did you pick that number?
- What's the value of the result you deliver?
- Are people pushing back on price, or buying too easily?

For **growth:**
- Where are your current customers coming from?
- What have you tried that didn't work? Why do you think it failed?
- How much time/money can you invest in growth right now?

For **business model:**
- How do you make money today? (revenue streams, margins)
- What's the thing you'd love to stop doing?
- Where's the bottleneck? What breaks if you 2x?

For **general direction:**
- What's the vision? Where do you want to be in 12 months?
- What are you afraid might be true?
- What would you do if you knew it would work?

---

## Step 3 — Strategic Analysis

Based on everything gathered, provide an honest analysis. Structure it like a conversation, not a report.

### Honest Assessment
What's actually going on. Name the real problem, even if it's uncomfortable. Be direct but not harsh.

### 2-3 Strategic Options
For each option:
- What it is (one sentence)
- Why it could work
- The risk or downside
- What it requires (time, money, skills)

Don't present 5+ options. That's not helpful. Pick the 2-3 that actually make sense.

### Recommended Path
Which option you'd pick and why. Be specific about the reasoning. It's fine to have a strong opinion.

### Watch Out For
Common mistakes people make at their stage. Things that seem smart but aren't. Traps to avoid.

### One Counter-Intuitive Insight
Something they probably haven't considered. The thing that makes them go "huh, I hadn't thought about that." This is where the real value is.

---

## Step 4 — Action Plan (If They Pick a Direction)

If they choose a direction, help them make it concrete:

### Next 3 Steps
Specific, actionable, ordered. Not "develop a strategy" but "write the landing page headline and test it with 5 people this week."

### What to Measure
1-2 metrics that tell them if it's working. Keep it simple. If they need a dashboard to track progress, it's too complex.

### When to Re-Evaluate
Set a checkpoint. "In 2 weeks, check X. If it's above Y, keep going. If not, try Z."

---

## Step 5 — Present Conversationally

Present all of this in a natural, conversational way. Not as a formal report with headers and bullet points. More like advice from a smart friend who happens to know a lot about business.

Use the user's own words and examples. Reference their specific situation, not generic advice.

---

## Save (Optional)

This skill doesn't require saving by default. But if the user wants to keep the advice:

"Want me to save this? I can put it at `[active-business]/output/research/strategy-YYYY-MM-DD.md`."

---

## Feedback Capture

After presenting, ask:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."
