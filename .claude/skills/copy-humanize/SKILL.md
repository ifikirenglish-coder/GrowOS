---
name: copy-humanize
description: "Remove AI writing patterns from text. Use when user says 'humanize', 'make it sound human', 'remove AI writing', or 'check for AI tells'."
argument-hint: "[paste text or reference a file]"
user-invocable: true
---

# Humanizer

Remove AI writing patterns from any text. Called by all content skills before presenting output.

**Cowork compatible:** Yes. Works with pasted text, no file access required.

---

## How to Use

**Standalone:** Paste or reference text and say `/humanize`. The skill scans, flags issues, and rewrites.

**Called by other skills:** Those skills say "Run `/humanize`" at a specific step. Follow the full checklist on the text.

---

## Step 0 — Context Loading

Load the active brand's brand file:
- `[active-business]/brand.md` (Section 4: Brand Voice) (check target reading level, tone rules)

If running standalone and no brand context is available, use sensible defaults (Grade 8, conversational tone).

---

## Step 1 — Accept Input

Accept text via:
- Pasted text in chat
- File reference (read the file)

If no text is provided, ask: "Paste the text you want me to humanize, or tell me which file to check."

---

## Step 2 — The Checklist

Scan the text for ALL of the following patterns. Flag each one found, then fix it.

### 1. Em Dash Overuse

**Pattern:** Overuse of em dashes (—) as a crutch connector.
**Fix:** Replace every em dash with: period + new sentence, comma, colon, or parenthetical. Zero em dashes in final output. Hard rule.

### 2. Rule of Three

**Pattern:** Lists or examples that always come in exactly three parallel items. AI defaults to three because it feels "complete."
- "Speed, quality, and reliability."
- "Whether you're a founder, marketer, or freelancer..."
- Three bullet points with identical structure

**Fix:** Use 2, 4, or 5 items. Or vary the structure so items aren't parallel. Real people don't naturally group everything in threes.

### 3. Negative Parallelisms

**Pattern:** "Not X. Not Y. But Z." or "It's not about X. It's about Y." Used once, it's fine. Used more than once in the same piece, it's an AI tell.

**Fix:** Allow maximum ONE per piece. Rewrite the rest using different sentence structures.

### 4. AI Vocabulary Words

**Pattern:** Words and phrases that AI uses 10x more than humans:
- delve, tapestry, landscape, leverage, utilize, facilitate, realm, foster
- game-changing, revolutionary, groundbreaking, cutting-edge, transformative
- navigate (used metaphorically), unlock (used metaphorically)
- robust, comprehensive, streamline, harness, elevate, empower, supercharge
- let's dive in, without further ado, buckle up, embark, pivotal, multifaceted

**Fix:** Replace with plain language. "Use" not "utilize." "Strong" not "robust." "Change" not "transform." Or just cut the word entirely.

### 5. Inflated Symbolism

**Pattern:** Treating ordinary things as deeply meaningful or symbolic. AI inflates significance.
- "The coffee cup wasn't just a coffee cup. It was a symbol of..."
- "This simple change represented a fundamental shift in..."
- Making mundane business decisions sound like spiritual awakenings

**Fix:** State things plainly. A coffee cup is a coffee cup. A business decision is a business decision.

### 6. Promotional Language

**Pattern:** Copy that reads like a press release or product page when it should be conversational.
- "We're thrilled to announce..."
- "This innovative solution..."
- "Experience the power of..."

**Fix:** Write like you're texting a friend about it. "So I built this thing..." or "Here's what it does."

### 7. Superficial "-ing" Analyses

**Pattern:** Surface-level observations disguised as insight by using present participles.
- "By leveraging AI, businesses are transforming their marketing..."
- "This approach is revolutionizing the way we think about..."

**Fix:** Be specific. What exactly changed? What were the numbers? What actually happened?

### 8. Vague Attributions

**Pattern:** Citing unnamed authorities or studies without specifics.
- "Studies show that..."
- "Experts agree..."
- "Research suggests..."
- "Many people believe..."

**Fix:** Name the specific source, or cut the claim. If you can't cite it, don't say it.

### 9. Excessive Conjunctive Phrases

**Pattern:** Over-reliance on transitional phrases that AI uses to sound structured:
- Furthermore, Moreover, Additionally, In addition
- That being said, With that in mind, Having said that
- It goes without saying, Needless to say
- On the other hand, By the same token

**Fix:** Cut them. Start the next sentence directly. Or use simple connectors: "And," "But," "So," "Still." Max 1 per piece.

### 10. Even Rhythm / Flat Emotional Tone

**Pattern:** Every sentence is roughly the same length. The energy never shifts. Reading it feels like being on a treadmill.

**Fix:** Vary sentence length aggressively. Short punch. Then a longer explanatory sentence that takes its time. Fragment. Then back to medium. The rhythm should pulse, not drone.

### 11. Too-Clean Structure

**Pattern:** Every section perfectly mirrors the last. Perfect introduction, body with numbered sections, and conclusion that summarizes. Real writing doesn't follow a formula this cleanly.

**Fix:** Let structure emerge from the content. Skip intros that preview what's coming. Don't summarize at the end. Start where the interesting part starts. Break the pattern.

### 12. Hedging Language

**Pattern:** AI hedges everything equally, making nothing feel definitive:
- "It's worth noting", "Interestingly", "Perhaps"
- "It could be argued", "This could potentially help improve..."
- "It might be worth considering..."

**Fix:** Have opinions. Be definitive where confident. Only hedge where genuine uncertainty exists.

### 13. Generic Closings

**Pattern:** Predictable endings that add nothing.
- "In conclusion", "To sum up", "At the end of the day"
- Restating everything that was just said

**Fix:** Just end naturally. The last point IS the ending. No need to announce it.

### 14. Manufactured Empathy

**Pattern:** Declaring understanding instead of showing it.
- "We understand how frustrating..."
- "We know you're busy..."
- "We get it."

**Fix:** Show understanding through specifics, not declarations. Describe the actual situation they're in.

### 15. Bullet Point Lists Where Prose Works Better

**Pattern:** Converting everything into bullet points or numbered lists when a paragraph would read more naturally.

**Fix:** Not everything needs to be a list. If the items flow as a narrative, write them as prose. Save lists for genuinely scannable content.

---

## Step 3 — Fix and Re-scan

1. Fix all flagged issues in the text
2. Re-scan the fixed version to catch any new patterns introduced by the fixes
3. Repeat until clean

---

## Step 4 — Present Output

Show the humanizer report and the clean version.

### Report Format:

```
HUMANIZER REPORT
Issues found: [number]

#4 AI Vocabulary: "leverage" in paragraph 2 → replaced with "use"
#2 Rule of Three: "speed, quality, and reliability" → changed to "speed and reliability"
#1 Em Dash: 3 em dashes found → replaced with periods/commas
#10 Flat Rhythm: paragraph 4 has 5 sentences all ~15 words → varied lengths

All issues fixed. Clean version below.
```

Then present the clean text.

---

## Step 5 — Feedback

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

---

## Quick Reference (Scan Priority)

When running quickly on short pieces, check these in order of frequency:

1. Em dashes (—)
2. Rule of three patterns
3. AI vocabulary (delve, leverage, landscape, robust, etc.)
4. Negative parallelisms (more than 1x)
5. Excessive conjunctive phrases (Furthermore, Moreover, Additionally)
6. Too-clean parallel structures
7. Even rhythm / flat tone
8. Inflated symbolism
9. Promotional language
10. Vague attributions

If the text passes these 10, it's usually clean. Run the full 15 on longer pieces (articles, sales copy, landing pages).

---

## Voice Rules (Apply After Humanizing)

- **Contractions required** ("you will" -> "you'll", "it is" -> "it's")
- **Start sentences with "And" and "But"** when natural
- **Parenthetical asides welcome** ("seriously, this took me way too long")
- **Fragments are fine** for impact
- **Grade 8 or lower** reading level (short sentences, simple words)
- **Would someone say this out loud?** If not, rewrite it
