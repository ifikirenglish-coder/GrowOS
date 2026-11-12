/* End-to-end suite for My Health Plan (Playwright + Chromium).
   Run: python3 -m http.server 8771   (in the app folder)   then   node tests/e2e.js
   Optional: node tests/e2e.js 3 7   runs only scenarios 3 and 7.  BASE=http://localhost:9999 to change the URL. */
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');

const BASE = process.env.BASE || 'http://localhost:8771';
const TODAY = '2026-11-12'; // Thursday
const SAT = '2026-11-14';
const SUN = '2026-11-15';

let browser;

/* ------------------------------------------------------------------ harness */
class Scenario {
  constructor(name) { this.name = name; this.failures = []; this.checks = 0; this.errors = []; this.ctxs = []; }
  check(cond, msg) { this.checks++; if (!cond) { this.failures.push(msg); console.log('    FAIL: ' + msg); } return !!cond; }
  eq(a, b, msg) {
    const ok = JSON.stringify(a) === JSON.stringify(b);
    return this.check(ok, msg + ' (got ' + JSON.stringify(a) + ', expected ' + JSON.stringify(b) + ')');
  }
  /** New isolated context+page. opts: viewport, today, welcomed (default true), sw (default blocked), offline */
  async page(opts) {
    opts = opts || {};
    const ctx = await browser.newContext({
      viewport: opts.viewport || { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true,
      acceptDownloads: true, serviceWorkers: opts.sw ? 'allow' : 'block', locale: 'en-US'
    });
    this.ctxs.push(ctx);
    const today = opts.today || TODAY;
    const welcomed = opts.welcomed !== false;
    await ctx.addInitScript(([t, w]) => {
      window.__HP_TODAY__ = t;
      try { if (w && localStorage.getItem('hp.welcomed') === null) localStorage.setItem('hp.welcomed', '1'); } catch (e) { /* ignore */ }
      // record every toast that ever appears (they auto-dismiss)
      window.__toasts = [];
      const start = () => {
        new MutationObserver((muts) => {
          muts.forEach((m) => m.addedNodes.forEach((n) => {
            if (n.nodeType === 1 && n.classList && n.classList.contains('toast')) window.__toasts.push(n.textContent.trim());
          }));
        }).observe(document, { childList: true, subtree: true });
      };
      start();
    }, [today, welcomed]);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => this.errors.push('pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') this.errors.push('console.error: ' + m.text()); });
    page.on('requestfailed', (r) => { if (!opts.offline) this.errors.push('requestfailed: ' + r.url() + ' ' + (r.failure() && r.failure().errorText)); });
    page.on('response', (r) => { if (r.status() >= 400) this.errors.push('HTTP ' + r.status() + ' ' + r.url()); });
    page.ctx = ctx;
    return page;
  }
  async open(page, hash) {
    await page.goto(BASE + '/index.html' + (hash || ''));
    await page.waitForFunction(() => window.HP && window.HP.app && window.HP.app.booted === true);
    await settle(page);
    return page;
  }
}

const settle = (page, ms) => page.waitForTimeout(ms || 90); // shell re-renders on a 30 ms debounce
const ev = (page, fn, arg) => page.evaluate(fn, arg);
async function tap(page, fk) {
  await page.locator('[data-fk="' + fk + '"]').click();
  await settle(page);
}
async function goView(page, id) {
  await page.locator('.app-nav [data-view="' + id + '"]').click();
  await page.waitForFunction((i) => document.getElementById('view').getAttribute('data-view') === i, id);
  await settle(page, 120);
}
const seed = async (page, n) => { await ev(page, (k) => window.HP.store.seedDemo(k), n); await settle(page, 150); };
const hudNums = (page) => ev(page, () => ({
  streak: document.getElementById('hud-streak-num').textContent, level: document.getElementById('hud-level-num').textContent
}));
async function confirmSheet(page) { // click the confirming (last) action of the top sheet
  const btn = page.locator('.sheet-backdrop.is-open .sheet-actions .btn').last();
  await btn.waitFor({ state: 'visible' });
  await btn.click();
  await page.waitForTimeout(450);
}

/* ---------------------------------------------------------------- scenarios */
const scenarios = [];
const S = (name, fn) => scenarios.push({ name, fn });

S('1. First run: welcome sheet, name, language, persistence', async (s) => {
  const page = await s.page({ welcomed: false });
  await s.open(page);
  await page.locator('.sheet[role="dialog"]').waitFor({ state: 'visible', timeout: 4000 });
  s.check(true, 'welcome sheet appears');
  s.check(/Selamat datang/.test(await page.locator('.sheet-title').innerText()), 'welcome title is Bahasa Malaysia by default');
  await page.locator('#welcome-name').fill('Aisyah');
  await page.getByRole('radio', { name: 'English' }).click();
  await page.locator('.sheet-title', { hasText: 'Welcome' }).waitFor({ timeout: 3000 });
  s.eq(await page.locator('#welcome-name').inputValue(), 'Aisyah', 'name kept after switching to English');
  s.eq(await ev(page, () => document.documentElement.lang), 'en', 'html lang is en');
  await page.getByRole('radio', { name: 'Bahasa Malaysia' }).click();
  await page.locator('.sheet-title', { hasText: 'Selamat datang' }).waitFor({ timeout: 3000 });
  s.eq(await page.locator('#welcome-name').inputValue(), 'Aisyah', 'name kept after switching back to BM');
  s.eq(await page.locator('.sheet[role="dialog"]').count(), 1, 'exactly one welcome sheet (no stacking)');
  await page.getByRole('button', { name: 'Mula', exact: true }).click();
  await page.waitForTimeout(500);
  s.eq(await page.locator('.sheet[role="dialog"]').count(), 0, 'sheet closes on Mula');
  const hud = await hudNums(page);
  s.eq(hud, { streak: '0', level: '1' }, 'HUD streak 0 / level 1');
  s.eq(await ev(page, () => window.HP.store.getProfile().name), 'Aisyah', 'profile name stored');
  await page.reload();
  await page.waitForFunction(() => window.HP && window.HP.app && window.HP.app.booted === true);
  await page.waitForTimeout(900);
  s.eq(await page.locator('.sheet[role="dialog"]').count(), 0, 'welcome sheet does not return after reload');
  s.eq(await ev(page, () => window.HP.store.getProfile().name), 'Aisyah', 'name persists after reload');
  s.eq(await ev(page, () => window.HP.lang), 'bm', 'language is BM after reload');
});

S('2. Today logging: full perfect day, XP, toasts, undo, reload', async (s) => {
  const page = await s.open(await s.page());
  const val = (id) => ev(page, (i) => window.HP.store.getValue(window.HP.dates.today(), i), id);
  const pctText = () => page.locator('.today-ring-pct').innerText();
  s.eq(await pctText(), '0', 'starts at 0%');
  // water
  for (let i = 0; i < 8; i++) await tap(page, 'water-add-250');
  s.eq(await val('water'), 2, 'water = 2 L after 8 x 250 ml');
  s.check(await page.locator('[data-habit="water"].is-done').count() === 1, 'water tile is done');
  // supplements: individually, then untick + "Ambil semua"
  for (const id of ['omega3', 'probiotic', 'vitc']) {
    await tap(page, 'sup-' + id);
    s.eq(await page.locator('[data-fk="sup-' + id + '"]').getAttribute('aria-pressed'), 'true', id + ' pressed');
  }
  s.check(await page.locator('[data-habit="supplements"].is-done').count() === 1, 'supplements done after three individual taps');
  s.eq(await page.locator('[data-fk="sup-all"]').count(), 0, '"Ambil semua" hidden when all taken');
  await tap(page, 'sup-probiotic');
  s.eq((await val('supplements')).length, 2, 'untoggle works (2/3)');
  s.check(await page.locator('[data-habit="supplements"].is-done').count() === 0, 'supplements not done at 2/3');
  s.check(/Ambil semua/.test(await page.locator('[data-fk="sup-all"]').innerText()), '"Ambil semua" visible and labelled');
  await tap(page, 'sup-all');
  s.eq((await val('supplements')).length, 3, '"Ambil semua" takes all three');
  // sleep
  await tap(page, 'sleep-7');
  s.eq(await val('sleep'), 7, 'sleep preset 7');
  s.check(await page.locator('[data-habit="sleep"].is-done').count() === 1, 'sleep done at 7 h');
  // walk
  await tap(page, 'walk-add-10');
  s.eq(await val('walk'), 10, 'walk +10');
  await tap(page, 'walk-complete');
  s.eq(await val('walk'), 30, 'walk complete button sets 30');
  s.check(await page.locator('[data-fk="walk-complete"]').count() === 0, 'complete button gone when walk done');
  // not perfect yet
  s.check(await pctText() !== '100', 'not 100% before fasting');
  s.eq(await ev(page, () => window.HP.scoring.dayScore(window.HP.dates.today()).perfect), false, 'day not perfect before fasting');
  const perfectToasts = () => ev(page, () => window.__toasts.filter((t) => /Hari sempurna!/.test(t)).length);
  s.eq(await perfectToasts(), 0, 'no perfect toast yet');
  const xpBefore = await ev(page, () => window.HP.gamify.compute().xp);
  // fasting completes the day
  await tap(page, 'fasting-toggle');
  s.eq(await page.locator('[data-fk="fasting-toggle"]').getAttribute('aria-checked'), 'true', 'fasting switch on');
  await page.waitForTimeout(300);
  s.eq(await pctText(), '100', 'summary ring reaches 100%');
  s.eq(await ev(page, () => window.HP.scoring.dayScore(window.HP.dates.today()).perfect), true, 'day is PERFECT');
  const g = await ev(page, () => window.HP.gamify.compute());
  s.check(g.xp > xpBefore, 'XP increased on perfect (' + xpBefore + ' -> ' + g.xp + ')');
  const dayXp = await ev(page, () => window.HP.gamify.xpForDay(window.HP.dates.today()));
  s.check(dayXp >= 5 * 10 + 20, 'day XP includes habits + perfect bonus (' + dayXp + ')');
  s.check(new RegExp('\\+' + dayXp + '\\s*XP').test(await page.locator('.today-summary').innerText()), 'summary shows +' + dayXp + ' XP');
  s.eq(await perfectToasts(), 1, 'celebration toast shown once');
  s.check(await ev(page, () => window.__toasts.some((t) => /Langkah Pertama/.test(t))), 'first-log badge toast (Langkah Pertama) appeared');
  s.eq(await ev(page, () => window.__toasts.filter((t) => /Langkah Pertama/.test(t)).length), 1, 'first-log badge toast only once');
  // re-render must not re-toast
  await goView(page, 'progress'); await goView(page, 'today');
  await page.locator('[data-fk="sup-omega3"]').scrollIntoViewIfNeeded();
  await ev(page, () => window.HP.app.renderActive()); await settle(page);
  s.eq(await perfectToasts(), 1, 'no new perfect toast on re-render / navigation');
  // HUD
  const hud = await hudNums(page);
  s.eq(hud.streak, String(g.streak.current), 'HUD streak matches compute()');
  s.eq(hud.level, String(g.level), 'HUD level matches compute()');
  s.check(g.streak.current >= 1, 'streak is at least 1 after a perfect day');
  // undo
  await tap(page, 'water-undo');
  s.eq(await val('water'), 1.75, 'undo lowers water to 1.75');
  s.check(await page.locator('[data-habit="water"].is-done').count() === 0, 'water no longer done after undo');
  s.check(Number(await pctText()) < 100, 'progress below 100% after undo');
  s.eq(await ev(page, () => window.HP.scoring.dayScore(window.HP.dates.today()).perfect), false, 'no longer perfect after undo');
  s.check((await ev(page, () => window.HP.gamify.compute().xp)) < g.xp, 'XP drops after undo');
  // persistence
  const before = await ev(page, () => JSON.stringify(window.HP.store.getLog(window.HP.dates.today())));
  await page.reload();
  await page.waitForFunction(() => window.HP && window.HP.app && window.HP.app.booted === true);
  await settle(page, 200);
  s.eq(await ev(page, () => JSON.stringify(window.HP.store.getLog(window.HP.dates.today()))), before, 'log survives reload');
  s.check(/1[,.]75/.test(await page.locator('[data-habit="water"] .today-val').innerText()), 'UI shows 1.75 L after reload');
  s.eq(await ev(page, () => window.__toasts.filter((t) => /Hari sempurna!|Lencana/.test(t)).length), 0, 'no celebration/badge toasts replayed on reload');
});

S('3. Date navigation', async (s) => {
  const page = await s.open(await s.page());
  const label = () => page.locator('.today-date-main').innerText();
  s.eq(await label(), 'Hari ini', 'today label');
  s.check(await page.locator('[data-fk="date-next"]').isDisabled(), 'next is disabled on today');
  s.eq(await page.locator('[data-fk="date-today"]').count(), 0, 'no back-to-today link on today');
  await tap(page, 'date-prev');
  s.eq(await label(), 'Semalam', 'prev shows Semalam');
  s.check(await page.locator('[data-fk="date-next"]').isEnabled(), 'next enabled on yesterday');
  s.eq(await page.locator('[data-fk="date-today"]').count(), 1, 'back-to-today link visible');
  await tap(page, 'water-add-250');
  s.eq(await ev(page, () => window.HP.store.getValue('2026-11-11', 'water')), 0.25, 'logged to yesterday');
  s.eq(await ev(page, () => window.HP.store.getValue('2026-11-12', 'water')), 0, 'nothing logged to today');
  await tap(page, 'date-prev');
  s.eq(await ev(page, () => window.HP.app.getDate()), '2026-11-10', 'two days back');
  await tap(page, 'date-next'); await tap(page, 'date-next');
  s.eq(await label(), 'Hari ini', 'next x2 returns to today');
  s.check(await page.locator('[data-fk="date-next"]').isDisabled(), 'next disabled again');
  // back to today link
  await tap(page, 'date-prev'); await tap(page, 'date-prev'); await tap(page, 'date-prev');
  s.eq(await ev(page, () => window.HP.app.getDate()), '2026-11-09', 'three days back');
  await tap(page, 'date-today');
  s.eq(await label(), 'Hari ini', 'back-to-today link returns to today');
  await tap(page, 'water-add-250');
  s.eq(await ev(page, () => window.HP.store.getValue('2026-11-12', 'water')), 0.25, 'after returning, logs go to today');
  // future unreachable
  await ev(page, () => { window.HP.app.setDate('2026-11-13'); window.HP.app.renderActive(); });
  await settle(page);
  s.eq(await label(), 'Hari ini', 'forcing a future date falls back to today');
  s.check(await page.locator('[data-fk="date-next"]').isDisabled(), 'still cannot go forward');
  await page.locator('[data-fk="date-next"]').click({ force: true }).catch(() => {});
  await settle(page);
  s.eq(await ev(page, () => window.HP.app.getDate()), TODAY, 'clicking disabled next does nothing');
  // week strip
  const strip = page.locator('.today-week button.ch-ws-item');
  s.eq(await strip.count(), 4, 'week strip: only Mon..Thu are tappable (Fri-Sun are future)');
  await strip.nth(0).click(); await settle(page);
  s.eq(await ev(page, () => window.HP.app.getDate()), '2026-11-09', 'tapping Monday switches to Monday');
  s.check(/Isn/.test(await page.locator('.today-date').innerText()), 'date bar shows Isn(in)');
  await strip.nth(2).click(); await settle(page);
  s.eq(await ev(page, () => window.HP.app.getDate()), '2026-11-11', 'tapping Wednesday switches to Wednesday');
  await strip.nth(3).click(); await settle(page);
  s.eq(await label(), 'Hari ini', 'tapping Thursday returns to today');
});

S('4. Rest-day behaviour (Saturday)', async (s) => {
  const page = await s.open(await s.page({ today: SAT }));
  // history: Mon-Fri fully done
  await ev(page, () => {
    const st = window.HP.store;
    ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13'].forEach((d) => {
      ['supplements', 'water', 'sleep', 'walk', 'fasting'].forEach((id) => st.completeHabit(d, id));
    });
  });
  await settle(page, 200);
  const snap = () => ev(page, () => {
    const H = window.HP, d = H.dates.today();
    const ds = H.scoring.dayScore(d), ws = H.scoring.weekScore(d), c = H.gamify.compute();
    return { xp: c.xp, streak: c.streak.current, dayPct: ds.pct, perfect: ds.perfect, logged: ds.logged, weekPct: ws.pct,
      month: H.scoring.commitment(30).pct, walk: ds.habits.find((h) => h.id === 'walk') };
  });
  s.eq(await ev(page, () => window.HP.dates.dow(window.HP.dates.today())), 5, 'today is Saturday');
  s.check(await page.locator('.today-rest [data-habit="walk"]').count() === 1, 'walk is under rest section');
  s.check(/Rehat hari ini/.test(await page.locator('.today-rest').innerText()), 'section titled "Rehat hari ini"');
  s.eq(await page.locator('.today-tiles [data-habit="walk"]').count(), 0, 'walk not a scheduled tile');
  s.eq(await page.locator('.today-tiles [data-habit]').count(), 3, 'three scheduled tiles on Saturday');
  const b = await snap();
  s.eq(b.streak, 5, 'streak is 5 before Saturday logging');
  await tap(page, 'rest-walk');
  await tap(page, 'walk-add-30');
  const a = await snap();
  s.eq(a.walk && a.walk.done, true, 'walk done');
  s.eq(a.walk && a.walk.bonus, true, 'walk flagged as bonus');
  s.check(a.xp === b.xp + 5, 'bonus gives XP (' + b.xp + ' -> ' + a.xp + ', expected +5)');
  s.eq(a.dayPct, b.dayPct, 'day score unchanged by bonus (' + b.dayPct + ' -> ' + a.dayPct + ')');
  s.eq(a.perfect, false, 'day is not perfect from a bonus alone');
  s.check(a.weekPct >= b.weekPct, 'week score not lowered by bonus (' + b.weekPct + ' -> ' + a.weekPct + ')');
  s.check(a.month >= b.month, '30-day commitment not lowered by bonus (' + b.month + ' -> ' + a.month + ')');
  s.eq(a.streak, b.streak, 'streak unchanged by bonus');
  s.check(/Bonus dilog/.test(await page.locator('.today-rest [data-habit="walk"]').innerText()), 'rest item shows "Bonus dilog"');
  // rest days do not break streaks: remove Saturday from every habit so it is a true rest day, then do Sunday
  await ev(page, () => {
    ['supplements', 'water', 'sleep', 'walk', 'fasting'].forEach((id) => {
      const days = window.HP.store.getScheduledDays(id).filter((x) => x !== 5);
      window.HP.store.setPlan(id, { days });
    });
  });
  await settle(page, 150);
  const rest = await ev(page, () => { const d = window.HP.scoring.dayScore('2026-11-14'); return { isRest: d.isRest, pct: d.pct }; });
  s.eq(rest.isRest, true, 'Saturday is a rest day when nothing is scheduled');
  s.eq(await ev(page, () => window.HP.scoring.isStreakDay('2026-11-14')), null, 'rest day is neutral for streak');
  await ev(page, () => { window.__HP_TODAY__ = '2026-11-15'; window.HP.app.setDate(null); });
  await ev(page, () => { ['supplements', 'water', 'sleep', 'fasting'].forEach((id) => window.HP.store.completeHabit('2026-11-15', id)); });
  await settle(page, 200);
  const g = await ev(page, () => window.HP.gamify.compute());
  s.check(g.streak.current >= 6, 'streak spans the rest day: Mon-Fri + Sun = 6+ (got ' + g.streak.current + ')');
});

S('5. Plan view and editing', async (s) => {
  const page = await s.open(await s.page());
  await ev(page, () => { const st = window.HP.store, d = window.HP.dates.today(); st.completeHabit(d, 'water'); st.completeHabit('2026-11-11', 'sleep'); st.addAmount('2026-11-11', 'walk', 10); });
  await goView(page, 'plan');
  const lab = (fk) => page.locator('[data-fk="' + fk + '"]').getAttribute('aria-label');
  s.check(/Selesai/.test(await lab('plan-cell-water-3')), 'Thursday water cell says Selesai: ' + await lab('plan-cell-water-3'));
  s.check(/Selesai/.test(await lab('plan-cell-sleep-2')), 'Wednesday sleep cell says Selesai');
  s.check(/Separuh jalan/.test(await lab('plan-cell-walk-2')), 'Wednesday walk cell is partial: ' + await lab('plan-cell-walk-2'));
  s.check(/Terlepas/.test(await lab('plan-cell-water-1')), 'Tuesday water (no log) is missed');
  s.check(/Rehat/.test(await lab('plan-cell-walk-5')), 'Saturday walk is rest: ' + await lab('plan-cell-walk-5'));
  s.check(/Akan datang/.test(await lab('plan-cell-water-4')), 'Friday is upcoming');
  // edit mode
  await tap(page, 'plan-edit');
  s.eq(await page.locator('[data-fk="plan-edit"]').getAttribute('aria-pressed'), 'true', 'edit mode on');
  await tap(page, 'plan-cell-walk-5');
  s.eq(await ev(page, () => window.HP.store.isScheduled('walk', '2026-11-14')), true, 'Saturday walk toggled on');
  s.eq(await page.locator('[data-fk="plan-cell-walk-5"]').getAttribute('aria-pressed'), 'true', 'cell pressed state updated');
  const plus = page.locator('[data-fk="plan-step-water"] .stepper-plus');
  await plus.click(); await settle(page, 120);
  await page.locator('[data-fk="plan-step-water"] .stepper-plus').click(); await settle(page, 120);
  s.eq(await ev(page, () => window.HP.store.getTarget('water')), 2.5, 'water target 2.5 via stepper');
  s.check(/2[.,]5/.test(await page.locator('[data-fk="plan-step-water"]').innerText()), 'stepper shows 2.5');
  s.check(/2[.,]5/.test(await page.locator('[data-habit="water"] .plan-habit-target').innerText()), 'plan row target text updated');
  await tap(page, 'plan-edit');
  // Today on Saturday
  await ev(page, () => { window.__HP_TODAY__ = '2026-11-14'; window.HP.app.setDate(null); });
  await goView(page, 'today');
  s.eq(await page.locator('.today-tiles [data-habit="walk"]').count(), 1, 'Today lists walk on Saturday');
  s.eq(await page.locator('.today-rest [data-habit="walk"]').count(), 0, 'walk no longer in rest section');
  s.check(/2[.,]5/.test(await page.locator('[data-habit="water"] .today-val').innerText()), 'Today water target text is 2.5 L: ' + await page.locator('[data-habit="water"] .today-val').innerText());
  // reset plan
  await goView(page, 'plan');
  await tap(page, 'plan-edit');
  await tap(page, 'plan-reset');
  await confirmSheet(page);
  s.eq(await ev(page, () => window.HP.store.getTarget('water')), 2, 'water target back to 2');
  s.eq(await ev(page, () => window.HP.store.isScheduled('walk', '2026-11-14')), false, 'Saturday walk back to rest');
  s.eq(await ev(page, () => JSON.stringify(window.HP.store.getPlan())), await ev(page, () => JSON.stringify(window.HP.config.defaultPlan())), 'plan equals default plan');
});

S('6. Progress + Rewards with seeded data', async (s) => {
  const page = await s.open(await s.page());
  await seed(page, 28);
  await goView(page, 'progress');
  for (const [i, n] of [[1, 30], [2, 90], [0, 7]]) {
    await tap(page, 'progress-range-' + i);
    s.eq(await page.locator('[data-fk="progress-range-' + i + '"]').getAttribute('aria-checked'), 'true', 'range ' + n + ' selected');
    s.check(new RegExp('\\b' + n + '\\b').test(await page.locator('.progress-hero-range').innerText()), 'hero text mentions ' + n + ' days');
  }
  s.check(await page.locator('.progress-hero .ch-ring').count() > 0 || await page.locator('.progress-hero svg').count() > 0, 'hero ring rendered');
  const cells = page.locator('.ch-heat-cell[data-date]');
  s.check(await cells.count() > 10, 'heatmap has clickable cells (' + await cells.count() + ')');
  const target = await ev(page, () => window.HP.dates.addDays(window.HP.dates.today(), -5));
  await page.locator('.ch-heat-cell[data-date="' + target + '"]').click();
  await page.waitForFunction(() => document.getElementById('view').getAttribute('data-view') === 'today');
  await settle(page, 150);
  s.eq(await ev(page, () => window.HP.app.getDate()), target, 'heatmap click selects that date');
  s.eq(await ev(page, () => window.location.hash), '#/today', 'heatmap click navigates to Today');
  s.check(await page.locator('[data-fk="date-today"]').count() === 1, 'Today shows back-to-today for past date');
  // rewards
  await goView(page, 'rewards');
  await page.waitForTimeout(900); // animateNumber
  const g = await ev(page, () => window.HP.gamify.compute());
  s.check(g.xp > 0, 'seeded XP > 0 (' + g.xp + ')');
  s.check(g.levelXp >= 0 && g.levelXp <= g.levelNeed, 'levelXp (' + g.levelXp + ') within level span (' + g.levelNeed + ')');
  s.check(g.levelPct >= 0 && g.levelPct <= 1, 'levelPct in 0..1 (' + g.levelPct + ')');
  s.check(/\d+/.test(await page.locator('.rewards-level-num').innerText()) && (await page.locator('.rewards-level-num').innerText()).includes(String(g.level)), 'level number on screen = ' + g.level);
  s.check((await page.locator('.rewards-total-xp').innerText()).replace(/\D/g, '') === String(g.xp), 'total XP on screen = ' + g.xp + ' (got ' + (await page.locator('.rewards-total-xp').innerText()) + ')');
  const now = await page.locator('.rewards-meter [role="progressbar"]').getAttribute('aria-valuenow');
  s.check(Number(now) >= 0 && Number(now) <= 100, 'XP bar aria-valuenow 0..100 (' + now + ')');
  const fillW = await ev(page, () => { const f = document.querySelector('.rewards-meter .ch-meter-fill'); return f ? parseFloat(f.style.width) : null; });
  s.check(fillW !== null && fillW <= 100 && fillW >= 0, 'XP bar fill width within 0..100% (' + fillW + ')');
  const hudW = await ev(page, () => parseFloat(document.getElementById('hud-xp-fill').style.width));
  s.check(hudW >= 0 && hudW <= 100, 'HUD XP bar within 0..100% (' + hudW + ')');
  const unl = g.badges.filter((b) => b.unlocked).length, lock = g.badges.length - unl;
  s.check(unl > 0 && lock > 0, 'seed data gives both unlocked (' + unl + ') and locked (' + lock + ') badges');
  s.eq(await page.locator('.rewards-badge.is-unlocked').count(), unl, 'unlocked badge cards match compute()');
  s.eq(await page.locator('.rewards-badge.is-locked').count(), lock, 'locked badge cards match compute()');
  s.check(await page.locator('.rewards-badge.is-locked [role="progressbar"]').count() === lock, 'every locked badge shows progress');
  s.check(g.badges.every((b) => b.progress >= 0 && b.progress <= 1), 'badge progress within 0..1');
  s.check(g.levelXp + 0 <= g.levelNeed && g.xp >= g.levelXp, 'xp total >= xp in level');
  // badge sheet opens
  await page.locator('.rewards-badge.is-locked').first().click();
  await page.locator('.sheet[role="dialog"]').waitFor({ state: 'visible' });
  s.check(true, 'badge detail sheet opens');
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  s.eq(await page.locator('.sheet[role="dialog"]').count(), 0, 'sheet closes on Escape');
});

S('7. Settings', async (s) => {
  const page = await s.open(await s.page());
  await goView(page, 'settings');
  // language
  await page.getByRole('radio', { name: 'English' }).click(); await settle(page, 200);
  const navText = await page.locator('.app-nav').innerText();
  s.check(/Today/.test(navText) && /Progress/.test(navText) && /Plan/.test(navText) && /Rewards/.test(navText) && /Settings/.test(navText), 'nav labels are English: ' + navText.replace(/\s+/g, ' '));
  s.eq(await page.locator('h1.page-title').innerText(), 'Settings', 'page title in English');
  s.eq(await ev(page, () => document.documentElement.lang), 'en', 'html lang en');
  s.eq(await ev(page, () => window.HP.store.getSettings().lang), 'en', 'lang persisted in settings');
  await page.getByRole('radio', { name: 'Bahasa Malaysia' }).click(); await settle(page, 200);
  s.eq(await page.locator('h1.page-title').innerText(), 'Tetapan', 'switch back to BM');
  // theme
  const bg = () => ev(page, () => getComputedStyle(document.body).backgroundColor);
  const lum = (c) => { const m = c.match(/\d+/g).map(Number); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
  await page.getByRole('radio', { name: 'Cerah' }).click(); await settle(page, 250);
  const light = await bg();
  s.eq(await ev(page, () => document.documentElement.getAttribute('data-theme')), 'light', 'data-theme=light');
  await page.getByRole('radio', { name: 'Gelap' }).click(); await settle(page, 250);
  s.eq(await ev(page, () => document.documentElement.getAttribute('data-theme')), 'dark', 'data-theme=dark');
  const dark = await bg();
  s.check(light !== dark && lum(dark) < lum(light) - 100, 'body background really changes (' + light + ' -> ' + dark + ')');
  const cardBg = await ev(page, () => getComputedStyle(document.querySelector('.card') || document.body).backgroundColor);
  s.check(lum(cardBg) < 90, 'cards are dark in dark mode (' + cardBg + ')');
  await page.getByRole('radio', { name: 'Auto' }).click(); await settle(page, 250);
  s.eq(await ev(page, () => document.documentElement.hasAttribute('data-theme')), false, 'auto removes data-theme');
  await page.getByRole('radio', { name: 'Gelap' }).click(); await settle(page, 250);
  // sound + haptics
  for (const k of ['sound', 'haptics']) {
    const sw = page.locator('[data-fk="settings-' + k + '"]');
    s.eq(await sw.getAttribute('aria-checked'), 'true', k + ' on by default');
    await sw.click(); await settle(page);
    s.eq(await page.locator('[data-fk="settings-' + k + '"]').getAttribute('aria-checked'), 'false', k + ' switched off');
  }
  // reminders
  const master = page.locator('[data-fk="settings-rem-master"]');
  await master.click(); await page.waitForTimeout(300);
  s.eq(await ev(page, () => window.HP.store.getSettings().reminders.enabled), true, 'reminders master on');
  s.check(await page.locator('[data-fk^="settings-rem-sw-"]').count() === 5, 'five per-habit reminder switches appear');
  s.eq(await ev(page, () => window.HP.store.getSettings().reminders.times.water), '10:00', 'water reminder defaults to 10:00');
  s.check(await page.locator('[data-fk="settings-rem-time-water"]').count() === 1, 'time input visible for water');
  await page.locator('[data-fk="settings-rem-time-water"]').fill('07:45'); await settle(page, 150);
  s.eq(await ev(page, () => window.HP.store.getSettings().reminders.times.water), '07:45', 'time edit persisted');
  await page.locator('[data-fk="settings-rem-sw-water"]').click(); await settle(page);
  s.eq(await ev(page, () => window.HP.store.getSettings().reminders.times.water), '', 'water reminder switched off');
  s.eq(await page.locator('[data-fk="settings-rem-time-water"]').count(), 0, 'time input hidden when off');
  await page.locator('[data-fk="settings-rem-sw-water"]').click(); await settle(page);
  s.check(!!(await ev(page, () => window.HP.store.getSettings().reminders.times.water)), 'water reminder back on with a default time');
  await page.locator('[data-fk="settings-rem-master"]').click(); await page.waitForTimeout(200);
  s.eq(await ev(page, () => window.HP.store.getSettings().reminders.enabled), false, 'reminders master off again');
  // persistence of switches + theme
  await page.reload();
  await page.waitForFunction(() => window.HP && window.HP.app && window.HP.app.booted === true);
  await settle(page, 200);
  const st = await ev(page, () => window.HP.store.getSettings());
  s.eq([st.sound, st.haptics, st.theme], [false, false, 'dark'], 'sound/haptics/theme persist after reload');
  s.eq(await ev(page, () => document.documentElement.getAttribute('data-theme')), 'dark', 'theme re-applied after reload');
  await goView(page, 'settings');
  s.eq(await page.locator('[data-fk="settings-sound"]').getAttribute('aria-checked'), 'false', 'sound switch shows off after reload');
  // export / import round trip
  await seed(page, 14);
  const dl = page.waitForEvent('download');
  await page.locator('[data-fk="settings-export"]').click();
  const download = await dl;
  const file = path.join(os.tmpdir(), 'hp-e2e-export-' + process.pid + '.json');
  await download.saveAs(file);
  const raw = fs.readFileSync(file, 'utf8');
  let parsed = null;
  try { parsed = JSON.parse(raw); } catch (e) { /* handled below */ }
  s.check(parsed && parsed.logs && Object.keys(parsed.logs).length >= 10, 'export is valid JSON with logs');
  s.check(/^my-health-plan-backup-.*\.json$/.test(download.suggestedFilename()), 'export filename: ' + download.suggestedFilename());
  const logsBefore = await ev(page, () => JSON.stringify(window.HP.store.get().logs));
  await ev(page, () => window.HP.store.reset()); await settle(page, 150);
  s.eq(await ev(page, () => window.HP.store.logDates().length), 0, 'reset wipes logs');
  await goView(page, 'settings');
  await page.locator('input.settings-file').setInputFiles(file);
  await page.locator('.sheet-backdrop.is-open').waitFor({ timeout: 3000 });
  await confirmSheet(page);
  s.eq(await ev(page, () => JSON.stringify(window.HP.store.get().logs)), logsBefore, 'import restores identical logs');
  // import of garbage is rejected without crashing
  const bad = path.join(os.tmpdir(), 'hp-e2e-bad-' + process.pid + '.json');
  fs.writeFileSync(bad, '{"nope": true');
  await page.locator('input.settings-file').setInputFiles(bad);
  await page.locator('.sheet-backdrop.is-open').waitFor({ timeout: 3000 }).catch(() => {});
  if (await page.locator('.sheet-backdrop.is-open').count()) await confirmSheet(page);
  s.eq(await ev(page, () => JSON.stringify(window.HP.store.get().logs)), logsBefore, 'garbage import leaves data untouched');
  // sample data
  await ev(page, () => window.HP.store.reset()); await settle(page, 150);
  await goView(page, 'settings');
  await tap(page, 'settings-sample');
  await page.locator('.sheet-backdrop.is-open').waitFor();
  await confirmSheet(page);
  s.check((await ev(page, () => window.HP.store.logDates().length)) >= 20, 'load sample data adds history');
  // cancel path keeps data
  await tap(page, 'settings-reset');
  await page.locator('.sheet-backdrop.is-open .sheet-actions .btn').first().click(); await page.waitForTimeout(450);
  s.check((await ev(page, () => window.HP.store.logDates().length)) >= 20, 'cancelling reset keeps data');
  // reset everything (two confirms)
  await tap(page, 'settings-reset');
  await page.locator('.sheet-backdrop.is-open').waitFor();
  await confirmSheet(page);
  await page.locator('.sheet-backdrop.is-open').waitFor({ timeout: 3000 });
  await confirmSheet(page);
  s.eq(await ev(page, () => window.HP.store.logDates().length), 0, 'reset everything wipes data after two confirms');
  s.eq(await ev(page, () => window.HP.store.getSettings().theme), 'auto', 'reset restores default settings');
  fs.unlinkSync(file); fs.unlinkSync(bad);
});

S('8. Persistence / corruption', async (s) => {
  const variants = [
    ['garbage text', 'not json{{', true],
    ['json null', 'null', false],
    ['json array', '[1,2,3]', false],
    ['string', '"hello"', false],
    ['bad field types', JSON.stringify({ version: 1, logs: { '2026-11-12': { water: 'abc', walk: -5, supplements: 'zzz', sleep: 99, fasting: 'yes' }, 'not-a-date': { water: 1 } }, plan: { water: { days: 'x', target: 'y' } }, settings: { lang: 'fr', theme: 'pink' } }), false]
  ];
  for (const [name, value, expectBackup] of variants) {
    const page = await s.page();
    await page.goto(BASE + '/index.html');
    await ev(page, (v) => localStorage.setItem('hp.v1', v), value);
    await page.reload();
    await page.waitForFunction(() => window.HP && window.HP.app && window.HP.app.booted === true, null, { timeout: 5000 }).catch(() => {});
    await settle(page, 200);
    s.check(await ev(page, () => !!(window.HP && window.HP.app && window.HP.app.booted)), '[' + name + '] app boots');
    s.check(await page.locator('.today').count() === 1, '[' + name + '] Today renders');
    s.eq(await page.locator('#boot-error.show').count(), 0, '[' + name + '] no boot error banner');
    if (expectBackup) s.eq(await ev(page, () => localStorage.getItem('hp.v1.corrupt')), value, '[' + name + '] raw value kept in hp.v1.corrupt');
    const ok = await ev(page, () => { const g = window.HP.store.get(); return !!g && typeof g.logs === 'object' && ['bm', 'en'].includes(g.settings.lang) && ['auto', 'light', 'dark'].includes(g.settings.theme); });
    s.check(ok, '[' + name + '] state sanitized');
    // still writable + persisted
    await ev(page, () => window.HP.store.addAmount(window.HP.dates.today(), 'water', 0.5)); await settle(page);
    await page.reload(); await page.waitForFunction(() => window.HP.app.booted === true);
    s.eq(await ev(page, () => window.HP.store.getValue(window.HP.dates.today(), 'water')), 0.5, '[' + name + '] writes persist after recovery');
    for (const v of ['progress', 'plan', 'rewards', 'settings']) await goView(page, v);
  }
  // localStorage that throws
  const p2 = await s.page();
  await p2.context().addInitScript(() => {
    const boom = () => { throw new Error('storage blocked'); };
    Object.defineProperty(window, 'localStorage', { get: boom, configurable: true });
  });
  await p2.goto(BASE + '/index.html');
  await p2.waitForFunction(() => window.HP && window.HP.app && window.HP.app.booted === true, null, { timeout: 5000 }).catch(() => {});
  s.check(await ev(p2, () => !!(window.HP && window.HP.app && window.HP.app.booted)), 'app boots with localStorage blocked (in-memory fallback)');
  await p2.waitForTimeout(700);
  await p2.keyboard.press('Escape'); await p2.waitForTimeout(400); // welcome sheet shows again: storage cannot remember it
  await p2.locator('[data-fk="water-add-250"]').click({ timeout: 3000 }).catch(() => s.check(false, 'could not tap water with storage blocked'));
  await settle(p2);
  s.eq(await ev(p2, () => window.HP.store.getValue(window.HP.dates.today(), 'water')), 0.25, 'logging works in memory when storage is blocked');
  s.check(await p2.locator('.today').count() === 1, 'Today still renders with storage blocked');
});

S('9. Layout: no horizontal overflow, nav never covers last control', async (s) => {
  for (const vp of [{ width: 360, height: 640 }, { width: 390, height: 844 }]) {
    const page = await s.open(await s.page({ viewport: vp }));
    await seed(page, 28);
    for (const view of ['today', 'progress', 'plan', 'rewards', 'settings']) {
      await goView(page, view);
      await page.waitForTimeout(900);
      const tag = vp.width + 'x' + vp.height + ' ' + view;
      const r = await ev(page, () => {
        const de = document.documentElement;
        const offenders = [];
        document.querySelectorAll('#view *, .app-header *, .app-nav *').forEach((el) => {
          const b = el.getBoundingClientRect();
          if (b.width > 0 && (b.right > innerWidth + 1 || b.left < -1)) {
            let scroller = false;
            for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') { scroller = true; break; } }
            if (!scroller && offenders.length < 6) offenders.push(el.tagName + '.' + (el.className && el.className.baseVal === undefined ? el.className : '') + ' r=' + Math.round(b.right));
          }
        });
        return { sw: de.scrollWidth, bw: document.body.scrollWidth, iw: innerWidth, offenders: offenders.slice(0, 6) };
      });
      s.check(r.sw <= r.iw && r.bw <= r.iw, tag + ': no horizontal overflow (scrollWidth ' + r.sw + '/' + r.bw + ' vs ' + r.iw + ') ' + r.offenders.join(' | '));
      await ev(page, () => window.scrollTo(0, 1e7));
      await page.waitForTimeout(250);
      const g = await ev(page, () => {
        const nav = document.querySelector('.app-nav').getBoundingClientRect();
        let lowest = null, lowestAny = 0;
        document.querySelectorAll('#view button, #view a[href], #view input, #view select, #view summary, #view textarea, #view [tabindex="0"]').forEach((el) => {
          const b = el.getBoundingClientRect(), cs = getComputedStyle(el);
          if (b.width < 2 || b.height < 2 || cs.visibility === 'hidden' || cs.display === 'none' || el.disabled || el.classList.contains('settings-file')) return;
          if (!lowest || b.bottom > lowest.bottom) lowest = { bottom: b.bottom, label: (el.getAttribute('data-fk') || el.className || el.tagName) };
        });
        const view = document.getElementById('view').getBoundingClientRect();
        lowestAny = Math.max.apply(null, Array.from(document.querySelectorAll('#view .page > *')).map((e) => e.getBoundingClientRect().bottom).concat([0]));
        return { navTop: nav.top, navVisible: nav.height > 0, lowest, lowestAny, vh: innerHeight, scrollable: document.documentElement.scrollHeight > innerHeight };
      });
      s.check(g.navVisible, tag + ': nav visible');
      s.check(!g.lowest || g.lowest.bottom <= g.navTop + 1, tag + ': last control (' + (g.lowest && g.lowest.label) + ' bottom ' + (g.lowest && Math.round(g.lowest.bottom)) + ') above nav top ' + Math.round(g.navTop));
      s.check(g.lowestAny <= g.navTop + 1, tag + ': last content block (bottom ' + Math.round(g.lowestAny) + ') above nav top ' + Math.round(g.navTop));
    }
    await page.ctx.close();
  }
});

S('10. Offline / PWA basics', async (s) => {
  const page = await s.page({ sw: true, offline: true });
  await s.open(page);
  const reg = await ev(page, async () => {
    if (!('serviceWorker' in navigator)) return null;
    const r = await Promise.race([navigator.serviceWorker.ready, new Promise((res) => setTimeout(() => res(null), 6000))]);
    return r ? { scope: r.scope, active: !!r.active } : null;
  });
  s.check(reg && reg.active, 'service worker registered and active: ' + JSON.stringify(reg));
  const manifest = await ev(page, async () => { const l = document.querySelector('link[rel=manifest]'); const r = await fetch(l.href); return r.ok ? r.json() : null; });
  s.check(manifest && manifest.name && Array.isArray(manifest.icons) && manifest.icons.length > 0 && manifest.start_url, 'manifest is valid and has icons');
  await page.reload(); await page.waitForFunction(() => window.HP.app.booted === true);
  s.check(await ev(page, () => !!navigator.serviceWorker.controller), 'page controlled by SW after reload');
  await page.waitForTimeout(800); // let the SW finish caching
  await ev(page, () => window.HP.store.addAmount(window.HP.dates.today(), 'water', 0.75));
  await page.context().setOffline(true);
  await page.reload();
  await page.waitForFunction(() => window.HP && window.HP.app && window.HP.app.booted === true, null, { timeout: 8000 }).catch(() => {});
  s.check(await ev(page, () => !!(window.HP && window.HP.app && window.HP.app.booted)), 'app boots offline after reload');
  s.check(await page.locator('.today').count() === 1, 'Today renders offline');
  s.check(/0[.,]75/.test(await page.locator('[data-habit="water"] .today-val').innerText()), 'data intact offline');
  for (const v of ['progress', 'plan', 'rewards', 'settings']) {
    await goView(page, v);
    s.check(await page.locator('#view .page').count() === 1, v + ' renders offline');
  }
  await tap(page, 'settings-sound').catch(() => {});
  await page.context().setOffline(false);
});

S('11. Language / i18n sweep', async (s) => {
  const RAW = /\b(today|progress|plan|rewards|settings|shell|app|common|status|rating|nav)\.[a-z]+/;
  const BAD = /undefined|NaN|\[object/;
  const scan = async (page, tag) => {
    if (process.env.VERBOSE) console.log('    scan ' + tag);
    const r = await ev(page, () => {
      const out = { text: document.body.innerText, attrs: [] };
      document.querySelectorAll('[aria-label],[title],[placeholder]').forEach((el) => {
        ['aria-label', 'title', 'placeholder'].forEach((a) => { const v = el.getAttribute(a); if (v) out.attrs.push(v); });
      });
      out.missing = window.HP.i18n.missing();
      return out;
    });
    const text = r.text;
    const m1 = text.match(RAW), m2 = text.match(BAD);
    s.check(!m1, tag + ': no raw i18n key in visible text' + (m1 ? ' -> "' + text.substr(Math.max(0, m1.index - 30), 80).replace(/\n/g, ' ') + '"' : ''));
    s.check(!m2, tag + ': no undefined/NaN/[object] in visible text' + (m2 ? ' -> "' + text.substr(Math.max(0, m2.index - 30), 80).replace(/\n/g, ' ') + '"' : ''));
    const badAttr = r.attrs.filter((a) => RAW.test(a) || BAD.test(a));
    s.check(!badAttr.length, tag + ': no raw keys / undefined in aria-label/title/placeholder' + (badAttr.length ? ' -> ' + badAttr.slice(0, 3).join(' | ') : ''));
    s.eq(r.missing, [], tag + ': HP.i18n.missing() is empty');
  };
  for (const mode of ['fresh', 'seeded']) {
    const page = await s.open(await s.page());
    if (mode === 'seeded') await seed(page, 28);
    for (const lang of ['bm', 'en']) {
      await ev(page, (l) => window.HP.store.setSettings({ lang: l }), lang); await settle(page, 200);
      s.eq(await ev(page, () => window.HP.lang), lang, mode + '/' + lang + ': language applied');
      for (const view of ['today', 'progress', 'plan', 'rewards', 'settings']) {
        await goView(page, view);
        await page.waitForTimeout(400);
        await scan(page, mode + '/' + lang + '/' + view);
      }
      // extra states: plan edit mode, a bonus/rest item, open sheets and toasts
      await goView(page, 'plan'); await tap(page, 'plan-edit'); await scan(page, mode + '/' + lang + '/plan-edit'); await tap(page, 'plan-edit');
      await goView(page, 'today');
      await ev(page, () => { window.HP.ui.confirm({ title: window.HP.t('common.confirm'), message: window.HP.t('common.loading') }); });
      await page.waitForTimeout(400); await scan(page, mode + '/' + lang + '/sheet');
      await ev(page, () => window.HP.ui.closeSheets()); await page.waitForTimeout(400);
    }
    if (mode === 'seeded') { // toasts / badge / level text in both languages
      for (const lang of ['bm', 'en']) {
        await ev(page, (l) => window.HP.store.setSettings({ lang: l }), lang); await settle(page, 200);
        const badge = await ev(page, () => window.HP.t('app.badge', { name: window.HP.tr(window.HP.gamify.badgeDefs[0].name) }) + ' | ' + window.HP.t('app.levelUp', { level: 3, name: 'x' }) + ' | ' + window.HP.t('app.perfect', { xp: 10 }));
        s.check(!RAW.test(badge) && !BAD.test(badge), lang + ': shell toast strings resolved (' + badge + ')');
      }
    }
    // welcome sheet, both languages
    const w = await s.open(await s.page({ welcomed: false }));
    await w.locator('.sheet[role="dialog"]').waitFor({ timeout: 4000 });
    await scan(w, 'welcome/bm');
    await w.getByRole('radio', { name: 'English' }).click(); await w.locator('.sheet-title', { hasText: 'Welcome' }).waitFor({ timeout: 3000 });
    await scan(w, 'welcome/en');
  }
});

/* ------------------------------------------------------------------- runner */
(async () => {
  try {
    const r = await fetch(BASE + '/index.html');
    if (!r.ok) throw new Error('HTTP ' + r.status);
  } catch (e) {
    console.error('Cannot reach ' + BASE + ' (' + e.message + '). Start it first:  python3 -m http.server 8771  in the app folder.');
    process.exit(2);
  }
  const only = process.argv.slice(2).map(Number).filter(Boolean);
  browser = await chromium.launch();
  const results = [];
  for (const sc of scenarios) {
    const num = parseInt(sc.name, 10);
    if (only.length && !only.includes(num)) continue;
    console.log('\n> ' + sc.name);
    const s = new Scenario(sc.name);
    const t0 = Date.now();
    try { await sc.fn(s); } catch (e) { s.failures.push('EXCEPTION: ' + (e.stack || e.message).split('\n').slice(0, 4).join(' / ')); console.log('    EXCEPTION: ' + e.message.split('\n')[0]); }
    // page / console errors are a failure in EVERY scenario
    const uniq = Array.from(new Set(s.errors));
    uniq.forEach((e) => { s.failures.push('browser error: ' + e); console.log('    FAIL: browser error: ' + e); });
    for (const c of s.ctxs) await c.close().catch(() => {});
    const ok = s.failures.length === 0;
    results.push({ name: sc.name, ok, checks: s.checks, failures: s.failures });
    console.log((ok ? '  PASS' : '  FAIL') + ' (' + s.checks + ' checks, ' + ((Date.now() - t0) / 1000).toFixed(1) + 's)');
  }
  await browser.close();
  console.log('\n================ SUMMARY ================');
  results.forEach((r) => console.log((r.ok ? 'PASS  ' : 'FAIL  ') + r.name + (r.ok ? '' : '  [' + r.failures.length + ' failure(s)]')));
  const failed = results.filter((r) => !r.ok).length;
  console.log('\n' + (results.length - failed) + '/' + results.length + ' scenarios passed');
  process.exit(failed ? 1 : 0);
})();
