# 7-day walkthrough video

A vertical 1080x1920 video (phone and social friendly) that shows the real app being used for one full week, Monday 9 to Sunday 15 November 2026, then a summary of what that week adds up to.

```
node video/record.js en     # English captions -> video/out/health-plan-7-days-en.mp4
node video/record.js bm     # Bahasa Malaysia  -> video/out/health-plan-7-days-bm.mp4
SPEED=0.4 node video/record.js en   # quick dev run (shorter waits)
```

Needs Node, Playwright with Chromium, and ffmpeg.

## How it works

- `stage.html` is the 1080x1920 canvas: captions, a 7-day tracker, a phone frame holding the real app in an iframe, a guiding finger, and the intro, impact and outro scenes.
- `record.js` serves the app, opens the stage, and drives the app with real taps (it sets the app's `__HP_TODAY__` hook to step through the days). Chromium screencast frames are piped into ffmpeg at 30 fps.
- The impact scene uses numbers read from the app itself (`HP.scoring`, `HP.gamify`) after the week is logged. They are saved to `out/impact-data-<lang>.json`.

## What the week shows

Day 1 is a slow, step-by-step tutorial. Days 2 to 7 are faster. Wednesday is a busy day with a 15 minute walk, which still keeps the streak. Saturday is a rest day. Sunday completes 7 days in a row.

## Honest framing

The week is a scripted example for illustration. The "impact" is the app's own tracking (commitment, streak, XP, badges) and the plan's stated aims. It does not claim health results, and the video says so on screen.

`out/*.mp4` is ignored by git (the repo ignores media files). Re-run the commands above to regenerate.
