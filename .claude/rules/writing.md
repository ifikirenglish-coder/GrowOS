# Writing Rules

These rules apply to ALL written content: emails, ads, social posts, newsletters, landing pages, articles.

---

## Voice

Always load the active business's `brand.md` Section 4 (Brand Voice) before writing anything. The voice profile defines tone, forbidden words, and style preferences specific to each business.

**Universal defaults (apply to all brands):**
- Conversational and direct. Like talking to a friend over coffee.
- Grade 8 or lower reading level.
- Short paragraphs (1-3 sentences max).
- No jargon or corporate buzzwords unless the brand voice explicitly allows them.

---

## Mandatory: Humanizer Check

Always run `/humanize` before presenting any written content. This checks for AI writing patterns and fixes them. No exceptions.

## Mandatory: Load Lessons

Before any writing task, load the active business's `lessons.md`. It contains feedback-driven rules that override defaults.

---

## Hard Rules

### No Em Dashes
Zero em dashes in any output. Replace with: period + new sentence, comma, colon, or parenthetical. This is the single biggest AI tell.

### No Fabrication
Never invent statistics, testimonials, results, or story details. If you don't have the info, use `[PLACEHOLDER]` and flag it.

### No AI Vocabulary
Avoid these words/phrases:
- delve, tapestry, landscape, leverage, utilize, facilitate, realm, foster
- game-changing, revolutionary, groundbreaking, cutting-edge, transformative
- it's worth noting, interestingly, it's important to note
- navigate (metaphorical), unlock (metaphorical), robust, comprehensive
- harness, elevate, empower, supercharge, streamline, synergy
- let's dive in, without further ado, buckle up
- embark, pivotal, multifaceted, nuanced (as filler)

Replace with plain language. "Use" not "utilize." "Strong" not "robust."

### No Rule of Three
Don't always list things in groups of three. Use 2, 4, or 5 items. Vary structure so items aren't parallel. Real people don't group everything in threes.

### No Negative Parallelisms
"Not X. Not Y. But Z." is fine once per piece. More than once is an AI tell.

### No Inflated Symbolism
A coffee cup is a coffee cup. A business decision is a business decision. Don't treat ordinary things as deeply meaningful or symbolic.

### No Promotional Language
Write like you're talking to a friend, not writing a press release. No "We're thrilled to announce" or "Experience the power of."

---

## Audience Context

Before writing persuasive content:
1. Ask which audience (if not specified and multiple exist)
2. Load the relevant persona from `[active-business]/audiences/`
3. Match language, pain points, and awareness level to that persona

---

## Feedback Loop

After presenting any written content:
1. Ask for feedback
2. If feedback is given: apply changes AND add a concise rule to `[active-business]/lessons.md`
3. This ensures the system learns from every correction
