---
name: youtube-thumbnail
description: "Generate 5 thumbnail + title concepts for A/B testing. Different psychological approaches for maximum click-through."
argument-hint: "[video topic or title]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# YouTube Thumbnail

**Purpose:** Create 5 distinct thumbnail + title combinations using different psychological approaches, ready for A/B testing.
**When to use:** When you need thumbnail and title options for a YouTube video.
**Cowork compatible:** Partially. Concepts are presented in chat, but image generation and file saving require Code mode.

---

## Step 0 — Load Context

Load these files before starting:

1. `[active-business]/brand.md` (Section 4: Brand Voice) — brand voice and visual identity
2. `[active-business]/lessons.md` — rules from past feedback

If multiple brands exist and none is specified, ask which brand to use.

---

## Step 1 — Get the Video Topic

**If the user provided a topic/title:** Use it.

**If a youtube-prepare output exists:** Check `[active-business]/output/youtube/` for recent video scripts. Offer to use that topic.

**If neither:** Ask what the video is about. Get:
- The core topic or claim
- The target viewer (who should click this?)
- The key emotion or reaction you want (curiosity, shock, relief, FOMO)

---

## Step 2 — Research What Works

Analyze thumbnail patterns for similar topics:

1. **What top videos use** — colors, text placement, expressions, composition
2. **Pattern interrupts** — what would look different from everything else in search results
3. **Text rules** — max 4-5 words on thumbnail, large enough to read on mobile
4. **Color psychology** — high contrast, warm colors pop, avoid blending with YouTube's white/red UI

Present a quick summary of what works in this niche before generating concepts.

---

## Step 3 — Generate 5 Variants

Create 5 distinct thumbnail + title combinations. Each uses a different psychological approach:

### Variant A: Curiosity Gap
- **Title formula:** Creates an open loop the viewer needs to close
- **Thumbnail:** Mysterious, partially revealed, or "what is that?" element
- **Example approach:** "What Happened When I..." / blurred or hidden key element

### Variant B: Outcome / Result
- **Title formula:** Leads with the impressive end result or number
- **Thumbnail:** Show the after state, big numbers, proof of result
- **Example approach:** "$X in Y days" / screenshot of results / transformation

### Variant C: Contrast / Before-After
- **Title formula:** Highlights the gap between current state and better state
- **Thumbnail:** Split screen or visual comparison, arrows, red X vs green check
- **Example approach:** Side-by-side comparison, "Wrong vs Right"

### Variant D: Bold Statement
- **Title formula:** Strong, provocative claim that demands a reaction
- **Thumbnail:** Large bold text (2-4 words), strong colors, minimal design
- **Example approach:** "This Changes Everything" / "Stop Doing This"

### Variant E: Person + Emotion
- **Title formula:** Personal, story-driven, creates empathy or identification
- **Thumbnail:** Close-up facial expression matching the emotion (shock, excitement, frustration), minimal text
- **Example approach:** Expressive face + 1-2 word reaction text

---

## Step 4 — Detail Each Variant

For each of the 5 variants, provide:

```markdown
### Variant [X]: [Approach Name]

**Title:** [Full YouTube title, under 60 characters]
**Thumbnail text:** [2-5 words that appear ON the thumbnail]

**Layout:**
- [Where the text sits]
- [Where the person/subject sits]
- [Background treatment]

**Colors:**
- Background: [color/gradient]
- Text: [color + outline/shadow if needed]
- Accent: [any highlight colors]

**Expression/Pose:** [If a person is featured, what expression and pose]

**Key Element:** [The one thing that makes someone click]

**Why this works:** [1 sentence on the psychology]
```

Present all 5 variants side by side for easy comparison.

---

## Step 5 — Check Image Generation

Check if kie.ai MCP is available by looking for the `mcp__kie-ai__nano_banana_image` tool.

**If kie.ai is NOT available**, suggest setting it up:

> "I can generate actual thumbnail images if you set up kie.ai (free API key, takes 2 minutes). Want me to walk you through it?"

Options via AskUserQuestion:
- **"Yes, help me set it up"** — Guide them through the setup:
  1. "Go to [kie.ai](https://kie.ai), sign up (free), and get your API key from Settings > API Keys"
  2. "Once you have the key, tell me and I'll add it to your .mcp.json"
  3. When they provide the key, update `.mcp.json` to add the kie-ai server:
     ```json
     "kie-ai": {
       "command": "npx",
       "args": ["-y", "@felores/kie-ai-mcp-server"],
       "env": {
         "KIE_AI_API_KEY": "[their-key]"
       }
     }
     ```
  4. "Restart Claude Code (close and reopen) so it picks up the new server. Then run /youtube-thumbnail again."
  5. Stop here (they need to restart for the MCP to load).
- **"No, just give me design briefs"** — Skip to Step 6 (design briefs).

**If kie.ai IS available**, proceed to generate thumbnails:

1. Ask which variants to generate (top 2-3, or all 5)
2. For each selected variant, write a detailed image prompt based on the concept from Step 4
3. Call `mcp__kie-ai__nano_banana_image` with:
   - `prompt`: detailed description of the thumbnail composition, colors, text, subject, and style
   - `aspect_ratio`: `"16:9"`
   - `resolution`: `"2K"` (higher quality for thumbnails)
4. The tool returns a `task_id`. Call `mcp__kie-ai__get_task_status` with that task_id to poll for the result. Wait a few seconds between polls. The status response includes the image URL when complete.
5. Download the generated image and save to the output folder (Step 7)
6. Review each output. Regenerate if text is unreadable or composition is off.

After generation, skip Step 6 (not needed when images are generated).

---

## Step 6 — Provide Design Briefs (fallback)

Only run this step if image generation is not available or the user chose design briefs.

Create Canva/Figma-ready briefs for each variant:

```markdown
## Thumbnail Brief: Variant [X]

**Dimensions:** 1280x720
**File format:** PNG or JPG

### Text
- Main text: "[words]" — [font style], [size], [color], [outline/shadow]
- Secondary text: "[words]" (if any)

### Subject/Photo
- [Description of the person, object, or visual element]
- [Position on canvas]

### Background
- [Solid color / gradient / image / pattern]
- [Any overlay or blur treatment]

### Composition Notes
- [Where the eye should go first]
- [Mobile readability check: will this work at 160x90px?]
```

---

## Step 7 — Save

Save to: `[active-business]/output/youtube/YYYY-MM-DD-slug/thumbnails/`

Include:
- `thumbnail-concepts.md` — all 5 variants with full descriptions
- Individual image files (if generated)

If a `youtube-prepare` output already exists for this video, save into that same dated folder.

---

## Feedback Capture

After presenting the concepts:

"Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time."

If feedback is given:
1. Apply the changes
2. Add a concise, actionable rule to `[active-business]/lessons.md` under the YouTube section
3. Present the updated version
