# My Health Plan — Build Spec (the contract all agents code against)

A simple, mobile-first, offline-capable health-habit tracker. **No build step, no dependencies, no ES modules.**
Plain `<script>` files that attach to one global namespace `window.HP`. Data lives in `localStorage`.
Open `index.html` (or serve the folder statically) and it works. Default UI language: **Bahasa Malaysia (`bm`)**, switchable to **English (`en`)**.

The product comes from the user's infographic "My Health Plan / Rancangan Penjagaan Kesihatan Saya":

| Habit (id)    | Target                          | Default scheduled days (Mon=0 … Sun=6) |
|---------------|---------------------------------|----------------------------------------|
| `supplements` | Omega-3 + Probiotic + Vitamin C | every day `[0..6]`                     |
| `water`       | ≥ 2 L / day                     | every day                              |
| `sleep`       | 7–9 h / day (done at ≥ 7 h)     | every day                              |
| `walk`        | brisk walk 30 min × 5 days      | Mon–Fri `[0,1,2,3,4]`, Sat/Sun = Rehat |
| `fasting`     | Intermittent Fasting 6×/week    | all but Sat `[0,1,2,3,4,6]`            |

Goals: healthier body, steadier energy, better focus, higher productivity. Tagline: **"Healthy Me, Happier Me!"**
Brand look: energetic orange (`#FF6B1A`) + near-black + warm cream, rounded cards, bold italic-ish headings.

## 0. Rules for every agent
1. **Only create/edit the files you own** (listed in your brief). Read `js/core.js` and `js/config.js` first — they exist already. Do not edit them.
2. Code strictly against the signatures below, even if the module that implements them is being written right now by another agent.
3. Every JS file is wrapped in an IIFE `(function(){ 'use strict'; var HP = window.HP; ... })();` and attaches to `HP`. ES2018 max, no modules, no libraries, no external network requests, no `eval`.
4. All user-visible text goes through `HP.t(key, params)` (shared keys, see §5) or `HP.tr({bm,en})`. Register your own strings with `HP.i18n.register({bm:{...}, en:{...}})` at file load. **Both languages are mandatory** for every key. Keys are namespaced `<module>.<name>`. `{name}` placeholders in strings are replaced from `params`.
5. Build DOM with `HP.h(...)` (text nodes are safe). Never concatenate user data into `innerHTML`.
6. Accessibility: real `<button>`s, ≥ 44px tap targets, `aria-label`s on icon-only buttons, `aria-live="polite"` for dynamic status, visible `:focus-visible`, respect `prefers-reduced-motion`, text contrast ≥ 4.5:1 in light AND dark.
7. Dates are local-time strings `'YYYY-MM-DD'`. Weekday index **Mon=0 … Sun=6** everywhere. Never use `toISOString()` for local dates.
8. No fabricated data. No medical claims beyond the plan; copy stays encouraging, non-judgmental, short (grade-8 reading level, no em dashes).
9. Run `node --check <file>` on every JS file you write. Keep files focused and readable (≤ ~600 lines).
10. When done, reply with a SHORT report: files written, public API you actually implemented (note any deviation from this spec), anything the integrator must know.

## 1. File layout & script order

```
.apps/health-plan/
  index.html                  ← App Shell agent
  manifest.webmanifest        ← PWA agent
  sw.js                       ← PWA agent
  icons/icon.svg, icons/icon-maskable.svg   ← PWA agent
  css/base.css                ← UI/UX Designer   (tokens, reset, layout, buttons, cards, chips, utilities)
  css/ui.css                  ← UI Components    (toast, sheet, stepper, switch, segmented, confetti, empty-state)
  css/charts.css              ← Charts
  css/today.css progress.css plan.css rewards.css settings.css   ← each view agent
  js/core.js config.js        ← Architect (DONE)
  js/i18n.js                  ← Localization
  js/icons.js                 ← Iconography
  js/store.js                 ← Data/Storage     (also defines HP.dates)
  js/scoring.js               ← Scoring & Rating
  js/gamify.js                ← Gamification
  js/insights.js              ← Coach & Insights
  js/charts.js                ← Charts
  js/ui.js                    ← UI Components
  js/reminders.js js/pwa.js   ← PWA & Reminders
  js/views/today.js progress.js plan.js rewards.js settings.js   ← view agents
  js/app.js                   ← App Shell
  tests/                      ← QA
```
**Script order in index.html:** core, config, i18n, icons, store, scoring, gamify, insights, charts, ui, reminders, pwa, views/today, views/progress, views/plan, views/rewards, views/settings, app. CSS order: base, ui, charts, today, progress, plan, rewards, settings.
Because of this order, a module may use only modules **earlier** in the list *at load time*; at call time (inside functions) everything is available.

## 2. Data model (`localStorage` key `hp.v1`, JSON)

```js
{
  version: 1,
  profile:  { name: '', createdAt: 'YYYY-MM-DD' },
  plan:     { supplements:{days:[0..6], target:3}, water:{days:[...], target:2}, sleep:{...target:7}, walk:{... target:30}, fasting:{... target:1} },
  logs:     { 'YYYY-MM-DD': { supplements:['omega3','vitc'], water:1.5, sleep:7.5, walk:30, fasting:true } },   // only keys that were set
  settings: { lang:'bm'|'en', theme:'auto'|'light'|'dark', sound:true, haptics:true,
              reminders:{ enabled:false, times:{ supplements:'08:00', water:'10:00', walk:'18:30', sleep:'22:00', fasting:'' } } },  // '' = off
  game:     { seenBadges:{ badgeId:'YYYY-MM-DD' }, lastLevel:1 }
}
```
Habit value types (see `HP.config`): `multi` → array of item ids; `amount` → number (L / hours / minutes); `toggle` → boolean.
A habit is **done** when `HP.config.isDone(id, value, plan[id].target)`.
A habit is **scheduled** on a date when that weekday index ∈ `plan[id].days`. Unscheduled habits are "Rehat" (rest) — logging them is allowed and counts as a **bonus** (XP only, never lowers a score).

## 3. Public APIs

### 3.1 `HP.dates` (defined in store.js)
`today()` (honours `window.__HP_TODAY__` string override for tests) · `parse(str)→Date(local noon)` · `fmt(Date)→str` · `addDays(str,n)` · `dow(str)→0..6 (Mon=0)` · `weekStart(str)→Monday str` · `weekDates(str)→[7 strs Mon..Sun]` · `diffDays(a,b)→b-a in days` · `range(a,b)→[a..b inclusive]` · `isFuture(str)` · `isToday(str)` · `label(str,{style:'short'|'long'})` (localized, e.g. "Isn, 12 Nov" / "Isnin, 12 November") · `relativeLabel(str)` ("Hari ini"/"Semalam"/label).

### 3.2 `HP.store` (store.js) — the ONLY writer of localStorage. Every mutation saves and emits `HP.bus.emit('change', {...})`.
```
init()                                   load + migrate + sanitize; emits change{type:'init'}; falls back to in-memory if localStorage throws
get()                                    → full state (treat as READ-ONLY)
getLog(date) → {supplements:[],water:0,sleep:0,walk:0,fasting:false} (all keys always present, defaults filled)
hasLog(date) → bool (any habit has a non-empty value)
getValue(date, habitId) → value
setValue(date, habitId, value)           normalizes via HP.config.normalize; removes the key if value is empty; emits change{type:'log',date,habitId}
addAmount(date, habitId, delta)          amount habits; clamps at [min,max]
toggleItem(date, habitId, itemId)        multi habits
toggle(date, habitId)                    toggle habits
completeHabit(date, habitId)             sets to full target (multi → all items, amount → max(current,target), toggle → true)
clearHabit(date, habitId)
logDates() → sorted array of dates having logs · firstLogDate() → str|null
getPlan() → plan (copy) · getTarget(habitId) · getScheduledDays(habitId) → [idx]
isScheduled(habitId, date) → bool
setPlan(habitId, {days?, target?})       validates (days unique 0..6 sorted; target within targetRange, ignored for fixedTarget); emits change{type:'plan'}
resetPlan()
getSettings() · setSettings(patch)       deep-merge; emits change{type:'settings'}; applies HP.setLang if lang changed
getProfile() · setProfile(patch)
getGame() · setGame(patch)               deep-merge; emits change{type:'game'}
exportJSON() → string · importJSON(str) → {ok:true}|{ok:false,error:'message key or text'}   (validates shape, sanitizes, replaces state; emits change{type:'import'})
reset()                                  wipe everything back to defaults; emits change{type:'reset'}
seedDemo(days=28)                        replaces logs with realistic, varied sample data ending yesterday+today partial (deterministic pseudo-random); for demos/tests
```

### 3.3 `HP.scoring` (scoring.js) — pure functions over store data
```
dayScore(date) → {
  date, dow, isToday, isFuture, logged,
  habits: [{id, scheduled, value, progress(0..1), done, bonus}],   // bonus = unscheduled but done
  scheduledCount, doneCount,
  pct,            // 0..100 = round(mean progress of scheduled habits * 100); rest day with nothing scheduled → 100 and isRest=true
  perfect,        // scheduledCount>0 && doneCount===scheduledCount
  isRest          // scheduledCount===0
}
weekScore(anyDateInWeek) → {
  weekStart, days:[7 × dayScore],
  pct,            // commitment over scheduled days up to & including today (future days excluded); 0 if nothing due yet
  scheduledTotal, doneTotal, perfectDays, daysElapsed,
  habits: { id:{ scheduled, done, pct, total (e.g. minutes walked / litres / nights) } },
  rating          // rate(pct)
}
commitment(days=30, endDate=today) → { pct, scheduledTotal, doneTotal, perfectDays, activeDays, trend:[{date,pct,isRest,isFuture}], habits:{id:{scheduled,done,pct,avg?}}, rating }
rate(pct) → { stars:0..5 (halves), grade:'S'|'A'|'B'|'C'|'D', key:'legend'|'great'|'good'|'keepgoing'|'restart', color }   // thresholds from HP.config.GRADES; stars=round(pct/20*2)/2
isStreakDay(date) → true | false | null   (null = rest day, neutral)
```
Today partially done must not look like a failure: `commitment`/`weekScore` count **today** only toward `pct` when it has ≥1 log or the day is over; otherwise today is excluded (so mornings don't tank the score).

### 3.4 `HP.gamify` (gamify.js) — everything derived from logs (deterministic), only "seen" markers are stored
```
compute() → {
  xp, level, levelName:{bm,en}, levelEmoji, levelXp (xp earned inside this level), levelNeed (xp span of this level), levelPct(0..1), nextLevelName,
  streak:{ current, best },       // consecutive streak days (scheduled day with pct >= STREAK_MIN_PCT); rest days neutral; today not-yet-qualified doesn't break it
  todayXp, weekXp,
  badges:[{ id, name:{bm,en}, desc:{bm,en}, emoji, unlocked, unlockedOn:'YYYY-MM-DD'|null, progress:0..1, hint:{bm,en} }]
}
xpForDay(date) → int       // HP.config.XP: perHabit per done scheduled habit + perfectDayBonus + bonusOnRestDay per done unscheduled habit + min(streakBonusCap, streakBonusPerDay*streakLength) on perfect days
checkProgress() → {newBadges:[badge], levelUp: null|{level,name}}   // diffs compute() vs store.game, persists via setGame, emits bus 'badge' (each) and 'levelup'. Silent (no emit) on first ever run when history already exists (mark as seen).
levels → array (≥ 10 levels, friendly names e.g. "Pemula/Beginner" … "Legenda/Legend") ; badgeDefs → array (≥ 14 badges: first log, streaks 3/7/14/30, perfect day, perfect week, hydration hero, sleep champion, walker 150 min week, IF pro 6×, supplement streak, comeback, level 5, XP milestones…)
```

### 3.5 `HP.insights` (insights.js) — returns already-localized strings
```
coachMessage(date?) → { tone:'cheer'|'nudge'|'celebrate'|'calm', emoji, title, body }        // for the Today card; depends on time of day, pending habits, streak, pace
nextAction(date?) → { habitId, text } | null                                                    // single best next thing to do now
habitTip(habitId) → string                                                                      // rotating by day-of-year, ≥ 6 tips/habit, from the plan's spirit (no medical claims)
weeklyReview(anyDateInWeek) → { headline, summary, highlights:[string], focus:{habitId,text}|null }
```

### 3.6 `HP.i18n` (i18n.js)
```
HP.t(key, params) → string (falls back to en, then to the key itself)      HP.setLang('bm'|'en')  (sets HP.lang, <html lang>, emits bus 'lang')
HP.i18n.register({bm:{...}, en:{...}})   merges dictionaries (call at load time in your own file)
HP.i18n.has(key) · HP.i18n.plural(n, {one:'..', other:'..'}) · HP.i18n.number(n, dp) (localized decimal)
```

### 3.7 `HP.icons` (icons.js) — 24×24 stroke icons, `currentColor`, round caps/joins
```
HP.icons.svg(name, {size=24, stroke=2, class=''}) → SVGElement      HP.icons.html(name, opts) → string (trusted static markup, for use with attrs.html)
HP.icons.names → array
```
Required names: `pill droplet bed walk utensils heart flame trophy star medal target calendar chart-bar home check check-circle plus minus x lock bell download upload trash edit moon sun globe sparkles zap crown leaf shield clock refresh info chevron-left chevron-right chevron-up chevron-down settings user share play pause smile sprout`. Habit ids map to icons through `HP.config.habit(id).icon`. Nav icons: today→`home`, progress→`chart-bar`, plan→`calendar`, rewards→`trophy`, settings→`settings`.

### 3.8 `HP.charts` (charts.js) — pure DOM/SVG builders, return an Element, use CSS vars / `currentColor`, animate in via CSS classes, no state
```
ring({value:0..1, size=120, stroke=12, color, track, label, sublabel, icon})          single progress ring with centered text/icon
multiRing({rings:[{value,color,label}], size=180, stroke=14, gap=4, center:Node|string})  concentric "activity" rings (outer = first)
bars({data:[{label,value,color?,highlight?}], max?, height=140, showValues=false, formatValue?})   vertical bars
line({points:[{label,value}], min=0, max=100, height=140, color, area=true, showDots=false})
sparkline(values:number[], {width=80,height=24,color})
heatmap({days:[{date, value:0..1|null, state?:'rest'|'future'}], onSelect(date), colorVar?, cell=14, gap=3, weekStartsMonday:true, selected?})   // GitHub-style calendar: columns = weeks, rows = Mon..Sun
weekStrip({days:[{label, state:'done'|'partial'|'miss'|'rest'|'future', today?:bool, onClick?}]})   // 7 dots/pills
stars(value:0..5, {size=18})                                                           // supports half stars, aria-label "x of 5"
meter({value:0..1, color, height=8, label})                                            // linear progress bar, role="progressbar"
```
### 3.9 `HP.ui` (ui.js)
```
toast(message, {type:'info'|'success'|'badge'|'level', icon?:iconName, emoji?:string, duration=3200})   // stacked, aria-live, tap to dismiss
confetti({count=60, origin:{x,y}?})                                                    // DOM particles; no-op under prefers-reduced-motion
celebrate(kind:'habit'|'perfect'|'badge'|'level')                                      // confetti + haptic + optional sound per kind (respects settings.haptics/sound)
sheet({title, content:Node, actions:[{label, kind:'primary'|'ghost'|'danger', onClick, keepOpen?}], onClose}) → {close()}   // bottom sheet, focus trap, ESC/backdrop to close
confirm({title, message, confirmLabel, cancelLabel, danger?}) → Promise<boolean>
stepper({value,min,max,step,unit,format?,onChange(v),label}) → Element             // [–] value [+], long-press repeat, role="spinbutton"
toggleSwitch({checked, onChange(bool), label}) → Element   (role="switch")
segmented({options:[{value,label}], value, onChange(v), label}) → Element   (role="radiogroup")
chip(text, {tone:'neutral'|'brand'|'ok'|'warn', icon?}) → Element
emptyState({icon, title, body, action:{label,onClick}?}) → Element
animateNumber(el, to, {from=0, ms=600, dp=0, suffix=''})
haptic(ms|pattern) · playSound('tick'|'success'|'level')   (tiny WebAudio beeps, off by default until a user gesture, respects settings.sound)
```

### 3.10 `HP.reminders` & `HP.pwa` (reminders.js, pwa.js)
```
HP.reminders.supported() · permission() → 'granted'|'denied'|'default'|'unsupported' · request() → Promise<permission>
HP.reminders.start() / stop()   in-app scheduler (checks each minute while app is open; for a due reminder whose habit is not yet done today, shows a Notification (via SW registration if available) else HP.ui.toast)
HP.reminders.buildICS() → string  recurring daily VEVENTs (one per enabled reminder time, RRULE:FREQ=DAILY, or weekly BYDAY for the plan's scheduled days) ; HP.reminders.downloadICS()  (Blob + <a download>)
HP.pwa.register() (no-op unless http/https) · canInstall() · install() → Promise · isStandalone() · isIOS()
```

### 3.11 Views (`js/views/*.js`) — each registers `HP.views.<id> = { id, icon, titleKey, render(container) }`
- ids/order: `today`, `progress`, `plan`, `rewards`, `settings`. Titles registered as shared keys `nav.<id>` (§5).
- `render(container)` must be **idempotent and fast**: it rebuilds the contents of `container` (use `HP.mount`). The shell calls it on navigation and after every `'change'`/`'lang'` event while the view is active. Do not subscribe to the bus yourself. Do not store DOM references across renders.
- Put `data-fk="<stable-key>"` on interactive elements; the shell restores focus to the same `data-fk` after a re-render.
- Prefix all your CSS classes with your view name (`today-`, `progress-`, `plan-`, `rewards-`, `settings-`) and keep them in your own CSS file.
- Shared shell helpers: `HP.app.navigate(viewId, {date?})`, `HP.app.getDate()` (selected date, default today), `HP.app.setDate(str)` (does not re-render by itself; call navigate or store change), `HP.app.renderActive()`.

### 3.12 App shell (`index.html`, `js/app.js`)
Header (app title, streak 🔥 chip, level chip with mini XP bar) · `<main id="view">` · bottom tab nav (5 tabs, safe-area aware). Boots: `HP.store.init()` → apply lang/theme → register SW → `HP.reminders.start()` → render. On `'change'`: update HUD, `HP.gamify.checkProgress()` (toast/celebrate for badges & level-ups), detect a day becoming perfect (emit `'perfect'`, `HP.ui.celebrate('perfect')`), re-render active view (debounced 30 ms, restoring focus via `data-fk` and scroll position). Applies `data-theme` on `<html>` (`auto` → remove attribute). Hash routing `#/today`, `#/progress`… First-run welcome sheet (name optional, language) shown once.

## 4. Visual design contract (CSS variables defined in `css/base.css`)
Light is default; dark is applied by `@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){…} }` **and** `:root[data-theme="dark"]{…}` (same values).
```
--bg --surface --surface-2 --text --text-muted --border
--brand (#FF6B1A) --brand-600 (#E5530A) --brand-100 (#FFE3D1) --brand-50 (#FFF4EC) --ink (#151515) --on-brand (#fff)
--ok (#1F9D63) --warn (#C77700) --danger (#D93025) --info (#1673C9)
--c-supplements #FF6B1A  --c-water #1E9BF0  --c-sleep #7B61FF  --c-walk #22B573  --c-fasting #F5A524      (habit identity colors, work in both themes)
--radius:18px --radius-sm:12px --radius-pill:999px --shadow-1 --shadow-2
--s-1:4px --s-2:8px --s-3:12px --s-4:16px --s-5:24px --s-6:32px
--font: system-ui stack; --font-display: same stack, heavy weight   --tap:44px --nav-h:64px --header-h:56px --safe-b: env(safe-area-inset-bottom)
```
Shared utility classes provided by `base.css` (everyone may use them): `.card` `.card-title` `.btn` (`.btn-primary` `.btn-ghost` `.btn-danger` `.btn-sm` `.btn-icon` `.btn-block`) `.chip` `.pill` `.stack` (flex column, gap `--s-4`; `.stack-sm`, `.stack-lg`) `.row` (flex, align center, gap `--s-3`; `.row-between`, `.row-wrap`) `.grid-2` `.grid-3` `.muted` `.small` `.h1` `.h2` `.h3` `.num` (tabular-nums) `.sr-only` `.divider` `.field` `.input` `.select` `.hide` `.page` (view padding) `.page-title`.
Shell classes (owned by designer, used by app.js): `.app` `.app-header` `.app-brand` `.hud` `.hud-chip` `.app-main` `.app-nav` `.nav-item` `.nav-item[aria-current="page"]` `.nav-label`.
`css/ui.css` owns: `.toast-stack .toast`, `.sheet-backdrop .sheet .sheet-handle .sheet-title .sheet-body .sheet-actions`, `.stepper`, `.switch`, `.segmented`, `.confetti-piece`, `.empty`.
`css/charts.css` owns: `.ch-*` classes.
Max content width 560px centered on large screens; fine on 360px phones; thumb-friendly; no horizontal scroll.

## 5. Shared i18n keys (defined by i18n.js; everyone may rely on them)
`nav.today nav.progress nav.plan nav.rewards nav.settings` · `common.save common.cancel common.done common.undo common.reset common.confirm common.yes common.no common.close common.edit common.add common.back common.next common.today common.yesterday common.tomorrow common.week common.month common.all common.days common.day common.of common.loading` · `unit.l unit.h unit.min unit.item unit.times` · `rating.legend rating.great rating.good rating.keepgoing rating.restart` (short labels for grades) · `app.name app.tagline` ("My Health Plan" / "Healthy Me, Happier Me!") · `habit.<id>.name habit.<id>.desc` (mirror of config) · `day.short.0..6 day.full.0..6` · `status.done status.partial status.missed status.rest status.upcoming status.bonus` · `error.generic`.

## 6. Quality bar
Fast first paint (< 100 ms of JS on a mid phone), one tap to log the most common things (+250 ml water, mark supplement, mark fasting), no blocking dialogs for routine actions, undo-friendly, works offline, no layout shift on re-render, 360–430px phones first, desktop second. Delight comes from XP/streak/badge feedback, never from nagging.
