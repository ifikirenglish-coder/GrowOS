/* progress.js — "How committed am I?" dashboard. Owner: Progress Dashboard Developer.
   Registers HP.views.progress. CSS lives in css/progress.css (prefix `progress-`). */
(function () {
  'use strict';
  var HP = window.HP;

  /* ---------- i18n ---------- */
  HP.i18n.register({
    bm: {
      'progress.rangeLabel': 'Julat masa',
      'progress.range7': '7 hari',
      'progress.range30': '30 hari',
      'progress.range90': '90 hari',
      'progress.hero.title': 'Komitmen saya',
      'progress.lastN': '{n} hari terakhir',
      'progress.commitment': 'komitmen',
      'progress.gradeAria': 'Gred {grade}',
      'progress.stat.perfect': 'Hari sempurna',
      'progress.stat.active': 'Hari aktif',
      'progress.stat.streak': 'Rentetan semasa',
      'progress.stat.best': 'Rentetan terbaik',
      'progress.trend.up': '▲ +{pct}%',
      'progress.trend.down': '▼ −{pct}%',
      'progress.trend.steady': '● Stabil',
      'progress.trend.vs': 'berbanding {n} hari sebelumnya',
      'progress.noRangeData': 'Belum ada data untuk tempoh ini. Log sesuatu hari ini untuk bermula.',
      'progress.week.title': 'Minggu ini',
      'progress.week.pct': 'komitmen minggu ini',
      'progress.week.focus': 'Fokus seterusnya',
      'progress.week.go': 'Buka Hari Ini',
      'progress.week.empty': 'Minggu baru bermula. Log hari ini untuk lihat ulasan anda.',
      'progress.habits.title': 'Konsistensi tabiat',
      'progress.habits.hint': 'Mulakan dengan yang teratas. Langkah kecil pun kira.',
      'progress.habits.best': 'Paling konsisten',
      'progress.habits.days': '{done}/{total} hari',
      'progress.trendCard.title': 'Trend harian',
      'progress.trendCard.sub': 'Peratus komitmen setiap hari',
      'progress.trendCard.few': 'Log beberapa hari lagi untuk lihat trend anda.',
      'progress.heat.title': 'Kalendar 12 minggu',
      'progress.heat.hint': 'Ketik satu hari untuk melihat butirannya.',
      'progress.heat.less': 'Kurang',
      'progress.heat.more': 'Lebih',
      'progress.nums.title': 'Angka tabiat',
      'progress.nums.water': 'Purata air',
      'progress.nums.waterSub': 'setiap hari dilog',
      'progress.nums.sleep': 'Purata tidur',
      'progress.nums.sleepSub': 'setiap hari dilog',
      'progress.nums.walk': 'Jumlah berjalan',
      'progress.nums.walkSub': 'dalam tempoh ini',
      'progress.nums.fasting': 'Hari puasa',
      'progress.nums.fastingSub': 'daripada {n} hari dijadual',
      'progress.nums.supp': 'Suplemen lengkap',
      'progress.nums.suppSub': 'daripada {n} hari dijadual',
      'progress.empty.title': 'Belum ada data lagi',
      'progress.empty.body': 'Log tabiat pertama anda hari ini dan kemajuan akan muncul di sini.',
      'progress.empty.cta': 'Pergi ke Hari Ini'
    },
    en: {
      'progress.rangeLabel': 'Time range',
      'progress.range7': '7 days',
      'progress.range30': '30 days',
      'progress.range90': '90 days',
      'progress.hero.title': 'My commitment',
      'progress.lastN': 'Last {n} days',
      'progress.commitment': 'commitment',
      'progress.gradeAria': 'Grade {grade}',
      'progress.stat.perfect': 'Perfect days',
      'progress.stat.active': 'Active days',
      'progress.stat.streak': 'Current streak',
      'progress.stat.best': 'Best streak',
      'progress.trend.up': '▲ +{pct}%',
      'progress.trend.down': '▼ −{pct}%',
      'progress.trend.steady': '● Steady',
      'progress.trend.vs': 'vs the previous {n} days',
      'progress.noRangeData': 'No data for this period yet. Log something today to get started.',
      'progress.week.title': 'This week',
      'progress.week.pct': 'commitment this week',
      'progress.week.focus': 'Next focus',
      'progress.week.go': 'Open Today',
      'progress.week.empty': 'A new week has just begun. Log today to see your review.',
      'progress.habits.title': 'Habit consistency',
      'progress.habits.hint': 'Start with the top one. Small steps count.',
      'progress.habits.best': 'Most consistent',
      'progress.habits.days': '{done}/{total} days',
      'progress.trendCard.title': 'Daily trend',
      'progress.trendCard.sub': 'Commitment percent for each day',
      'progress.trendCard.few': 'Log a few more days to see your trend.',
      'progress.heat.title': '12-week calendar',
      'progress.heat.hint': 'Tap a day to see its details.',
      'progress.heat.less': 'Less',
      'progress.heat.more': 'More',
      'progress.nums.title': 'Habit numbers',
      'progress.nums.water': 'Avg water',
      'progress.nums.waterSub': 'per logged day',
      'progress.nums.sleep': 'Avg sleep',
      'progress.nums.sleepSub': 'per logged day',
      'progress.nums.walk': 'Total walking',
      'progress.nums.walkSub': 'in this period',
      'progress.nums.fasting': 'Fasting days',
      'progress.nums.fastingSub': 'of {n} scheduled',
      'progress.nums.supp': 'Supplements complete',
      'progress.nums.suppSub': 'of {n} scheduled days',
      'progress.empty.title': 'No data yet',
      'progress.empty.body': 'Log your first habit today and your progress will show up here.',
      'progress.empty.cta': 'Go to Today'
    }
  });

  /* ---------- module state ---------- */
  var range = 30; // 7 | 30 | 90, remembered across renders
  var RANGES = [7, 30, 90];

  /* ---------- helpers ---------- */
  function safe(fn, label) {
    try { return fn(); } catch (e) { console.error('[progress] ' + label + ' failed', e); return null; }
  }
  function isNum(n) { return typeof n === 'number' && isFinite(n); }

  /** Pick black-ish or white text for a given hex background (best contrast). */
  function readableOn(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
    if (!m) return '#151515';
    var n = parseInt(m[1], 16);
    var ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) {
      v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    var L = 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
    var vsWhite = 1.05 / (L + 0.05);
    var vsInk = (L + 0.05) / (0.0075 + 0.05); // #151515 luminance ~ 0.0075
    return vsWhite >= vsInk ? '#fff' : '#151515';
  }

  function card(title, children, cls, sub) {
    return HP.h('section', { class: 'card progress-card ' + (cls || '') },
      title ? HP.h('h2', { class: 'card-title' }, title) : null,
      sub ? HP.h('p', { class: 'small muted progress-sub' }, sub) : null,
      children);
  }

  function goToday(date) {
    if (date && HP.app && HP.app.setDate) HP.app.setDate(date);
    if (HP.app && HP.app.navigate) HP.app.navigate('today', date ? { date: date } : undefined);
  }

  function rerender(container) {
    if (HP.app && HP.app.renderActive) HP.app.renderActive();
    else HP.views.progress.render(container);
  }

  function num(n, dp) { return HP.i18n.number(n, dp == null ? 0 : dp); }

  /* ---------- data ---------- */
  function trendDelta(cur, days, today) {
    if (!cur || !cur.scheduledTotal || !isNum(cur.pct)) return null;
    var prev = HP.scoring.commitment(days, HP.dates.addDays(today, -days));
    if (!prev || !prev.scheduledTotal || !prev.activeDays || !isNum(prev.pct)) return null;
    return Math.round(cur.pct - prev.pct);
  }

  /** Real numbers from raw logs over the range. Never invents: null when there is no data. */
  function habitNumbers(today, days) {
    var dates = HP.dates.range(HP.dates.addDays(today, -(days - 1)), today);
    var water = [], sleep = [], walk = [], supp = [];
    var walkTotal = 0, fastDays = 0, fastSched = 0, suppFull = 0, suppSched = 0;
    var targetSupp = HP.store.getTarget('supplements');
    dates.forEach(function (d) {
      var log = HP.store.getLog(d);
      if (log.water > 0) water.push(log.water);
      if (log.sleep > 0) sleep.push(log.sleep);
      if (log.walk > 0) { walk.push(log.walk); walkTotal += log.walk; }
      var sc = (log.supplements || []).length;
      if (sc > 0) supp.push(sc);
      if (HP.store.isScheduled('fasting', d)) fastSched++;
      if (HP.store.isScheduled('supplements', d)) suppSched++;
      if (log.fasting) fastDays++;
      if (HP.config.isDone('supplements', log.supplements, targetSupp)) suppFull++;
    });
    function avg(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
    return {
      water: { avg: avg(water), series: water },
      sleep: { avg: avg(sleep), series: sleep },
      walk: { total: walk.length ? walkTotal : null, series: walk },
      fasting: { days: fastDays, sched: fastSched, any: fastDays > 0 },
      supp: { days: suppFull, sched: suppSched, any: supp.length > 0, series: supp }
    };
  }

  /* ---------- sections ---------- */
  function buildRange(container) {
    var seg = HP.ui.segmented({
      label: HP.t('progress.rangeLabel'),
      value: range,
      options: RANGES.map(function (r) { return { value: r, label: HP.t('progress.range' + r) }; }),
      onChange: function (v) {
        var n = Number(v);
        if (RANGES.indexOf(n) < 0 || n === range) return;
        range = n;
        rerender(container);
      }
    });
    HP.$$('button, [role="radio"]', seg).forEach(function (b, i) {
      if (!b.dataset.fk) b.dataset.fk = 'progress-range-' + i;
    });
    return HP.h('div', { class: 'progress-range' }, seg);
  }

  function statTile(icon, value, label) {
    return HP.h('div', { class: 'progress-stat' },
      HP.h('span', { class: 'progress-stat-ico', 'aria-hidden': 'true' }, HP.icons.svg(icon, { size: 18 })),
      HP.h('span', { class: 'progress-stat-num num' }, String(value)),
      HP.h('span', { class: 'progress-stat-label small muted' }, label));
  }

  function buildHero(cur, delta, streak) {
    var rating = cur.rating || HP.scoring.rate(cur.pct || 0);
    var hasData = !!cur.scheduledTotal;
    var pct = hasData ? Math.round(cur.pct) : null;

    var ring = HP.charts.ring({
      value: hasData ? HP.clamp(cur.pct / 100, 0, 1) : 0,
      size: 132, stroke: 13, color: rating.color,
      label: hasData ? pct + '%' : '–',
      sublabel: HP.t('progress.commitment')
    });

    var side = HP.h('div', { class: 'progress-hero-side' },
      HP.h('div', { class: 'progress-hero-range small muted' }, HP.t('progress.lastN', { n: range })),
      HasStars(rating, hasData),
      hasData ? HP.h('div', { class: 'progress-grade-row' },
        HP.h('span', {
          class: 'progress-grade',
          style: { background: rating.color, color: readableOn(rating.color) },
          role: 'img',
          'aria-label': HP.t('progress.gradeAria', { grade: rating.grade })
        }, rating.grade),
        HP.h('span', { class: 'progress-grade-label' }, HP.t('rating.' + rating.key))) : null,
      delta == null ? null : HP.h('div', { class: 'progress-trend-row' },
        HP.ui.chip(delta > 1 ? HP.t('progress.trend.up', { pct: delta })
          : (delta < -1 ? HP.t('progress.trend.down', { pct: Math.abs(delta) }) : HP.t('progress.trend.steady')),
          { tone: delta > 1 ? 'ok' : (delta < -1 ? 'warn' : 'neutral') }),
        HP.h('span', { class: 'small muted' }, HP.t('progress.trend.vs', { n: range }))));

    var stats = HP.h('div', { class: 'progress-stats' },
      statTile('star', cur.perfectDays || 0, HP.t('progress.stat.perfect')),
      statTile('calendar', cur.activeDays || 0, HP.t('progress.stat.active')),
      statTile('flame', streak ? streak.current : 0, HP.t('progress.stat.streak')),
      statTile('trophy', streak ? streak.best : 0, HP.t('progress.stat.best')));

    return card(HP.t('progress.hero.title'), [
      HP.h('div', { class: 'progress-hero-top' }, HP.h('div', { class: 'progress-ring' }, ring), side),
      hasData ? null : HP.h('p', { class: 'small muted progress-note', 'aria-live': 'polite' }, HP.t('progress.noRangeData')),
      stats
    ], 'progress-hero');
  }

  function HasStars(rating, hasData) {
    return hasData ? HP.h('div', { class: 'progress-stars' }, HP.charts.stars(rating.stars, { size: 20 })) : null;
  }

  function dayState(d) {
    if (d.isFuture) return 'future';
    if (d.isRest) return 'rest';
    if (d.perfect) return 'done';
    if (d.pct > 0) return 'partial';
    if (d.isToday && !d.logged) return 'future';
    return 'miss';
  }

  function buildWeek(today) {
    var week = HP.scoring.weekScore(today);
    var review = HP.insights.weeklyReview(today) || {};
    var hasData = week.scheduledTotal > 0 && week.daysElapsed > 0;

    var strip = HP.charts.weekStrip({
      days: week.days.map(function (d) {
        var st = dayState(d);
        return {
          label: HP.config.dayName(d.dow, 'short'),
          state: st,
          today: !!d.isToday,
          onClick: d.isFuture ? undefined : function () { goToday(d.date); }
        };
      })
    });

    var highlights = (review.highlights || []).slice(0, 4);
    var focus = review.focus;

    return card(HP.t('progress.week.title'), [
      HP.h('div', { class: 'progress-week-top' },
        HP.h('div', { class: 'progress-week-strip' }, strip),
        HP.h('div', { class: 'progress-week-pct' },
          HP.h('span', { class: 'progress-week-num num' }, hasData ? Math.round(week.pct) + '%' : '–'),
          HP.h('span', { class: 'small muted' }, HP.t('progress.week.pct')))),
      hasData && review.headline
        ? HP.h('p', { class: 'progress-week-headline h3' }, review.headline)
        : HP.h('p', { class: 'small muted' }, review.headline || HP.t('progress.week.empty')),
      highlights.length ? HP.h('ul', { class: 'progress-bullets' },
        highlights.map(function (t) { return HP.h('li', null, t); })) : null,
      focus && focus.text ? HP.h('div', { class: 'progress-focus' },
        HP.h('div', { class: 'progress-focus-text' },
          HP.h('span', { class: 'progress-focus-label small muted' }, HP.t('progress.week.focus')),
          HP.h('span', null, focus.text)),
        HP.h('button', {
          type: 'button', class: 'btn btn-primary btn-sm', 'data-fk': 'progress-focus-go',
          onclick: function () { goToday(); }
        }, HP.t('progress.week.go'))) : null
    ], 'progress-week');
  }

  function buildHabits(cur) {
    var rows = [];
    HP.config.habitIds().forEach(function (id) {
      var s = cur.habits && cur.habits[id];
      if (!s || !s.scheduled) return;
      var pct = isNum(s.pct) ? s.pct : Math.round((s.done / s.scheduled) * 100);
      rows.push({ id: id, done: s.done, scheduled: s.scheduled, pct: HP.clamp(Math.round(pct), 0, 100) });
    });
    if (!rows.length) return null;

    var best = null;
    if (rows.length > 1) {
      rows.forEach(function (r) { if (r.pct > 0 && (!best || r.pct > best.pct)) best = r; });
    }
    rows.sort(function (a, b) { return a.pct - b.pct; }); // weakest first (stable for ties)

    var list = HP.h('ul', { class: 'progress-habit-list' }, rows.map(function (r) {
      var h = HP.config.habit(r.id);
      return HP.h('li', { class: 'progress-habit' + (best === r ? ' is-best' : ''), style: { '--hc': h.color } },
        HP.h('span', { class: 'progress-habit-ico', 'aria-hidden': 'true' }, HP.icons.svg(h.icon, { size: 20 })),
        HP.h('div', { class: 'progress-habit-main' },
          HP.h('div', { class: 'progress-habit-head' },
            HP.h('span', { class: 'progress-habit-name' }, HP.config.name(r.id)),
            best === r ? HP.h('span', { class: 'progress-best-tag' },
              HP.icons.svg('sparkles', { size: 12 }), HP.t('progress.habits.best')) : null),
          HP.charts.meter({ value: r.pct / 100, color: h.color, height: 8, label: HP.config.name(r.id) + ' ' + r.pct + '%' }),
          HP.h('div', { class: 'progress-habit-foot small muted' },
            HP.t('progress.habits.days', { done: r.done, total: r.scheduled }))),
        HP.h('span', { class: 'progress-habit-pct num' }, r.pct + '%'));
    }));

    return card(HP.t('progress.habits.title'), [
      list,
      rows.length > 1 ? HP.h('p', { class: 'small muted progress-hint' }, HP.t('progress.habits.hint')) : null
    ], 'progress-habits');
  }

  function buildTrend(cur, today) {
    var pts = (cur.trend || []).filter(function (p) {
      if (!p || p.isRest || p.isFuture || !isNum(p.pct)) return false;
      if (p.date === today && !HP.store.hasLog(today)) return false; // morning must not look like a dip
      return true;
    });
    var body;
    if (pts.length < 2) {
      body = HP.h('p', { class: 'small muted progress-note' }, HP.t('progress.trendCard.few'));
    } else if (range === 7) {
      body = HP.charts.bars({
        data: pts.map(function (p) {
          return {
            label: HP.config.dayName(HP.dates.dow(p.date), 'short'),
            value: Math.round(p.pct),
            highlight: p.date === today
          };
        }),
        max: 100, height: 140, showValues: true
      });
    } else {
      body = HP.charts.line({
        points: pts.map(function (p) { return { label: HP.dates.label(p.date, { style: 'short' }), value: Math.round(p.pct) }; }),
        min: 0, max: 100, height: 140, area: true, showDots: pts.length <= 14
      });
    }
    return card(HP.t('progress.trendCard.title'), HP.h('div', { class: 'progress-chart' }, body),
      'progress-trend', HP.t('progress.trendCard.sub'));
  }

  function buildHeatmap(today) {
    var start = HP.dates.weekStart(HP.dates.addDays(today, -77)); // 12 full weeks incl. current
    var end = HP.dates.addDays(start, 83);
    var first = HP.store.firstLogDate();
    var days = HP.dates.range(start, end).map(function (d) {
      if (HP.dates.isFuture(d)) return { date: d, value: null, state: 'future' };
      if (first && d < first) return { date: d, value: null }; // before tracking began: neutral, not a miss
      var ds = HP.scoring.dayScore(d);
      if (ds.isRest) return { date: d, value: null, state: 'rest' };
      if (ds.isToday && !ds.logged) return { date: d, value: null };
      return { date: d, value: HP.clamp(ds.pct / 100, 0, 1) };
    });
    var heat = HP.charts.heatmap({
      days: days,
      cell: 16, gap: 3, weekStartsMonday: true,
      onSelect: function (date) { goToday(date); }
    });
    var legend = HP.h('div', { class: 'progress-legend small muted', 'aria-hidden': 'true' },
      HP.h('span', null, HP.t('progress.heat.less')),
      [0, 1, 2, 3, 4].map(function (l) { return HP.h('i', { class: 'progress-legend-sw', 'data-level': String(l) }); }),
      HP.h('span', null, HP.t('progress.heat.more')));
    return card(HP.t('progress.heat.title'), [
      HP.h('div', { class: 'progress-heat' }, heat),
      HP.h('div', { class: 'progress-heat-foot' },
        HP.h('span', { class: 'small muted' }, HP.t('progress.heat.hint')), legend)
    ], 'progress-heatcard');
  }

  function numTile(habitId, label, valueText, sub, series) {
    var h = HP.config.habit(habitId);
    var has = valueText != null;
    return HP.h('div', { class: 'progress-num', style: { '--hc': h.color } },
      HP.h('div', { class: 'progress-num-head' },
        HP.h('span', { class: 'progress-num-ico', 'aria-hidden': 'true' }, HP.icons.svg(h.icon, { size: 16 })),
        HP.h('span', { class: 'small muted' }, label)),
      HP.h('div', { class: 'progress-num-value num' }, has ? valueText : '–'),
      HP.h('div', { class: 'progress-num-foot' },
        HP.h('span', { class: 'small muted' }, has ? sub : ''),
        has && series && series.length >= 3
          ? HP.h('span', { class: 'progress-spark', 'aria-hidden': 'true' },
            HP.charts.sparkline(series.slice(-30), { width: 64, height: 22, color: h.color }))
          : null));
  }

  function buildNumbers(today) {
    var n = habitNumbers(today, range);
    var unitL = HP.config.unitLabel('water');
    var unitH = HP.config.unitLabel('sleep');
    var unitM = HP.config.unitLabel('walk');
    var tiles = [
      numTile('water', HP.t('progress.nums.water'),
        n.water.avg == null ? null : num(n.water.avg, 1) + ' ' + unitL, HP.t('progress.nums.waterSub'), n.water.series),
      numTile('sleep', HP.t('progress.nums.sleep'),
        n.sleep.avg == null ? null : num(n.sleep.avg, 1) + ' ' + unitH, HP.t('progress.nums.sleepSub'), n.sleep.series),
      numTile('walk', HP.t('progress.nums.walk'),
        n.walk.total == null ? null : num(n.walk.total, 0) + ' ' + unitM, HP.t('progress.nums.walkSub'), n.walk.series),
      numTile('fasting', HP.t('progress.nums.fasting'),
        n.fasting.any ? String(n.fasting.days) : null, HP.t('progress.nums.fastingSub', { n: n.fasting.sched }), null),
      numTile('supplements', HP.t('progress.nums.supp'),
        n.supp.any ? String(n.supp.days) : null, HP.t('progress.nums.suppSub', { n: n.supp.sched }), n.supp.series)
    ];
    return card(HP.t('progress.nums.title'), HP.h('div', { class: 'progress-nums' }, tiles),
      'progress-numscard', HP.t('progress.lastN', { n: range }));
  }

  /* ---------- view ---------- */
  function build(container) {
    var today = HP.dates.today();
    var title = HP.h('h1', { class: 'page-title' }, HP.t('nav.progress'));

    if (!HP.store.logDates().length) {
      return HP.h('div', { class: 'page progress' }, title,
        HP.ui.emptyState({
          icon: 'chart-bar',
          title: HP.t('progress.empty.title'),
          body: HP.t('progress.empty.body'),
          action: { label: HP.t('progress.empty.cta'), onClick: function () { goToday(); } }
        }));
    }

    var cur = safe(function () { return HP.scoring.commitment(range, today); }, 'commitment');
    var delta = cur ? safe(function () { return trendDelta(cur, range, today); }, 'trendDelta') : null;
    var streak = safe(function () { return HP.gamify.compute().streak; }, 'streak');

    var sections = [
      buildRange(container),
      cur ? safe(function () { return buildHero(cur, delta, streak); }, 'hero') : null,
      safe(function () { return buildWeek(today); }, 'week'),
      cur ? safe(function () { return buildHabits(cur); }, 'habits') : null,
      cur ? safe(function () { return buildTrend(cur, today); }, 'trend') : null,
      safe(function () { return buildHeatmap(today); }, 'heatmap'),
      safe(function () { return buildNumbers(today); }, 'numbers')
    ];
    return HP.h('div', { class: 'page progress' }, title, HP.h('div', { class: 'stack' }, sections));
  }

  HP.views.progress = {
    id: 'progress',
    icon: 'chart-bar',
    titleKey: 'nav.progress',
    render: function (container) {
      HP.mount(container, build(container));
    }
  };
})();
