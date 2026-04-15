---
name: check-fb-compliance
description: "Validate Facebook ad copy against Meta advertising policies. Catches rejection risks before you submit."
argument-hint: "[paste ad copy or reference a file]"
user-invocable: true
---

# Facebook Ad Compliance Check

Validate ad copy against Meta's advertising policies before submitting. Catches common rejection triggers.

**Cowork compatible:** Yes. Works with pasted text, no file access required.

---

## Step 1 — Accept Input

Accept ad copy via:
- Pasted text in chat
- File reference (read the file)

If no text is provided, ask: "Paste the Facebook ad copy you want me to check, or tell me which file to review."

If multiple ad variants are provided, check each one separately.

---

## Step 2 — Check Against Meta Policies

Review the ad copy against each policy area:

### A. Personal Attributes
Meta prohibits ads that assert or imply knowledge of personal attributes.
- Direct "Are you...?" questions about: race, ethnicity, religion, beliefs, age, sexual orientation, gender identity, disability, medical conditions (physical or mental), financial status, criminal record, name, voting status, union membership
- Implied personal attributes: "As a diabetic...", "Struggling with debt?", "Other Christians agree..."
- **Allowed:** General statements that don't single out the viewer. "Many small business owners find..." is safer than "As a small business owner, you..."

### B. Before/After Claims
- Weight loss before/after images or claims
- Income before/after claims ("I went from $0 to $10K/month")
- Unrealistic transformation timelines
- **Allowed:** Results with proper context and disclaimers. Focus on the process, not dramatic transformation.

### C. Sensational Language / Clickbait
- Exaggerated claims designed to generate clicks
- "You won't believe..." / "Shocking discovery..."
- ALL CAPS for emphasis (individual words are usually fine, full sentences are not)
- Excessive punctuation (!!!, ???)

### D. Misleading Claims
- Exaggerated or unverifiable results
- Implied guarantees without basis
- "Secret" or "hack" framing that implies insider knowledge
- Screenshots of results without context
- **Allowed:** Specific, verifiable claims with proper context

### E. Profanity and Adult Content
- Profanity in ad copy (even mild)
- Sexual suggestiveness
- Graphic or violent imagery descriptions

### F. Health and Supplement Claims
- Claims that could be interpreted as medical advice
- "Cure", "treat", "heal" language
- Supplement claims that imply drug-like effects
- Diet claims with specific weight loss numbers
- **Allowed:** General wellness language. "Support your health goals" vs "Cure your back pain"

### G. Financial Claims
- Promised specific returns ("Make $10K in 30 days")
- "Get rich" implications
- Crypto/investment promises
- MLM-style income claims
- **Allowed:** General business growth language with realistic framing

### H. Political Content
- References to political figures, parties, or elections
- Social issues that Meta classifies as political (varies by region)
- Requires "Paid for by" disclaimers in many cases

### I. Discriminatory Implications
- Copy that could be seen as targeting or excluding protected groups
- Housing, employment, or credit ads have extra restrictions
- Age-specific language in restricted categories

---

## Step 3 — Rate Each Policy Area

For each area checked, rate:

- **PASS** — No issues found
- **WARNING** — Could trigger review or rejection depending on reviewer interpretation
- **FAIL** — Likely to be rejected. Needs changes before submitting.

---

## Step 4 — Present Report

```
FB COMPLIANCE REPORT

Overall verdict: [READY TO SUBMIT / NEEDS CHANGES / HIGH REJECTION RISK]

Policy Area          | Status
---------------------|--------
Personal Attributes  | PASS
Before/After Claims  | WARNING
Sensational Language | PASS
Misleading Claims    | PASS
Profanity/Adult      | PASS
Health Claims        | FAIL
Financial Claims     | WARNING
Political Content    | PASS
Discriminatory       | PASS

---

ISSUES:

[FAIL] Health Claims
Text: "This supplement will fix your chronic fatigue"
Issue: "Fix" implies a cure, which violates health claim policies.
Compliant alternative: "Support your energy levels naturally"

[WARNING] Before/After Claims
Text: "I went from exhausted to energized in 2 weeks"
Issue: Implied health transformation with specific timeline. May trigger review.
Compliant alternative: "Here's what changed when I adjusted my routine"

[WARNING] Financial Claims
Text: "Double your revenue"
Issue: Specific financial promise without disclaimer.
Compliant alternative: "Grow your revenue" or add "Results vary. See typical outcomes at [link]"
```

---

## Step 5 — Present Compliant Version

If any WARNING or FAIL was found:

"Here's a compliant version with all issues fixed:"

Show the full revised ad copy with changes highlighted or noted.

---

## Step 6 — Feedback

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your lessons.md so I remember next time."

---

## Notes

- Meta's policies change frequently. When in doubt, flag as WARNING rather than PASS.
- Ad reviewers have discretion. A technically compliant ad can still be rejected.
- Special Ad Categories (housing, employment, credit) have stricter rules. If the ad falls in one of these categories, mention the additional restrictions.
- Image/video content also affects approval but is outside the scope of this copy check. Remind the user to review visual content separately.
