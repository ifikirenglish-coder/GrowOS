# Remotion Setup Guide

Remotion lets GrowOS create branded video animations, carousels, and social images. It's optional but unlocks `/video-animate`, `/visual-carousel`, and `/visual-image`.

---

## Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm** (comes with Node.js)

### Install Node.js (if needed)

**Mac:**
```bash
# Option 1: Homebrew (recommended)
brew install node

# Option 2: Direct download
# Visit https://nodejs.org and download the LTS version
```

**Windows:**
```bash
# Option 1: winget
winget install OpenJS.NodeJS.LTS

# Option 2: Direct download
# Visit https://nodejs.org and download the LTS installer
```

---

## Installation

1. Open your terminal/command prompt

2. Navigate to the video-animations folder:
```bash
cd path/to/GrowOS/system/tools/video-animations
```

3. Install dependencies:
```bash
npm install
```

4. Test that it works:
```bash
npx remotion preview
```

This should open a browser window showing available compositions.

---

## First Render Test

Run a test render to confirm everything works:

```bash
npx remotion render src/index.ts TestComp out/test.mp4
```

If you see a video file in `out/test.mp4`, you're good to go.

---

## Troubleshooting

### "node: command not found"
Node.js isn't installed or not in your PATH. Install it using the instructions above, then restart your terminal.

### "Cannot find module" errors
Run `npm install` again from the `system/tools/video-animations` folder.

### Render is very slow
- Close other apps to free RAM
- Try rendering at lower resolution first: add `--height 720` to the render command
- Remotion uses your CPU for rendering. Faster CPU = faster renders.

### "Chrome/Chromium not found"
Remotion needs a browser for rendering. Install it:
```bash
npx remotion browser ensure
```

### Windows-specific: execution policy error
Run PowerShell as administrator and execute:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## What This Enables

Once installed, these skills can generate video/image content:
- `/video-animate` — Branded animations and B-roll
- `/visual-carousel` — Instagram and LinkedIn carousels
- `/visual-image` — Social media images from templates

Skills will check if Remotion is installed and guide you through setup if it's not.
