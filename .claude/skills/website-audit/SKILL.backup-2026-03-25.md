---
name: website-audit
description: "Score any website 0-100 across 6 dimensions: content, SEO, conversion, trust, UX, and brand consistency."
argument-hint: "[URL to audit]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Website Audit

**Purpose:** Score any website across 6 key dimensions and provide actionable improvement recommendations.
**When to use:** When you want to evaluate your own website or a competitor's site.
**Cowork compatible:** Partially. Scorecard is presented in chat, but file saving requires Code mode.

---

## Step 0 — Load Context

Load these files before starting:

1. `brands/[active-brand]/voice.md` — your brand context (for comparison if auditing your own site)
2. `brands/[active-brand]/lessons.md` — rules from past feedback

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Get the URL

Ask: "What URL do you want to audit? This can be your own website or a competitor's."

If no URL is provided, check if the brand's voice.md contains a website URL and offer to audit that.

---

## Step 2 — Fetch and Review

Fetch the homepage and attempt to access key pages:
- Homepage
- About / About Us
- Pricing (if applicable)
- Blog / Resources (if applicable)
- Contact

For each page, note what's present, what's missing, and what stands out (good or bad).

If some pages can't be accessed, note which ones and score based on what's available.

---

## Step 3 — Score Across 6 Dimensions

Rate each dimension 0-100. Be honest and specific. Justify every score with concrete observations.

### 1. Content Quality (0-100)
- Is the copy clear and easy to understand?
- Does it speak to a specific audience?
- Is the value proposition obvious within 5 seconds?
- Is the writing compelling or generic?
- Are there spelling/grammar issues?
- Is the content original or template-like?

### 2. SEO Basics (0-100)
- Are title tags and meta descriptions present and well-written?
- Do pages have proper heading hierarchy (H1, H2, H3)?
- Are images using alt text?
- Is the URL structure clean?
- Are there signs of keyword targeting?
- Is there a blog or content hub for organic traffic?

### 3. Conversion Optimization (0-100)
- Is there a clear CTA above the fold?
- Is the value proposition immediately visible?
- Are there multiple CTAs throughout the page?
- Is the pricing clear (if applicable)?
- Is there a lead capture mechanism (email signup, free trial, etc.)?
- Does the page reduce friction (FAQ, objection handling)?

### 4. Trust and Credibility (0-100)
- Are there testimonials or reviews?
- Are there client logos or "as seen in" badges?
- Is there a clear about page with real people?
- Are there case studies or proof of results?
- Is there a physical address or clear contact info?
- Does the site feel legitimate and professional?

### 5. User Experience (0-100)
- Is the navigation intuitive?
- Does the page load quickly?
- Is the site mobile-friendly?
- Is the text readable (font size, contrast, line length)?
- Is the layout clean or cluttered?
- Can you find what you need within 2 clicks?

### 6. Brand Consistency (0-100)
- Are colors, fonts, and imagery consistent across pages?
- Does the voice feel consistent throughout?
- Does the site feel cohesive or like pages were designed separately?
- Is the logo prominent and professional?
- Does the overall feel match the stated positioning?

---

## Step 4 — Calculate Overall Score

**Weighted average:**
- Content Quality: 20%
- SEO Basics: 15%
- Conversion Optimization: 25%
- Trust and Credibility: 20%
- User Experience: 10%
- Brand Consistency: 10%

Conversion and content are weighted highest because they most directly impact business results.

Round to the nearest whole number.

**Score ranges:**
- 90-100: Excellent. Minor tweaks only.
- 75-89: Strong. A few areas to tighten up.
- 60-74: Decent. Clear opportunities for improvement.
- 40-59: Needs work. Several significant gaps.
- Below 40: Major overhaul needed.

---

## Step 5 — Present the Scorecard

### Overall Score: [XX]/100 — [Rating]

| Dimension | Score | Quick Take |
|-----------|-------|------------|
| Content Quality | XX/100 | [one-line summary] |
| SEO Basics | XX/100 | [one-line summary] |
| Conversion Optimization | XX/100 | [one-line summary] |
| Trust & Credibility | XX/100 | [one-line summary] |
| User Experience | XX/100 | [one-line summary] |
| Brand Consistency | XX/100 | [one-line summary] |

### Top 3 Strengths
1. [specific thing done well, with example]
2. [specific thing done well, with example]
3. [specific thing done well, with example]

### Top 3 Weaknesses
1. [specific problem + concrete fix suggestion]
2. [specific problem + concrete fix suggestion]
3. [specific problem + concrete fix suggestion]

### Quick Wins (under 1 hour to fix)
- [specific action item]
- [specific action item]
- [specific action item]

### Deep Improvements (higher effort, high impact)
- [specific action item with expected impact]
- [specific action item with expected impact]
- [specific action item with expected impact]

---

## Step 6 — Save

Save to: `brands/[active-brand]/output/research/website-audit-YYYY-MM-DD.md`

Include metadata at the top:

```markdown
---
url: "[url audited]"
overall_score: XX
date: YYYY-MM-DD
type: website-audit
---
```

Include the full scorecard and all recommendations.

---

## Feedback Capture

After presenting the scorecard:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes
2. Add a concise, actionable rule to `brands/[active-brand]/lessons.md`
3. Present the updated version
