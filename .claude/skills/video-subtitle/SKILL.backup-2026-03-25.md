---
name: video-subtitle
description: "Add animated captions to any video. Word-by-word MFM/Hormozi style with keyword highlighting. Works for reels, YouTube, and any format."
argument-hint: "[path to video file]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Video Subtitle

Add MFM/Hormozi-style animated captions to any video. Word-by-word display with keyword highlighting, ALL CAPS, burned into the video. Auto-detects format and adjusts sizing/positioning.

**Pipeline position:** `/video-edit` -> `/video-animate` -> `/video-finalize` -> **`/video-subtitle`**

---

## Step 0 -- Context Loading

1. Load `brands/[active-brand]/voice.md` for brand colors (used for highlight color).
2. Load `brands/[active-brand]/lessons.md` for any subtitle/caption lessons.

---

## Step 1 -- Input & Format Detection

Ask for the video file path if not provided as argument.

```bash
ffprobe -v quiet -print_format json -show_streams "[input_video]"
```

Parse width and height:
- width > height * 1.2 -> "landscape" (1920x1080)
- height > width * 1.2 -> "vertical" (1080x1920)
- else -> "square" (1080x1080)

Tell user: "Detected [format] video ([width]x[height]). I'll optimize captions for [format]."

Get exact FPS and duration. Check if a transcription JSON already exists in the same folder.

**Dependencies:**
- FFmpeg: `which ffmpeg` -- required for burning subtitles
- Whisper or ElevenLabs for transcription (if no existing transcript)

---

## Step 2 -- Transcription

Reuse existing transcription if available (`[video]-transcript.json` or `transcription.json` in the same folder).

If not found:

```
1. Try: whisper --help (local openai-whisper)
2. If not available: check for ELEVENLABS_API_KEY
3. If neither: "Transcription needed but no tool found. Install whisper: pip install openai-whisper or set ELEVENLABS_API_KEY."
4. Run: whisper [input] --model base --output_format json --word_timestamps True
5. Save to [video]-transcript.json
```

---

## Step 3 -- Skip Hook Region

If the video was processed by `/video-animate` and has a hook animation in the first 3 seconds, don't add captions there. Check for a broll-map.md or ask the user.

**Rule:** Captions start at 3.0 seconds (or whenever the first non-filler word after 3.0s begins) if a hook animation exists. Otherwise, captions start from the beginning.

---

## Step 4 -- Group Words into Phrases

Group words into display phrases of 2-3 words each (MFM/Hormozi style).

### Grouping Rules

1. **2-3 words per phrase** (never 1 unless for emphasis, rarely 4)
2. **Break at natural pause points** (gaps >0.2s between words)
3. **Keep grammatical units together:** article+noun ("the system"), preposition+noun ("for free"), verb+object ("use Claude")
4. **Never split numbers from context:** "100 percent", "$10 billion"
5. **Short phrases for emphasis:** When a word is clearly emphasized (louder, slower), it can be a 1-word phrase

### Filler Word Removal

Strip these BEFORE grouping (don't show in captions):
- "uh", "um"
- "like" (when used as filler, not verb/comparison)
- "you know", "I mean", "right?" (trailing discourse markers)
- "kind of", "sort of" (hedging)
- "basically", "literally" (when used as filler)

Remove entirely. Adjust phrase timing to skip over filler timestamps.

### Timing

Each phrase appears when its first word starts and disappears when its last word ends. No gaps between phrases (next phrase appears immediately when previous ends).

---

## Step 5 -- Select Highlight Keywords

For each phrase, determine if any word should be color-highlighted.

### Priority (pick ONE per phrase, not every phrase gets one)

1. **Numbers** always highlight: "$10", "100%", "22 years", "3x"
2. **Product/brand names** from voice.md
3. **Strong action verbs:** "build", "replace", "destroy", "launch"
4. **Emotional words:** "impossible", "everything", "never", "free"
5. **Contrasting words:** "but", "instead", "without"

### Frequency

- Highlight 1 word every 3-5 phrases (not every phrase)
- Never highlight 2 consecutive phrases
- Target 20-30% of phrases having a highlight

---

## Step 6 -- Generate ASS Subtitle File

### Format-Specific Style Settings

```ass
[Script Info]
ScriptType: v4.00+
PlayResX: [WIDTH]
PlayResY: [HEIGHT]
WrapStyle: 0
```

| Setting | Landscape | Vertical | Square |
|---------|-----------|----------|--------|
| PlayResX | 1920 | 1080 | 1080 |
| PlayResY | 1080 | 1920 | 1080 |
| Font | Arial Black | Arial Black | Arial Black |
| Font size | 60 | 90 | 75 |
| MarginV | 80 | 500 | 120 |
| Alignment | 2 (center-bottom) | 2 (center-bottom) | 2 (center-bottom) |

### Style Definition

```ass
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial Black,[SIZE],&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,5,2,2,40,40,[MARGINV],1
Style: Highlight,Arial Black,[SIZE],&H0080DEFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,5,2,2,40,40,[MARGINV],1
```

**Key parameters:**
- Text color: White (`&H00FFFFFF`)
- Highlight color: Orange/yellow (`&H0080DEFF` = #FFDE80 in ASS BGR format). If the brand has a primary color in voice.md, use that instead (convert to ASS BGR format).
- Outline: 5px black
- Shadow: 2px
- Case: ALL CAPS (convert all text to uppercase)
- Bold: -1 (true)

### Highlight Implementation

Use ASS override tags for highlighted words:

```ass
Dialogue: 0,0:00:01.20,0:00:02.10,Default,,0,0,0,,YOU DON'T {\rHighlight}NEED{\rDefault} CODE
```

---

## Step 7 -- Burn Subtitles

```bash
ffmpeg -y -i "[INPUT_VIDEO]" \
  -vf "ass=subtitles.ass" \
  -c:v libx264 -crf 18 -preset medium \
  -c:a copy \
  "[OUTPUT_VIDEO]"
```

Output naming: `{input-name}-captioned.mp4`

---

## Step 8 -- Verification

### Visual Check

Extract 4 frames at different timestamps:

```bash
ffmpeg -ss 0.5 -i "OUTPUT" -vframes 1 check_hook.jpg
ffmpeg -ss 5 -i "OUTPUT" -vframes 1 check_early.jpg
ffmpeg -ss [mid] -i "OUTPUT" -vframes 1 check_middle.jpg
ffmpeg -ss [late] -i "OUTPUT" -vframes 1 check_late.jpg
```

Read each frame and check:
- Captions are well-positioned (not overlapping face, not too close to edges)
- Highlighted words are clearly distinguishable from white text
- Text is large enough to read on a phone screen
- No text extends beyond the safe zone
- ALL CAPS applied correctly
- No captions during hook animation (if applicable)

### Technical Check

```bash
ffprobe -v quiet -print_format json -show_streams "OUTPUT"
```

- Resolution matches input
- Duration matches input (+/- 0.1s)

---

## Step 9 -- Report

```
Captioned: [filename]
Duration: [X]s
Format: [landscape/vertical/square] ([WxH])
Total phrases: [N]
Highlighted words: [M] ([M/N]% of phrases)
Filler words removed: [K]
Caption start: [X]s (after hook: yes/no)
Output: [path]
```

---

## Output Saving

Save to `brands/[active-brand]/output/video/`:
- Captioned video: `[date]-[slug]-captioned.mp4`
- ASS subtitle file: `[date]-[slug]-subtitles.ass`

---

## Key Rules

1. **ALL CAPS always** -- every word in every caption is uppercase
2. **2-3 words per phrase** -- never single-word (except emphasis), never 4+
3. **Highlight sparingly** -- 20-30% of phrases, never consecutive
4. **MFM/Hormozi style** -- word-by-word animated display, not full sentences
5. **Skip hook region** -- first 3s reserved for hook animation if one exists
6. **Burn in, don't use soft subs** -- platforms strip soft subtitles
7. **Reuse transcription** -- don't re-transcribe unnecessarily
8. **Brand-aware highlights** -- use brand color from voice.md if available, otherwise orange/yellow
9. **Format-aware sizing** -- font size and margins adjust per format for readability

---

## Quick Reference

| Setting | Landscape | Vertical | Square |
|---------|-----------|----------|--------|
| Font | Arial Black | Arial Black | Arial Black |
| Size | 60 | 90 | 75 |
| Color | White | White | White |
| Highlight | Orange/Yellow or brand color | Same | Same |
| Outline | 5px black | 5px black | 5px black |
| Shadow | 2px | 2px | 2px |
| MarginV | 80 | 500 | 120 |
| Case | ALL CAPS | ALL CAPS | ALL CAPS |
| Words/phrase | 2-3 | 2-3 | 2-3 |
| Highlight % | 20-30% | 20-30% | 20-30% |
| CRF | 18 | 18 | 18 |
| Audio | Copy (no re-encode) | Copy | Copy |

---

## Feedback

Want to change anything? If you give feedback, I'll apply it and add a lesson to your brand's lessons.md so I remember next time.
