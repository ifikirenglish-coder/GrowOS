/* gamify.js — XP, levels, streaks, badges. Owner: Gamification Engineer.
   Everything is DERIVED from the logs (so editing past days stays consistent).
   Only game.seenBadges / game.lastLevel are stored (via HP.store.setGame).
   Reads: HP.scoring (dayScore, isStreakDay), HP.store (logDates, firstLogDate, getGame, setGame), HP.dates, HP.config. */
(function () {
  'use strict';
  var HP = window.HP;

  /* ---------- tuning ---------- */
  var WALK_WEEK_MIN = 150;      // walker badge: minutes in one calendar week
  var IF_WEEK_DAYS = 6;         // IF pro badge: fasting days in one week
  var SUPP_RUN_DAYS = 14;       // supplement streak badge
  var WATER_RUN_DAYS = 7;       // hydration hero
  var SLEEP_RUN_DAYS = 7;       // sleep champion
  var COMEBACK_MISSED = 3;      // comeback: back after >= 3 missed days
  var PERFECT_WEEK_MIN_DAYS = 3;// a perfect week needs at least this many perfect days
  var STREAK_STEPS = [3, 7, 14, 30];
  var XP_STEPS = [500, 1000, 2500];

  /* ---------- levels (cumulative XP thresholds; spans grow) ---------- */
  var LEVEL_DATA = [
    [0, '🌱', 'Pemula', 'Beginner'],
    [100, '🌿', 'Bertunas', 'Sprout'],
    [250, '🚶', 'Bergerak', 'On the Move'],
    [450, '💧', 'Konsisten', 'Steady'],
    [700, '💪', 'Pejuang', 'Fighter'],
    [1000, '🔥', 'Bersemangat', 'On Fire'],
    [1400, '⚡', 'Bertenaga', 'Energised'],
    [1900, '🏅', 'Juara', 'Champion'],
    [2500, '🌟', 'Bintang', 'Star'],
    [3200, '🏆', 'Wira Sihat', 'Health Hero'],
    [4300, '💎', 'Pakar', 'Master'],
    [5600, '👑', 'Legenda', 'Legend']
  ];
  var levels = LEVEL_DATA.map(function (r, i) {
    var next = LEVEL_DATA[i + 1];
    return { level: i + 1, min: r[0], need: next ? next[0] - r[0] : 0, emoji: r[1], name: { bm: r[2], en: r[3] } };
  });

  /* ---------- badges (static text; unlock logic lives in evaluate()) ---------- */
  var MIN_PCT = (HP.config && HP.config.STREAK_MIN_PCT) || 70;
  function B(id, emoji, nameBm, nameEn, descBm, descEn, hintBm, hintEn) {
    return { id: id, emoji: emoji, name: { bm: nameBm, en: nameEn }, desc: { bm: descBm, en: descEn }, hint: { bm: hintBm, en: hintEn } };
  }
  var badgeDefs = [
    B('first_log', '🌱', 'Langkah Pertama', 'First Step',
      'Kamu catat tabiat pertama. Permulaan yang bagus!', 'You logged your first habit. A great start!',
      'Catat satu tabiat untuk bermula.', 'Log one habit to get started.'),
    B('streak_3', '🔥', 'Api Kecil', 'Little Spark',
      'Tiga hari berturut-turut atas landasan.', 'Three days in a row on track.',
      'Capai ' + MIN_PCT + '% atau lebih setiap hari selama 3 hari berturut-turut.', 'Hit ' + MIN_PCT + '% or more each day for 3 days in a row.'),
    B('streak_7', '🔥', 'Seminggu Kuat', 'Strong Week',
      'Tujuh hari berturut-turut. Tabiat mula melekat!', 'Seven days in a row. The habit is sticking!',
      'Capai ' + MIN_PCT + '% atau lebih setiap hari selama 7 hari berturut-turut.', 'Hit ' + MIN_PCT + '% or more each day for 7 days in a row.'),
    B('streak_14', '⚡', 'Dua Minggu Hebat', 'Two Weeks Strong',
      'Empat belas hari tanpa putus. Tenaga kamu menyerlah!', 'Fourteen days without a break. Your energy shows!',
      'Kekalkan rentetan selama 14 hari.', 'Keep your streak going for 14 days.'),
    B('streak_30', '🏆', 'Sebulan Penuh', 'Full Month',
      'Tiga puluh hari berturut-turut. Ini sudah gaya hidup!', 'Thirty days in a row. This is a lifestyle now!',
      'Kekalkan rentetan selama 30 hari.', 'Keep your streak going for 30 days.'),
    B('perfect_day', '⭐', 'Hari Sempurna', 'Perfect Day',
      'Semua tabiat hari itu siap. Mantap!', 'Every habit done in one day. Nice!',
      'Siapkan semua tabiat yang dijadualkan dalam satu hari.', 'Finish every scheduled habit in a single day.'),
    B('perfect_week', '🌟', 'Minggu Sempurna', 'Perfect Week',
      'Setiap hari berjadual dalam seminggu siap sepenuhnya.', 'Every scheduled day of the week fully done.',
      'Jadikan setiap hari berjadual sempurna dalam satu minggu (sekurang-kurangnya 3 hari).', 'Make every scheduled day perfect in one week (at least 3 days).'),
    B('hydration_hero', '💧', 'Wira Air', 'Hydration Hero',
      'Sasaran air dicapai 7 hari berturut-turut.', 'Water goal met 7 days in a row.',
      'Capai sasaran air selama 7 hari berturut-turut.', 'Meet your water goal 7 days in a row.'),
    B('sleep_champion', '😴', 'Juara Tidur', 'Sleep Champion',
      'Tidur cukup 7 malam berturut-turut. Badan berterima kasih!', 'Enough sleep 7 nights in a row. Your body says thanks!',
      'Capai sasaran tidur selama 7 malam berturut-turut.', 'Meet your sleep goal 7 nights in a row.'),
    B('walker', '🚶', 'Si Pejalan', 'Walker',
      'Berjalan pantas 150 minit dalam seminggu.', 'Brisk walking for 150 minutes in one week.',
      'Kumpulkan 150 minit berjalan pantas dalam satu minggu (Isnin hingga Ahad).', 'Collect 150 brisk walking minutes in one week (Mon to Sun).'),
    B('if_pro', '⏱️', 'Pro Puasa', 'IF Pro',
      'Puasa berselang 6 hari dalam seminggu.', 'Intermittent fasting on 6 days in one week.',
      'Tanda puasa berselang siap pada 6 hari dalam satu minggu.', 'Mark fasting done on 6 days in one week.'),
    B('supplement_streak', '💊', 'Rajin Suplemen', 'Supplement Streak',
      'Ketiga-tiga suplemen diambil 14 hari berturut-turut.', 'All three supplements taken 14 days in a row.',
      'Ambil Omega-3, Probiotik dan Vitamin C selama 14 hari berturut-turut.', 'Take Omega-3, Probiotic and Vitamin C for 14 days in a row.'),
    B('comeback', '💪', 'Kembali Bangkit', 'Comeback',
      'Rehat itu biasa. Kamu kembali semula!', 'Breaks happen. You came back!',
      'Mula catat semula selepas rehat 3 hari atau lebih.', 'Start logging again after a break of 3 days or more.'),
    B('level_5', '🥇', 'Tahap 5', 'Level 5',
      'Kamu sampai ke tahap Pejuang.', 'You reached the Fighter level.',
      'Kumpul ' + levels[4].min + ' XP untuk sampai ke tahap 5.', 'Earn ' + levels[4].min + ' XP to reach level 5.'),
    B('xp_500', '✨', '500 XP', '500 XP',
      'Jumlah 500 XP terkumpul.', '500 XP collected.',
      'Kumpul 500 XP.', 'Earn 500 XP.'),
    B('xp_1000', '💫', '1000 XP', '1000 XP',
      'Jumlah 1000 XP terkumpul. Hebat!', '1000 XP collected. Awesome!',
      'Kumpul 1000 XP.', 'Earn 1000 XP.'),
    B('xp_2500', '💎', '2500 XP', '2500 XP',
      'Jumlah 2500 XP terkumpul. Luar biasa!', '2500 XP collected. Outstanding!',
      'Kumpul 2500 XP.', 'Earn 2500 XP.')
  ];

  /* ---------- helpers ---------- */
  function xpCfg() {
    var x = (HP.config && HP.config.XP) || {};
    return {
      perHabit: x.perHabit == null ? 10 : x.perHabit,
      perfect: x.perfectDayBonus == null ? 20 : x.perfectDayBonus,
      rest: x.bonusOnRestDay == null ? 5 : x.bonusOnRestDay,
      perDay: x.streakBonusPerDay == null ? 1 : x.streakBonusPerDay,
      cap: x.streakBonusCap == null ? 10 : x.streakBonusCap
    };
  }

  /** XP of one scored day. streakLen = streak length including this day (only used on perfect days). */
  function dayXp(ds, streakLen) {
    if (!ds || ds.isFuture) return 0;
    var X = xpCfg(), xp = 0, hs = ds.habits || [];
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i];
      if (h.scheduled) { if (h.done) xp += X.perHabit; }
      else if (h.bonus || h.done) xp += X.rest;
    }
    if (ds.perfect) xp += X.perfect + Math.min(X.cap, X.perDay * Math.max(1, streakLen || 1));
    return xp;
  }

  function levelFor(xp) {
    var i = 0;
    while (i + 1 < levels.length && xp >= levels[i + 1].min) i++;
    return levels[i];
  }

  /** consecutive-run tracker. ok: true (+1), false (reset, but not for today), null (neutral). */
  function Run(steps) { this.cur = 0; this.best = 0; this.steps = steps || []; this.on = {}; }
  Run.prototype.step = function (date, ok, isToday) {
    if (ok === null || ok === undefined) return;
    if (ok) {
      this.cur++;
      if (this.cur > this.best) this.best = this.cur;
      for (var i = 0; i < this.steps.length; i++) {
        var s = this.steps[i];
        if (this.cur >= s && !this.on[s]) this.on[s] = date;
      }
    } else if (!isToday) this.cur = 0;
  };

  /** habit entry -> true (done / bonus), false (scheduled but not done), null (rest, nothing done = neutral) */
  function habitRunValue(h) {
    if (!h) return null;
    if (h.done || h.bonus) return true;
    return h.scheduled ? false : null;
  }

  function clamp01(n) { return n < 0 ? 0 : (n > 1 ? 1 : n); }

  /* ---------- the history scan (single pass, O(days)) ---------- */
  function scan() {
    var S = HP.store, SC = HP.scoring, D = HP.dates;
    var today = D.today();
    var first = S.firstLogDate();
    var out = {
      today: today, xp: 0, todayXp: 0, weekXp: 0,
      streak: new Run(STREAK_STEPS), water: new Run([WATER_RUN_DAYS]), sleep: new Run([SLEEP_RUN_DAYS]), supp: new Run([SUPP_RUN_DAYS]),
      on: {}, levelOn: {}, xpOn: {},
      week: { walk: 0, fast: 0, perfect: 0, sched: 0 },
      todayPct: 0, hasLogs: false
    };
    if (!first || first > today) return out;
    out.hasLogs = true;
    out.on.first_log = first;

    var dates = D.range(first, today);
    var wkStart = D.weekStart(today);
    var wk = null, i;
    var cum = 0;

    function finalizeWeek(w, isCurrent) {
      var futureSched = 0;
      if (isCurrent) {
        var wd = D.weekDates(today);
        for (var k = 0; k < wd.length; k++) {
          if (wd[k] > today) { var fd = SC.dayScore(wd[k]); if (fd && !fd.isRest) futureSched++; }
        }
        out.week = { walk: w.walk, fast: w.fast, perfect: w.perfect, sched: w.sched + futureSched };
      }
      if (w.bad === 0 && w.perfect >= PERFECT_WEEK_MIN_DAYS && futureSched === 0 && !out.on.perfect_week) {
        out.on.perfect_week = w.lastPerfect;
      }
    }

    for (i = 0; i < dates.length; i++) {
      var d = dates[i];
      var isToday = d === today;
      var ds = SC.dayScore(d);
      var sd = SC.isStreakDay(d);
      var hv = {};
      var hs = ds.habits || [];
      for (var j = 0; j < hs.length; j++) hv[hs[j].id] = hs[j];

      // new week bucket
      if (wk === null || ds.dow === 0) {
        if (wk) finalizeWeek(wk, false);
        wk = { walk: 0, fast: 0, perfect: 0, sched: 0, bad: 0, lastPerfect: null };
      }

      // streak
      out.streak.step(d, sd === true ? true : (sd === false ? false : null), isToday);

      // XP (streak bonus uses the streak length including this day)
      var dx = dayXp(ds, out.streak.cur);
      cum += dx;
      if (d >= wkStart) out.weekXp += dx;
      if (isToday) { out.todayXp = dx; out.todayPct = ds.isRest ? 0 : (ds.pct || 0); }
      for (var li = 1; li < levels.length; li++) if (cum >= levels[li].min && !out.levelOn[li + 1]) out.levelOn[li + 1] = d;
      for (var xi = 0; xi < XP_STEPS.length; xi++) if (cum >= XP_STEPS[xi] && !out.xpOn[XP_STEPS[xi]]) out.xpOn[XP_STEPS[xi]] = d;

      // perfect day / perfect week bookkeeping
      if (ds.perfect && !out.on.perfect_day) out.on.perfect_day = d;
      if (!ds.isRest) {
        wk.sched++;
        if (ds.perfect) { wk.perfect++; wk.lastPerfect = d; } else wk.bad++;
      }

      // runs
      out.water.step(d, habitRunValue(hv.water), isToday);
      out.sleep.step(d, habitRunValue(hv.sleep), isToday);
      out.supp.step(d, habitRunValue(hv.supplements), isToday);

      // weekly totals
      if (hv.walk) {
        wk.walk += Number(hv.walk.value) || 0;
        if (wk.walk >= WALK_WEEK_MIN && !out.on.walker) out.on.walker = d;
      }
      if (hv.fasting && (hv.fasting.done || hv.fasting.bonus)) {
        wk.fast++;
        if (wk.fast >= IF_WEEK_DAYS && !out.on.if_pro) out.on.if_pro = d;
      }
    }
    if (wk) finalizeWeek(wk, true);
    out.xp = cum;

    // comeback: first log after a gap of >= COMEBACK_MISSED days without any log
    var ld = S.logDates(), prev = null;
    for (i = 0; i < ld.length; i++) {
      if (ld[i] > today) break;
      if (prev !== null && D.diffDays(prev, ld[i]) - 1 >= COMEBACK_MISSED) { out.on.comeback = ld[i]; break; }
      prev = ld[i];
    }
    return out;
  }

  /* ---------- compute() with a small cache (invalidated by store changes) ---------- */
  var cache = null, version = 0;
  function invalidate() { version++; cache = null; }
  HP.bus.on('change', function (e) {
    var t = e && e.type;
    // game / settings / profile changes cannot alter anything derived here
    if (t === 'game' || t === 'settings' || t === 'profile') return;
    invalidate();
  });

  function evaluate(sc, xp, lvl) {
    var unlockedOn = {};
    var progress = {};
    var cur = sc.streak.cur;
    function setP(id, on, p) { unlockedOn[id] = on || null; progress[id] = on ? 1 : Math.min(0.99, clamp01(p)); }

    setP('first_log', sc.on.first_log, 0);
    STREAK_STEPS.forEach(function (n) { setP('streak_' + n, sc.streak.on[n], cur / n); });
    setP('perfect_day', sc.on.perfect_day, sc.todayPct / 100);
    setP('perfect_week', sc.on.perfect_week, sc.week.perfect / Math.max(PERFECT_WEEK_MIN_DAYS, sc.week.sched));
    setP('hydration_hero', sc.water.on[WATER_RUN_DAYS], sc.water.cur / WATER_RUN_DAYS);
    setP('sleep_champion', sc.sleep.on[SLEEP_RUN_DAYS], sc.sleep.cur / SLEEP_RUN_DAYS);
    setP('walker', sc.on.walker, sc.week.walk / WALK_WEEK_MIN);
    setP('if_pro', sc.on.if_pro, sc.week.fast / IF_WEEK_DAYS);
    setP('supplement_streak', sc.supp.on[SUPP_RUN_DAYS], sc.supp.cur / SUPP_RUN_DAYS);
    setP('comeback', sc.on.comeback, 0);
    setP('level_5', sc.levelOn[5], xp / levels[4].min);
    XP_STEPS.forEach(function (n) { setP('xp_' + n, sc.xpOn[n], xp / n); });

    return badgeDefs.map(function (def) {
      return {
        id: def.id, name: def.name, desc: def.desc, emoji: def.emoji, hint: def.hint,
        unlocked: !!unlockedOn[def.id], unlockedOn: unlockedOn[def.id] || null, progress: HP.round(progress[def.id] || 0, 3)
      };
    });
  }

  function build() {
    var sc = scan();
    var xp = sc.xp;
    var lvl = levelFor(xp);
    var next = levels[lvl.level] || null; // levels[] is 0-based, so index lvl.level is the NEXT level
    var xpIn = xp - lvl.min;
    return {
      xp: xp,
      level: lvl.level,
      levelName: lvl.name,
      levelEmoji: lvl.emoji,
      levelXp: xpIn,
      levelNeed: lvl.need || (levels.length > 1 ? levels[levels.length - 1].min - levels[levels.length - 2].min : 0),
      levelPct: next ? clamp01(xpIn / lvl.need) : 1,
      nextLevelName: next ? next.name : null,
      streak: { current: sc.streak.cur, best: sc.streak.best },
      todayXp: sc.todayXp,
      weekXp: sc.weekXp,
      badges: evaluate(sc, xp, lvl)
    };
  }

  /** Returns a fresh top-level copy each call (arrays/objects safe to sort); badge objects themselves are shared: treat as read-only. */
  function compute() {
    var key = HP.dates.today() + '|' + version;
    if (!cache || cache.key !== key) cache = { key: key, value: build() };
    var v = cache.value;
    return {
      xp: v.xp, level: v.level, levelName: v.levelName, levelEmoji: v.levelEmoji, levelXp: v.levelXp, levelNeed: v.levelNeed,
      levelPct: v.levelPct, nextLevelName: v.nextLevelName,
      streak: { current: v.streak.current, best: v.streak.best },
      todayXp: v.todayXp, weekXp: v.weekXp, badges: v.badges.slice()
    };
  }

  /** XP earned on one date (0 for future days). Walks back at most a few days to find the streak length. */
  function xpForDay(date) {
    var S = HP.store, SC = HP.scoring, D = HP.dates;
    var ds = SC.dayScore(date);
    if (!ds || ds.isFuture) return 0;
    var len = 1;
    if (ds.perfect) {
      var X = xpCfg();
      var limit = X.perDay > 0 ? Math.ceil(X.cap / X.perDay) : 1;
      var first = S.firstLogDate();
      for (var i = 1; i < 400 && len < limit; i++) {
        var p = D.addDays(date, -i);
        if (first && p < first) break;
        var sd = SC.isStreakDay(p);
        if (sd === false) break;
        if (sd === true) len++;
      }
    }
    return dayXp(ds, len);
  }

  /* ---------- checkProgress(): diff against stored "seen" markers ---------- */
  var busy = false;
  function checkProgress() {
    var none = { newBadges: [], levelUp: null };
    if (busy) return none; // re-entrancy guard (setGame emits 'change')
    var S = HP.store;
    var c = compute();
    var g = S.getGame() || {};
    var seen = g.seenBadges || {};
    var lastLevel = typeof g.lastLevel === 'number' && g.lastLevel >= 1 ? g.lastLevel : 1;
    var today = HP.dates.today();

    var unlocked = c.badges.filter(function (b) { return b.unlocked; });
    var fresh = unlocked.filter(function (b) { return !seen[b.id]; });
    var leveled = c.level > lastLevel;
    if (!fresh.length && !leveled) return none;

    // First ever run with pre-existing history (demo data, import, upgrade): mark everything seen, stay silent.
    var neverSeen = Object.keys(seen).length === 0 && lastLevel <= 1;
    var hasHistory = (c.xp - c.todayXp) > 0 || unlocked.some(function (b) { return b.unlockedOn && b.unlockedOn < today; });
    var silent = neverSeen && hasHistory;

    var patch = {};
    if (fresh.length) {
      patch.seenBadges = {};
      fresh.forEach(function (b) { patch.seenBadges[b.id] = b.unlockedOn || today; });
    }
    if (leveled) patch.lastLevel = c.level;

    busy = true;
    try { S.setGame(patch); } finally { busy = false; }

    if (silent) return none;
    var result = { newBadges: fresh, levelUp: leveled ? { level: c.level, name: c.levelName, emoji: c.levelEmoji } : null };
    fresh.forEach(function (b) { HP.bus.emit('badge', { badge: b }); });
    if (result.levelUp) HP.bus.emit('levelup', { level: result.levelUp.level, name: result.levelUp.name, emoji: result.levelUp.emoji });
    return result;
  }

  HP.gamify = {
    compute: compute,
    xpForDay: xpForDay,
    checkProgress: checkProgress,
    levels: levels,
    badgeDefs: badgeDefs,
    invalidate: invalidate
  };
})();
