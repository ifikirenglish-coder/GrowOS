/* scoring.js — HP.scoring: pure, read-only scoring layer over HP.store + HP.dates. Owner: Scoring & Rating.
   No state, no memoization (a day is ~5 cheap lookups), so results can never go stale. */
(function () {
  'use strict';
  var HP = window.HP;
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  /* ---------- small safe helpers ---------- */
  function validDate(d) { return typeof d === 'string' && DATE_RE.test(d); }
  function today() { return HP.dates.today(); }
  function num(n) { n = typeof n === 'number' ? n : parseFloat(n); return isFinite(n) ? n : 0; }
  function r2(n) { return Math.round(n * 100) / 100; }
  function habitIds() { return HP.config.habitIds(); }

  function safeLog(date) {
    var log = null;
    try { log = HP.store.getLog(date); } catch (e) { log = null; }
    return log && typeof log === 'object' ? log : {};
  }
  function safeTarget(id) {
    var t = null;
    try { t = HP.store.getTarget(id); } catch (e) { t = null; }
    t = num(t);
    if (t > 0) return t;
    var h = HP.config.habit(id);
    return h ? h.defaultTarget : 1;
  }
  function safeScheduled(id, date) {
    try { return !!HP.store.isScheduled(id, date); } catch (e) { return false; }
  }
  function safeHasLog(date) {
    try { return !!HP.store.hasLog(date); } catch (e) { return false; }
  }

  /* ---------- rating ---------- */
  function rate(pct) {
    var p = HP.clamp(num(pct), 0, 100);
    var grades = (HP.config.GRADES || []).slice().sort(function (a, b) { return b.min - a.min; });
    var g = grades[grades.length - 1] || { grade: 'D', key: 'restart', color: '#9AA0A6' };
    for (var i = 0; i < grades.length; i++) { if (p >= grades[i].min) { g = grades[i]; break; } }
    return {
      stars: HP.clamp(Math.round(p / 20 * 2) / 2, 0, 5),
      grade: g.grade,
      key: g.key,
      color: g.color
    };
  }

  /* ---------- the day ---------- */
  function dayScore(date) {
    if (!validDate(date)) date = today();
    var log = safeLog(date);
    var isFuture = !!HP.dates.isFuture(date);
    var isToday = !!HP.dates.isToday(date);
    var habits = [];
    var scheduledCount = 0, doneCount = 0, sum = 0;

    habitIds().forEach(function (id) {
      var scheduled = safeScheduled(id, date);
      var value = log[id];
      if (value === undefined) value = HP.config.emptyValue(id);
      var progress = HP.clamp(num(HP.config.progressOf(id, value, safeTarget(id))), 0, 1);
      var done = progress >= 0.9999;
      if (scheduled) {
        scheduledCount++;
        sum += progress;
        if (done) doneCount++;
      }
      habits.push({ id: id, scheduled: scheduled, value: value, progress: progress, done: done, bonus: !scheduled && done });
    });

    var isRest = scheduledCount === 0;
    return {
      date: date,
      dow: HP.dates.dow(date),
      isToday: isToday,
      isFuture: isFuture,
      logged: safeHasLog(date),
      habits: habits,
      scheduledCount: scheduledCount,
      doneCount: doneCount,
      pct: isRest ? 100 : Math.round(sum / scheduledCount * 100),
      perfect: scheduledCount > 0 && doneCount === scheduledCount,
      isRest: isRest
    };
  }

  /** First day that can count against the user: earlier of first log and profile.createdAt (else today). */
  function startDate() {
    var cands = [];
    try { var f = HP.store.firstLogDate(); if (validDate(f)) cands.push(f); } catch (e) { /* ignore */ }
    try {
      var p = HP.store.getProfile();
      if (p && validDate(p.createdAt)) cands.push(p.createdAt);
    } catch (e) { /* ignore */ }
    if (!cands.length) return today();
    return cands.sort()[0]; // YYYY-MM-DD sorts chronologically
  }

  /** Does this day count toward a pct? Not future, not a rest day, not before the start, and today only once started. */
  function counts(ds, start) {
    if (ds.isFuture || ds.isRest) return false;
    if (ds.date < start) return false;
    if (ds.isToday && !ds.logged) return false;
    return true;
  }

  /** Aggregate a list of dayScores (with the counting rule applied). */
  function aggregate(list, start) {
    var out = { scheduledTotal: 0, doneTotal: 0, perfectDays: 0, counted: 0, pctSum: 0, habits: {} };
    habitIds().forEach(function (id) { out.habits[id] = { scheduled: 0, done: 0, prog: 0, val: 0 }; });
    list.forEach(function (ds) {
      if (!counts(ds, start)) return;
      out.counted++;
      out.pctSum += ds.pct;
      out.scheduledTotal += ds.scheduledCount;
      out.doneTotal += ds.doneCount;
      if (ds.perfect) out.perfectDays++;
      ds.habits.forEach(function (h) {
        if (!h.scheduled) return;
        var a = out.habits[h.id];
        if (!a) return;
        a.scheduled++;
        a.prog += h.progress;
        if (h.done) a.done++;
        var hc = HP.config.habit(h.id);
        if (hc && hc.kind === 'multi') a.val += Array.isArray(h.value) ? h.value.length : 0;
        else if (hc && hc.kind === 'amount') a.val += num(h.value);
      });
    });
    out.pct = out.counted ? Math.round(out.pctSum / out.counted) : 0;
    return out;
  }

  function habitSummary(agg, withAvg) {
    var res = {};
    Object.keys(agg.habits).forEach(function (id) {
      var a = agg.habits[id];
      var o = { scheduled: a.scheduled, done: a.done, pct: a.scheduled ? Math.round(a.prog / a.scheduled * 100) : 0 };
      var hc = HP.config.habit(id);
      if (withAvg && hc && hc.kind !== 'toggle') o.avg = a.scheduled ? r2(a.val / a.scheduled) : 0;
      res[id] = o;
    });
    return res;
  }

  /* ---------- the week ---------- */
  function weekScore(anyDate) {
    if (!validDate(anyDate)) anyDate = today();
    var dates = HP.dates.weekDates(anyDate);
    var days = dates.map(dayScore);
    var start = startDate();
    var agg = aggregate(days, start);
    var habits = habitSummary(agg, false);

    // total: everything actually logged this week (bonus included), never future days.
    habitIds().forEach(function (id) {
      var hc = HP.config.habit(id);
      var target = safeTarget(id);
      var total = 0, goalDays = 0;
      days.forEach(function (ds) {
        var h = null;
        for (var i = 0; i < ds.habits.length; i++) if (ds.habits[i].id === id) { h = ds.habits[i]; break; }
        if (!h) return;
        if (h.scheduled) goalDays++;
        if (ds.isFuture) return;
        if (id === 'sleep') { if (h.done) total += 1; } // nights at or above target
        else if (hc.kind === 'multi') total += Array.isArray(h.value) ? h.value.length : 0;
        else if (hc.kind === 'toggle') total += h.value ? 1 : 0;
        else total += num(h.value);
      });
      if (!habits[id]) habits[id] = { scheduled: 0, done: 0, pct: 0 };
      habits[id].total = r2(total);
      habits[id].goalDays = goalDays;
      habits[id].target = target;
    });

    var elapsed = days.filter(function (d) { return !d.isFuture; }).length;
    return {
      weekStart: dates[0],
      days: days,
      pct: agg.pct,
      scheduledTotal: agg.scheduledTotal,
      doneTotal: agg.doneTotal,
      perfectDays: agg.perfectDays,
      daysElapsed: elapsed,
      counted: agg.counted,
      habits: habits,
      rating: rate(agg.pct)
    };
  }

  /** Plan-view summary: {done, goal, unit, bonus, days, target, total, totalGoal, totalUnit, pct}
      goal = scheduled days in the week; done = scheduled days completed so far. */
  function weeklyGoal(habitId, anyDate) {
    var hc = HP.config.habit(habitId);
    if (!hc) return { done: 0, goal: 0, unit: '' };
    if (!validDate(anyDate)) anyDate = today();
    var target = safeTarget(habitId);
    var goal = 0, done = 0, bonus = 0, total = 0;
    HP.dates.weekDates(anyDate).forEach(function (date) {
      var ds = dayScore(date);
      var h = null;
      for (var i = 0; i < ds.habits.length; i++) if (ds.habits[i].id === habitId) { h = ds.habits[i]; break; }
      if (!h) return;
      if (h.scheduled) { goal++; if (!ds.isFuture && h.done) done++; }
      else if (!ds.isFuture && h.done) bonus++;
      if (!ds.isFuture) {
        if (hc.kind === 'multi') total += Array.isArray(h.value) ? h.value.length : 0;
        else if (hc.kind === 'toggle') total += h.value ? 1 : 0;
        else total += num(h.value);
      }
    });
    var dayUnit = HP.t('common.days');
    if (dayUnit === 'common.days') dayUnit = HP.tr({ bm: 'hari', en: 'days' });
    var isAmount = hc.kind === 'amount';
    return {
      done: done,
      goal: goal,
      unit: dayUnit,
      bonus: bonus,
      days: goal,
      target: target,
      total: r2(total),
      totalGoal: isAmount ? r2(goal * target) : (hc.kind === 'multi' ? goal * hc.items.length : goal),
      totalUnit: isAmount ? HP.config.unitLabel(habitId) : '',
      pct: goal ? Math.round(done / goal * 100) : 0
    };
  }

  /* ---------- long-range commitment ---------- */
  function commitment(days, endDate) {
    days = Math.round(num(days));
    if (days < 1) days = 30;
    if (days > 3660) days = 3660;
    if (!validDate(endDate)) endDate = today();
    var start = startDate();
    var from = HP.dates.addDays(endDate, -(days - 1));
    if (from < start) from = start; // never penalise history that predates the app

    var list = from <= endDate ? HP.dates.range(from, endDate).map(dayScore) : [];
    var agg = aggregate(list, start);
    var activeDays = list.filter(function (d) { return !d.isFuture && d.logged; }).length;
    var trend = list.map(function (d) {
      var notYet = d.isFuture || (d.isToday && !d.logged && !d.isRest);
      return { date: d.date, pct: notYet ? 0 : d.pct, isRest: d.isRest, isFuture: notYet };
    });
    return {
      pct: agg.pct,
      scheduledTotal: agg.scheduledTotal,
      doneTotal: agg.doneTotal,
      perfectDays: agg.perfectDays,
      activeDays: activeDays,
      counted: agg.counted,
      startDate: start,
      trend: trend,
      habits: habitSummary(agg, true),
      rating: rate(agg.pct)
    };
  }

  /** true = qualifying scheduled day, false = scheduled day below STREAK_MIN_PCT, null = rest/future (neutral).
      Today not yet qualified returns false; gamify decides not to break the streak for it. */
  function isStreakDay(date) {
    if (!validDate(date)) return null;
    var ds = dayScore(date);
    if (ds.isRest || ds.isFuture) return null;
    return ds.pct >= HP.config.STREAK_MIN_PCT;
  }

  HP.scoring = {
    dayScore: dayScore,
    weekScore: weekScore,
    weeklyGoal: weeklyGoal,
    commitment: commitment,
    rate: rate,
    isStreakDay: isStreakDay,
    startDate: startDate
  };
})();
