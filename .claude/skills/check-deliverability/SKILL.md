---
name: check-deliverability
description: "Email spam and deliverability check. Catches spam triggers in subject lines, body copy, and formatting."
argument-hint: "[paste email subject + body]"
user-invocable: true
---

# Email Deliverability Check

Analyze email copy for spam triggers and deliverability risks before sending.

**Cowork compatible:** Yes. Works with pasted text, no file access required.

---

## Step 1 — Accept Input

Accept email copy via:
- Pasted text in chat (subject line + body)
- File reference (read the file)

If only the body is provided, ask for the subject line too. Subject line is critical for spam filtering.

If no text is provided, ask: "Paste your email (subject line + body), or tell me which file to check."

---

## Step 2 — Check for Spam Triggers

### A. Subject Line Analysis

- **ALL CAPS words:** Flag any fully capitalized words (1-2 is borderline, 3+ is high risk)
- **Excessive punctuation:** Multiple exclamation marks (!!!), question marks (???), or combinations (!?!?)
- **Spam trigger words:** free, guarantee, act now, limited time, click here, buy now, order now, don't miss, urgent, congratulations, winner, prize, no obligation, risk-free, 100%, lowest price, cash, credit, discount, extra income, earn money, double your, million, billion
- **Deceptive patterns:** Fake "Re:" or "Fwd:" prefixes, misleading content that doesn't match the body
- **Length:** Flag if over 60 characters (many clients truncate) or under 20 characters (can look spammy)
- **Emoji overuse:** More than 1-2 emojis in subject line

### B. Body Content Analysis

- **Spam trigger density:** High concentration of sales-heavy words in a short email
- **Link count:** Flag if more than 3 unique links (excluding unsubscribe). Each additional link increases spam score.
- **Image-to-text ratio notes:** Remind that emails with mostly images and little text often land in spam. Recommend at least a 60/40 text-to-image ratio.
- **HTML complexity:** Warn about heavy HTML, embedded CSS, or JavaScript (gets flagged). Recommend simple, clean HTML.
- **Unsubscribe link:** Remind to include one. Required by CAN-SPAM, GDPR, and most ESPs enforce it.
- **Sender name consistency:** Remind to keep sender name consistent across emails (changing it frequently hurts deliverability)

### C. Formatting Red Flags

- **Exclamation marks:** More than 2 in the entire email body
- **Colored text:** Red or green text is a classic spam signal
- **Font size extremes:** Very large (for emphasis) or very small (for hiding text) both trigger filters
- **ALL CAPS paragraphs:** Even one full sentence in caps raises flags
- **Dollar signs with amounts:** "$997" or "$$$$" patterns. Use "997 dollars" or rephrase.

### D. Content Patterns

- **Pressure language:** "Act now", "Last chance", "Expires tonight", "Only 3 left". One is fine, stacking multiple is risky.
- **Promises:** "Guaranteed results", "100% satisfaction", "Risk-free". These are spam filter favorites.
- **Asking to be whitelisted:** "Add us to your contacts" in the first email comes across as desperate. Save for onboarding sequences.
- **Excessive personalization tokens:** Too many merge fields look templated to filters.

---

## Step 3 — Rate Deliverability Risk

- **Low Risk:** Clean copy. Minor suggestions only. Should land in inbox.
- **Medium Risk:** Several triggers that could cause issues with strict filters (corporate emails, Gmail promotions tab). Worth fixing.
- **High Risk:** Multiple strong spam signals. Likely to hit spam or promotions tab. Needs rewriting.

---

## Step 4 — Present Report

```
DELIVERABILITY REPORT

Subject line: "[subject line]"
Risk level: [LOW / MEDIUM / HIGH]
Spam triggers found: [number]

---

SUBJECT LINE:
- [PASS/WARNING/FAIL] ALL CAPS: [details]
- [PASS/WARNING/FAIL] Punctuation: [details]
- [PASS/WARNING/FAIL] Trigger words: [details]
- [PASS/WARNING/FAIL] Length: [X characters]
- [PASS/WARNING/FAIL] Deceptive patterns: [details]

BODY:
- [PASS/WARNING/FAIL] Link count: [X links found]
- [PASS/WARNING/FAIL] Spam word density: [details]
- [PASS/WARNING/FAIL] Formatting: [details]
- [PASS/WARNING/FAIL] Pressure language: [details]

ISSUES:

1. Subject line contains "FREE" in all caps
   Why it matters: ALL CAPS trigger words are among the strongest spam signals.
   Fix: Lowercase it ("free") or rephrase: "no cost" or "complimentary"

2. Body has 5 exclamation marks
   Why it matters: Excessive punctuation signals promotional/spam content to filters.
   Fix: Keep max 1-2 in the entire email. Let the content create excitement, not punctuation.

3. "Click here" appears twice
   Why it matters: "Click here" is one of the oldest spam trigger phrases.
   Fix: Use descriptive link text: "grab the template" or "see the full breakdown"
```

---

## Step 5 — Present Clean Version

Show the revised email with all triggers removed:
- Cleaned subject line
- Cleaned body copy
- Note each change made

---

## Step 6 — Deliverability Tips Beyond Copy

Share relevant tips based on what was found:

**Sending practices:**
- Warm up new sending domains/IPs gradually (start with your most engaged subscribers)
- Send consistently. Long gaps followed by blasts hurt your sender reputation.
- Clean your list regularly. Remove bounces and unengaged subscribers (no opens in 90+ days).

**Authentication:**
- Make sure SPF, DKIM, and DMARC records are set up for your sending domain
- Use a custom sending domain, not your ESP's shared domain

**List hygiene:**
- Double opt-in reduces spam complaints
- Make unsubscribing easy (hard-to-find unsubscribe links increase spam reports)
- Segment by engagement. Send more to openers, less to cold subscribers.

Only mention tips that are relevant. Don't dump the full list every time.

---

## Step 7 — Feedback

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your lessons.md so I remember next time."
