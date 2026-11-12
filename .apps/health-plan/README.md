# My Health Plan

A simple habit tracker built from the "Rancangan Penjagaan Kesihatan Saya" infographic.
It tracks five habits, scores your commitment, and adds light game rewards. Works offline, no account, no server. Data stays on your device.

## Open it

- **Quickest:** open `dist/health-plan.html` in any browser (phone or computer). This is one self-contained file.
- **As an app on your phone:** host the folder anywhere that serves static files (GitHub Pages, Netlify, any web server), open it on your phone, then use "Add to Home Screen". The service worker makes it work offline.
- **Locally:** `python3 -m http.server 8000` inside this folder, then visit `http://localhost:8000`.

Rebuild the single file after any code change: `node tools/bundle.js`

## The five habits

| Habit | Target | Scheduled days |
|---|---|---|
| Suplemen (Omega-3, Probiotik, Vitamin C) | all 3 taken | every day |
| Air Putih | 2 L | every day |
| Tidur | 7 hours or more | every day |
| Brisk Walk | 30 minutes | Mon to Fri |
| Puasa Berselang (IF) | fasted | every day except Saturday |

You can change days and targets in the **Pelan** (Plan) tab.

## How scoring works

- **Day score:** the average progress of the habits scheduled that day. Partial effort counts.
- **Rest days** (such as Saturday for IF) never lower your score. Logging a rest-day habit earns bonus XP.
- **Commitment rating:** your average day score over 7, 30 or 90 days. 95% and up is S, then A (85), B (70), C (50), D.
- **Streak:** a day counts when you reach 70% of its plan. Rest days never break a streak.
- **XP:** +10 per finished habit, +20 for a perfect day, +5 for a rest-day bonus, plus a streak bonus on perfect days. 12 levels and 17 badges.

## Screens

- **Hari Ini (Today):** one-tap logging (+250 ml water, mark supplements, mark fasting) and a coach message. Use the arrows to log a missed day.
- **Kemajuan (Progress):** commitment rating, habit consistency, trend, calendar heatmap.
- **Pelan (Plan):** your weekly table with real status, plus edit mode.
- **Ganjaran (Rewards):** level, streak and badges.
- **Tetapan (Settings):** language (Bahasa Malaysia or English), theme, reminders, backup and restore.

## Folder map

- `SPEC.md` is the contract all modules were built against.
- `js/` has one file per module. `js/views/` has one file per screen. `css/` mirrors it.
- `tests/e2e.js` is the browser test suite (see `tests/README.md`). `tests/*-report.md` are the review logs.

## Reminders, honestly

Reminders show while the app is open. For alerts that arrive when it is closed, use Settings, "Add to calendar (.ics)" and import the file into your phone calendar.

This app tracks habits. It is not medical advice.
