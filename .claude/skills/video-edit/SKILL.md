---
name: video-edit
description: "Edit video for any platform. Auto-detects format (landscape, vertical, square). Cuts, silence removal, crop optimization, and audio mastering."
argument-hint: "[path to video file]"
user-invocable: true
---

Today: !`date +%Y-%m-%d`

# Video Edit

Edit and optimize video content for any format. Auto-detects orientation (landscape 16:9, vertical 9:16, square 1:1) and applies format-specific settings throughout.

**Pipeline:** Record -> **`/video-edit`** -> `/video-animate` -> `/video-finalize` -> `/video-subtitle`

---

## Context Management (Prevents Window Exhaustion)

This skill frequently exhausts the context window due to long ffmpeg outputs and multi-step processing. To prevent this:

1. **Write all intermediate state to disk.** After each step, save results (transcription, segment list, crop coordinates, edit script) to the project folder. If context resets, the next session can resume from the last saved step.
2. **Don't keep ffmpeg output in conversation.** Redirect verbose output to files and only read the summary/result.
3. **Natural breakpoints** (if context is getting heavy, suggest pausing):
   - After Step 4 (transcription saved to disk)
   - After Step 8 (segments + crop coordinates saved)
   - After Step 11 (edit script saved, ready to render)

---

## Step 0 — Context Loading

1. Load `[active-business]/brand.md` (Section 4: Brand Voice) for brand fonts and colors.
2. Load `[active-business]/lessons.md` for any video editing lessons.

---

## Step 1 — Input & Format Detection

Ask for the video file path if not provided as argument. Then detect format:

```bash
ffprobe -v quiet -print_format json -show_streams "[input_video]"
```

Parse width and height:
- width > height * 1.2 -> "landscape" (output: 1920x1080)
- height > width * 1.2 -> "vertical" (output: 1080x1920)
- else -> "square" (output: 1080x1080)

Tell user: "Detected [format] video ([width]x[height]). I'll optimize for [format]."

Also detect and report:
- Duration
- FPS (MUST preserve source FPS, never hardcode)
- Codec
- Audio channels and sample rate

**Dependency checks:**
- FFmpeg: `which ffmpeg` -- if missing: "FFmpeg is required. Install with `brew install ffmpeg` (Mac) or `choco install ffmpeg` (Windows)."
- FFprobe: `which ffprobe` -- comes with FFmpeg

---

## Step 2 — B-roll Sync (Optional)

Ask: "Do you have a second camera angle or B-roll footage to sync?"

**If yes:** Run 3-phase camera sync. This is MANDATORY before any editing when two cameras are involved.

### Phase 1 -- Coarse: Silence Pattern Matching

```bash
# Extract audio for silence detection
ffmpeg -y -i "MAIN_VIDEO" -vn -acodec pcm_s16le -ar 16000 -ac 1 main_audio.wav
ffmpeg -y -i "BROLL_VIDEO" -vn -acodec pcm_s16le -ar 16000 -ac 1 broll_audio.wav

# Detect silences in both
ffmpeg -i main_audio.wav -af "silencedetect=n=-30dB:d=0.5" -f null /dev/null 2>&1 | grep -E "silence_(start|end)"
ffmpeg -i broll_audio.wav -af "silencedetect=n=-30dB:d=0.5" -f null /dev/null 2>&1 | grep -E "silence_(start|end)"
```

Match distinctive silence patterns. Calculate `SYNC_OFFSET = broll_time - main_time`. If consistent within 0.1s across 2+ pairs, proceed to Phase 2.

### Phase 2 -- Fine: Waveform Cross-Correlation

Cross-correlate raw audio at 3 different timepoints spread across the recording for sub-frame precision.

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import correlate

sr1, main = wavfile.read('main_audio.wav')
sr2, broll = wavfile.read('broll_audio.wav')
main = main.astype(np.float64)
broll = broll.astype(np.float64)
main = main / (np.max(np.abs(main)) + 1e-10)
broll = broll / (np.max(np.abs(broll)) + 1e-10)

COARSE_OFFSET = 0.0  # fill in from Phase 1

def find_precise_offset(main, broll, main_time, coarse_offset, sr, chunk_sec=5, margin_sec=2):
    chunk_start = int(main_time * sr)
    chunk_len = int(chunk_sec * sr)
    main_chunk = main[chunk_start:chunk_start + chunk_len]
    search_center = int((main_time + coarse_offset) * sr)
    search_margin = int(margin_sec * sr)
    search_start = max(0, search_center - search_margin)
    search_end = min(len(broll), search_center + search_margin + chunk_len)
    broll_search = broll[search_start:search_end]
    corr = correlate(broll_search, main_chunk, mode='valid')
    peak = np.argmax(corr)
    broll_match = search_start + peak
    return (broll_match - chunk_start) / sr

offsets = []
for t in [20, 50, 90]:  # adjust based on video duration
    try:
        o = find_precise_offset(main, broll, t, COARSE_OFFSET, sr1)
        offsets.append(o)
    except:
        pass
```

Acceptance: 3 measurements must agree within 0.04s (1 frame at 25fps).

### Phase 3 -- Visual: Frame-by-Frame Verification

Extract synchronized frames at 2+ timepoints. Verify body position and gestures match between main and B-roll. Do NOT proceed until visual sync is confirmed.

Save offset: `echo "SYNC_OFFSET=X.XXXX" > sync_offset.txt`

**If no B-roll camera:** Skip this step entirely.

---

## Step 3 -- Quality Gates (Vertical/Square Only)

For vertical and square formats, run extra checks:

### Brightness Check
```bash
ffmpeg -i "VIDEO" -vf "fps=0.2,signalstats" -f null /dev/null 2>&1 | grep YAVG
```
If average YAVG < 400: Warn "Footage appears underexposed. This will look dark on mobile." Continue anyway.

### Crop Feasibility Check
Calculate upscale factor for each crop level. If any requires >2x upscale, warn the user. Continue anyway.

---

## Step 4 -- Transcription

Check for existing transcription file in the project folder first.

```
1. Check for [video]-transcript.json
2. If not found, check dependencies:
   a. Try: whisper --help (local openai-whisper)
   b. If not available: check for ELEVENLABS_API_KEY in environment
   c. If neither: "Transcription needed but no tool found. Install whisper: pip install openai-whisper or set ELEVENLABS_API_KEY."
3. Run transcription with word-level timestamps
```

**Using Whisper (preferred):**
```bash
whisper "[input]" --model base --output_format json --word_timestamps True
```

**Using ElevenLabs Scribe v2 (fallback):**
Call Scribe v2 API with keyterm prompting for product/brand names.

Save transcript to `[video]-transcript.json`. If the video had a speech start offset, add it back to all timestamps.

---

## Step 5 -- Build Segment List

Compare transcription against the teleprompter script (if available) to identify:
- **Retakes** -- if something is said twice, keep the LAST version
- **Mistakes** -- stumbles, "let me start over", pre-recording chat
- **Section boundaries** -- natural topic transitions

Create raw segments as: `(start, end, source, crop_level, comment)`

---

## Step 6 -- Crop Classification

3 crop levels with emotional content mapping. Use instant static crop that switches on each cut. NO animated Ken Burns zoom.

| Crop Level | What It Shows | When to Use |
|-----------|--------------|------------|
| `normal` | Medium shot, chest and above | Default, narrative sections, matter-of-fact info |
| `punched_in` | Close-up, face and shoulders | Emphasis, important points, transitions |
| `tight` | Very tight, face only | Emotional peaks, revelations, bold claims |

### Format-Specific Crop Presets

**Landscape (1920x1080 from 1920x1080 source):**
```python
MAIN_CROPS = {
    'normal':     None,  # no crop, use as-is
    'punched_in': 'crop=1478:831:{mx}:{my},scale=1920:1080:flags=lanczos',
    'tight':      'crop=1280:720:{mx2}:{my2},scale=1920:1080:flags=lanczos',
}
```

**Vertical (1080x1920 from horizontal source):**
```python
MAIN_CROPS = {
    'normal':     'crop=608:1080:{mx}:0,scale=1080:1920:flags=lanczos',
    'punched_in': 'crop=468:831:{mx}:{my},scale=1080:1920:flags=lanczos',
    'tight':      'crop=405:720:{mx2}:{my2},scale=1080:1920:flags=lanczos',
}
```

**Square (1080x1080 from horizontal source):**
```python
MAIN_CROPS = {
    'normal':     'crop=1080:1080:{mx}:0,scale=1080:1080:flags=lanczos',
    'punched_in': 'crop=831:831:{mx}:{my},scale=1080:1080:flags=lanczos',
    'tight':      'crop=720:720:{mx2}:{my2},scale=1080:1080:flags=lanczos',
}
```

If a second camera exists, also set B-roll crops per format:
- Landscape: wide (full frame), medium (2/3 crop), close (tight face)
- Vertical: wide (vertical slice), medium, close
- Square: wide (center square), medium, close

### Emotional Content Classification

| Content Pattern | Crop | Notes |
|----------------|------|-------|
| Emotional story | `tight` | Draws viewer in |
| Key revelation | `tight` | Stay on main for impact |
| Bold claim | `tight` | Eye contact = conviction |
| After powerful statement | `normal` | Contrast creates rhythm |
| Backstory/narrative | `punched_in` | Engaged but not intense |
| Lists/sequences | B-roll `medium` | Cut to B-roll for variety |
| Direct address to viewer | `normal` | Eye contact matters |
| Matter-of-fact info | `normal` | No emphasis needed |
| Transition between topics | `punched_in` | Signals a shift |

---

## Step 7 -- Face Calibration

Auto-detect face center, test crops, verify with user. Never use centered defaults.

**Step 1:** Extract reference frames
**Step 2:** Detect face position (brightness-weighted center detection)
**Step 3:** Calculate crop offsets using `calc_crop_offset(face_cx, face_cy, frame_w, frame_h, crop_w, crop_h)`
**Step 4:** Extract test cropped frames and verify visually

Face should be well-framed with forehead visible and chin not cut off. Adjust and re-test if needed.

**If second camera exists:** Also run B-roll smart frame detection. Analyze for equipment, clutter, or unprofessional elements. Choose crop strategy based on frame cleanliness.

---

## Step 8 -- Format-Specific Pacing

### Cut Frequency

| Format | Target | Max Static |
|--------|--------|-----------|
| Landscape | 5-7s between changes (~9-12 cuts/min) | 7s |
| Vertical | 4-6s between changes (~10-15 cuts/min) | 6s |
| Square | 5-6s between changes (~10-12 cuts/min) | 6s |

Rules:
1. Never stay on the same static frame beyond the max
2. Alternate crop levels between sentences
3. Pattern: normal -> punched_in -> normal -> tight -> normal
4. B-roll used sparingly (5-10% of runtime, only for retake splices, emotional peaks, transitions)
5. Main camera dominates (90-95% of runtime)

---

## Step 9 -- Silence Trimming

### Settings

```python
# Pass 1: Catch obvious silences
SILENCE_THRESHOLD_P1 = -30   # dB
SILENCE_MIN_DURATION_P1 = 0.5  # seconds

# Pass 2: Catch micro-silences (vertical/square only for tighter pacing)
SILENCE_THRESHOLD_P2 = -25   # dB
SILENCE_MIN_DURATION_P2 = 0.3  # seconds

# Natural pause replacement
NATURAL_PAUSE = 0.15  # seconds each side (vertical/square)
# NATURAL_PAUSE = 0.15  # landscape uses 0.15 per side too
```

**Landscape:** Single pass (-30dB/0.5s) is usually sufficient.
**Vertical/Square:** Two-pass for tighter pacing. Target < 2% silence ratio.

### Transcript-Anchored Silence Protection (MANDATORY)

After detecting silences, cross-reference against the transcription to prevent cutting through spoken words. The -25dB pass frequently misidentifies quiet speech as silence.

Check if any transcribed word's midpoint falls inside a silence region. If so, shrink the silence to exclude that word.

```python
def protect_silences_with_transcript(silences, words, duration):
    key = 'word' if words and 'word' in words[0] else 'text'
    protected = []
    for s_start, s_end in silences:
        midpoint_words = [w for w in words
                          if s_start < (w['start'] + w['end']) / 2 < s_end]
        if not midpoint_words:
            protected.append((s_start, s_end))
        else:
            first_word_start = min(w['start'] for w in midpoint_words)
            last_word_end = max(w['end'] for w in midpoint_words)
            if first_word_start - s_start > 0.15:
                protected.append((s_start, first_word_start - 0.05))
            if s_end - last_word_end > 0.15:
                protected.append((last_word_end + 0.05, s_end))
    return protected
```

---

## Step 10 -- Audio Mastering

### Processing Chain

1. **Highpass 80Hz** -- removes rumble
2. **Lowpass 14kHz** -- removes hiss
3. **Presence EQ +3dB at 3kHz** (Q=1.5) -- voice clarity
4. **Warmth EQ +2dB at 200Hz** (Q=1) -- fuller sound
5. **De-esser** (intensity=0.4) -- tames harsh S/SH
6. **Compressor** -- 3:1 ratio, -21dB threshold, 10ms attack, 100ms release, 4dB makeup
7. **Loudnorm** -- EBU R128 to -16 LUFS, true peak -1.5dB

Format-specific LRA targets:
- Landscape: LRA=11 (more dynamic range for long-form)
- Vertical: LRA=2 (compressed for mobile playback)
- Square: LRA=5 (moderate)

```bash
ffmpeg -y -i input.mp4 \
  -af "highpass=f=80,lowpass=f=14000,equalizer=f=3000:t=q:w=1.5:g=3,equalizer=f=200:t=q:w=1:g=2,deesser=i=0.4:m=0.5:f=0.5:s=o,acompressor=threshold=0.089:ratio=3:attack=10:release=100:makeup=4,loudnorm=I=-16:LRA=[LRA]:TP=-1.5" \
  -c:v copy -c:a aac -b:a 320k \
  output-mastered.mp4
```

Crossfades at cut points to prevent audio pops.

---

## Step 11 -- FFmpeg Render

Generate a Python edit script that builds the ffmpeg filter_complex.

### Encoding Settings

| Setting | Value |
|---------|-------|
| CRF | 18 |
| Audio | AAC 320kbps |
| FPS | Match source exactly |
| Preset | medium |
| Container | MP4 + faststart |

Output resolution by format:
- Landscape: 1920x1080
- Vertical: 1080x1920
- Square: 1080x1080

Audio ALWAYS from main camera (if multi-camera). Never use B-roll audio.

Save the filter_complex to a separate file for debugging long chains.

---

## Step 12 -- Verification

```bash
# Check specs
ffprobe -v quiet -print_format json -show_streams -show_format output.mp4

# Check silences
ffmpeg -i output.mp4 -af "silencedetect=n=-30dB:d=0.5" -f null /dev/null 2>&1 | grep silence

# Check scene changes
ffmpeg -i output.mp4 -vf "select='gt(scene,0.15)',showinfo" -vsync vfr -f null /dev/null 2>&1 | grep showinfo | wc -l

# Check loudness
ffmpeg -i output.mp4 -af "loudnorm=print_format=json" -f null /dev/null 2>&1
```

### Quality Targets

| Metric | Landscape | Vertical | Square |
|--------|-----------|----------|--------|
| Resolution | 1920x1080 | 1080x1920 | 1080x1080 |
| Bitrate | 8-12 Mbps | 6-10 Mbps | 6-10 Mbps |
| FPS | Matches source | Matches source | Matches source |
| Max silence | <0.6s | <0.6s | <0.6s |
| Loudness | -16 LUFS | -16 LUFS | -16 LUFS |
| Scene changes/min | 9-12 | 10-15 | 10-12 |
| B-roll % | 5-10% | 5-10% | 5-10% |

---

## Step 13 -- Optional QA Review

Ask: "Want me to run a quality check on the edit?"

**If yes, run these checks:**

1. **Resolution/format** -- verify matches detected format
2. **Loudness** -- integrated loudness -17 to -15 LUFS, LRA within target, true peak < -1.0 dBTP
3. **Silence gaps** -- max silence < 0.6s, no trailing silence > 0.3s, no leading silence > 0.2s
4. **Glitch frames** -- extract first 3 and last 3 frames, check for pre-speech poses or black frames
5. **Audio artifacts** -- check for pops/clicks at cut points
6. **Face visibility** -- extract a frame every 5s, verify face is properly framed in all crops
7. **Content accuracy** -- compare transcript vs teleprompter script (if available)
8. **Retake detection** -- check for duplicate content that should have been removed
9. **Cut quality** -- verify no mid-word cuts, cuts happen at natural pause points

### Auto-Fix Pipeline

If issues found:
1. Rebuild segment list to fix retakes, mid-word cuts, silence issues
2. Shift cut points to word boundaries
3. Trim glitch frames
4. Re-run audio mastering if loudness is off
5. Re-render with fixes
6. Re-verify the fixed version
7. Present before/after report

---

## Output Saving

Save to `[active-business]/output/video/`:
- Edited video: `[date]-[slug]-edited.mp4`
- Transcript: `[date]-[slug]-transcript.json`
- Edit script: `[date]-[slug]-edit-script.py`

---

## Feedback

Want to change anything? If you give feedback, I'll apply it and add a lesson to your lessons.md so I remember next time.
