---
name: ads-create-fb
description: "Generate a complete Facebook/Meta ad campaign with multiple ad sets, copy variants, and creative direction."
argument-hint: "[offer or product name]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Facebook Ad Campaign Creator

**Purpose:** Build a full Facebook/Meta ad campaign from scratch, with structured ad sets, copy variants, and creative direction.
**When to use:** When you want to create Facebook or Meta ads for a product, offer, or promotion.
**Cowork compatible:** Partially. Copy is presented in chat, but file saving requires Code mode.

---

## Step 0 — Load Context

Load these files before starting:

1. `[active-business]/brand.md` (Section 4: Brand Voice) — writing voice
2. `[active-business]/lessons.md` — rules from past feedback
3. `system/references/headline-types.md` — headline formulas
4. `system/references/hook-types.md` — hook formulas

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Get the Offer Details

Ask the user:

- **What product or offer are you advertising?** (name, price, key benefit)
- **Do you have a landing page URL?** (if yes, fetch and review it for messaging alignment)

If a landing page URL is provided, review it to understand the offer positioning, headline, CTA, and proof points. Use these to align ad copy with the landing page experience.

---

## Step 2 — Load Target Audience

Load the target audience persona from `[active-business]/audiences/`.

If multiple audience files exist, ask which persona to target. If only one exists, use it.

Pull from the persona:
- Pain points and desires
- Language patterns (how they describe their problems)
- Awareness level
- Objections

---

## Step 3 — Campaign Objective

Ask: "What's the goal of this campaign?"

- **A) Traffic** — Drive visitors to a page
- **B) Leads** — Collect emails, signups, or form fills
- **C) Sales** — Direct purchases or bookings
- **D) Awareness** — Get the brand in front of new people

The objective shapes the copy approach:
- Traffic: curiosity-driven, click-worthy hooks
- Leads: value-first, what they'll get
- Sales: proof-heavy, objection-handling, urgency
- Awareness: story-driven, shareable, memorable

---

## Step 4 — Budget and Constraints

Ask: "Any budget range or constraints I should know about?"

Examples of useful constraints:
- Daily/monthly budget range
- No video (image only)
- Specific audience exclusions
- Seasonal timing
- Compliance requirements (health, finance, etc.)

---

## Step 5 — Generate Campaign Structure

Build the campaign:

**Campaign name:** `[Brand] - [Offer] - [Objective] - [Date]`

Create **2-3 ad sets**, each with a different angle or audience segment. For each ad set:
- Name and targeting description
- The angle or messaging theme (e.g., "pain point," "social proof," "curiosity")

Create **3-5 ads per ad set**, each with a different hook or copy approach.

Present the structure as an overview before writing the actual copy:

```
Campaign: [name]
├── Ad Set 1: [angle/audience]
│   ├── Ad 1: [hook type]
│   ├── Ad 2: [hook type]
│   └── Ad 3: [hook type]
├── Ad Set 2: [angle/audience]
│   ├── Ad 1: [hook type]
│   ├── Ad 2: [hook type]
│   └── Ad 3: [hook type]
```

---

## Step 6 — Write All Ads

For each ad, write:

### Primary Text (3 variants)
- **Short** (1-2 sentences, under 125 characters visible)
- **Medium** (3-5 sentences, punchy and scannable)
- **Long** (paragraph format, storytelling or detailed proof)

### Headline
- Under 40 characters
- Clear benefit or curiosity hook
- Use formulas from `system/references/headline-types.md`

### Description
- 1 sentence supporting the headline
- Reinforces the main benefit or handles an objection

### Creative Direction
- Image or video concept (what it should show)
- Text overlay suggestions (if image)
- Mood/style notes
- Format recommendation (single image, carousel, video)

**Key rules for all copy:**
- Match the brand's voice (from brand.md Section 4) exactly
- Grade 8 or lower reading level
- No em dashes
- No fabricated results or testimonials. Use `[PLACEHOLDER]` if needed.
- Hook in the first line (most people only see the first 1-2 lines before "See more")
- Every ad must pass the "would I stop scrolling?" test

---

## Step 7 — Humanize

Run `/humanize` on all ad copy before presenting it.

Check for and fix:
- Rule of three patterns
- Vague AI language
- Too-polished phrasing that sounds like a template
- Generic marketing buzzwords
- Even rhythm without variation

---

## Step 8 — Compliance Check

Run `/check-fb-compliance` on all ads.

Check for:
- Personal attributes violations ("Are you struggling with...?")
- Before/after claims without proper framing
- Exaggerated or misleading claims
- Prohibited content categories
- Special ad category requirements (housing, credit, employment, politics)

Fix any flagged issues before presenting.

---

## Step 9 — Present the Campaign

Present the complete campaign in a clear, organized format:

1. **Campaign overview** (objective, audience, structure)
2. **Each ad set** with its angle
3. **Each ad** with all variants (short/medium/long primary text, headline, description, creative direction)

Format so the user can review and approve individual ads.

---

## Step 10 — Save

Save to: `[active-business]/output/ads/YYYY-MM-DD-campaign-slug/`

Create these files:
- `campaign-structure.md` — overview with objective, audiences, structure
- `ads/ad-set-1-ad-1.md`, `ads/ad-set-1-ad-2.md`, etc. — individual ad files with all copy variants and creative direction

Each ad file format:

```markdown
---
ad_set: "[ad set name]"
hook_type: "[hook type used]"
status: draft
date: YYYY-MM-DD
---

## Primary Text

### Short
[copy]

### Medium
[copy]

### Long
[copy]

## Headline
[headline]

## Description
[description]

## Creative Direction
[image/video concept and notes]
```

---

## Step 11 — Generate Ad Creatives (optional)

After the campaign is saved, check if kie.ai MCP is available by looking for the `mcp__kie-ai__nano_banana_image` tool.

**If kie.ai IS available**, ask:

> "Want me to generate the ad images based on the creative direction? I can create mockups for your top ads."

Options via AskUserQuestion:
- **"Yes, generate images"** — For each ad (or user-selected subset):
  1. Write a prompt from the Creative Direction section
  2. Call `mcp__kie-ai__nano_banana_image` with `prompt` and `aspect_ratio: "1:1"` (square for Facebook feed)
  3. The tool returns a `task_id`. Call `mcp__kie-ai__get_task_status` with that task_id to poll for the result. Wait a few seconds between polls.
  4. Download the generated image and save to the campaign's `creatives/` subfolder
- **"No, I'll create them myself"** — Skip.

**If kie.ai is NOT available**, mention it briefly:

> "Tip: If you set up kie.ai (free image generation), I can create the ad images for you next time. See `system/config/integrations.md` for setup."

---

## Feedback Capture

After presenting the campaign:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your lessons.md so I remember next time."

If feedback is given:
1. Apply the changes
2. Add a concise, actionable rule to `[active-business]/lessons.md` under the ads section
3. Present the updated version
