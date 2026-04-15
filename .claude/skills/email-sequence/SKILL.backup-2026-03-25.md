---
name: email-sequence
description: "Build multi-email sequences: welcome, nurture, launch, or re-engagement. Full sequence map through polished emails."
argument-hint: "[sequence type: welcome, nurture, launch, re-engagement]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Email Sequence

**Purpose:** Create complete multi-email sequences with strategic timing, subject lines, and fully written emails. Each email follows proven type templates.
**When to use:** Welcome sequences for new subscribers, nurture sequences, product launch campaigns, re-engagement campaigns.
**Cowork compatible:** Yes. Output is presented in chat. File saving is optional.

---

## Step 0 — Context Loading

Load these files before starting:
- `brands/[active-brand]/voice.md`
- `brands/[active-brand]/lessons.md`
- `system/references/email-types.md`

To identify the active brand: check if CLAUDE.md lists an active brand. If multiple brands exist and none is specified, ask the user which brand they're working on.

---

## Step 1 — Determine Sequence Type

Ask using AskUserQuestion:

"What type of email sequence do you need?

A) **Welcome** (5-7 emails) — For new subscribers. Introduces you, builds trust, delivers on the signup promise.
B) **Nurture** (ongoing, 8-12 emails) — Keeps your audience engaged between launches. Value-driven content.
C) **Launch** (7-10 emails) — Sells a specific offer. Pre-launch excitement through cart close.
D) **Re-engagement** (3-4 emails) — Wakes up cold subscribers who haven't opened in a while.

Which one?"

---

## Step 2 — Gather Context

Based on the sequence type, ask follow-up questions:

**For all types:**
1. "What's the goal of this sequence? What should someone do or feel by the end?"
2. "Who is receiving these emails? (describe the person, not just demographics)"

**Welcome-specific:**
3. "What did they sign up for? (lead magnet, newsletter, free trial, etc.)"
4. "What do you want them to do after the welcome sequence? (buy something, book a call, stay subscribed)"

**Nurture-specific:**
3. "What topics or themes should these emails cover?"
4. "Do you have an offer they'll eventually see, or is this purely relationship-building?"

**Launch-specific:**
3. "What's the offer? (name, price, what's included)"
4. "Is there a deadline or scarcity element? (only if genuine)"
5. "What objections do people have about this offer?"

**Re-engagement-specific:**
3. "How long have these subscribers been inactive?"
4. "What's the incentive to come back? (new content, special offer, just checking in)"

Load the target audience from `brands/[active-brand]/audiences/` if available.

If a launch sequence references an offer, check `brands/[active-brand]/output/offers/` for existing offer docs.

---

## Step 3 — Present Sequence Map

Create a sequence map table:

```
| # | Timing        | Purpose              | Subject Line Concept     | Email Type        |
|---|---------------|----------------------|--------------------------|-------------------|
| 1 | Immediately   | Deliver + introduce  | [concept]                | [type from ref]   |
| 2 | Day 2         | Build trust          | [concept]                | [type from ref]   |
| 3 | Day 4         | Share value          | [concept]                | [type from ref]   |
...
```

**Timing guidelines by sequence type:**

- **Welcome:** Email 1 immediately, then days 1, 2, 4, 7, 10, 14
- **Nurture:** Every 3-5 days, can stretch to weekly
- **Launch:** Pre-launch (days -7, -5, -3), launch day, days 1, 3, 5, cart close day, last chance
- **Re-engagement:** Days 0, 3, 7 (then unsubscribe or move to different segment)

For each email, reference the appropriate type from `system/references/email-types.md`. Use a variety of types across the sequence. Don't repeat the same type back-to-back.

Present the map and ask: "Does this sequence flow make sense? Want to adjust the timing, add an email, or change any of the angles?"

---

## Step 4 — Approve the Map

Wait for user approval or adjustments. Apply any changes to the map before proceeding.

If the user wants to change the order, timing, or purpose of specific emails, update and re-present.

---

## Step 5 — Write Each Email

Write each email in sequence order, following the matched email type template from `system/references/email-types.md`.

**For each email, include:**
- **Subject line** (2-3 options, mark the recommended one)
- **Preview text** (the snippet shown in inbox)
- **Body** (the full email)
- **CTA** (what the reader should do, if anything)
- **P.S.** (optional, but effective for key emails in the sequence)

**Writing rules for all emails:**
- Grade 8 or lower reading level
- Short paragraphs (1-3 sentences)
- Conversational tone matching voice.md
- No em dashes
- No fabricated stats, testimonials, or results. Use `[PLACEHOLDER]` if needed.
- Each email should stand alone (someone might open only this one)
- But also build on previous emails (reward consistent readers)
- Sign-off should match what's in voice.md

**Sequence-specific rules:**

**Welcome:**
- Email 1 delivers what was promised (link to lead magnet, access, etc.)
- Early emails focus on trust and value, not selling
- Gradually introduce your story and credibility
- Last email transitions to whatever comes next (nurture, offer, etc.)

**Nurture:**
- Lead with value in every email. Teach something useful.
- Vary the format: stories, lessons, tips, questions, curated links
- Occasional soft CTA (reply, check out a resource)
- No hard selling. This is relationship-building.

**Launch:**
- Pre-launch builds anticipation without revealing everything
- Launch email is direct and clear about the offer
- Middle emails handle objections, share proof, add urgency
- Cart close emails increase urgency honestly
- Final email is short and direct: last chance

**Re-engagement:**
- Email 1: Casual check-in. "Haven't seen you in a while."
- Email 2: Offer something valuable. Give a reason to re-engage.
- Email 3: Direct and honest. "Should I keep sending you emails?" Give them an easy out.

---

## Step 6 — Quality Gate

Run `/humanize` on each email before presenting it.

Check for and fix:
- Emails that sound like templates instead of real messages
- Subject lines that are too clever (clarity beats cleverness)
- AI tells: perfect parallel structures, rule of three, "In today's..."
- Overly formal language for what should be conversational emails
- Every email starting the same way (vary openings across the sequence)
- Missing personality. Emails should feel like they come from a real person.

---

## Step 7 — Present All Emails

Show all emails in sequence order. For each email, display:
1. Email number and timing (e.g., "Email 3 — Day 4")
2. Purpose
3. Subject line options
4. Preview text
5. Full body
6. CTA

After showing all emails, present the sequence map again as a summary view.

---

## Step 8 — Save Output

Save to `brands/[active-brand]/output/email-sequences/YYYY-MM-DD-slug/`

Create individual files for each email:
- `01-welcome.md`
- `02-story.md`
- `03-value.md`
- (naming based on each email's purpose)

Plus a summary file:

**sequence-map.md:**
```markdown
# [Sequence Name] — Email Sequence

- **Type:** [Welcome / Nurture / Launch / Re-engagement]
- **Emails:** [count]
- **Created:** [today]
- **Goal:** [sequence goal]
- **Audience:** [who receives this]

## Sequence Map

| # | Timing | Purpose | Subject Line | Email Type | File |
|---|--------|---------|--------------|------------|------|
| 1 | ...    | ...     | ...          | ...        | 01-welcome.md |
...

## Notes
[Any strategic notes about the sequence: what to monitor, when to adjust, how to measure success]
```

---

## Feedback Capture

After presenting the sequence:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes to the affected emails
2. Add the lesson to `brands/[active-brand]/lessons.md` under the appropriate section
3. Show the updated version
