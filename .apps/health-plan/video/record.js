#!/usr/bin/env node
/* Records the REAL app being used for one full week (Mon 9 Nov to Sun 15 Nov 2026), then an impact summary.
   Usage:  node video/record.js en|bm        -> video/out/health-plan-7-days-<lang>.mp4
   Frames come from the Chromium screencast (JPEG) and are piped straight into ffmpeg at 30 fps.
   SPEED=0.5 makes a quick dev run (shorter waits; animations still play in real time). */
'use strict';
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const LANG = (process.argv[2] || 'en').toLowerCase() === 'bm' ? 'bm' : 'en';
const K = parseFloat(process.env.SPEED || '1');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'out');
const FILE = path.join(OUT, `health-plan-7-days-${LANG}.mp4`);
const W = 1080, H = 1920, FPS = 30;
const DATES = ['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms * K));

/* ------------------------------------------------------------------ copy */
const T = {
  en: {
    letters: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    dayNames: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], dayWord: 'DAY',
    intro: { title: 'My Health Plan', sub: '7 days. 5 habits. One simple app.', note: 'Watch one real week: how to use it, and what it adds up to.', tag: 'Healthy Me, Happier Me!' },
    open: ['Open the app', 'Pick your language and tap Start. No sign-up. Your data stays on your phone.'],
    plan: ['Your plan is ready', 'Supplements, water, sleep, brisk walk and fasting, set up from your health plan.'],
    plan2: ['Rest days are built in', 'Walking is Monday to Friday. Fasting skips Saturday. You can edit any of it.'],
    glance: ['Your day at a glance', 'The ring fills as you finish habits. Rating and XP update live.'],
    sup: ['Supplements', 'Tap each one, or tap Take all.'],
    water: ['Water', 'Tap +500 ml each time you drink. Four taps is 2 litres.'],
    sleep: ['Sleep', "Tap the hours you slept last night."],
    walk: ['Brisk walk', 'Finished 30 minutes? One tap.'],
    fast: ['Fasting', 'Tap once on every fasting day.'],
    perfect1: ['A perfect day', 'All five habits done. You earn XP, a rating and your first badge.'],
    days: [
      null,
      ['Same routine, under a minute', 'Supplements, water, sleep, walk and fasting. Tap, tap, done.'],
      ['A busy day? Log what you did', 'Only 15 minutes of walking. Partial effort still counts, and your streak stays alive.'],
      ['Your coach points the way', 'The app suggests the next habit and keeps the tone kind.'],
      ['Last walk of the week', 'Friday is the final brisk walk day in your plan.'],
      ['Saturday is a rest day', 'No walk, no fasting. Rest never breaks your streak.'],
      ['Day 7. Finish strong', 'Fasting is back today. Log it and complete your first full week.']
    ],
    week: ['7 days in a row', 'Your first week is done. Here is what the app shows you now.'],
    progress: ['Check your progress', 'Commitment rating, trends and a weekly review, updated for you.'],
    rewards: ['Streaks, levels and badges', 'Small rewards that make showing up feel good.'],
    impact: {
      kicker: 'YOUR FIRST WEEK', title: '7 days, tracked', commit: 'Commitment', streak: 'Streak', days: 'days', streakNote: 'in a row',
      xp: 'Total XP', level: 'Level', done: 'Habits done', doneNote: 'this week', perfect: 'Perfect days', badges: 'badges earned',
      planVsActual: 'YOUR PLAN VS WHAT YOU DID', aims: 'WHAT THIS PLAN AIMS FOR',
      goals: ['Healthier body', 'Steadier energy', 'Better focus', 'More productivity'],
      fine: 'Sample week shown for illustration. Results differ for everyone. This app tracks habits and is not medical advice.'
    },
    units: { days: 'days', nights: 'nights', min: 'min', L: 'L' },
    outro: { title: 'Healthy Me, Happier Me!', sub: 'Start your 7 days today.', note: 'Open My Health Plan, tap Start, and log your first habit.', tag: 'My Health Plan' }
  },
  bm: {
    letters: ['I', 'S', 'R', 'K', 'J', 'S', 'A'],
    dayNames: ['ISN', 'SEL', 'RAB', 'KHA', 'JUM', 'SAB', 'AHA'], dayWord: 'HARI',
    intro: { title: 'My Health Plan', sub: '7 hari. 5 tabiat. Satu app mudah.', note: 'Lihat satu minggu sebenar: cara guna, dan hasil akhirnya.', tag: 'Healthy Me, Happier Me!' },
    open: ['Buka app', 'Pilih bahasa dan tekan Mula. Tiada pendaftaran. Data kekal di telefon anda.'],
    plan: ['Pelan anda sudah sedia', 'Suplemen, air putih, tidur, brisk walk dan puasa berselang, mengikut rancangan anda.'],
    plan2: ['Hari rehat sudah ada', 'Berjalan Isnin hingga Jumaat. Puasa tidak dibuat pada Sabtu. Semua boleh diubah.'],
    glance: ['Hari anda sekali pandang', 'Bulatan penuh bila tabiat siap. Penilaian dan XP dikemas kini terus.'],
    sup: ['Suplemen', 'Tekan satu per satu, atau tekan Ambil semua.'],
    water: ['Air putih', 'Tekan +500 ml setiap kali minum. Empat tekan sama dengan 2 liter.'],
    sleep: ['Tidur', 'Tekan jam tidur anda semalam.'],
    walk: ['Brisk walk', 'Siap 30 minit? Tekan sekali.'],
    fast: ['Puasa berselang', 'Tekan sekali pada setiap hari berpuasa.'],
    perfect1: ['Hari sempurna', 'Kelima-lima tabiat siap. Anda dapat XP, penilaian dan lencana pertama.'],
    days: [
      null,
      ['Rutin sama, kurang seminit', 'Suplemen, air, tidur, jalan dan puasa. Tekan, tekan, siap.'],
      ['Hari sibuk? Rekod apa yang sempat', 'Berjalan 15 minit sahaja. Usaha separuh tetap dikira, dan rentetan anda kekal.'],
      ['Jurulatih anda tunjuk arah', 'App cadangkan tabiat seterusnya dengan nada yang baik.'],
      ['Jalan terakhir minggu ini', 'Jumaat ialah hari brisk walk terakhir dalam pelan anda.'],
      ['Sabtu ialah hari rehat', 'Tiada jalan, tiada puasa. Rehat tidak memutuskan rentetan.'],
      ['Hari ke-7. Tamatkan dengan kuat', 'Puasa kembali hari ini. Rekod dan siapkan minggu penuh pertama anda.']
    ],
    week: ['7 hari berturut-turut', 'Minggu pertama anda siap. Ini yang app tunjukkan sekarang.'],
    progress: ['Semak kemajuan anda', 'Penilaian komitmen, trend dan ulasan mingguan, dikemas kini untuk anda.'],
    rewards: ['Rentetan, tahap dan lencana', 'Ganjaran kecil yang buat anda seronok datang semula.'],
    impact: {
      kicker: 'MINGGU PERTAMA ANDA', title: '7 hari, direkod', commit: 'Komitmen', streak: 'Rentetan', days: 'hari', streakNote: 'berturut-turut',
      xp: 'Jumlah XP', level: 'Tahap', done: 'Tabiat siap', doneNote: 'minggu ini', perfect: 'Hari sempurna', badges: 'lencana diperoleh',
      planVsActual: 'RANCANGAN VS YANG ANDA BUAT', aims: 'MATLAMAT RANCANGAN INI',
      goals: ['Badan lebih sihat', 'Tenaga lebih stabil', 'Fokus lebih baik', 'Produktiviti meningkat'],
      fine: 'Contoh minggu untuk ilustrasi. Hasil berbeza bagi setiap orang. App ini menjejak tabiat dan bukan nasihat perubatan.'
    },
    units: { days: 'hari', nights: 'malam', min: 'min', L: 'L' },
    outro: { title: 'Healthy Me, Happier Me!', sub: 'Mulakan 7 hari anda hari ini.', note: 'Buka My Health Plan, tekan Mula, dan rekod tabiat pertama anda.', tag: 'My Health Plan' }
  }
}[LANG];

/* ------------------------------------------------------------- static server */
function serve() {
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]);
      const file = path.join(ROOT, rel === '/' ? 'index.html' : rel);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('nf'); }
      res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    }).listen(0, '127.0.0.1', () => resolve({ srv, port: srv.address().port }));
  });
}

/* ------------------------------------------------------------------- main */
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const { srv, port } = await serve();
  const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, serviceWorkers: 'block' });
  await ctx.addInitScript((lang) => {
    window.__HP_TODAY__ = '2026-11-09';
    window.__HP_HOUR__ = 9;
    try { if (!localStorage.getItem('hp.v1')) localStorage.setItem('hp.v1', JSON.stringify({ version: 1, settings: { lang } })); } catch (e) { /* ignore */ }
  }, LANG);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto(`http://127.0.0.1:${port}/video/stage.html`);
  const frame = await (await page.waitForSelector('#app')).contentFrame();
  await frame.waitForFunction(() => window.HP && HP.app && HP.app.booted, null, { timeout: 15000 });

  const st = (fn, ...a) => page.evaluate(([f, args]) => window.stage[f](...args), [fn, a]);
  await st('init', T.letters);
  await st('intro', T.intro);
  await st('outro', T.outro);
  await st('phone', true);
  await st('scene', 'sIntro', true);
  await sleep(900);

  /* ---- screencast -> ffmpeg ---- */
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-vf', 'format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-r', String(FPS), '-movflags', '+faststart', FILE], { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffDone = new Promise((r) => ff.on('close', r));
  let q = Promise.resolve(), t0 = null, written = 0, last = null;
  const writeN = (buf, n) => { q = q.then(async () => { for (let i = 0; i < n; i++) { if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); } }); };
  const cdp = await ctx.newCDPSession(page);
  cdp.on('Page.screencastFrame', (ev) => {
    cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }).catch(() => {});
    const ts = ev.metadata.timestamp, buf = Buffer.from(ev.data, 'base64');
    if (t0 === null) { t0 = ts; last = buf; return; }
    const target = Math.round((ts - t0) * FPS);
    if (target > written) { writeN(last, target - written); written = target; }
    last = buf;
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: W, maxHeight: H, everyNthFrame: 1 });

  /* ---- helpers that drive the real app ---- */
  const fk = (k) => `[data-fk="${k}"]`;
  let slow = true;
  async function tap(sel, o = {}) {
    await frame.waitForSelector(sel, { state: 'attached', timeout: 6000 });
    if (o.scroll !== false) {
      await frame.evaluate((s) => document.querySelector(s).scrollIntoView({ behavior: 'smooth', block: 'center' }), sel);
      await sleep(slow ? 650 : 420);
    }
    const r = await frame.evaluate((s) => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel);
    await st('finger', r.x, r.y);
    await sleep(slow ? 520 : 300);
    await st('press');
    await frame.evaluate((s) => document.querySelector(s).click(), sel);
    await sleep(o.after != null ? o.after : (slow ? 650 : 300));
  }
  const scrollTop = async (y = 0, wait = 800) => { await frame.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'smooth' }), y); await sleep(wait); };
  const say = (a, b) => st('say', a, b || '');
  const goto = (view) => tap(`a.nav-item[data-view="${view}"]`, { scroll: false });
  const dayChip = (i) => st('chip', `${T.dayWord} ${i + 1} · ${T.dayNames[i]}`);
  async function rollTo(i) {
    await frame.evaluate((d) => { window.__HP_TODAY__ = d; document.dispatchEvent(new Event('visibilitychange')); }, DATES[i]);
    await sleep(900);
  }

  /* ---- Scene 1: intro ---- */
  await sleep(3200);
  await st('scene', 'sIntro', false);
  await sleep(900);

  /* ---- Scene 2: open + plan ---- */
  await st('chip', LANG === 'en' ? 'SET UP' : 'PERSEDIAAN');
  await say(...T.open);
  await sleep(2800);
  await tap('.sheet .sheet-actions .btn-primary', { scroll: false, after: 900 });
  await say(...T.plan);
  await goto('plan');
  await sleep(1800);
  await scrollTop(520, 1500);
  await say(...T.plan2);
  await sleep(2200);
  await scrollTop(1100, 1500);
  await sleep(1300);
  await scrollTop(0, 600);
  await goto('today');

  /* ---- Scene 3: day 1, step by step ---- */
  await dayChip(0); await st('mark', 0, 'cur');
  await say(...T.glance);
  await scrollTop(0, 500);
  await sleep(3200);
  await say(...T.sup);
  await tap(fk('sup-omega3'));
  await tap(fk('sup-all'));
  await say(...T.water);
  await tap(fk('water-add-500'));
  for (let n = 0; n < 3; n++) await tap(fk('water-add-500'), { scroll: false });
  await say(...T.sleep);
  await tap(fk('sleep-8'));
  await say(...T.walk);
  await tap(fk('walk-complete'));
  await say(...T.fast);
  await tap(fk('fasting-toggle'));
  await scrollTop(0, 900);
  await say(...T.perfect1);
  await sleep(4200);
  await st('mark', 0, 'done');

  /* ---- Scene 4: days 2 to 7, faster ---- */
  slow = false;
  for (let i = 1; i < 7; i++) {
    await rollTo(i);
    await dayChip(i); await st('mark', i, 'cur');
    await say(...T.days[i]);
    await scrollTop(0, 500);
    await sleep(1100);
    await tap(fk('sup-all'));
    for (let n = 0; n < 4; n++) await tap(fk('water-add-500'), { scroll: n === 0 });
    await tap(fk('sleep-' + (i % 2 ? 8 : 7)));
    if (i <= 4) { // Mon-Fri walk days
      if (i === 2) await tap(fk('walk-add-15')); else await tap(fk('walk-complete'));
    }
    if (i !== 5) await tap(fk('fasting-toggle'));
    if (i === 3) { await scrollTop(0, 800); await sleep(1500); } // show the coach card
    if (i === 5) { // Saturday: show the rest section
      await frame.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));
      await sleep(1700);
    }
    await scrollTop(0, 800);
    await sleep(i === 6 ? 500 : 1500);
    await st('mark', i, i === 2 ? 'partial' : (i === 5 ? 'rest' : 'done'));
  }
  await say(...T.week);
  await sleep(4800); // perfect-day + streak badge celebrations from the app itself
  await st('hideFinger');

  /* ---- Scene 5: progress + rewards ---- */
  slow = true;
  await say(...T.progress);
  await goto('progress');
  await sleep(1800); await scrollTop(700, 1600); await sleep(900); await scrollTop(1500, 1600); await sleep(900);
  await say(...T.rewards);
  await goto('rewards');
  await sleep(1800); await scrollTop(650, 1600); await sleep(1200);
  await st('hideFinger');

  /* ---- Scene 6: impact summary (numbers come from the app itself) ---- */
  const d = await frame.evaluate(() => {
    const day = '2026-11-15', w = HP.scoring.weekScore(day), c = HP.gamify.compute();
    return {
      pct: Math.round(w.pct), rating: w.rating, streak: c.streak.current, xp: c.xp, level: c.level, levelName: HP.tr(c.levelName), levelEmoji: c.levelEmoji,
      doneTotal: w.doneTotal, scheduledTotal: w.scheduledTotal, perfectDays: w.perfectDays, badges: c.badges.filter((b) => b.unlocked).length,
      habits: HP.config.habitIds().map((id) => ({ id, name: HP.config.name(id), color: HP.config.habit(id).color, pct: w.habits[id].pct, done: w.habits[id].done, scheduled: w.habits[id].scheduled, total: w.habits[id].total, target: w.habits[id].target }))
    };
  });
  const U = T.units;
  d.habits.forEach((h) => {
    if (h.id === 'water') h.note = `${+h.total.toFixed(1)} ${U.L}`;
    else if (h.id === 'walk') h.note = `${h.total} / ${h.scheduled * h.target} ${U.min}`;
    else if (h.id === 'sleep') h.note = `${h.done}/${h.scheduled} ${U.nights}`;
    else h.note = `${h.done}/${h.scheduled} ${U.days}`;
  });
  d.labels = T.impact;
  fs.writeFileSync(path.join(OUT, `impact-data-${LANG}.json`), JSON.stringify(d, null, 2));
  await st('impact', d);
  await sleep(11500);
  await st('scene', 'sImpact', false);
  await sleep(700);

  /* ---- Scene 7: outro ---- */
  await st('scene', 'sOutro', true);
  await sleep(4200);

  /* ---- finish ---- */
  await cdp.send('Page.stopScreencast');
  const end = Date.now() / 1000, target = Math.round((end - t0) * FPS);
  if (target > written) writeN(last, target - written);
  await q;
  ff.stdin.end();
  await ffDone;
  await browser.close();
  srv.close();
  console.log(errors.length ? 'APP ERRORS:\n' + errors.join('\n') : 'no app errors');
  console.log('wrote', FILE);
})().catch((e) => { console.error('RECORD FAILED', e); process.exit(1); });
