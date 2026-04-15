---
name: visual-image
description: "Generate social media images. Designs branded visuals for any platform with the right dimensions, colors, and typography."
argument-hint: "[platform and content, e.g. 'IG post with headline: Stop Overthinking']"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Visual Image

**Purpose:** Create branded social media images for any platform, using Remotion stills, image generation APIs, or detailed design briefs.
**When to use:** When you need a social post image, thumbnail, ad creative, or blog header.
**Cowork compatible:** Partially. Can provide design briefs in chat, but file saving and generation require Code mode.

---

## Step 0 — Load Context

Load these files before starting:

1. `[active-business]/brand.md (Section 4: Brand Voice)` — brand voice and visual identity
2. `[active-business]/lessons.md` — rules from past feedback

Check if Remotion is installed by looking for a `system/tools/video-animations/` directory or `package.json` with remotion dependency. Note the result for Step 5.

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Determine Image Purpose

**If the user specified the purpose:** Confirm and move on.

**If not:** Ask using AskUserQuestion:

"What's this image for?"
- A) Social post (Instagram, Facebook, LinkedIn, Twitter)
- B) YouTube thumbnail
- C) Ad creative (Facebook/Meta ads)
- D) Blog header or article image
- E) Something else (describe it)

---

## Step 2 — Get the Content

Ask what should be on the image:

- **Headline or text** — the main message (keep it short, 3-8 words ideal)
- **Supporting text** — optional subtitle or context
- **Visual concept** — any specific imagery, photos, or style in mind

If the user provides a topic but no specific text, write 3 headline options and let them pick.

---

## Step 3 — Set Dimensions

Based on the platform, use these standard dimensions:

| Platform / Use | Dimensions | Aspect Ratio |
|----------------|-----------|--------------|
| Instagram feed | 1080x1080 | 1:1 |
| Instagram/FB story | 1080x1920 | 9:16 |
| Facebook/LinkedIn feed | 1200x628 | ~1.91:1 |
| Twitter/X post | 1200x675 | 16:9 |
| YouTube thumbnail | 1280x720 | 16:9 |
| Blog header | 1200x630 | ~1.91:1 |
| Pinterest | 1000x1500 | 2:3 |

If the user wants a custom size, use that instead.

---

## Step 4 — Design the Image

Create a detailed design specification:

1. **Layout** — Where each element sits (headline placement, visual elements, whitespace)
2. **Colors** — Pull from the brand's brand.md Section 4 (Brand Voice) or visual identity. Specify exact hex codes.
3. **Typography** — Font choices, sizes, weights. Heading vs body fonts from brand guidelines.
4. **Visual elements** — Background treatment, shapes, icons, photos, gradients
5. **Style notes** — Clean/minimal, bold/punchy, editorial, etc.

Present the design concept to the user for approval before generating.

---

## Step 5 — Generate with Remotion (if available)

If Remotion is installed:

1. Check existing compositions in `system/tools/video-animations/src/compositions/` for reusable templates
2. Create a new composition or adapt an existing one for the image
3. Use the brand's theme file for colors and typography
4. Render as a still frame using Remotion's still rendering

Export to the output folder (Step 8).

---

## Step 6 — Generate with kie.ai (if available)

Check if kie.ai MCP is available by looking for the `mcp__kie-ai__nano_banana_image` tool.

**If kie.ai IS available:**

1. Write a detailed prompt based on the design specification from Step 4
2. Call `mcp__kie-ai__nano_banana_image` with the `prompt` and appropriate `aspect_ratio` (e.g., `"1:1"` for Instagram, `"16:9"` for Twitter/YouTube, `"9:16"` for stories)
3. The tool returns a `task_id`. Call `mcp__kie-ai__get_task_status` with that task_id to poll for the result. Wait a few seconds between polls. The status response includes the image URL when complete.
4. Download the generated image, review, and iterate if needed
5. Save the generated file to the output folder (Step 8)

**If kie.ai is NOT available**, suggest setting it up:

> "I can generate this image directly if you set up kie.ai (free API key, takes 2 minutes). Want me to help?"

Options via AskUserQuestion:
- **"Yes, help me set it up"** — Guide them:
  1. "Go to [kie.ai](https://kie.ai), sign up (free), and get your API key from Settings > API Keys"
  2. When they provide the key, update `.mcp.json` to add:
     ```json
     "kie-ai": {
       "command": "npx",
       "args": ["-y", "@felores/kie-ai-mcp-server"],
       "env": {
         "KIE_AI_API_KEY": "[their-key]"
       }
     }
     ```
  3. "Restart Claude Code so it picks up the new server. Then run this skill again."
  4. Stop here (restart needed).
- **"No, just give me a design brief"** — Skip to Step 7.

---

## Step 7 — Provide Design Brief (fallback)

Only run this step if neither Remotion nor kie.ai is available, or the user chose design briefs.

Create a detailed brief for Canva or Figma:

```markdown
## Design Brief

**Dimensions:** [width]x[height]
**Platform:** [target platform]

### Text
- Headline: [exact text]
- Subtitle: [if any]

### Colors
- Background: [hex]
- Text: [hex]
- Accent: [hex]

### Typography
- Headline: [font], [size], [weight]
- Subtitle: [font], [size], [weight]

### Layout
[Describe positioning of each element]

### Visual Elements
[Background treatment, shapes, photos, etc.]

### Style Reference
[Any reference images or style notes]
```

Present this brief clearly so the user can recreate it in their design tool.

---

## Step 8 — Save

Save output to: `[active-business]/output/social/images/YYYY-MM-DD-slug/`

Include:
- The generated image file (if created)
- `design-brief.md` — the full design specification (always save this, even if image was generated)

---

## Feedback Capture

After presenting the output:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes
2. Add a concise, actionable rule to `[active-business]/lessons.md` under the appropriate section
3. Present the updated version
