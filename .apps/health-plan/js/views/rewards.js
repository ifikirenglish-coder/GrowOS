/* views/rewards.js — Rewards & Achievements view (SPEC 3.11). Owner: Rewards view agent. CSS: css/rewards.css (prefix rewards-). */
(function () {
  'use strict';
  var HP = window.HP;
  var h = HP.h;

  HP.i18n.register({
    bm: {
      'rewards.level': 'Tahap {n}',
      'rewards.xpOf': '{a} / {b} XP',
      'rewards.xpToNext': '{n} XP lagi ke {name}',
      'rewards.maxLevel': 'Anda di tahap tertinggi. Syabas!',
      'rewards.totalXp': 'Jumlah XP',
      'rewards.streakTitle': 'Rentetan',
      'rewards.streakDays': 'hari berturut-turut',
      'rewards.streakNone': 'Belum ada rentetan',
      'rewards.bestStreak': 'Terbaik: {n} hari',
      'rewards.streakRule': 'Satu hari dikira bila anda capai {pct}% rancangan hari itu. Hari rehat tidak pernah memutuskan rentetan anda.',
      'rewards.streakRisk': 'Capai {pct}% rancangan hari ini untuk kekalkan rentetan {n} hari anda.',
      'rewards.streakStart': 'Capai {pct}% rancangan hari ini untuk mulakan rentetan baharu.',
      'rewards.xpToday': 'XP hari ini',
      'rewards.xpWeek': 'XP minggu ini',
      'rewards.howTitle': 'Cara dapat XP',
      'rewards.howHabit': '+{n} XP untuk setiap tabiat yang siap pada hari dirancang',
      'rewards.howPerfect': '+{n} XP bonus untuk hari sempurna',
      'rewards.howRest': '+{n} XP bonus bila anda siapkan tabiat pada hari rehat',
      'rewards.howStreak': 'Sehingga +{n} XP bonus rentetan pada hari sempurna (+{per} untuk setiap hari rentetan)',
      'rewards.ratingTitle': 'Rating Komitmen',
      'rewards.thisWeek': 'Minggu ini',
      'rewards.last30': '30 hari lepas',
      'rewards.grade': 'Gred {g}',
      'rewards.badgesTitle': 'Koleksi lencana',
      'rewards.badgeCount': '{n} / {total} lencana',
      'rewards.locked': 'Terkunci',
      'rewards.unlockedOn': 'Dibuka {date}',
      'rewards.unlocked': 'Sudah dibuka',
      'rewards.new': 'Baharu',
      'rewards.howToEarn': 'Cara mendapatnya',
      'rewards.progress': 'Kemajuan',
      'rewards.nextTitle': 'Hampir dapat',
      'rewards.toGo': '{pct}% lagi',
      'rewards.roadmapTitle': 'Peta tahap',
      'rewards.roadmapAria': 'Senarai tahap',
      'rewards.xpNeeded': '{n} XP',
      'rewards.current': 'Semasa',
      'rewards.reached': 'Dicapai',
      'rewards.unavailable': 'Ganjaran belum tersedia. Cuba muat semula halaman.'
    },
    en: {
      'rewards.level': 'Level {n}',
      'rewards.xpOf': '{a} / {b} XP',
      'rewards.xpToNext': '{n} XP to {name}',
      'rewards.maxLevel': 'You are at the top level. Well done!',
      'rewards.totalXp': 'Total XP',
      'rewards.streakTitle': 'Streak',
      'rewards.streakDays': 'days in a row',
      'rewards.streakNone': 'No streak yet',
      'rewards.bestStreak': 'Best: {n} days',
      'rewards.streakRule': "A day counts when you hit {pct}% of the day's plan. Rest days never break your streak.",
      'rewards.streakRisk': "Hit {pct}% of today's plan to keep your {n}-day streak alive.",
      'rewards.streakStart': "Hit {pct}% of today's plan to start a new streak.",
      'rewards.xpToday': 'XP today',
      'rewards.xpWeek': 'XP this week',
      'rewards.howTitle': 'How to earn XP',
      'rewards.howHabit': '+{n} XP for every habit you finish on a planned day',
      'rewards.howPerfect': '+{n} XP bonus for a perfect day',
      'rewards.howRest': '+{n} XP bonus when you finish a habit on a rest day',
      'rewards.howStreak': 'Up to +{n} XP streak bonus on perfect days (+{per} for each streak day)',
      'rewards.ratingTitle': 'Commitment Rating',
      'rewards.thisWeek': 'This week',
      'rewards.last30': 'Last 30 days',
      'rewards.grade': 'Grade {g}',
      'rewards.badgesTitle': 'Badge collection',
      'rewards.badgeCount': '{n} / {total} badges',
      'rewards.locked': 'Locked',
      'rewards.unlockedOn': 'Unlocked {date}',
      'rewards.unlocked': 'Unlocked',
      'rewards.new': 'New',
      'rewards.howToEarn': 'How to earn it',
      'rewards.progress': 'Progress',
      'rewards.nextTitle': 'Almost there',
      'rewards.toGo': '{pct}% to go',
      'rewards.roadmapTitle': 'Levels roadmap',
      'rewards.roadmapAria': 'List of levels',
      'rewards.xpNeeded': '{n} XP',
      'rewards.current': 'Current',
      'rewards.reached': 'Reached',
      'rewards.unavailable': 'Rewards are not ready yet. Try reloading the page.'
    }
  });

  /* ---------- module state (survives re-renders) ---------- */
  var lastXp = null;      // last XP total shown; null until first paint
  var xpHelpOpen = false; // keep the <details> open across re-renders

  /* ---------- small guarded helpers ---------- */
  function num(n, fallback) { n = Number(n); return isFinite(n) ? n : (fallback || 0); }
  function clamp01(n) { return HP.clamp(num(n, 0), 0, 1); }
  function t(key, params) { return HP.t(key, params); }

  function icon(name, size) {
    try {
      if (HP.icons && HP.icons.svg) return HP.icons.svg(name, { size: size || 20 });
    } catch (e) { /* fall through */ }
    return h('span', { 'aria-hidden': 'true' });
  }

  function meter(value, color, label, height) {
    value = clamp01(value);
    try {
      if (HP.charts && HP.charts.meter) return HP.charts.meter({ value: value, color: color, height: height || 8, label: label });
    } catch (e) { /* fall through */ }
    return h('div', { class: 'rewards-fallback-meter', role: 'progressbar', 'aria-label': label || '', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(value * 100)) },
      h('div', { class: 'rewards-fallback-fill', style: { width: Math.round(value * 100) + '%', background: color || 'var(--brand)' } }));
  }

  function stars(value) {
    try {
      if (HP.charts && HP.charts.stars) return HP.charts.stars(num(value), { size: 20 });
    } catch (e) { /* fall through */ }
    return h('span', { class: 'rewards-stars-fallback' }, num(value) + ' / 5');
  }

  function dateLabel(d) {
    try { return HP.dates.label(d, { style: 'short' }); } catch (e) { return d || ''; }
  }

  function today() {
    try { return HP.dates.today(); } catch (e) { return null; }
  }

  function safe(fn, fallback) {
    try { var r = fn(); return r == null ? fallback : r; } catch (e) { return fallback; }
  }

  /* ---------- sections ---------- */
  function levelCard(g) {
    var need = num(g.levelNeed, 0);
    var inLevel = num(g.levelXp, 0);
    var pct = need > 0 ? clamp01(inLevel / need) : clamp01(g.levelPct);
    var isMax = !g.nextLevelName || need <= 0;
    var totalEl = h('span', { class: 'rewards-total-xp num' }, num(g.xp, 0) + ' XP');

    var from = lastXp == null ? 0 : lastXp;
    var to = num(g.xp, 0);
    var reduce = false;
    try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* ignore */ }
    if (from !== to && !reduce && HP.ui && HP.ui.animateNumber) {
      try { HP.ui.animateNumber(totalEl, to, { from: from, ms: 700, dp: 0, suffix: ' XP' }); } catch (e) { /* keep static text */ }
    }
    lastXp = to;

    return h('section', { class: 'rewards-hero', 'aria-label': t('rewards.level', { n: g.level }) },
      h('div', { class: 'rewards-hero-top' },
        h('div', { class: 'rewards-level-emoji', 'aria-hidden': 'true' }, g.levelEmoji || '🌱'),
        h('div', { class: 'rewards-hero-text' },
          h('div', { class: 'rewards-level-num' }, t('rewards.level', { n: g.level })),
          h('h2', { class: 'rewards-level-name' }, HP.tr(g.levelName)))),
      h('div', { class: 'rewards-hero-xp' },
        h('div', { class: 'rewards-meter' }, meter(isMax ? 1 : pct, 'var(--brand)', t('rewards.xpOf', { a: inLevel, b: need }), 12)),
        h('div', { class: 'rewards-xp-line row row-between' },
          h('span', { class: 'num' }, isMax ? t('rewards.maxLevel') : t('rewards.xpOf', { a: inLevel, b: need })),
          isMax ? null : h('span', { class: 'rewards-xp-next' }, t('rewards.xpToNext', { n: Math.max(0, need - inLevel), name: HP.tr(g.nextLevelName) })))),
      h('div', { class: 'rewards-total row row-between' },
        h('span', { class: 'rewards-total-label' }, t('rewards.totalXp')),
        totalEl));
  }

  function streakCard(g) {
    var streak = g.streak || {};
    var cur = num(streak.current, 0);
    var best = num(streak.best, 0);
    var minPct = num(HP.config.STREAK_MIN_PCT, 70);
    var td = today();
    var ds = td ? safe(function () { return HP.scoring.dayScore(td); }, null) : null;
    var qualified = ds ? (ds.isRest || num(ds.pct) >= minPct) : true;
    var showHint = ds && !qualified;
    var hint = null;
    if (showHint) {
      hint = h('div', { class: 'rewards-risk', role: 'note' },
        icon('info', 20),
        h('span', null, cur > 0 ? t('rewards.streakRisk', { pct: minPct, n: cur }) : t('rewards.streakStart', { pct: minPct })));
    }
    return h('section', { class: 'card rewards-streak' },
      h('div', { class: 'row rewards-streak-main' },
        h('div', { class: 'rewards-flame' + (cur > 0 ? ' is-lit' : ''), 'aria-hidden': 'true' }, '🔥'),
        h('div', { class: 'rewards-streak-text' },
          h('div', { class: 'card-title' }, t('rewards.streakTitle')),
          cur > 0
            ? h('div', { class: 'rewards-streak-line' },
              h('span', { class: 'rewards-streak-num num' }, String(cur)),
              h('span', { class: 'rewards-streak-unit' }, t('rewards.streakDays')))
            : h('div', { class: 'rewards-streak-line' }, h('span', { class: 'rewards-streak-unit' }, t('rewards.streakNone'))),
          h('div', { class: 'rewards-best muted small' }, icon('trophy', 16), h('span', null, t('rewards.bestStreak', { n: best }))))),
      hint,
      h('p', { class: 'rewards-rule muted small' }, t('rewards.streakRule', { pct: minPct })));
  }

  function xpTiles(g) {
    var X = HP.config.XP || {};
    var tile = function (label, value, key) {
      return h('div', { class: 'card rewards-tile', 'data-tile': key },
        h('div', { class: 'rewards-tile-label small muted' }, label),
        h('div', { class: 'rewards-tile-value num' }, '+' + num(value, 0), h('span', { class: 'rewards-tile-unit' }, ' XP')));
    };
    var details = h('details', { class: 'card rewards-how', open: xpHelpOpen ? true : null },
      h('summary', { class: 'rewards-how-summary', 'data-fk': 'rewards-xp-help' },
        h('span', null, t('rewards.howTitle')),
        icon('chevron-down', 20)),
      h('ul', { class: 'rewards-how-list' },
        h('li', null, t('rewards.howHabit', { n: num(X.perHabit) })),
        h('li', null, t('rewards.howPerfect', { n: num(X.perfectDayBonus) })),
        h('li', null, t('rewards.howRest', { n: num(X.bonusOnRestDay) })),
        h('li', null, t('rewards.howStreak', { n: num(X.streakBonusCap), per: num(X.streakBonusPerDay) }))));
    details.addEventListener('toggle', function () { xpHelpOpen = details.open; });
    return [
      h('div', { class: 'grid-2 rewards-tiles' }, tile(t('rewards.xpToday'), g.todayXp, 'today'), tile(t('rewards.xpWeek'), g.weekXp, 'week')),
      details
    ];
  }

  function ratingCol(label, rating, pct) {
    rating = rating || { stars: 0, grade: 'D', key: 'restart', color: '#9AA0A6' };
    return h('div', { class: 'rewards-rate-col' },
      h('div', { class: 'rewards-rate-label small muted' }, label),
      h('div', { class: 'rewards-rate-main' },
        h('div', { class: 'rewards-grade', style: { '--grade': rating.color || '#9AA0A6' }, role: 'img', 'aria-label': t('rewards.grade', { g: rating.grade }) },
          h('span', { 'aria-hidden': 'true' }, rating.grade)),
        h('div', { class: 'rewards-rate-info' },
          stars(rating.stars),
          h('div', { class: 'rewards-rate-text' },
            h('strong', null, t('rating.' + rating.key)),
            pct != null ? h('span', { class: 'muted num' }, ' ' + Math.round(num(pct)) + '%') : null))));
  }

  function ratingCard() {
    var td = today();
    var wk = td ? safe(function () { return HP.scoring.weekScore(td); }, null) : null;
    var mo = td ? safe(function () { return HP.scoring.commitment(30); }, null) : null;
    return h('section', { class: 'card rewards-rating' },
      h('h3', { class: 'card-title' }, t('rewards.ratingTitle')),
      h('div', { class: 'rewards-rate-grid' },
        ratingCol(t('rewards.thisWeek'), wk && wk.rating, wk ? wk.pct : null),
        ratingCol(t('rewards.last30'), mo && mo.rating, mo ? mo.pct : null)));
  }

  function isNewBadge(b) {
    var td = today();
    if (!b.unlocked || !b.unlockedOn || !td) return false;
    var d = safe(function () { return HP.dates.diffDays(b.unlockedOn, td); }, 99);
    return d >= 0 && d <= 2;
  }

  function sortBadges(list) {
    var unlocked = list.filter(function (b) { return b.unlocked; }).sort(function (a, b) {
      return String(b.unlockedOn || '').localeCompare(String(a.unlockedOn || ''));
    });
    var locked = list.filter(function (b) { return !b.unlocked; }).sort(function (a, b) {
      return num(b.progress) - num(a.progress);
    });
    return unlocked.concat(locked);
  }

  function badgeCard(b) {
    var locked = !b.unlocked;
    var isNew = isNewBadge(b);
    var name = HP.tr(b.name);
    var cls = 'rewards-badge ' + (locked ? 'is-locked' : 'is-unlocked') + (isNew ? ' is-new' : '');
    var aria = name + '. ' + (locked ? t('rewards.locked') : t('rewards.unlocked'));
    var visual = h('div', { class: 'rewards-badge-art' },
      h('span', { class: 'rewards-badge-emoji', 'aria-hidden': 'true' }, b.emoji || '🏅'),
      locked ? h('span', { class: 'rewards-lock', 'aria-hidden': 'true' }, icon('lock', 14)) : null,
      isNew ? h('span', { class: 'pill rewards-new-pill' }, t('rewards.new')) : null);
    var foot = locked
      ? [
        h('div', { class: 'rewards-badge-state small' }, icon('lock', 14), h('span', null, t('rewards.locked'))),
        meter(b.progress, 'var(--brand)', name + ' ' + t('rewards.progress'), 6),
        h('div', { class: 'rewards-badge-hint small muted' }, HP.tr(b.hint))
      ]
      : [h('div', { class: 'rewards-badge-state small' }, icon('check-circle', 14),
        h('span', null, b.unlockedOn ? t('rewards.unlockedOn', { date: dateLabel(b.unlockedOn) }) : t('rewards.unlocked')))];
    return h('button', {
      type: 'button', class: cls, 'aria-label': aria, 'data-fk': 'rewards-badge-' + b.id,
      onclick: function () { openBadge(b); }
    }, visual, h('div', { class: 'rewards-badge-name' }, name), h('div', { class: 'rewards-badge-desc small muted' }, HP.tr(b.desc)), foot);
  }

  function openBadge(b) {
    var locked = !b.unlocked;
    var pct = Math.round(clamp01(b.progress) * 100);
    var body = h('div', { class: 'rewards-sheet' },
      h('div', { class: 'rewards-sheet-art' + (locked ? ' is-locked' : '') },
        h('span', { class: 'rewards-sheet-emoji', 'aria-hidden': 'true' }, b.emoji || '🏅'),
        locked ? h('span', { class: 'rewards-lock rewards-lock-lg', 'aria-hidden': 'true' }, icon('lock', 20)) : null),
      h('div', { class: 'rewards-sheet-state' },
        locked ? icon('lock', 16) : icon('check-circle', 16),
        h('span', null, locked ? t('rewards.locked') : (b.unlockedOn ? t('rewards.unlockedOn', { date: dateLabel(b.unlockedOn) }) : t('rewards.unlocked')))),
      h('p', { class: 'rewards-sheet-desc' }, HP.tr(b.desc)),
      h('div', { class: 'rewards-sheet-block' },
        h('div', { class: 'rewards-sheet-h small muted' }, t('rewards.howToEarn')),
        h('p', null, HP.tr(b.hint))),
      locked
        ? h('div', { class: 'rewards-sheet-block' },
          h('div', { class: 'row row-between small' }, h('span', { class: 'muted' }, t('rewards.progress')), h('span', { class: 'num' }, pct + '%')),
          meter(b.progress, 'var(--brand)', t('rewards.progress'), 10))
        : null);
    try {
      HP.ui.sheet({
        title: HP.tr(b.name),
        content: body,
        actions: [{ label: t('common.close'), kind: 'ghost' }]
      });
    } catch (e) { console.error('[rewards] sheet failed', e); }
  }

  function badgeGrid(badges) {
    var sorted = sortBadges(badges);
    var unlockedCount = badges.filter(function (b) { return b.unlocked; }).length;
    return h('section', { class: 'rewards-badges', 'aria-label': t('rewards.badgesTitle') },
      h('div', { class: 'rewards-section-head row row-between' },
        h('h3', { class: 'h3' }, t('rewards.badgesTitle')),
        h('span', { class: 'rewards-count num', 'aria-live': 'polite' }, t('rewards.badgeCount', { n: unlockedCount, total: badges.length }))),
      h('div', { class: 'rewards-grid' }, sorted.map(badgeCard)));
  }

  function nextUp(badges) {
    var next = badges.filter(function (b) { return !b.unlocked; })
      .sort(function (a, b) { return num(b.progress) - num(a.progress); }).slice(0, 2);
    if (!next.length) return null;
    return h('section', { class: 'card rewards-next' },
      h('h3', { class: 'card-title' }, t('rewards.nextTitle')),
      h('div', { class: 'stack-sm' }, next.map(function (b) {
        var left = Math.max(1, Math.round((1 - clamp01(b.progress)) * 100));
        return h('button', { type: 'button', class: 'rewards-next-item', 'data-fk': 'rewards-next-' + b.id, onclick: function () { openBadge(b); } },
          h('span', { class: 'rewards-next-emoji', 'aria-hidden': 'true' }, b.emoji || '🏅'),
          h('span', { class: 'rewards-next-body' },
            h('span', { class: 'rewards-next-top row row-between' },
              h('strong', null, HP.tr(b.name)),
              h('span', { class: 'rewards-togo small num' }, t('rewards.toGo', { pct: left }))),
            h('span', { class: 'rewards-next-hint small muted' }, HP.tr(b.hint)),
            meter(b.progress, 'var(--brand)', HP.tr(b.name) + ' ' + t('rewards.progress'), 6)));
      })));
  }

  function levelXpNeeded(l) {
    var keys = ['xp', 'minXp', 'xpRequired', 'xpNeeded', 'min', 'at', 'threshold', 'need', 'from'];
    for (var i = 0; i < keys.length; i++) if (l && typeof l[keys[i]] === 'number') return l[keys[i]];
    return null;
  }

  function roadmap(g) {
    var levels = (HP.gamify && HP.gamify.levels) || [];
    if (!levels.length) return null;
    var items = levels.map(function (l, i) {
      var n = num(l.level != null ? l.level : (l.n != null ? l.n : i + 1), i + 1);
      var state = n === g.level ? 'current' : (n < g.level ? 'past' : 'future');
      var xp = levelXpNeeded(l);
      return h('li', { class: 'rewards-lvl is-' + state, 'aria-current': state === 'current' ? 'step' : null, 'data-current': state === 'current' ? '1' : null },
        h('div', { class: 'rewards-lvl-emoji', 'aria-hidden': 'true' }, l.emoji || '⭐'),
        h('div', { class: 'rewards-lvl-n small num' }, t('rewards.level', { n: n })),
        h('div', { class: 'rewards-lvl-name' }, HP.tr(l.name)),
        h('div', { class: 'rewards-lvl-xp small muted num' }, xp != null ? t('rewards.xpNeeded', { n: xp }) : ''),
        h('div', { class: 'rewards-lvl-state small' },
          state === 'past' ? [icon('check', 14), h('span', null, t('rewards.reached'))]
            : (state === 'current' ? h('span', null, t('rewards.current')) : [icon('lock', 14), h('span', null, t('rewards.locked'))])));
    });
    var scroller = h('ol', { class: 'rewards-roadmap-scroll', tabindex: '0', 'aria-label': t('rewards.roadmapAria'), 'data-fk': 'rewards-roadmap' }, items);
    var cur = items.filter(function (li) { return li.getAttribute('data-current') === '1'; })[0];
    if (cur) {
      var center = function () {
        if (!scroller.isConnected) return;
        scroller.scrollLeft = Math.max(0, cur.offsetLeft - (scroller.clientWidth - cur.offsetWidth) / 2);
      };
      if (window.requestAnimationFrame) window.requestAnimationFrame(center); else setTimeout(center, 0);
    }
    return h('section', { class: 'rewards-roadmap' },
      h('h3', { class: 'h3 rewards-roadmap-title' }, t('rewards.roadmapTitle')),
      scroller);
  }

  /* ---------- render ---------- */
  function render(container) {
    var g = null;
    try { g = HP.gamify.compute(); } catch (e) { console.error('[rewards] gamify.compute failed', e); }
    if (!g) {
      HP.mount(container, h('div', { class: 'page rewards-page' },
        h('h1', { class: 'page-title' }, t('nav.rewards')),
        HP.ui && HP.ui.emptyState
          ? HP.ui.emptyState({ icon: 'trophy', title: t('nav.rewards'), body: t('rewards.unavailable') })
          : h('p', { class: 'muted' }, t('rewards.unavailable'))));
      return;
    }
    var badges = Array.isArray(g.badges) ? g.badges : [];
    HP.mount(container, h('div', { class: 'page rewards-page stack' },
      h('h1', { class: 'page-title' }, t('nav.rewards')),
      levelCard(g),
      streakCard(g),
      xpTiles(g),
      ratingCard(),
      nextUp(badges),
      badgeGrid(badges),
      roadmap(g)));
  }

  HP.views.rewards = { id: 'rewards', icon: 'trophy', titleKey: 'nav.rewards', render: render };
})();
