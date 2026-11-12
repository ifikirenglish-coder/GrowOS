# My Health Plan: end-to-end tests

Playwright + Chromium, 11 scenarios (first run, logging, dates, rest days, plan, progress/rewards,
settings, corruption, layout, offline, i18n). Every scenario also fails on any console error or page error.

1. In the app folder, serve it:  `python3 -m http.server 8771`
2. In another terminal, from the app folder:  `node tests/e2e.js`
3. Run only some scenarios:  `node tests/e2e.js 2 7`  (numbers match the scenario titles)
4. Other URL:  `BASE=http://localhost:9000 node tests/e2e.js`

Needs `playwright` resolvable by `require` (global install is fine). The date is pinned to Thursday
2026-11-12 with `window.__HP_TODAY__`. Exit code is 0 only when every scenario passes. A full run takes about 2 minutes.
