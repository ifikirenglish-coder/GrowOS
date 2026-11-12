/* plan.js — Weekly Plan view (SPEC §3.11). Interactive version of "Rancangan Penjagaan Kesihatan Saya". Owner: Weekly Plan View Developer. */
(function () {
  'use strict';
  var HP = window.HP;

  /* ---------- strings ---------- */
  HP.i18n.register({
    bm: {
      'plan.title': 'Rancangan Penjagaan Kesihatan Saya',
      'plan.focus': 'Fokus Kesihatan',
      'plan.prevWeek': 'Minggu sebelumnya',
      'plan.nextWeek': 'Minggu seterusnya',
      'plan.thisWeek': 'Minggu ini',
      'plan.weekNav': 'Pilih minggu',
      'plan.weekDone': '{done} / {total} selesai',
      'plan.edit': 'Ubah rancangan',
      'plan.editing': 'Siap',
      'plan.editHint': 'Ketik sel untuk hidupkan atau matikan hari bagi setiap tabiat.',
      'plan.editNote': 'Perubahan terpakai untuk semua minggu.',
      'plan.reset': 'Set semula rancangan asal',
      'plan.resetTitle': 'Set semula rancangan?',
      'plan.resetMsg': 'Hari dan sasaran akan kembali ke rancangan asal. Log anda tidak dipadam.',
      'plan.resetConfirm': 'Set semula',
      'plan.resetToast': 'Rancangan asal dipulihkan.',
      'plan.zeroDays': 'Tiada hari dipilih untuk {habit}. Pilih sekurang-kurangnya satu hari.',
      'plan.targetOf': 'Sasaran {habit}',
      'plan.target': 'Sasaran',
      'plan.scheduled': 'Dijadualkan',
      'plan.on': 'Aktif',
      'plan.cellOpen': 'Buka {day} di Hari Ini',
      'plan.gridLabel': 'Jadual mingguan tabiat kesihatan',
      'plan.legend': 'Petunjuk',
      'plan.summary': 'Ringkasan Sasaran Mingguan',
      'plan.summaryNote': 'Kemajuan minggu ini',
      'plan.goalNone': 'Tiada hari dipilih',
      'plan.t.daily': 'Setiap hari',
      'plan.t.timesWeek': '{n}× seminggu',
      'plan.t.except': '(kecuali {days})',
      'plan.t.water': '≥ {v} Liter sehari',
      'plan.t.waterSome': '≥ {v} Liter, {n}× seminggu',
      'plan.t.sleep': '{v}-9 Jam sehari',
      'plan.t.sleepSome': '{v}-9 Jam, {n}× seminggu',
      'plan.t.sleepMax': '9 Jam sehari',
      'plan.t.walk': '{v} Minit × {n} hari (seminggu)',
      'plan.t.none': 'Tiada hari dipilih',
      'plan.g.water': '≥ {v} Liter / hari',
      'plan.g.sleep': '{v}-9 Jam / hari',
      'plan.g.sleepMax': '9 Jam / hari',
      'plan.g.walk': '{v} Minit × {n} Hari (= {total} Minit / minggu)',
      'plan.u.days': 'hari',
      'plan.u.min': 'min',
      'plan.u.l': 'L',
      'plan.u.h': 'jam',
      'plan.u.times': 'kali',
      'plan.u.nights': 'malam',
      'plan.u.items': 'item',
      'plan.goal1': 'Badan lebih sihat',
      'plan.goal2': 'Tenaga lebih stabil',
      'plan.goal3': 'Fokus lebih baik',
      'plan.goal4': 'Produktiviti meningkat',
      'plan.goalsLabel': 'Matlamat anda'
    },
    en: {
      'plan.title': 'My Health Care Plan',
      'plan.focus': 'Health Focus',
      'plan.prevWeek': 'Previous week',
      'plan.nextWeek': 'Next week',
      'plan.thisWeek': 'This week',
      'plan.weekNav': 'Choose week',
      'plan.weekDone': '{done} / {total} done',
      'plan.edit': 'Edit plan',
      'plan.editing': 'Done',
      'plan.editHint': 'Tap a cell to turn that day on or off for each habit.',
      'plan.editNote': 'Changes apply to all weeks.',
      'plan.reset': 'Reset to default plan',
      'plan.resetTitle': 'Reset your plan?',
      'plan.resetMsg': 'Days and targets go back to the default plan. Your logs are kept.',
      'plan.resetConfirm': 'Reset',
      'plan.resetToast': 'Default plan restored.',
      'plan.zeroDays': 'No days selected for {habit}. Pick at least one day.',
      'plan.targetOf': '{habit} target',
      'plan.target': 'Target',
      'plan.scheduled': 'Scheduled',
      'plan.on': 'On',
      'plan.cellOpen': 'Open {day} in Today',
      'plan.gridLabel': 'Weekly health habit grid',
      'plan.legend': 'Legend',
      'plan.summary': 'Weekly Goals',
      'plan.summaryNote': 'Progress this week',
      'plan.goalNone': 'No days selected',
      'plan.t.daily': 'Every day',
      'plan.t.timesWeek': '{n}× a week',
      'plan.t.except': '(except {days})',
      'plan.t.water': '≥ {v} L a day',
      'plan.t.waterSome': '≥ {v} L, {n}× a week',
      'plan.t.sleep': '{v}-9 hours a day',
      'plan.t.sleepSome': '{v}-9 hours, {n}× a week',
      'plan.t.sleepMax': '9 hours a day',
      'plan.t.walk': '{v} min × {n} days (a week)',
      'plan.t.none': 'No days selected',
      'plan.g.water': '≥ {v} L / day',
      'plan.g.sleep': '{v}-9 hours / day',
      'plan.g.sleepMax': '9 hours / day',
      'plan.g.walk': '{v} min × {n} days (= {total} min / week)',
      'plan.u.days': 'days',
      'plan.u.min': 'min',
      'plan.u.l': 'L',
      'plan.u.h': 'h',
      'plan.u.times': 'times',
      'plan.u.nights': 'nights',
      'plan.u.items': 'items',
      'plan.goal1': 'Healthier body',
      'plan.goal2': 'Steadier energy',
      'plan.goal3': 'Better focus',
      'plan.goal4': 'Higher productivity',
      'plan.goalsLabel': 'Your goals'
    }
  });

  /* ---------- module state ---------- */
  var viewWeek = null;      // Monday string of the week being viewed (null = current week)
  var editMode = false;
  var lastContainer = null; // only used to re-render after local UI actions

  /* ---------- helpers ---------- */
  function t(k, p) { return HP.t(k, p); }
  function el() { return HP.h.apply(null, arguments); }
  function icon(name, size, cls) { return HP.icons.svg(name, { size: size || 24, stroke: 2, class: cls || '' }); }

  function num(v) {
    var dp = Number.isInteger(v) ? 0 : (Number.isInteger(v * 10) ? 1 : 2);
    if (HP.i18n && HP.i18n.number) return HP.i18n.number(v, dp);
    return String(HP.round(v, dp));
  }

  function currentWeek() { return HP.dates.weekStart(HP.dates.today()); }
  function activeWeek() {
    var cur = currentWeek();
    if (!viewWeek || viewWeek > cur) viewWeek = cur;
    return viewWeek;
  }

  function rerender() {
    if (HP.app && HP.app.renderActive) HP.app.renderActive();
    else if (lastContainer) HP.views.plan.render(lastContainer);
  }

  function weekLabel(weekStart) {
    var dates = HP.dates.weekDates(weekStart);
    var a = HP.dates.parse(dates[0]);
    var b = HP.dates.parse(dates[6]);
    var sameMonth = a.getMonth() === b.getMonth();
    var left = HP.config.dayName(0, 'short') + ' ' + a.getDate() + (sameMonth ? '' : ' ' + HP.config.monthName(a.getMonth(), 'short'));
    var right = HP.config.dayName(6, 'short') + ' ' + b.getDate() + ' ' + HP.config.monthName(b.getMonth(), 'short');
    var yearNow = HP.dates.parse(HP.dates.today()).getFullYear();
    if (b.getFullYear() !== yearNow) right += ' ' + b.getFullYear();
    return left + ' - ' + right;
  }

  /* Days the habit is NOT scheduled, as "Sabtu" or "Sabtu, Ahad" (only when 1-2 days are missing). */
  function exceptText(days) {
    var missing = [];
    for (var i = 0; i < 7; i++) if (days.indexOf(i) < 0) missing.push(i);
    if (!days.length || missing.length < 1 || missing.length > 2) return '';
    return t('plan.t.except', { days: missing.map(function (i) { return HP.config.dayName(i, 'full'); }).join(', ') });
  }

  function freqText(days) {
    if (days.length >= 7) return t('plan.t.daily');
    var s = t('plan.t.timesWeek', { n: days.length });
    var ex = exceptText(days);
    return ex ? s + ' ' + ex : s;
  }

  /** Target text under the habit name. Built from the live plan so edits stay accurate. */
  function targetText(id) {
    var days = HP.store.getScheduledDays(id);
    var target = HP.store.getTarget(id);
    var n = days.length;
    if (!n) return t('plan.t.none');
    if (id === 'water') return n >= 7 ? t('plan.t.water', { v: num(target) }) : t('plan.t.waterSome', { v: num(target), n: n });
    if (id === 'sleep') {
      if (target >= 9) return t('plan.t.sleepMax');
      return n >= 7 ? t('plan.t.sleep', { v: num(target) }) : t('plan.t.sleepSome', { v: num(target), n: n });
    }
    if (id === 'walk') return t('plan.t.walk', { v: num(target), n: n });
    return freqText(days);
  }

  /** Shorter goal text for the weekly summary tiles. */
  function goalText(id) {
    var days = HP.store.getScheduledDays(id);
    var target = HP.store.getTarget(id);
    var n = days.length;
    if (!n) return t('plan.goalNone');
    if (id === 'water') {
      var w = t('plan.g.water', { v: num(target) });
      return n >= 7 ? w : w + ', ' + t('plan.t.timesWeek', { n: n });
    }
    if (id === 'sleep') {
      var s = target >= 9 ? t('plan.g.sleepMax') : t('plan.g.sleep', { v: num(target) });
      return n >= 7 ? s : s + ', ' + t('plan.t.timesWeek', { n: n });
    }
    if (id === 'walk') return t('plan.g.walk', { v: num(target), n: n, total: num(target * n) });
    return freqText(days);
  }

  function itemsText(id) {
    var h = HP.config.habit(id);
    if (!h.items) return '';
    return h.items.map(function (i) { return HP.tr(i.name); }).join(', ');
  }

  function unitLabel(u) {
    if (u && typeof u === 'object') return HP.tr(u);
    var map = { day: 'days', days: 'days', hari: 'days', min: 'min', minutes: 'min', minit: 'min', l: 'l', litre: 'l', litres: 'l', liter: 'l',
      h: 'h', hour: 'h', hours: 'h', jam: 'h', time: 'times', times: 'times', night: 'nights', nights: 'nights', item: 'items', items: 'items' };
    var k = map[String(u || 'days').toLowerCase()];
    return k ? t('plan.u.' + k) : String(u);
  }

  /** Weekly goal for a habit with a guard if scoring.weeklyGoal is missing. */
  function weeklyGoal(id, weekStart, ws) {
    try {
      if (HP.scoring && typeof HP.scoring.weeklyGoal === 'function') {
        var g = HP.scoring.weeklyGoal(id, weekStart);
        if (g && typeof g.goal === 'number') return { done: g.done || 0, goal: g.goal, unit: g.unit || 'days' };
      }
    } catch (e) { /* fall through */ }
    var hs = ws && ws.habits && ws.habits[id];
    return { done: hs ? hs.done : 0, goal: hs ? hs.scheduled : HP.store.getScheduledDays(id).length, unit: 'days' };
  }

  function meter(value, color, label) {
    if (HP.charts && HP.charts.meter) return HP.charts.meter({ value: HP.clamp(value, 0, 1), color: color, height: 8, label: label });
    return el('div', { class: 'plan-meter-fallback', role: 'progressbar', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(value * 100) },
      el('span', { style: { width: Math.round(HP.clamp(value, 0, 1) * 100) + '%', background: color } }));
  }

  /* ---------- cell state ---------- */
  function cellState(day, hd) {
    if (!hd.scheduled) return (hd.done || hd.bonus) ? 'bonus' : 'rest';
    if (hd.done) return 'done';
    if (hd.progress > 0) return 'partial';
    if (day.isFuture || day.isToday) return 'upcoming';
    return 'missed';
  }

  function shortValue(habit, hd) {
    if (habit.kind === 'multi') return (Array.isArray(hd.value) ? hd.value.length : 0) + '/' + habit.items.length;
    if (habit.kind === 'amount') return num(Number(hd.value) || 0);
    return '';
  }

  function ringSvg(progress, color) {
    var r = 9, c = 2 * Math.PI * r;
    return el('svg', { class: 'plan-ring', viewBox: '0 0 24 24', width: 24, height: 24, 'aria-hidden': 'true' },
      el('circle', { cx: 12, cy: 12, r: r, fill: 'none', stroke: 'var(--border)', 'stroke-width': 3 }),
      el('circle', { cx: 12, cy: 12, r: r, fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-linecap': 'round',
        'stroke-dasharray': (c * HP.clamp(progress, 0, 1)).toFixed(2) + ' ' + c.toFixed(2), transform: 'rotate(-90 12 12)' }));
  }

  function badge(kind, ic, size) {
    return el('span', { class: 'plan-badge plan-badge-' + kind, 'aria-hidden': 'true' }, icon(ic, size || 14, 'plan-badge-ic'));
  }

  function stateNodes(state, habit, hd) {
    switch (state) {
      case 'done': return [badge('done', 'check', 15)];
      case 'partial': return [ringSvg(hd.progress, habit.color), el('span', { class: 'plan-val num' }, shortValue(habit, hd))];
      case 'missed': return [badge('missed', 'x', 12)];
      case 'upcoming': return [el('span', { class: 'plan-badge plan-badge-upcoming', 'aria-hidden': 'true' })];
      case 'bonus': return [badge('bonus', 'star', 14), el('span', { class: 'plan-val' }, t('status.bonus'))];
      default: return [badge('rest', 'minus', 13), el('span', { class: 'plan-val' }, t('status.rest'))];
    }
  }

  function statusLabel(state) {
    return t('status.' + (state === 'missed' ? 'missed' : state));
  }

  /* ---------- sections ---------- */
  function buildNavigator(week, ws) {
    var cur = currentWeek();
    var isCurrent = week === cur;
    var prev = el('button', {
      type: 'button', class: 'btn btn-ghost btn-icon plan-nav-btn', 'aria-label': t('plan.prevWeek'), dataset: { fk: 'plan-prev' },
      onclick: function () { viewWeek = HP.dates.addDays(week, -7); rerender(); }
    }, icon('chevron-left', 22));
    var next = el('button', {
      type: 'button', class: 'btn btn-ghost btn-icon plan-nav-btn', 'aria-label': t('plan.nextWeek'), dataset: { fk: 'plan-next' },
      disabled: isCurrent,
      onclick: function () { viewWeek = HP.dates.addDays(week, 7); if (viewWeek > cur) viewWeek = cur; rerender(); }
    }, icon('chevron-right', 22));
    var mid = el('div', { class: 'plan-nav-mid', role: 'group', 'aria-label': t('plan.weekNav') },
      el('div', { class: 'plan-nav-label num', 'aria-live': 'polite' }, weekLabel(week)),
      el('div', { class: 'plan-nav-sub small muted' },
        isCurrent ? t('plan.thisWeek') + (ws.scheduledTotal > 0 ? ' · ' : '') : '',
        ws.scheduledTotal > 0 ? t('plan.weekDone', { done: ws.doneTotal, total: ws.scheduledTotal }) : ''));
    var nodes = [prev, mid, next];
    var card = el('div', { class: 'card plan-nav' }, nodes);
    if (!isCurrent) {
      card.appendChild(el('button', {
        type: 'button', class: 'btn btn-sm plan-nav-today', dataset: { fk: 'plan-this' },
        onclick: function () { viewWeek = cur; rerender(); }
      }, t('plan.thisWeek')));
    }
    return card;
  }

  function buildToolbar() {
    var kids = [
      el('button', {
        type: 'button', class: 'btn btn-sm ' + (editMode ? 'btn-primary' : 'btn-ghost'), 'aria-pressed': editMode ? 'true' : 'false', dataset: { fk: 'plan-edit' },
        onclick: function () { editMode = !editMode; rerender(); }
      }, icon(editMode ? 'check' : 'edit', 16), ' ', editMode ? t('plan.editing') : t('plan.edit'))
    ];
    return el('div', { class: 'plan-toolbar row row-between row-wrap' },
      el('h2', { class: 'h3 plan-focus' }, t('plan.focus')), kids);
  }

  function buildEditPanel() {
    return el('div', { class: 'card plan-editpanel stack-sm' },
      el('p', { class: 'small plan-edit-hint' }, t('plan.editHint')),
      el('p', { class: 'small plan-edit-note', role: 'note' }, icon('info', 14), ' ', t('plan.editNote')),
      el('button', {
        type: 'button', class: 'btn btn-sm btn-ghost btn-danger plan-reset', dataset: { fk: 'plan-reset' },
        onclick: function () {
          HP.ui.confirm({
            title: t('plan.resetTitle'), message: t('plan.resetMsg'),
            confirmLabel: t('plan.resetConfirm'), cancelLabel: t('common.cancel'), danger: true
          }).then(function (ok) {
            if (!ok) return;
            HP.store.resetPlan();
            if (HP.ui.toast) HP.ui.toast(t('plan.resetToast'), { type: 'success', icon: 'refresh' });
          });
        }
      }, icon('refresh', 16), ' ', t('plan.reset')));
  }

  function buildDayHead(ws) {
    var cells = ws.days.map(function (d, i) {
      var dn = HP.dates.parse(d.date).getDate();
      return el('div', { class: 'plan-dayhead' + (d.isToday ? ' plan-today' : ''), role: 'columnheader', 'aria-label': HP.config.dayName(i, 'full') + ' ' + dn },
        el('span', { class: 'plan-dayname' }, t('day.short.' + i)),
        el('span', { class: 'plan-daynum num' }, String(dn)));
    });
    return el('div', { class: 'plan-days plan-headrow', role: 'row' }, cells);
  }

  function buildCell(ws, i, habit) {
    var day = ws.days[i];
    var hd = day.habits.filter(function (x) { return x.id === habit.id; })[0] || { scheduled: false, progress: 0, done: false, value: null };
    var fk = 'plan-cell-' + habit.id + '-' + i;
    var dayFull = HP.config.dayName(i, 'full');
    var cls = 'plan-cell' + (day.isToday ? ' plan-today' : '');
    var attrs = { type: 'button', role: 'gridcell', dataset: { fk: fk, date: day.date } };

    if (editMode) {
      var on = HP.store.isScheduled(habit.id, day.date);
      var days = HP.store.getScheduledDays(habit.id);
      attrs.class = cls + ' plan-cell-edit plan-state-' + (on ? 'sched' : 'rest');
      attrs['aria-pressed'] = on ? 'true' : 'false';
      attrs['aria-label'] = HP.config.name(habit.id) + ', ' + dayFull + ': ' + (on ? t('plan.scheduled') : t('status.rest'));
      attrs.onclick = function () {
        var next = on ? days.filter(function (d) { return d !== i; }) : days.concat([i]);
        HP.store.setPlan(habit.id, { days: next.sort(function (a, b) { return a - b; }) });
      };
      return el('button', attrs, on
        ? [badge('sched', 'check', 14), el('span', { class: 'plan-val' }, t('plan.on'))]
        : [badge('rest', 'minus', 13), el('span', { class: 'plan-val' }, t('status.rest'))]);
    }

    var state = cellState(day, hd);
    attrs.class = cls + ' plan-state-' + state;
    var label = HP.config.name(habit.id) + ', ' + dayFull + ': ' + statusLabel(state);
    if (state === 'partial') label += ' (' + shortValue(habit, hd) + ')';
    attrs['aria-label'] = label + '. ' + t('plan.cellOpen', { day: dayFull });
    attrs.onclick = function () {
      HP.app.setDate(day.date);
      HP.app.navigate('today', { date: day.date });
    };
    return el('button', attrs, stateNodes(state, habit, hd));
  }

  function buildHabitRow(ws, habit) {
    var id = habit.id;
    var iconWrap = el('span', { class: 'plan-hicon', style: { '--hc': habit.color }, 'aria-hidden': 'true' }, icon(habit.icon, 20));
    var sub = itemsText(id);
    var head = el('div', { class: 'plan-habit-head' }, iconWrap,
      el('div', { class: 'plan-habit-text' },
        el('div', { class: 'plan-habit-name' }, HP.config.name(id)),
        el('div', { class: 'plan-habit-target small' }, targetText(id)),
        sub ? el('div', { class: 'plan-habit-sub small muted' }, sub) : null));

    var kids = [head];
    if (editMode) {
      var days = HP.store.getScheduledDays(id);
      if (!habit.fixedTarget && habit.targetRange) {
        var r = habit.targetRange;
        var unit = HP.tr(habit.unit);
        var st = HP.ui.stepper({
          value: HP.store.getTarget(id), min: r.min, max: r.max, step: r.step, unit: unit,
          format: function (v) { return num(v) + ' ' + unit; },
          label: t('plan.targetOf', { habit: HP.config.name(id) }),
          onChange: function (v) { HP.store.setPlan(id, { target: v }); }
        });
        st.dataset.fk = 'plan-step-' + id;
        kids.push(el('div', { class: 'plan-tools row row-between' }, el('span', { class: 'small muted' }, t('plan.target')), st));
      }
      if (!days.length) {
        kids.push(el('p', { class: 'plan-warn small', role: 'status', 'aria-live': 'polite' }, icon('info', 14), ' ', t('plan.zeroDays', { habit: HP.config.name(id) })));
      }
    }
    var cells = [];
    for (var i = 0; i < 7; i++) cells.push(buildCell(ws, i, habit));
    kids.push(el('div', { class: 'plan-days', role: 'row' }, cells));
    return el('div', { class: 'plan-habit' + (editMode ? ' plan-habit-editing' : ''), role: 'rowgroup', dataset: { habit: id } }, kids);
  }

  function buildLegend() {
    var items = [['done', 'status.done'], ['partial', 'status.partial'], ['missed', 'status.missed'], ['upcoming', 'status.upcoming'], ['rest', 'status.rest'], ['bonus', 'status.bonus']];
    return el('ul', { class: 'plan-legend small muted', 'aria-label': t('plan.legend') }, items.map(function (it) {
      var sample;
      if (it[0] === 'partial') sample = ringSvg(0.5, 'var(--brand)');
      else if (it[0] === 'upcoming') sample = el('span', { class: 'plan-badge plan-badge-upcoming' });
      else sample = badge(it[0], it[0] === 'done' ? 'check' : it[0] === 'missed' ? 'x' : it[0] === 'bonus' ? 'star' : 'minus', 12);
      return el('li', { class: 'plan-legend-item' }, el('span', { class: 'plan-legend-ic', 'aria-hidden': 'true' }, sample), el('span', null, t(it[1])));
    }));
  }

  function buildGrid(ws) {
    var rows = HP.config.HABITS.map(function (h) { return buildHabitRow(ws, h); });
    return el('div', { class: 'card plan-grid', role: 'grid', 'aria-label': t('plan.gridLabel') },
      buildDayHead(ws), rows, editMode ? null : buildLegend());
  }

  function buildSummary(week, ws) {
    var tiles = HP.config.HABITS.map(function (h) {
      var g = weeklyGoal(h.id, week, ws);
      var frac = g.goal > 0 ? g.done / g.goal : 0;
      var unit = unitLabel(g.unit);
      var xy = num(g.done) + ' / ' + num(g.goal);
      return el('div', { class: 'plan-tile', style: { '--hc': h.color }, role: 'group', 'aria-label': HP.config.name(h.id) },
        el('div', { class: 'plan-tile-head' },
          el('span', { class: 'plan-hicon plan-hicon-sm', 'aria-hidden': 'true' }, icon(h.icon, 16)),
          el('span', { class: 'plan-tile-name' }, HP.config.name(h.id))),
        el('div', { class: 'plan-tile-goal small muted' }, goalText(h.id)),
        meter(frac, h.color, HP.config.name(h.id) + ' ' + xy + ' ' + unit),
        el('div', { class: 'plan-tile-count num' }, el('strong', null, xy), ' ', el('span', { class: 'small muted' }, unit)));
    });
    return el('section', { class: 'plan-summary stack-sm', 'aria-label': t('plan.summary') },
      el('div', { class: 'plan-summary-head' },
        el('h2', { class: 'h3' }, icon('target', 18), ' ', t('plan.summary')),
        el('span', { class: 'small muted' }, t('plan.summaryNote'))),
      el('div', { class: 'plan-tiles' }, tiles));
  }

  function buildFooter() {
    var chips = [1, 2, 3, 4].map(function (n) { return HP.ui.chip(t('plan.goal' + n), { tone: 'brand' }); });
    return el('footer', { class: 'plan-footer card' },
      el('div', { class: 'plan-tagline h3' }, icon('heart', 18), ' ', t('app.tagline')),
      el('div', { class: 'plan-goals', role: 'list', 'aria-label': t('plan.goalsLabel') },
        chips.map(function (c) { c.setAttribute('role', 'listitem'); return c; })));
  }

  /* ---------- view ---------- */
  HP.views.plan = {
    id: 'plan',
    icon: 'calendar',
    titleKey: 'nav.plan',
    render: function (container) {
      lastContainer = container;
      var week = activeWeek();
      var ws = HP.scoring.weekScore(week);
      HP.mount(container, el('div', { class: 'page plan-page stack' },
        el('h1', { class: 'page-title plan-title' }, t('plan.title')),
        buildNavigator(week, ws),
        buildToolbar(),
        editMode ? buildEditPanel() : null,
        buildGrid(ws),
        buildSummary(week, ws),
        buildFooter()));
    }
  };
})();
