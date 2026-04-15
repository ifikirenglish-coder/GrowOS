---
name: check-readability
description: "Check and optimize reading level. Flags complex sentences, hard words, passive voice, and jargon."
argument-hint: "[paste text or reference a file]"
user-invocable: true
---

# Readability Check

Analyze text for reading level and optimize for clarity.

**Cowork compatible:** Yes. Works with pasted text, no file access required.

---

## Step 0 — Context Loading

Load the active brand's brand file:
- `[active-business]/brand.md` (Section 4: Brand Voice) (check target reading level)

If no brand context is available, default to **Grade 8** target.

---

## Step 1 — Accept Input

Accept text via:
- Pasted text in chat
- File reference (read the file)

If no text is provided, ask: "Paste the text you want me to check, or tell me which file to analyze."

---

## Step 2 — Analyze Readability

Run the full analysis:

### A. Grade Level Estimate

Calculate a Flesch-Kincaid equivalent grade level based on:
- Average sentence length (words per sentence)
- Average syllables per word
- Report the estimated grade level

### B. Long Sentences

Flag every sentence over 25 words. For each:
- Quote the sentence
- Show word count
- Suggest where to split or trim

### C. Complex Words

Flag words over 3 syllables that have simpler alternatives. For each:
- The complex word
- A simpler replacement
- Skip proper nouns and technical terms that have no simpler equivalent

### D. Passive Voice

Flag passive voice constructions. For each:
- Quote the passive sentence
- Suggest the active rewrite

### E. Jargon and Technical Terms

Flag jargon or technical terms used without explanation. For each:
- The term
- Whether it needs explanation, simplification, or removal
- Consider the likely audience (if brand context is loaded, use audience files)

---

## Step 3 — Present Report

```
READABILITY REPORT

Current grade level: [X]
Target grade level: [Y]
Status: [PASS / NEEDS WORK / TOO COMPLEX]

Long sentences (25+ words): [count]
Complex words with simpler alternatives: [count]
Passive voice instances: [count]
Unexplained jargon: [count]

DETAILS:

LONG SENTENCES:
- "[sentence]" (32 words) → Split after "[word]"
- "[sentence]" (28 words) → Remove "[phrase]"

COMPLEX WORDS:
- "utilize" → "use"
- "approximately" → "about"
- "implementation" → "setup"

PASSIVE VOICE:
- "The email was sent by the team" → "The team sent the email"

JARGON:
- "CTA" → spell out or explain on first use
- "conversion rate" → add brief context for non-marketers
```

---

## Step 4 — Offer Rewrite

Ask: "Want me to rewrite this at the target grade level? I'll simplify the language while keeping the meaning intact."

If yes:
- Rewrite the full text
- Fix all flagged issues
- Preserve the original meaning and tone
- Run `/humanize` on the rewrite before presenting it

---

## Step 5 — Show Comparison

If rewritten, show a before/after comparison:

```
BEFORE (Grade [X]):
[original paragraph]

AFTER (Grade [Y]):
[simplified paragraph]
```

Focus on the paragraphs that changed most. Don't repeat sections that were already fine.

---

## Step 6 — Feedback

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."
