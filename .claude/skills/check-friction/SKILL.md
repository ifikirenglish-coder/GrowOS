---
name: check-friction
description: "Copy friction audit. Find where readers drop off, get confused, or lose trust."
argument-hint: "[paste text or reference a file]"
user-invocable: true
---

# Friction Audit

Identify where readers drop off, get confused, or lose trust in your copy.

**Cowork compatible:** Yes. Works with pasted text, no file access required.

---

## Step 0 — Context Loading

Load the active brand's files:
- `[active-business]/brand.md` (Section 4: Brand Voice)
- `[active-business]/lessons.md`

If no brand context is available, proceed with general best practices.

---

## Step 1 — Accept Input

Accept text via:
- Pasted text in chat (landing page, email, ad copy, article, sales page)
- File reference (read the file)

If no text is provided, ask: "Paste the copy you want me to audit, or tell me which file to check."

Also ask what type of content it is (if not obvious): landing page, email, ad, article, sales page. This affects how friction is weighted.

---

## Step 2 — Analyze for Friction Types

Read through the text as a first-time reader would. Flag every point where a reader might:
- Stop reading
- Get confused
- Feel skeptical
- Feel overwhelmed
- Not know what to do next

### Friction Categories:

**Confusion Friction**
- Unclear meaning or ambiguous phrasing
- Ambiguous pronouns ("it", "they", "this" without clear reference)
- Missing context (assumes knowledge the reader may not have)
- Logical jumps between ideas
- Contradicting statements

**Credibility Friction**
- Unsubstantiated claims ("the best", "proven", "guaranteed")
- Vague proof ("thousands of customers", "amazing results")
- "Trust me" moments with no evidence
- Claims that sound too good to be true
- Missing specifics where specifics would convince

**Effort Friction**
- Walls of text with no visual breaks
- Too much information at once
- Paragraphs over 4 lines
- Sections that could be cut without losing meaning
- Repetitive points that add length but not value

**Relevance Friction**
- Sections that don't serve the reader's goal
- Self-congratulatory content (about the brand, not the reader)
- Tangents that break the flow
- Features listed without benefits
- Information the reader doesn't need at this point

**Emotional Friction**
- Sudden tone shifts (casual to corporate, or vice versa)
- Condescension ("As you probably already know...")
- Guilt trips or shame-based persuasion
- False urgency ("Act NOW before it's too late!!!")
- Hype without substance

**Decision Friction**
- Too many CTAs competing for attention
- Unclear next step
- Choice overload (too many options presented at once)
- CTA that doesn't match the content's promise
- Missing CTA entirely
- Asking for too much too soon (big commitment before building trust)

---

## Step 3 — Rate Overall Friction

Rate the piece: **Low** / **Medium** / **High**

- **Low:** Minor issues. Reads smoothly. 0-2 friction points.
- **Medium:** Several spots that could lose readers. 3-5 friction points.
- **High:** Significant risk of readers dropping off. 6+ friction points or any critical friction.

---

## Step 4 — Present Findings

For each friction point, show:

```
FRICTION AUDIT REPORT

Overall friction: [LOW / MEDIUM / HIGH]
Friction points found: [number]

---

1. [CONFUSION] Severity: Medium
   Location: Paragraph 3, sentence 2
   Text: "[the problematic text]"
   Issue: Pronoun "it" could refer to either the product or the process
   Fix: Replace "it" with "the onboarding process"

2. [CREDIBILITY] Severity: High
   Location: Headline
   Text: "The #1 marketing tool for small businesses"
   Issue: Unsubstantiated "#1" claim. Readers will be skeptical without proof.
   Fix: Replace with specific result: "Used by 500+ small businesses to [specific outcome]"

3. [EFFORT] Severity: Medium
   Location: Section 2
   Text: [6-line paragraph]
   Issue: Wall of text. No breaks for scanning.
   Fix: Split into 2-3 shorter paragraphs. Add a subhead.
```

---

## Step 5 — Offer Rewrites

Ask: "Want me to rewrite the worst friction points? I'll fix the top [N] issues."

If yes:
- Rewrite the most severe friction points
- Run `/humanize` on any rewritten sections
- Show before/after for each fix

---

## Step 6 — Feedback

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your lessons.md so I remember next time."
