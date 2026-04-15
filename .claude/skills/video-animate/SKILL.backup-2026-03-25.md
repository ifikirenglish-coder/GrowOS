---
name: video-animate
description: "Create Remotion animations for your videos. B-roll accents, social clips, diagrams, text overlays, and transitions for any format."
argument-hint: "[what to animate or script file]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Video Animate

Create branded video animations using Remotion. Covers all animation types: B-roll for any format, social clips, diagrams, overlays, and one-off animations. Supports landscape (16:9), vertical (9:16), and square (1:1).

**Pipeline position:** `/video-edit` -> **`/video-animate`** -> `/video-finalize`

---

## Step 0 -- Context Loading

1. Load `brands/[active-brand]/voice.md` for brand colors, fonts, and tone.
2. Load `brands/[active-brand]/lessons.md` for any animation or video lessons.
3. **Check Remotion installation:** Look for `system/tools/video-animations/node_modules`. If it exists, Remotion is ready. If not, check for `system/config/remotion-setup.md` and tell the user: "Remotion isn't installed yet. Check `system/config/remotion-setup.md` for setup instructions. In the meantime, I can create a detailed animation brief you can use with any video tool."

Set `remotion_available` = true or false for the rest of the workflow.

4. If Remotion is available, also load:
   - `system/tools/video-animations/src/compositions/archetypes.md` (if it exists) -- animation pattern catalog
   - The brand's theme file in `system/tools/video-animations/src/config/` (if it exists)
   - A reference `shared.ts` from any existing composition folder

---

## Step 1 -- Determine Input Type

Read the request and identify:

- **Script-based batch** -- A video script is provided or referenced. Analyze for B-roll moments. Proceed to Step 2.
- **Brief-based batch** -- A content brief or topic list. Design animations around key points. Skip to Step 3.
- **Single animation** -- A specific animation request. Skip to Step 3.

---

## Step 2 -- Analyze Script (script-based only)

Read the full script and identify moments that benefit from visual animation:

- **Data points** -- Numbers, statistics, comparisons, timelines
- **Concepts** -- Abstract ideas that need visual explanation
- **Emotional beats** -- Story moments that benefit from visual emphasis
- **Process steps** -- Workflows, checklists, before/after sequences
- **Quotes** -- Powerful lines worth highlighting visually

### Hook Animation (Vertical format, MANDATORY)

Every script-based vertical video batch MUST include a hook animation as item #01. This is a 1-2 second animated opener before the talking head.

**Hook types (pick the best fit):**

| Type | When to use |
|------|-------------|
| **Tweet card** | Citing someone's claim/tweet |
| **Bold title card** | Introducing a tool/concept |
| **Stat reveal** | Hook is a number |
| **News flash** | Covering a new release |
| **Contrarian claim** | Challenging conventional wisdom |

**Specs:** 1-2 seconds (30-60 frames), full-screen, dark background, text fills 60%+ of frame.

For landscape format, the hook animation is optional.

### Fact-Check Pass

If the brand has a stories index or background file, cross-reference claims and numbers. Flag discrepancies but don't block. Present them: "The script says X but your files say Y. Which is correct?"

---

## Step 3 -- Creative Brief

Ask via AskUserQuestion:

1. **Mood/energy** -- What's the overall feel?
   - A) Energetic/hype (fast animations, bold colors)
   - B) Calm/thoughtful (slower reveals, subtle motion)
   - C) Dramatic/cinematic (tension builds, impactful reveals)
   - D) Mixed (varies by section)

2. **Format** -- What output dimensions?
   - A) Landscape 16:9 only (YouTube, presentations)
   - B) Vertical 9:16 only (Shorts, Reels, TikTok)
   - C) Square 1:1 only (feed posts)
   - D) Multiple formats
   - E) Custom (ask for dimensions)

3. **Any specific requests?** -- Open text for constraints, must-haves, or references.

---

## Step 4 -- Design Animations

For each animation moment, select an archetype from the catalog (if it exists). Aim for variety -- avoid using the same pattern twice in a row.

### For each animation, determine:

| Decision | How to decide |
|----------|---------------|
| **Archetype** | Match content type to pattern |
| **Duration** | Max 3 seconds (90 frames at 30fps). Simplify content rather than extending. |
| **Background** | Dark and light modes. Every animation gets both. |

### Format-Specific Typography

| Element | Landscape (1920x1080) | Vertical (1080x1920) | Square (1080x1080) |
|---------|----------------------|---------------------|-------------------|
| Headings | 48-72px | 64-80px | 56-72px |
| Body | 28-36px | 38-50px | 32-42px |
| Labels | 20-24px | 28-36px | 24-30px |

**Vertical-specific:**
- Bottom-safe zone: keep critical content above y=1632 (bottom 15%)
- Top-safe zone: keep content below y=96 (top 5%)
- Fill the frame, minimize whitespace
- Impact stats (key numbers): 140-200px for 60-80% screen fill, max 1-2 per video

### Present the Plan

Show a minimal list:

```
1. AnimationName -- one-line description
2. AnimationName -- one-line description
...

Total: N animations
Hook: [yes/no, type]
Formats: [landscape/vertical/square/multiple]
```

Wait for approval before building.

---

## Step 5 -- Set Up Project Structure (Remotion only)

### Source code structure

```
system/tools/video-animations/src/compositions/{platform}-{slug}-{YYYY-MM}/
-- shared.ts              -- BgMode helpers, font loading, theme re-exports
-- 01-AnimationName.tsx
-- 02-AnimationName.tsx
```

**Naming convention:** `{platform}-{slug}-{YYYY-MM}`
- Platform: `yt`, `rl` (reels), `ig`, `fb`, `li`, `tw`, `web`, `misc`
- Slug: short descriptive name, kebab-case
- Date: year-month of creation

### Create shared.ts

Copy pattern from existing shared.ts (if available):
- Font loading (sans, serif, mono)
- `BgMode` type
- Color helpers: `bgColor()`, `headingColor()`, `bodyColor()`, `mutedColor()`, etc.
- `grainStyle()` for texture overlay
- Re-exports from theme

---

## Step 6 -- Build Animations (Remotion only)

Build each animation as a self-contained React component.

### Code Standards

- Import from `./shared` -- never directly from theme
- Accept `{ mode: BgMode }` prop -- every component supports dark and light
- Use `AbsoluteFill` as root container
- Include grain overlay via `grainStyle(mode)`
- Use `interpolate()`, `spring()`, and `Easing` from Remotion
- Typography: use brand heading and body fonts from voice.md

### Register in Root.tsx

```tsx
// Naming: {PREFIX}-{##}-{Name} for dark, {PREFIX}-{##}-{Name}-L for light
<Composition
  id="YT-01-AnimName"
  component={AnimName}
  defaultProps={{ mode: "dark" as const }}
  durationInFrames={90}
  fps={30}
  width={1920}
  height={1080}
/>
```

Format prefixes:
- `YT` = YouTube landscape, `YTS` = YouTube shorts
- `RL` = Reels vertical
- `SQ` = Square
- Suffix: no suffix = dark, `-L` = light

---

## Step 7 -- Self-Review & Flag Concerns

Before presenting, review and flag:
- Text that might be too small on mobile
- Animations that might feel too fast or too slow
- Content that couldn't be fact-checked
- Layouts with too much whitespace
- Content in bottom-safe zone (vertical)

Present flags: "Things to double-check: #08 font might be tight on iPhone SE, #03 text might overlap platform UI"

---

## Step 8 -- Preview (Remotion only)

```bash
cd system/tools/video-animations && npm run dev
```

Tell user: "Studio is open at http://localhost:3000. Check the flagged items. Let me know any changes needed."

Iterate on feedback until approved.

---

## Step 9 -- Render

**If Remotion is available:**

Batch render everything. Run 4-5 in parallel.

**Dark and light versions (MP4):**
```bash
npx remotion render {COMPOSITION_ID} "output/path/{filename}.mp4" --crf 18
```

**Vertical format also gets transparent (ProRes 4444):**
```bash
npx remotion render {COMPOSITION_ID} "output/path/{filename}-alpha.mov" --codec prores --prores-profile 4444 --pixel-format yuva444p10le
```

Render outputs:
- Landscape: dark MP4 + light MP4
- Vertical: dark MP4 + transparent MOV (ProRes 4444)
- Square: dark MP4 + light MP4

Verify each file exists and has non-zero size.

**If Remotion is NOT available:**

Create a detailed animation brief with:
- Frame-by-frame storyboard with timing
- Exact colors (hex codes), font names, font sizes
- Animation easing and duration for each element
- Asset list
- Export specs

Save brief to `brands/[active-brand]/output/video/[date]-[slug]-animation-brief.md`

---

## Step 10 -- Generate B-Roll Map (script-based only)

```markdown
# B-Roll Map: [Video Title]

| Script Section | Timestamp | Animation | File | Duration | Notes |
|---------------|-----------|-----------|------|----------|-------|
| "example text" | 0:45 | AnimName | 01-AnimName-dark.mp4 | 3s | Full screen replacement |
```

Save to same folder as rendered output: `broll-map.md`

---

## Step 11 -- Report

```
Total animations: [N]
Total files rendered: [X] (dark + light MP4s, transparent MOVs)
Formats: [landscape/vertical/square]
Output: [path to rendered files]
B-roll map: [path] (if script-based)
```

---

## Output Saving

**If Remotion available:**
- Source code: `system/tools/video-animations/src/compositions/{project-slug}/`
- Rendered files: `brands/[active-brand]/output/video/{project-slug}/`

**If Remotion NOT available:**
- Brief: `brands/[active-brand]/output/video/[date]-[slug]-animation-brief.md`

---

## Feedback

Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time.
