/* today.js — the Today screen (SPEC §3.11). Owner: Today Screen Developer.
   Registers HP.views.today. render() is idempotent; the shell re-renders after every 'change'/'lang'. */
(function () {
  'use strict';
  var HP = window.HP;
  var h = HP.h;

  HP.i18n.register({
    bm: {
      'today.prevDay': 'Hari sebelumnya',
      'today.nextDay': 'Hari seterusnya',
      'today.backToToday': 'Kembali ke hari ini',
      'today.progressAria': 'Kemajuan hari ini: {pct} peratus',
      'today.doneCount': '{done}/{total} selesai',
      'today.xp': '+{xp} XP',
      'today.restShort': 'Rehat',
      'today.restDay': 'Hari rehat',
      'today.fresh': 'Mulakan dengan satu tap',
      'today.nothing': 'Tiada log pada hari ini',
      'today.upNext': 'Seterusnya',
      'today.sup.status': '{n}/{total} diambil',
      'today.sup.takeAll': 'Ambil semua',
      'today.addMl': '+{ml} ml',
      'today.removeMl': 'Kurangkan {ml} ml',
      'today.editValue': 'Ubah nilai tepat: {habit}',
      'today.sleep.fine': 'Laras',
      'today.walk.add': '+{n} min',
      'today.walk.complete': '{n} min selesai',
      'today.walk.remove': 'Kurangkan {n} min',
      'today.fast.cta': 'Saya berpuasa hari ini',
      'today.fast.on': 'Berpuasa',
      'today.fast.off': 'Belum ditanda',
      'today.sheet.hint': 'Sasaran: {target}. Masukkan nilai tepat.',
      'today.clear': 'Kosongkan',
      'today.rest.title': 'Rehat hari ini',
      'today.rest.sub': 'Tidak dalam jadual hari ini. Kalau anda tetap buat, ia dikira bonus XP.',
      'today.rest.bonus': 'Bonus +{xp} XP',
      'today.rest.logged': 'Bonus dilog',
      'today.week.this': 'Minggu ini',
      'today.week.other': 'Minggu dipilih',
      'today.week.summary': '{done}/{total} selesai',
      'today.tip.title': 'Petua: {habit}'
    },
    en: {
      'today.prevDay': 'Previous day',
      'today.nextDay': 'Next day',
      'today.backToToday': 'Back to today',
      'today.progressAria': 'Progress for the day: {pct} percent',
      'today.doneCount': '{done}/{total} done',
      'today.xp': '+{xp} XP',
      'today.restShort': 'Rest',
      'today.restDay': 'Rest day',
      'today.fresh': 'Start with one tap',
      'today.nothing': 'Nothing logged this day',
      'today.upNext': 'Up next',
      'today.sup.status': '{n}/{total} taken',
      'today.sup.takeAll': 'Take all',
      'today.addMl': '+{ml} ml',
      'today.removeMl': 'Remove {ml} ml',
      'today.editValue': 'Edit exact value: {habit}',
      'today.sleep.fine': 'Fine-tune',
      'today.walk.add': '+{n} min',
      'today.walk.complete': '{n} min done',
      'today.walk.remove': 'Remove {n} min',
      'today.fast.cta': 'I fasted today',
      'today.fast.on': 'Fasting logged',
      'today.fast.off': 'Not logged yet',
      'today.sheet.hint': 'Target: {target}. Enter the exact value.',
      'today.clear': 'Clear',
      'today.rest.title': 'Rest today',
      'today.rest.sub': 'Not on the plan today. If you do it anyway, it counts as bonus XP.',
      'today.rest.bonus': 'Bonus +{xp} XP',
      'today.rest.logged': 'Bonus logged',
      'today.week.this': 'This week',
      'today.week.other': 'Selected week',
      'today.week.summary': '{done}/{total} done',
      'today.tip.title': 'Tip: {habit}'
    }
  });

  /* ---------- module state (no DOM refs) ---------- */
  var lastDone = { date: null, ids: {} }; // habits that were done at the previous render
  var pops = {};                          // 'date|id' -> timestamp the habit just became done
  var openRest = {};                      // rest-day habit id -> expanded?
  var restDate = null;
  var POP_MS = 700;

  /* ---------- small helpers ---------- */
  function t(k, p) { return HP.t(k, p); }
  function icon(name, size) { return HP.icons.svg(name, { size: size || 20 }); }
  function safe(fn, fallback) {
    try { return fn(); } catch (e) { console.error('[today]', e); return fallback; }
  }
  function tick() { try { if (HP.ui && HP.ui.haptic) HP.ui.haptic(8); } catch (e) { /* ignore */ } }
  function num(n) {
    n = Math.round(n * 100) / 100;
    var dp = Number.isInteger(n) ? 0 : (Math.abs(n * 10 - Math.round(n * 10)) < 1e-9 ? 1 : 2);
    return HP.i18n.number(n, dp);
  }
  function unit(id) { return HP.config.unitLabel(id); }
  function amountText(id, v) { return num(v) + ' ' + unit(id); }

  function trackDone(date, habits) {
    var now = Date.now(), ids = {};
    habits.forEach(function (x) {
      if (!x.done) return;
      ids[x.id] = true;
      if (lastDone.date === date && !lastDone.ids[x.id]) pops[date + '|' + x.id] = now;
    });
    lastDone = { date: date, ids: ids };
  }
  /** Continues a running pop animation across a quick second render (negative delay). */
  function popStyle(date, id) {
    var key = date + '|' + id, t0 = pops[key];
    if (!t0) return null;
    var el = Date.now() - t0;
    if (el > POP_MS) { delete pops[key]; return null; }
    return { '--pop-delay': (-el) + 'ms' };
  }

  function iconCircle(id) {
    return h('span', { class: 'today-ico', 'aria-hidden': 'true' }, HP.icons.svg(HP.config.habit(id).icon, { size: 22 }));
  }

  /* ---------- 1. date bar ---------- */
  function dateBar(c) {
    var today = HP.dates.today();
    var rel = HP.dates.relativeLabel(c.date);
    var sub = HP.dates.label(c.date, { style: 'long' });
    if (rel === sub || rel === HP.dates.label(c.date, { style: 'short' })) sub = '';
    var isToday = c.date === today;
    return h('div', { class: 'today-datebar-wrap' },
      h('div', { class: 'today-datebar' },
        h('button', {
          class: 'btn btn-icon today-nav', type: 'button', 'aria-label': t('today.prevDay'), dataset: { fk: 'date-prev' },
          onclick: function () { HP.app.setDate(HP.dates.addDays(c.date, -1)); HP.app.renderActive(); }
        }, icon('chevron-left')),
        h('div', { class: 'today-date', 'aria-live': 'polite' },
          h('div', { class: 'today-date-main h2' }, rel),
          sub ? h('div', { class: 'today-date-sub small muted' }, sub) : null),
        h('button', {
          class: 'btn btn-icon today-nav', type: 'button', 'aria-label': t('today.nextDay'), dataset: { fk: 'date-next' }, disabled: isToday,
          onclick: function () {
            var next = HP.dates.addDays(c.date, 1);
            if (HP.dates.isFuture(next)) return;
            HP.app.setDate(next); HP.app.renderActive();
          }
        }, icon('chevron-right'))),
      isToday ? null : h('button', {
        class: 'today-back', type: 'button', dataset: { fk: 'date-today' },
        onclick: function () { HP.app.setDate(today); HP.app.renderActive(); }
      }, icon('refresh', 16), t('today.backToToday')));
  }

  /* ---------- 2. summary card ---------- */
  function focusHabit(id) {
    var date = HP.app.getDate();
    if (!HP.store.isScheduled(id, date) && !openRest[id]) { openRest[id] = true; HP.app.renderActive(); }
    var el = HP.$('.today [data-habit="' + id + '"]');
    if (!el) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    var scope = el.querySelector('.today-body') || el;
    var first = scope.querySelector('button:not([disabled])');
    if (first) { try { first.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    el.classList.add('today-flash');
    setTimeout(function () { el.classList.remove('today-flash'); }, 1400);
  }

  function summaryCard(c) {
    var d = c.day;
    var sched = c.sched;
    var rate = HP.scoring.rate(d.pct);
    var rings = d.isRest
      ? [{ value: 1, color: '#22B573', label: t('today.restDay') }]
      : sched.map(function (x) { return { value: x.progress, color: HP.config.habit(x.id).color, label: HP.config.name(x.id) }; });
    var center = d.isRest
      ? h('div', { class: 'today-ring-center' },
          h('span', { class: 'today-ring-emoji', 'aria-hidden': 'true' }, '😌'),
          h('span', { class: 'today-ring-sub' }, t('today.restShort')))
      : h('div', { class: 'today-ring-center' },
          h('span', { class: 'today-ring-pct num' }, String(d.pct)),
          h('span', { class: 'today-ring-sign' }, '%'));
    var ring = h('div', { class: 'today-ring', role: 'img', 'aria-label': t('today.progressAria', { pct: d.pct }) },
      HP.charts.multiRing({ rings: rings, size: 160, stroke: 8, gap: 3, center: center }));

    var rating;
    if (d.isRest) {
      rating = h('div', { class: 'today-rating-text' }, t('today.restDay'));
    } else if (!d.logged) {
      rating = h('div', { class: 'today-rating' },
        HP.charts.stars(0, { size: 18 }),
        h('span', { class: 'today-rating-text' }, t(d.isToday ? 'today.fresh' : 'today.nothing')));
    } else {
      rating = h('div', { class: 'today-rating' },
        HP.charts.stars(rate.stars, { size: 18 }),
        h('span', { class: 'today-grade', style: { background: rate.color }, 'aria-hidden': 'true' }, rate.grade),
        h('span', { class: 'today-rating-text' }, t('rating.' + rate.key)));
    }

    var xp = safe(function () { return HP.gamify.xpForDay(c.date); }, 0);
    var meta = h('div', { class: 'today-meta' },
      rating,
      h('div', { class: 'today-count num' }, t('today.doneCount', { done: d.doneCount, total: d.scheduledCount })),
      HP.ui.chip(t('today.xp', { xp: xp }), { tone: 'brand', icon: 'zap' }));

    var coach = safe(function () { return HP.insights.coachMessage(c.date); }, null);
    var next = safe(function () { return HP.insights.nextAction(c.date); }, null);
    var coachNode = coach ? h('div', { class: 'today-coach', 'aria-live': 'polite' },
      h('span', { class: 'today-coach-emoji', 'aria-hidden': 'true' }, coach.emoji),
      h('div', { class: 'today-coach-text' },
        h('div', { class: 'today-coach-title' }, coach.title),
        h('p', { class: 'today-coach-body' }, coach.body))) : null;
    var nextNode = next ? h('button', {
      class: 'today-next', type: 'button', dataset: { fk: 'next-action' },
      onclick: function () { focusHabit(next.habitId); }
    }, h('span', { class: 'today-next-label' }, t('today.upNext')), h('span', { class: 'today-next-text' }, next.text), icon('chevron-right', 18)) : null;

    return h('section', { class: 'card today-summary', dataset: { tone: coach ? coach.tone : 'calm' } },
      h('div', { class: 'today-summary-top' }, ring, meta),
      coachNode, nextNode);
  }

  /* ---------- value sheet (exact entry) ---------- */
  function openValueSheet(date, id, val, target) {
    var cfg = HP.config.habit(id), cur = val;
    var stepper = HP.ui.stepper({
      value: val, min: cfg.min, max: cfg.max, step: cfg.step, unit: unit(id), format: num,
      label: HP.config.name(id), onChange: function (v) { cur = v; }
    });
    var content = h('div', { class: 'today-sheet' },
      h('p', { class: 'muted small today-sheet-hint' }, t('today.sheet.hint', { target: amountText(id, target) })),
      stepper);
    HP.ui.sheet({
      title: HP.config.name(id),
      content: content,
      actions: [
        { label: t('common.save'), kind: 'primary', onClick: function () { HP.store.setValue(date, id, cur); } },
        { label: t('today.clear'), kind: 'ghost', onClick: function () { HP.store.clearHabit(date, id); } }
      ]
    });
  }

  /* ---------- 3. kind-specific bodies ---------- */
  function actionBtn(label, fk, onClick, extra) {
    return h('button', { class: 'btn today-act ' + (extra || ''), type: 'button', dataset: { fk: fk }, onclick: function () { tick(); onClick(); } }, label);
  }
  function undoBtn(fk, ariaLabel, disabled, onClick) {
    return h('button', {
      class: 'btn btn-icon today-undo', type: 'button', 'aria-label': ariaLabel, disabled: disabled, dataset: { fk: fk },
      onclick: function () { tick(); onClick(); }
    }, icon('minus'));
  }
  function meterFor(id, progress, text) {
    return HP.charts.meter({ value: progress, color: HP.config.habit(id).color, height: 10, label: HP.config.name(id) + ': ' + text });
  }

  function supplementsBody(c, v) {
    var cfg = HP.config.habit('supplements');
    var chips = cfg.items.map(function (it) {
      var on = v.indexOf(it.id) >= 0;
      return h('button', {
        class: 'today-sup' + (on ? ' is-on' : ''), type: 'button', 'aria-pressed': on ? 'true' : 'false',
        dataset: { fk: 'sup-' + it.id },
        onclick: function () { tick(); HP.store.toggleItem(c.date, 'supplements', it.id); }
      },
        h('span', { class: 'today-sup-emoji', 'aria-hidden': 'true' }, it.emoji),
        h('span', { class: 'today-sup-name' }, HP.tr(it.name)),
        h('span', { class: 'today-sup-check', 'aria-hidden': 'true' }, on ? icon('check', 14) : null));
    });
    var all = v.length >= cfg.items.length;
    return h('div', { class: 'today-body stack-sm' },
      h('div', { class: 'today-sups' }, chips),
      all ? null : h('button', {
        class: 'btn btn-sm today-takeall', type: 'button', dataset: { fk: 'sup-all' },
        onclick: function () { tick(); HP.store.completeHabit(c.date, 'supplements'); }
      }, icon('check-circle', 18), t('today.sup.takeAll')));
  }

  function waterBody(c, hab, target) {
    var cfg = HP.config.habit('water'), val = hab.value;
    var adds = cfg.quick.map(function (q, i) {
      var ml = Math.round(q * 1000);
      return actionBtn(t('today.addMl', { ml: ml }), 'water-add-' + ml, function () { HP.store.addAmount(c.date, 'water', q); }, i === 0 ? 'btn-primary' : 'today-act-alt');
    });
    var q0 = cfg.quick[0];
    return h('div', { class: 'today-body stack-sm' },
      meterFor('water', hab.progress, amountText('water', val) + ' / ' + amountText('water', target)),
      h('div', { class: 'today-actions' },
        undoBtn('water-undo', t('today.removeMl', { ml: Math.round(q0 * 1000) }), val <= 0, function () { HP.store.addAmount(c.date, 'water', -q0); }),
        adds));
  }

  function sleepBody(c, hab, target) {
    var cfg = HP.config.habit('sleep'), val = hab.value;
    var chips = cfg.presets.map(function (p) {
      var on = val === p;
      return h('button', {
        class: 'today-pchip num' + (on ? ' is-on' : ''), type: 'button', 'aria-pressed': on ? 'true' : 'false', dataset: { fk: 'sleep-' + p },
        onclick: function () {
          tick();
          if (on) HP.store.clearHabit(c.date, 'sleep'); else HP.store.setValue(c.date, 'sleep', p);
        }
      }, amountText('sleep', p));
    });
    return h('div', { class: 'today-body stack-sm' },
      meterFor('sleep', hab.progress, amountText('sleep', val) + ' / ' + amountText('sleep', target)),
      h('div', { class: 'today-chips' }, chips),
      h('button', {
        class: 'btn btn-sm btn-ghost today-fine', type: 'button', dataset: { fk: 'sleep-fine' },
        onclick: function () { openValueSheet(c.date, 'sleep', val, target); }
      }, icon('edit', 16), t('today.sleep.fine')));
  }

  function walkBody(c, hab, target) {
    var cfg = HP.config.habit('walk'), val = hab.value;
    var adds = cfg.quick.map(function (m) {
      return actionBtn(t('today.walk.add', { n: m }), 'walk-add-' + m, function () { HP.store.addAmount(c.date, 'walk', m); }, 'today-act-alt');
    });
    return h('div', { class: 'today-body stack-sm' },
      meterFor('walk', hab.progress, amountText('walk', val) + ' / ' + amountText('walk', target)),
      h('div', { class: 'today-actions' },
        undoBtn('walk-undo', t('today.walk.remove', { n: 5 }), val <= 0, function () { HP.store.addAmount(c.date, 'walk', -5); }),
        adds),
      hab.done ? null : h('button', {
        class: 'btn btn-primary btn-block today-complete', type: 'button', dataset: { fk: 'walk-complete' },
        onclick: function () { tick(); HP.store.completeHabit(c.date, 'walk'); }
      }, icon('check-circle', 18), t('today.walk.complete', { n: target })));
  }

  function fastingBody(c, hab) {
    var on = !!hab.value;
    return h('div', { class: 'today-body' },
      h('button', {
        class: 'today-fast' + (on ? ' is-on' : ''), type: 'button', role: 'switch', 'aria-checked': on ? 'true' : 'false',
        dataset: { fk: 'fasting-toggle' },
        onclick: function () { tick(); HP.store.toggle(c.date, 'fasting'); }
      },
        h('span', { class: 'today-fast-label' }, t('today.fast.cta')),
        h('span', { class: 'today-switch', 'aria-hidden': 'true' }, h('span', { class: 'today-switch-thumb' }))));
  }

  function bodyFor(c, hab, target) {
    switch (hab.id) {
      case 'supplements': return supplementsBody(c, hab.value || []);
      case 'water': return waterBody(c, hab, target);
      case 'sleep': return sleepBody(c, hab, target);
      case 'walk': return walkBody(c, hab, target);
      case 'fasting': return fastingBody(c, hab);
      default: return null;
    }
  }

  /** Header status: plain text for multi/toggle, tappable value (opens sheet) for amounts. */
  function statusNode(c, hab, target) {
    var cfg = HP.config.habit(hab.id);
    if (cfg.kind === 'multi') {
      return h('div', { class: 'today-status num', 'aria-live': 'polite' }, t('today.sup.status', { n: (hab.value || []).length, total: cfg.items.length }));
    }
    if (cfg.kind === 'toggle') {
      return h('div', { class: 'today-status', 'aria-live': 'polite' }, t(hab.value ? 'today.fast.on' : 'today.fast.off'));
    }
    return h('button', {
      class: 'today-val num', type: 'button', dataset: { fk: hab.id + '-edit' },
      'aria-label': t('today.editValue', { habit: HP.config.name(hab.id) }) + ' (' + amountText(hab.id, hab.value) + ' / ' + amountText(hab.id, target) + ')',
      onclick: function () { openValueSheet(c.date, hab.id, hab.value, target); }
    }, num(hab.value) + ' / ' + amountText(hab.id, target), icon('edit', 14));
  }

  function tile(c, hab) {
    var id = hab.id, cfg = HP.config.habit(id), target = HP.store.getTarget(id);
    var pop = hab.done ? popStyle(c.date, id) : null;
    var style = { '--hc': cfg.color };
    if (pop) style['--pop-delay'] = pop['--pop-delay'];
    return h('article', {
      class: 'card today-tile' + (hab.done ? ' is-done' : '') + (pop ? ' today-pop' : ''),
      dataset: { habit: id }, style: style
    },
      h('div', { class: 'today-head' },
        iconCircle(id),
        h('div', { class: 'today-head-text' },
          h('h3', { class: 'today-name' }, HP.config.name(id)),
          statusNode(c, hab, target)),
        h('span', { class: 'today-check' + (hab.done ? ' is-on' : '') },
          hab.done ? [icon('check', 18), h('span', { class: 'sr-only' }, t('status.done'))] : null)),
      bodyFor(c, hab, target));
  }

  /* ---------- 4. rest section ---------- */
  function restItem(c, hab) {
    var id = hab.id, cfg = HP.config.habit(id), open = !!openRest[id], target = HP.store.getTarget(id);
    var xp = HP.config.XP.bonusOnRestDay;
    var hint = hab.done ? t('today.rest.logged') : t('today.rest.bonus', { xp: xp });
    var head = h('button', {
      class: 'today-rest-head', type: 'button', 'aria-expanded': open ? 'true' : 'false', dataset: { fk: 'rest-' + id },
      onclick: function () { openRest[id] = !openRest[id]; HP.app.renderActive(); }
    },
      iconCircle(id),
      h('span', { class: 'today-rest-text' },
        h('span', { class: 'today-name' }, HP.config.name(id)),
        h('span', { class: 'today-rest-hint small' }, hint)),
      hab.done ? h('span', { class: 'today-check is-on' }, icon('check', 16)) : null,
      h('span', { class: 'today-rest-chev', 'aria-hidden': 'true' }, icon(open ? 'chevron-up' : 'chevron-down', 18)));
    return h('div', {
      class: 'today-rest-item' + (open ? ' is-open' : '') + (hab.done ? ' is-done' : ''),
      dataset: { habit: id }, style: { '--hc': cfg.color }
    }, head, open ? bodyFor(c, hab, target) : null);
  }

  function restSection(c) {
    if (!c.rest.length) return null;
    return h('section', { class: 'today-rest', 'aria-labelledby': 'today-rest-title' },
      h('div', { class: 'today-section-head' },
        h('h2', { class: 'h3', id: 'today-rest-title' }, t('today.rest.title')),
        h('p', { class: 'small muted' }, t('today.rest.sub'))),
      h('div', { class: 'today-rest-list' }, c.rest.map(function (x) { return restItem(c, x); })));
  }

  /* ---------- 5. week strip ---------- */
  function weekState(d) {
    if (d.isFuture) return 'future';
    if (d.isRest) return 'rest';
    if (d.perfect) return 'done';
    if (d.isToday && !d.logged) return 'future';
    return d.pct > 0 ? 'partial' : 'miss';
  }
  function weekCard(c) {
    var ws = HP.scoring.weekScore(c.date);
    var same = HP.dates.weekStart(c.date) === HP.dates.weekStart(HP.dates.today());
    var days = ws.days.map(function (d) {
      return {
        label: HP.config.dayName(d.dow, 'short'), state: weekState(d), today: d.isToday,
        onClick: d.isFuture ? undefined : function () { HP.app.setDate(d.date); HP.app.renderActive(); }
      };
    });
    return h('section', { class: 'card today-week' },
      h('div', { class: 'row row-between today-week-head' },
        h('h2', { class: 'card-title today-week-title' }, t(same ? 'today.week.this' : 'today.week.other')),
        h('span', { class: 'small muted num' }, t('today.week.summary', { done: ws.doneTotal, total: ws.scheduledTotal }))),
      HP.charts.weekStrip({ days: days }));
  }

  /* ---------- 6. tip ---------- */
  function tipCard() {
    var ids = HP.config.habitIds();
    var id = ids[Math.abs(HP.dates.diffDays('2024-01-01', HP.dates.today())) % ids.length];
    var tip = safe(function () { return HP.insights.habitTip(id); }, '');
    if (!tip) return null;
    return h('aside', { class: 'today-tip', style: { '--hc': HP.config.habit(id).color } },
      iconCircle(id),
      h('div', { class: 'today-tip-text' },
        h('div', { class: 'today-tip-title small' }, t('today.tip.title', { habit: HP.config.name(id) })),
        h('p', { class: 'today-tip-body' }, tip)));
  }

  /* ---------- render ---------- */
  function render(container) {
    var today = HP.dates.today();
    var date = HP.app.getDate() || today;
    if (HP.dates.isFuture(date)) { date = today; HP.app.setDate(today); }
    if (restDate !== date) { openRest = {}; restDate = date; }

    var day = HP.scoring.dayScore(date);
    var byId = {};
    day.habits.forEach(function (x) { byId[x.id] = x; });
    var ordered = HP.config.habitIds().map(function (id) { return byId[id]; }).filter(Boolean);
    trackDone(date, ordered);

    var c = {
      date: date, day: day,
      sched: ordered.filter(function (x) { return x.scheduled; }),
      rest: ordered.filter(function (x) { return !x.scheduled; })
    };

    HP.mount(container, h('div', { class: 'page stack today' },
      dateBar(c),
      summaryCard(c),
      c.sched.length ? h('div', { class: 'today-tiles' }, c.sched.map(function (x) { return tile(c, x); })) : null,
      restSection(c),
      weekCard(c),
      tipCard()));
  }

  HP.views.today = { id: 'today', icon: 'home', titleKey: 'nav.today', render: render };
})();
