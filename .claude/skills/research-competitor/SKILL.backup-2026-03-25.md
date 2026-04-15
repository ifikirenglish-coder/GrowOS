---
name: research-competitor
description: "Systematic competitor analysis with positioning gaps, content strategy, and differentiation opportunities."
argument-hint: "[competitor name or URL]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Competitor Research

**Purpose:** Analyze a competitor's positioning, offers, content, and messaging to find differentiation opportunities.
**When to use:** When you want to understand a competitor or find gaps in the market.
**Cowork compatible:** Partially. Analysis is presented in chat, but file saving and competitor index updates require Code mode.

---

## Step 0 — Load Context

Load these files before starting:

1. `brands/[active-brand]/voice.md` — your brand positioning
2. `brands/[active-brand]/lessons.md` — rules from past feedback
3. `brands/[active-brand]/competitors/_index.md` — existing competitor intel (if it exists)

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Identify the Competitor

Ask: "Who do you want to analyze? Give me a name, URL, or say 'find my competitors' and I'll research who's in your space."

**If a specific name/URL is given:** Proceed to Step 2.

**If "find my competitors":** Use the brand's voice.md and audience files to understand the niche. Search for competitors in that space. Present 5-7 potential competitors and let the user pick which to analyze.

---

## Step 2 — Website Analysis

If a URL is provided (or found), fetch and analyze their website. Extract:

- **Positioning statement** — How do they describe what they do? (usually in the hero section)
- **Target audience** — Who are they speaking to? What language do they use?
- **Key offers/products** — What do they sell? At what price points (if visible)?
- **Pricing model** — Free tier? Subscription? One-time? Enterprise?
- **Content strategy** — Do they have a blog? Podcast? YouTube? Newsletter? How often do they publish?
- **Unique selling points** — What makes them different (in their own words)?
- **Social proof** — Testimonials, logos, case studies, numbers
- **Tech/tools** — What platform are they built on? Any visible integrations?
- **Weaknesses/gaps** — What's missing, unclear, or poorly executed?

---

## Step 3 — Social Media and Content Presence

Search for their presence across platforms:

- Twitter/X — follower count, posting frequency, engagement levels, content themes
- LinkedIn — company page, key people, content approach
- YouTube — channel size, video topics, view counts
- Instagram — follower count, content style
- Email/Newsletter — do they have one? What's the signup offer?

Note: You may not be able to access all platforms. Report what you can find and note what couldn't be verified.

---

## Step 4 — Competitive Comparison

Compare against your brand's positioning (from voice.md and audience files):

| Dimension | Competitor | Your Brand |
|-----------|-----------|------------|
| Positioning | | |
| Target audience | | |
| Price range | | |
| Key differentiator | | |
| Content approach | | |
| Biggest strength | | |
| Biggest weakness | | |

---

## Step 5 — Present the Analysis

Structure the report:

### Competitor Profile
- Name, URL, one-line description
- What they do and who they serve
- Estimated size/stage (startup, growth, established)

### Strengths to Learn From
- 3-5 things they do well that are worth noting
- Specific examples (headlines, offers, content pieces)

### Gaps and Opportunities
- 3-5 weaknesses or blind spots
- Messaging angles they are NOT using (your opportunity)
- Audiences they are ignoring or underserving
- Content formats they are missing

### Differentiation Strategy
- How your brand can position differently
- Specific messaging angles to test
- Content ideas inspired by their gaps

### Content Ideas
- 3-5 content pieces you could create that address gaps this competitor leaves open

---

## Step 6 — Update Competitor Index

Add or update the competitor in `brands/[active-brand]/competitors/_index.md`:

```markdown
## [Competitor Name]
- **URL:** [url]
- **Analyzed:** YYYY-MM-DD
- **Positioning:** [one-line summary]
- **Key differentiator:** [what makes them different]
- **Our advantage:** [where we win]
```

If the file doesn't exist, create it with a header: `# Competitor Index`

---

## Step 7 — Save Full Report

Save to: `brands/[active-brand]/output/research/competitor-[name]-YYYY-MM-DD.md`

Include all sections from Step 5, plus the raw data from Steps 2-4.

Format with metadata at the top:

```markdown
---
competitor: "[name]"
url: "[url]"
date: YYYY-MM-DD
status: complete
---
```

---

## Feedback Capture

After presenting the analysis:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes
2. Add a concise, actionable rule to `brands/[active-brand]/lessons.md` under the research section
3. Present the updated version
