# Performance, UX polish and copy review

Harness: Playwright + Chromium desktop, 390x800 (360x780 for layout checks), `__HP_TODAY__ = 2026-11-12`, 2 years (730 days, about 3,300 log values) seeded. Scripts live in the scratchpad `perf/` folder (not shipped).

## C. Performance (render budget: < 50 ms, Today < 16 ms)

| Measure (median, 2 years of data) | Before | After |
|---|---|---|
| Today render | 10.2 ms | 3.6 to 4.4 ms |
| Progress render | 12.2 ms | 11.6 ms |
| Plan render | 13.7 ms | 4.9 to 6.6 ms |
| Rewards render | 7.1 ms | 7.4 ms |
| Settings render | 3.2 ms | 2.5 to 3.2 ms |
| `scoring.commitment(90)` | 1.0 ms | 0.4 to 0.6 ms |
| `scoring.commitment(365)` | 2.4 ms | 1.5 to 2.3 ms |
| One tap, synchronous work (store write + checkProgress + HUD) | 10 to 18 ms | 5 to 9 ms |
| `gamify.compute()` | cached per change; cold run happens inside the tap above | same |

Hot spot found with the CPU profiler: `HP.dates` re-parsed the same date strings thousands of times per scan (`isValidDate`, `dow` via `rawParse`). Fix: bounded memo for validity and weekday in `js/store.js`. All views are far under budget.

Leak check (100 navigations across all 5 views, then 100 log changes, then 30 sheet open/close cycles): DOM node count stayed at 249, body HTML length flat, JS heap flat, no stray toasts or sheets. `HP.reminders.start()` called 3 times still creates one interval (guard already in place); no `setInterval` created by navigation.

## A. Re-render flicker and animation replay

Before: every change replayed chart intro animations (CSS animations running 1 s after a tap: Today 4, Progress 101, Rewards 7, Plan 5).
After: 0 chart animations after a tap on every view. Intro animations still play on navigation to a view.

- `js/app.js` `renderActive`: sets `data-rerender` on `#view` for change-driven re-renders, removes it for navigation renders.
- `css/charts.css`: `[data-rerender] .ch-anim ...` rules turn the intro animations off.
- Checked, already fine: Today tile pop only on the tile that just became done (it also pops after a data import or demo load, by design of the existing code); Rewards XP count-up only when XP changed (stays static on theme change); toasts are de-duplicated and capped at 3.

## B. Press-and-hold steppers

- Today value sheet: the sheet lives outside `#view` and only saves on Save, so background re-renders never touch it. OK.
- Plan edit mode (target steppers): a hold wrote to the store every 45 ms, each write re-rendered `#view` and destroyed the button under the finger. Worse, the old button never got `pointerup`, so the value kept climbing after release (measured 35 to 85 with the finger already up).
- Fix: `js/ui.js` stepper tracks pressed state and exposes `HP.ui.isHolding()`; `js/app.js` `scheduleRender` postpones the re-render (retry every 120 ms, 20 s failsafe) while a stepper is held. Verified: the same button element survives the whole hold, the value stops on release, repeated taps work.

## D. Copy and i18n

Scanned all screens in BM and EN, seeded and brand-new user, plus sheets, badge dialogs, toasts, and all i18n dictionaries (1,088 strings including coach messages, tips, weekly reviews for 14 days):
- `HP.i18n.missing()`: none. BM and EN key sets are identical (327 keys).
- No `undefined`, `NaN`, raw keys or `{placeholder}` on screen.
- Em/en dashes in user-facing text: fixed (see below). Banned AI words: none left.
- Reading level: all EN strings of 6+ words at grade 8 or lower except brand/plan terms ("intermittent fasting").
- English left inside BM UI: chart aria-labels only (fixed). Brand terms kept.
- Horizontal overflow at 360 px: none on any screen in either language, including a 50 character name. The only wide items are the intentional level roadmap scroller and visually hidden inputs.

Fixes:
- `js/views/plan.js`: "7–9 hours" now "7-9 hours" (6 strings); week label "Isn 9 – Aha 15 Nov" now uses a hyphen; "0 / 0 done" hidden until a week has scheduled days.
- `js/config.js`, `js/views/progress.js`: lone "–" placeholders now "-".
- `js/views/progress.js`: heatmap, trend chart and week strip aria-labels and "no data" titles localized (new keys `progress.heat.none`, `progress.trendCard.aria`, `progress.trendCard.empty`). `js/views/today.js`: week strip label localized; "0/0 done" hidden.
- `js/views/rewards.js`: "Unlocked / Dibuka" now "Earned / Diperoleh" (banned word); new users see "Not enough data yet" instead of a red-ish "D / Restart / 0%" rating (new key `rewards.noRating`).
- No shame for missed days: `status.missed` now "Not done" / "Belum siap" (`js/i18n.js`) and the Plan "missed" badge is neutral grey instead of alarm red (`css/plan.css`).
- `js/views/settings.js`: "Notifications are not supported on this browser" now "This browser cannot show notifications".
- `css/base.css`: at 360 px the header brand "My Health Plan" was clipped by two-digit streak and level chips. Smaller brand and chip padding under 400 px, plus ellipsis on the name.

## E. Edge cases

| Case | Result |
|---|---|
| Midnight rollover (`__HP_TODAY__` + `visibilitychange`, and `focus`) | Today view, HUD and streak refresh; a manually selected past date is kept. OK |
| Time zones (KL, LA, Auckland, London, Kiritimati, Sao Paulo; DST weeks in US/EU/NZ, leap day, year end): addDays, diffDays, dow, weekDates, range | 0 errors |
| Past weeks in Plan (12 steps back, incl. before first log) | No errors, no NaN; weeks before data show no counts |
| Habit with 0 scheduled days (walk, fasting; and all five) | Scores stay numeric, no NaN, views render, Plan shows the existing "no days" warning |
| Water above 6 L | Store clamps to the habit max (6 L); progress capped at 100% |
| 50 character name | Header OK; Settings greeting wraps; no overflow |
| `localStorage` throwing on access | App boots and works in memory. New: Settings shows a calm note that data lasts only while the page is open and suggests exporting a backup (`settings.data.noStorage`) |

## Remaining issues and notes
- Tiles also "pop" when data is imported or demo data is loaded (every newly done tile pops once). Cosmetic.
- The hidden `#boot-error` block in `index.html` is bilingual static text (intended).
- Progress view is the slowest at about 12 ms (heatmap with 84 day scores); well within budget, left as is.
- Chart `animate:false` was not needed after the `data-rerender` approach; a view that wants a deliberate intro on re-render can remove the attribute.
