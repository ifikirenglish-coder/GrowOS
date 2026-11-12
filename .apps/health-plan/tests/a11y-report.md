# Accessibility and visual-quality audit

Method: Playwright (Chromium) against a static server, demo data from `HP.store.seedDemo(28)`, fixed date 2026-11-12,
welcome sheet dismissed (checked separately). Matrix: light and dark (both `colorScheme` emulation and the `data-theme`
attribute), 360x640 and 390x844, all 5 views plus the welcome sheet, the stepper sheet, a confirm sheet and toasts.

## What was checked

1. **Contrast.** DOM walker over every visible text node and every SVG icon. It resolves the effective background by
   climbing ancestors (alpha, opacity, gradient layers, worst-case stop) and tests 4.5:1 for normal text, 3:1 for large
   text and icons. SVG `<text>` is measured by `fill`. Emoji glyphs are skipped.
2. **Keyboard and focus.** Tab walk of every view (reachability, visible ring, accessible name, order). Sheets: focus
   moves in, Tab and Shift+Tab are trapped, ESC closes, focus returns to the opener. Focus after a re-render
   (`data-fk` restore) and nav `aria-current`.
3. **Semantics.** Headings per view, names on buttons and links, input labels, roles on rings/meters/charts, live
   regions, `lang` on language switch, the Plan grid structure.
4. **Targets and motion.** Bounding boxes plus an `elementFromPoint` probe for pseudo-element hit areas. Reduced motion
   (counting running animations and confetti pieces). 200% text zoom (`html{font-size:32px}`). Horizontal scroll and
   clipped text at 100% and 200%.
5. **Visual polish.** Full-page screenshots of all views in light and dark at 390 and 360 wide.

## Issues found and fixed

| # | Issue | Fix | File |
|---|-------|-----|------|
| 1 | Orange text from `--brand-600` (3.4 to 3.8:1) in "14% lagi", "XP" unit, "Paling konsisten" tag, tagline, back link, streak number, scheduled badge | now `--brand-text` (passes in light and dark) | rewards.css, progress.css, settings.css, today.css, plan.css |
| 2 | Chart axis and line used plain `--brand` (2.85:1) as the default colour | `.ch-line` default colour is `--brand-text` | charts.css |
| 3 | White glyphs on habit colour discs (2.0 to 2.9:1; fasting amber 2.0) | ink glyphs (`#151515`, at least 3.9:1 on all five habit colours) | today.css, plan.css, settings.css |
| 4 | White check on dark-mode `--ok` (1.9:1) | dark check colour `#0B2417` | today.css |
| 5 | Header logo and card-title icons plain `--brand` | `--brand-text` | base.css, settings.css |
| 6 | Done badge in the Plan grid: white on `--brand-600` | `--brand-strong` with `--on-strong` | plan.css |
| 7 | Rating stars amber on white (2.0:1) | star fill uses `--warn` (3.5:1 light, bright in dark) | charts.css |
| 8 | Habit icons and sparklines in Progress below 3:1 | `color-mix` of the habit colour with `--text` (works in both themes) | progress.css |
| 9 | Supplement tile check icon 2.98:1 | `--ok-text` | today.css |
| 10 | Focus rings drawn in orange (2.7:1 on cream) in Today, Rewards, Plan, week strip | all use the global `--focus` blue | today.css, rewards.css, plan.css, charts.css |
| 11 | No `<h1>` on Today; habit titles were `h3` with no `h2` above | date title is `h1`, habit titles `h2` | views/today.js |
| 12 | `.btn-sm` 36px high (pseudo hit area clipped by the card) | `min-height: var(--tap)` | base.css |
| 13 | Walk quick-add row ("+30 min") overflowed the card and was clipped | actions wrap, buttons can shrink | today.css |
| 14 | Progress "Minggu ini": week strip squeezed to 21px per day beside the % | strip is full width, % sits underneath | progress.css |
| 15 | Heatmap cells 16px with 19px pitch | 20px cells, 4px gap (24px pitch, WCAG 2.2 AA 2.5.8) | views/progress.js |
| 16 | Plan day cells 42px wide at 360 | grid padding 4px, gap 2px gives 44px at 360 | plan.css |
| 17 | Trend chart x-labels ("Kha, 15 Okt") collided | label count derived from width and label length | charts.js |
| 18 | "Minggu yang cemerlang" bullets had no markers (reset removed them) | `list-style: disc` | progress.css |
| 19 | Orphan half-width last card in "Angka tabiat" | last odd card spans both columns (not at 3-col width) | progress.css |
| 20 | Icons stacked above headings (global `svg{display:block}`) in the Plan summary title, tagline, edit note and Settings hint | `display: inline-block` | plan.css, settings.css |
| 21 | Level roadmap names broke mid-word ("Bersemang / at") | tile 128px, name 14px, `break-word` | rewards.css |
| 22 | 200% zoom clipped tab labels, header brand name and Plan cell values | font sizes capped with `min(rem, vw)`; plan cells grow in height | base.css, plan.css |

## Verified OK (no change needed)

- Every focusable element in every view is reachable, has a visible 3px ring and an accessible name; order follows DOM.
- Sheets (stepper, confirm, welcome): `role=dialog`, `aria-modal`, `aria-labelledby`, focus trap in both directions, ESC
  closes, focus returns to the opener. Danger confirm focuses Cancel.
- Focus survives re-render (`water-add-250` keeps focus after repeated Enter).
- Nav: `<nav aria-label>` (translated), links with names, `aria-current="page"` on the active tab.
- One `<h1>` per view; heading order has no skips. Progress rings, meters and charts have `role` plus a label.
- Plan view is a real `grid` with `columnheader`s for days and `row`/`rowgroup` per habit; each cell has a full name
  ("Suplemen, Isnin: Selesai. Buka Isnin di Hari Ini").
- Toast stack is `role=status aria-live=polite` with `aria-relevant additions text` (not atomic, so not chatty).
- `lang` attribute follows the language setting (`ms` to `en`); nav label and document title update.
- `prefers-reduced-motion: reduce` leaves zero running animations and zero confetti pieces, including celebrate(level),
  toasts, sheets and page transitions (normal mode: 120 confetti pieces, pop, check-in, toast-in).
- No horizontal page scroll at 360 or 390, at 100% or 200% text zoom. Last content sits 24px above the tab bar.
- Dark mode contrast: no text or icon failures after the fixes.

## Remaining known issues

- Week strip (Today, Progress) buttons are 37 to 39px wide at 360px (57px tall). Seven buttons cannot reach 44px in a
  296px card. They meet WCAG 2.2 AA 2.5.8 (24px).
- Heatmap cells are 20px (24px pitch), below the 44px best practice, by design (84 cells). Meets 2.5.8.
- Contrast tool false positives (checked by pixel sampling): rewards hero "Tahap 7" and total XP read 6.8:1 and 7.6:1
  on the real pixels; the tool takes the glow stop as the worst case. `.ch-star` is coloured by CSS `fill`, not `color`.
- Per-habit sparklines in Progress use the raw habit colour (2.4 to 2.7:1 on the tinted tile). They are decorative; the
  value is in text next to them.
- `today-date`, `today-coach` and each status line are `aria-live="polite"`. A screen reader may announce the coach line
  after each tap; not changed because it is the intended feedback.
- 200% zoom: the header brand name ellipsises ("My Healt...") because the HUD chips grow.
- Settings has one extra 2px overflow at 200% zoom from an unlabelled span (no horizontal scroll results).
