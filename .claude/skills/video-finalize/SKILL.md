---
name: video-finalize
description: "Add B-roll footage and Remotion animations to your edited video. Auto-detects format. Creates the final composed video."
argument-hint: "[path to edited video]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Video Finalize

Takes an edited video (from `/video-edit`) and composes the final output by inserting Remotion animations and real B-roll at the right moments. This is the LAST step before `/video-subtitle`.

**Pipeline:** Record -> `/video-edit` -> `/video-animate` -> **`/video-finalize`** -> `/video-subtitle`

---

## Step 0 -- Context Loading

1. Load `[active-business]/brand.md (Section 4: Brand Voice)` for brand style.
2. Load `[active-business]/lessons.md` for any video finalization lessons.

---

## Prerequisites

Before running this skill, these must exist:
1. **Edited video** -- already processed by `/video-edit`
2. **B-roll map** -- `broll-map.md` from `/video-animate` (maps script moments to animations)
3. **Rendered animations** -- the actual MP4 files (dark/light variants)

---

## Step 1 -- Input & Format Detection

Ask for the edited video path if not provided as argument.

```bash
ffprobe -v quiet -print_format json -show_streams "[input_video]"
```

Parse width and height:
- width > height * 1.2 -> "landscape" (output: 1920x1080)
- height > width * 1.2 -> "vertical" (output: 1080x1920)
- else -> "square" (output: 1080x1080)

Tell user: "Detected [format] video ([width]x[height]). I'll optimize for [format]."

Get specs: resolution, fps, duration, codec. All output must match these specs.

**Check Remotion:** Look for `system/tools/video-animations/node_modules`. If not installed, skip animation insertions and only do real B-roll.

---

## Step 2 -- Transcription

Check for existing transcription file (from `/video-edit`). If not found:

```
1. Check for [video]-transcript.json in the same folder
2. If not found:
   a. Try: whisper --help (local openai-whisper)
   b. If not available: check for ELEVENLABS_API_KEY
   c. If neither: "Transcription needed but no tool found. Install whisper: pip install openai-whisper or set ELEVENLABS_API_KEY."
3. Run: whisper [input] --model base --output_format json --word_timestamps True
4. Save to [video]-transcript.json
```

---

## Step 3 -- Load B-Roll Map

Parse `broll-map.md` to get the animation placement plan. Each entry has:
- Script moment (text that triggers the animation)
- Animation name and file
- Duration
- Suggested use (full screen, overlay, etc.)

Match each broll-map entry to a transcript timestamp by fuzzy-matching the script moment text against the transcription.

---

## Step 4 -- Show-Moment Detection (2-Layer)

Scan the transcript for "show moments" where B-roll would cover important visual content. Two detection layers:

### Layer 1: Verbal Cue Phrases (case-insensitive)

**Explicit callouts:**
- "show you" / "showing you" / "let me show"
- "look at" / "look here" / "take a look"
- "you can see" / "as you can see"
- "check this out" / "check it out"
- "right here" / "over here"
- "on the screen" / "on screen"
- "here's what" / "here's the"
- "watch this" / "watch what"

**Demonstration language:**
- "so right now" / "right now I'm"
- "I'm going to" / "let's go into" / "let me go"
- "open up" / "click on" / "type in" / "scroll down"
- "this is what it looks like"
- "over in" / "inside of" / "in the tool"
- "I'll just" / "let me just" (followed by action verbs)
- "so here" / "and here" / "now here"
- "as I" / "while I" (doing something visible)

### Layer 2: Tool/App Context Detection

Scan for tool names and screen indicators. When 2+ mentions cluster within 30 seconds, flag as a demonstration zone.

**Tool names:** Claude, ChatGPT, GPT, Cursor, VS Code, Chrome, Safari, browser, terminal, dashboard, Notion, Google Docs, spreadsheet, Figma, Canva, Facebook Ads Manager, Meta, Google Ads, Analytics, Stripe, Zapier, Make

**Screen indicators:** screen, tab, window, sidebar, menu, button, dropdown, settings, interface, prompt, output, response, result

**Rule:** If a tool name AND a screen indicator appear within 10 seconds of each other, treat it as a demonstration zone.

### Buffers

| Detection type | Before buffer | After buffer |
|---------------|--------------|-------------|
| Verbal cue (explicit callout) | 3 seconds | 8 seconds |
| Verbal cue (demonstration language) | 3 seconds | 6 seconds |
| Tool/app context cluster | 5 seconds | 12 seconds |

### Override Rules

1. `[SAFE]` flag -- always insert animation regardless of show-moment zone
2. `[NEVER]` flag -- skip animation regardless
3. `[FORCE-TIMESTAMP:MM:SS]` -- insert at exact timestamp
4. If broll-map entry falls inside show-moment zone with no override flag: SKIP
5. Merge overlapping detection zones (earliest start, latest end)
6. Log all skipped animations in the final report

---

## Step 5 -- Variant Selection & Real B-Roll

### Variant Selection (Deterministic)

```
Pattern: dark -> light -> dark -> light -> ...
```

Context-driven overrides:
- **Dark** for: technical content, dramatic moments, data/charts
- **Light** for: positive/aspirational moments, comparisons, lists
- Never the same variant twice in a row

### Format-Specific Animation Rules

| Setting | Landscape | Vertical | Square |
|---------|-----------|----------|--------|
| Max animation duration | 8s | 6s | 7s |
| Max talking head gap | 25s | 15s | 20s |
| Real B-roll clip length | 3-5s | 2-4s | 3-4s |

If an animation exceeds the max, trim from the BACK (keep the opening).

### Real B-Roll Selection

Two independent methods, results merged:

**Method 1: Visual Noun Matching** (highest priority)
Scan transcript for concrete visual nouns matching real footage in the B-roll catalog (if one exists). Visual noun matches override gap rules and can replace planned animations.

**Method 2: Gap Filling**
After placing animations and visual noun matches, scan for remaining gaps:

| Gap Size | Landscape | Vertical | Square |
|----------|-----------|----------|--------|
| Mandatory fill | >30s | >20s | >25s |
| Recommended fill | 20-30s | 12-20s | 15-25s |
| Skip | <20s | <12s | <15s |

For each gap, use semantic segment matching:
1. Extract 2-3 sentences around the gap center
2. Classify the moment (emotional tone, content type, visual subject, energy level)
3. Match against B-roll catalog by classification, not keywords
4. Negative matching: avoid mismatched moods

Selection priority:
1. Clips rated "Hero" in catalog (2x weight)
2. Clips with matching emotional tone
3. Clips not used in recent videos (check usage log if it exists)
4. Never use the same real clip twice in one video

### Approval Gate

Present ALL B-roll decisions via AskUserQuestion BEFORE rendering:

```
"Here's the full B-roll plan. Approve or adjust?"

Animations (from broll-map):
1. [timestamp] -- [AnimationName] (dark/light, Xs) -- "[script moment]"

Real B-roll (from media library):
A. [timestamp] -- [filename] (Xs) -- "[why: visual noun match / gap fill]"

Conflicts (real footage vs animation at same moment):
At [timestamp]: Animation [X] OR real clip [Y]?

Options: Approve plan / Adjust specific items / Skip all real B-roll
```

---

## Step 6 -- Build Segment List

Create the final edit decision list (EDL):

Rules:
- **Audio ALWAYS from the main edited video** -- continuous, never interrupted
- **B-roll is visual replacement only** -- talking head disappears, voice continues
- **Leave /video-edit crop decisions untouched**
- **No overlays or PiP** -- all B-roll is full-screen replacement

### Format-Specific Pacing

**Landscape:**
| Section | B-roll frequency |
|---------|-----------------|
| First 30s | Every 3-5s |
| Minutes 1-3 | Every 10-15s |
| Minutes 3-8 | Every 15-20s |
| After 8 min | Every 20-30s |

**Vertical:**
| Section | B-roll frequency |
|---------|-----------------|
| First 5s | Hook -- can use B-roll immediately |
| Seconds 5-15 | Every 3-5s |
| Seconds 15-30 | Every 5-8s |
| After 30s | Every 8-12s |

**Square:** Between landscape and vertical pacing.

For all formats:
- Story/emotional sections: slow down, stay on face
- CTA/pitch sections: minimal B-roll, face builds trust
- Topic transitions: use B-roll as scene breaks
- Never insert same type of animation twice in a row

---

## Step 7 -- FFmpeg Composition

Build ffmpeg filter_complex with multi-input sources.

```python
def build_ffmpeg(segments, source_video, broll_files, output_file, source_fps, output_w, output_h):
    inputs = ["-i", source_video]
    for bf in broll_files:
        inputs.extend(["-i", bf])

    filter_parts = []
    concat_inputs = []

    for i, seg in enumerate(segments):
        if seg['type'] == 'talk':
            filter_parts.append(
                f"[0:v]trim=start={seg['start']:.3f}:end={seg['end']:.3f},"
                f"setpts=PTS-STARTPTS,fps={source_fps},setsar=1:1[v{i}];"
            )
            filter_parts.append(
                f"[0:a]atrim=start={seg['start']:.3f}:end={seg['end']:.3f},"
                f"asetpts=PTS-STARTPTS[a{i}];"
            )
        else:
            inp_idx = seg['input_index']
            filter_parts.append(
                f"[{inp_idx}:v]trim=start={seg['broll_start']:.3f}:end={seg['broll_end']:.3f},"
                f"setpts=PTS-STARTPTS,scale={output_w}:{output_h}:flags=lanczos,"
                f"fps={source_fps},setsar=1:1[v{i}];"
            )
            filter_parts.append(
                f"[0:a]atrim=start={seg['start']:.3f}:end={seg['end']:.3f},"
                f"asetpts=PTS-STARTPTS[a{i}];"
            )
        concat_inputs.append(f"[v{i}][a{i}]")

    n = len(segments)
    filter_complex = "\n".join(filter_parts)
    filter_complex += f"\n{''.join(concat_inputs)}concat=n={n}:v=1:a=1[outv][outa]"

    filter_file = output_file.replace('.mp4', '-filter.txt')
    with open(filter_file, 'w') as f:
        f.write(filter_complex)

    cmd = [
        "ffmpeg", "-y", *inputs,
        "-filter_complex_script", filter_file,
        "-map", "[outv]", "-map", "[outa]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-c:a", "aac", "-b:a", "320k",
        "-movflags", "+faststart",
        output_file
    ]
    return cmd
```

---

## Step 8 -- Render

Run the ffmpeg command. Save output as `{original-filename}-final.mp4` in the same directory.

---

## Step 9 -- Verification

```bash
# Check specs match source
ffprobe -v quiet -print_format json -show_streams -show_format output.mp4

# Duration should match edited video (+/- 0.5s)
# Scene changes should be more than the edited video
ffmpeg -i output.mp4 -vf "select='gt(scene,0.15)',showinfo" -vsync vfr -f null /dev/null 2>&1 | grep showinfo | wc -l
```

### Quality Targets

| Metric | Landscape | Vertical | Square |
|--------|-----------|----------|--------|
| Resolution | 1920x1080 | 1080x1920 | 1080x1080 |
| Bitrate | 8-12 Mbps | 6-10 Mbps | 6-10 Mbps |
| FPS | Matches source | Matches source | Matches source |
| Duration | Same as edited (+/- 0.5s) | Same | Same |

---

## Step 10 -- Cross-Video Tracking

After each finalize run, append used clips to a usage log in the project folder:

```
## [date] -- [video title]
- clip-name-1.mp4 (at 2:34)
- animation-name.mp4 (at 5:12)
```

When selecting clips for future videos, check the last 3 entries. Deprioritize (don't block) recently used clips.

---

## Step 11 -- Optional QA Review

Ask: "Want me to run a quality check on the final video?"

If yes:
1. Check resolution/format matches detected format
2. Check loudness (-17 to -15 LUFS)
3. Check for silence gaps (>0.8s)
4. Check for glitch frames at B-roll transitions
5. Verify B-roll audio is from main video (not from B-roll files)
6. Check scene changes increased vs edited video
7. Auto-fix any issues, re-render, re-verify
8. Present before/after report

---

## Step 12 -- Report

```
Finalized: [filename]
Duration: [X]m [Y]s
Format: [landscape/vertical/square] ([WxH])
B-roll insertions: [N] animations, [M] real footage clips
Skipped: [K] animations (show moments)
Variant pattern: dark/light/dark/light...
Output: [path to final file]
```

---

## Key Rules

1. **Audio ALWAYS from edited video** -- continuous, never from B-roll files
2. **All B-roll is full-screen replacement** -- no overlays, no PiP
3. **Skip show moments** -- two-layer detection (verbal cues + tool/app context)
4. **Use full animation durations** -- only trim if exceeding format-specific max (trim from BACK)
5. **Deterministic** -- same input always produces same output
6. **Leave crops alone** -- /video-edit already handled crop levels
7. **Approve full B-roll plan** -- present ALL decisions via AskUserQuestion before rendering
8. **Context-driven variants** -- alternate dark/light, never same variant twice in a row
9. **Never exceed max talking head gap** -- format-specific (25s landscape, 15s vertical, 20s square)
10. **Match source specs exactly** -- FPS, resolution, codec quality
11. **Never reuse B-roll** -- every clip and animation used at most ONCE per video

---

## Quick Reference

| Setting | Landscape | Vertical | Square |
|---------|-----------|----------|--------|
| Output | 1920x1080 | 1080x1920 | 1080x1080 |
| CRF | 18 | 18 | 18 |
| Audio | AAC 320kbps | AAC 320kbps | AAC 320kbps |
| Max B-roll | 8s | 6s | 7s |
| Max talk gap | 25s | 15s | 20s |
| Gap fill (mandatory) | >30s | >20s | >25s |
| Gap fill (recommended) | 20-30s | 12-20s | 15-25s |
| Variant pattern | dark/light alternating | dark/light alternating | dark/light alternating |
| Show-moment buffer (verbal) | 3s before, 6-8s after | 3s before, 6-8s after | 3s before, 6-8s after |
| Show-moment buffer (tool) | 5s before, 12s after | 5s before, 12s after | 5s before, 12s after |

---

## Feedback

Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time.
