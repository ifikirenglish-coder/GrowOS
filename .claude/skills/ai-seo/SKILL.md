---
name: ai-seo
description: "Optimize content for AI search engines like Perplexity, ChatGPT, and Google AI Overviews."
argument-hint: "[URL, article draft, or topic]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# AI SEO Optimizer

**Purpose:** Analyze and optimize content so it gets cited by AI search engines (Perplexity, ChatGPT, Google AI Overviews, etc.).
**When to use:** When you want your content to show up in AI-generated answers, not just traditional search results.
**Cowork compatible:** Yes. Analysis and recommendations are presented in chat. File saving is optional.

---

## Step 0 — Load Context

Load these files before starting:

1. `[active-business]/brand.md` (Section 4: Brand Voice) — writing voice
2. `[active-business]/lessons.md` — rules from past feedback

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Get the Content

Ask: "What do you want to optimize for AI search? Give me one of these:"

- **A URL** — I'll fetch and analyze the live page
- **An article draft** — Paste it or point me to a file
- **A topic** — I'll help you write content designed for AI citations from scratch

---

## Step 2 — AI SEO Principles

Before diving into analysis, briefly explain the key principles so the user understands the "why" behind the recommendations:

**How AI search engines decide what to cite:**

1. **Clear, direct answers.** AI models pull from content that directly answers specific questions. Hedging and filler get skipped.
2. **Structured content.** Headings that map to real search queries make it easy for AI to extract relevant sections.
3. **Specific data points.** Numbers, percentages, timelines, and original data get cited over vague claims.
4. **Original insights.** AI models prioritize content that says something new, not content that rephrases what everyone else says.
5. **Entity clarity.** Clear definitions of key terms and concepts help AI understand and reference your content accurately.
6. **Freshness.** Recently published or updated content gets priority, especially for evolving topics.
7. **Authority signals.** Author credentials, backlinks from trusted sources, and consistent publishing history build citation trust.

---

## Step 3 — Analyze for AI-Searchability

Review the content (or URL) against these criteria. Score each one as Strong / Needs Work / Missing:

### Question Targeting
- Does the content clearly answer specific questions someone would ask an AI?
- Are those questions represented in headings or subheadings?
- Would an AI be able to extract a clean 2-3 sentence answer from any section?

### Structure and Scannability
- Are headings descriptive and query-like (not clever or vague)?
- Is there a logical hierarchy that an AI can follow?
- Are key points front-loaded in paragraphs (not buried)?
- Is there a summary or TL;DR section?

### Specificity and Data
- Does it include specific numbers, stats, or data points?
- Are there original insights, frameworks, or methodologies?
- Does it go deeper than surface-level coverage?
- Are claims supported with evidence or examples?

### Authority Signals
- Is the author/brand clearly identified?
- Are there credentials or experience markers?
- Does it link to authoritative external sources?
- Is there an author bio or about section?

### Entity Optimization
- Are key terms clearly defined when first introduced?
- Are relationships between concepts made explicit?
- Could an AI build a knowledge graph from this content?

### Freshness
- Is the content dated?
- Are references and examples current?
- Is there a pattern of updates?

---

## Step 4 — Generate Recommendations

Based on the analysis, provide:

### Priority Fixes (do these first)
- Specific questions to add and answer in the content
- Heading rewrites that map to real search queries
- Sections that need a clear, extractable answer added

### Structural Improvements
- Where to add FAQ sections
- Summary or TL;DR placement
- Heading hierarchy fixes
- Front-loading key information in paragraphs

### Entity Optimization
- Key terms that need clear definitions
- Relationships between concepts to make explicit
- Jargon to either define or replace

### Schema Markup Suggestions
- FAQ schema for question-answer sections
- Article schema with author info
- HowTo schema for process content
- Organization schema for the brand

### Linking Strategy
- Internal links to add (connect related content)
- External authority links to include (studies, data sources)
- Anchor text improvements

---

## Step 5 — Rewrite (if optimizing existing content)

If working with existing content (URL or draft), provide the optimized version:

- Restructure headings as query-style where appropriate
- Add clear, extractable answers at the top of each section
- Insert specific data points and examples
- Add an FAQ section at the bottom with 5-8 questions
- Include a summary/TL;DR near the top
- Front-load key insights in every paragraph

Keep the brand's voice intact. This is about structure and specificity, not changing the personality.

---

## Step 6 — Humanize

Run `/humanize` on any rewritten content before presenting it.

The optimization should make content more structured and specific, not more robotic. Check for:
- Headings that sound like a textbook instead of a real person
- Answers that read like Wikipedia instead of an expert talking
- Loss of personality in the pursuit of structure

---

## Step 7 — Save

Save to: `[active-business]/output/research/ai-seo-YYYY-MM-DD.md`

Include metadata at the top:

```markdown
---
content: "[URL or topic]"
date: YYYY-MM-DD
type: ai-seo-optimization
---
```

Include:
- The analysis scorecard
- All recommendations
- The rewritten content (if applicable)
- Schema markup suggestions

---

## Feedback Capture

After presenting the analysis and recommendations:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes
2. Add a concise, actionable rule to `[active-business]/lessons.md`
3. Present the updated version
