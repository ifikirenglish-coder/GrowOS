/* store.js — HP.dates (local-time date math) and HP.store (the ONLY localStorage writer). Owner: Data & Storage. */
(function () {
  'use strict';
  var HP = window.HP;
  var C = HP.config;

  var hasOwn = Object.prototype.hasOwnProperty;
  var BAD_KEYS = { '__proto__': 1, 'constructor': 1, 'prototype': 1 };

  function isPlain(o) { return o !== null && typeof o === 'object' && !Array.isArray(o); }
  function clone(o) { return o === undefined ? undefined : JSON.parse(JSON.stringify(o)); }
  function pad(n, w) { var s = String(n); while (s.length < (w || 2)) s = '0' + s; return s; }
  /** HP.t with a bm/en fallback when i18n is not loaded (or the key is missing). */
  function tt(key, bm, en) {
    var s = typeof HP.t === 'function' ? HP.t(key) : key;
    return s && s !== key ? s : HP.tr({ bm: bm, en: en });
  }

  /* =====================================================================
     HP.dates — all math on local-time, noon-anchored Dates (DST-safe)
     ===================================================================== */
  var DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

  function fmt(d) { return pad(d.getFullYear(), 4) + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  /** Date at local noon, or null if the string is not a real calendar date. */
  function rawParse(str) {
    if (typeof str !== 'string') return null;
    var m = DATE_RE.exec(str);
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var dt = new Date(2000, 0, 1, 12, 0, 0, 0);
    dt.setFullYear(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
    return dt;
  }
  function isValidDate(str) { return rawParse(str) !== null; }
  function today() {
    var o = window.__HP_TODAY__;
    if (typeof o === 'string' && isValidDate(o)) return o;
    var n = new Date();
    n.setHours(12, 0, 0, 0);
    return fmt(n);
  }
  function parse(str) { return rawParse(str) || rawParse(today()); }
  function addDays(str, n) {
    var d = parse(str);
    d.setDate(d.getDate() + Math.round(+n || 0));
    return fmt(d);
  }
  function dow(str) { return (parse(str).getDay() + 6) % 7; }
  function weekStart(str) { return addDays(str, -dow(str)); }
  function weekDates(str) {
    var s = weekStart(str), out = [];
    for (var i = 0; i < 7; i++) out.push(addDays(s, i));
    return out;
  }
  function diffDays(a, b) { return Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000); }
  function range(a, b) {
    var out = [];
    if (!isValidDate(a) || !isValidDate(b) || a > b) return out;
    var d = parse(a), cur = fmt(d), guard = 0;
    while (cur <= b && guard++ < 40000) {
      out.push(cur);
      d.setDate(d.getDate() + 1);
      cur = fmt(d);
    }
    return out;
  }
  function isFuture(str) { return isValidDate(str) && str > today(); }
  function isToday(str) { return str === today(); }
  function label(str, opts) {
    var long = !!(opts && opts.style === 'long');
    var d = parse(str);
    var style = long ? 'full' : 'short';
    return C.dayName(dow(str), style) + ', ' + d.getDate() + ' ' + C.monthName(d.getMonth(), long ? 'long' : 'short');
  }
  function relativeLabel(str) {
    var t = today();
    if (str === t) return tt('common.today', 'Hari ini', 'Today');
    if (str === addDays(t, -1)) return tt('common.yesterday', 'Semalam', 'Yesterday');
    if (str === addDays(t, 1)) return tt('common.tomorrow', 'Esok', 'Tomorrow');
    return label(str);
  }

  HP.dates = {
    today: today, parse: parse, fmt: fmt, addDays: addDays, dow: dow, weekStart: weekStart,
    weekDates: weekDates, diffDays: diffDays, range: range, isFuture: isFuture, isToday: isToday,
    label: label, relativeLabel: relativeLabel, isValid: isValidDate
  };
  var D = HP.dates;

  /* =====================================================================
     i18n for import errors (strings are returned already localized)
     ===================================================================== */
  if (HP.i18n && typeof HP.i18n.register === 'function') {
    HP.i18n.register({
      bm: {
        'store.err.empty': 'Fail kosong.',
        'store.err.parse': 'Fail ini bukan JSON yang sah.',
        'store.err.shape': 'Fail ini bukan data My Health Plan yang sah.'
      },
      en: {
        'store.err.empty': 'The file is empty.',
        'store.err.parse': 'This file is not valid JSON.',
        'store.err.shape': 'This file is not valid My Health Plan data.'
      }
    });
  }

  /* =====================================================================
     Defaults & sanitizers
     ===================================================================== */
  var KEY = C.STORAGE_KEY || 'hp.v1';
  var CORRUPT_KEY = KEY + '.corrupt';
  var NEWER_KEY = KEY + '.newer';
  var LANGS = ['bm', 'en'];
  var THEMES = ['auto', 'light', 'dark'];

  function defaultSettings() {
    return {
      lang: 'bm', theme: 'auto', sound: true, haptics: true,
      reminders: {
        enabled: false,
        times: { supplements: '08:00', water: '10:00', walk: '18:30', sleep: '22:00', fasting: '' }
      }
    };
  }
  function defaultGame() { return { seenBadges: {}, lastLevel: 1 }; }
  function defaultProfile() { return { name: '', createdAt: today() }; }
  function defaultState() {
    return {
      version: C.VERSION || 1,
      profile: defaultProfile(),
      plan: C.defaultPlan(),
      logs: {},
      settings: defaultSettings(),
      game: defaultGame()
    };
  }

  function isEmptyValue(id, v) {
    var h = C.habit(id);
    if (h.kind === 'multi') return !v || v.length === 0;
    if (h.kind === 'toggle') return !v;
    return !(v > 0);
  }
  /** C.normalize + stable item order for multi habits. */
  function normV(id, v) {
    var h = C.habit(id), n = C.normalize(id, v);
    if (h && h.kind === 'multi') {
      var order = h.items.map(function (i) { return i.id; });
      n = n.slice().sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
    }
    return n;
  }
  function copyValue(v) { return Array.isArray(v) ? v.slice() : v; }

  /** Array of unique sorted ints 0..6, or null when `arr` is not an array. */
  function cleanDays(arr) {
    if (!Array.isArray(arr)) return null;
    var seen = {}, out = [];
    arr.forEach(function (x) {
      var n = typeof x === 'number' ? x : (typeof x === 'string' && /^\d+$/.test(x) ? parseInt(x, 10) : NaN);
      if (Math.floor(n) === n && n >= 0 && n <= 6 && !seen[n]) { seen[n] = 1; out.push(n); }
    });
    return out.sort(function (a, b) { return a - b; });
  }
  function cleanTarget(id, raw, fallback) {
    var h = C.habit(id);
    if (h.fixedTarget) return h.defaultTarget;
    var n = typeof raw === 'string' ? parseFloat(raw) : raw;
    if (typeof n !== 'number' || !isFinite(n)) return fallback;
    var r = h.targetRange || { min: h.min, max: h.max, step: h.step };
    var step = r.step || 1;
    n = Math.round(n / step) * step;
    n = Math.min(r.max, Math.max(r.min, n));
    return Math.round(n * 100) / 100;
  }
  function sanitizePlanEntry(id, raw, base) {
    var h = C.habit(id);
    var fallback = base || { days: h.defaultDays.slice(), target: h.defaultTarget };
    var out = { days: fallback.days.slice(), target: fallback.target };
    if (isPlain(raw)) {
      var d = cleanDays(raw.days);
      if (d && (d.length > 0 || raw.days.length === 0)) out.days = d; // junk-only array falls back; explicit [] is allowed
      out.target = cleanTarget(id, raw.target, out.target);
    }
    if (h.fixedTarget) out.target = h.defaultTarget;
    return out;
  }
  function sanitizePlan(raw) {
    var out = {};
    C.habitIds().forEach(function (id) {
      out[id] = sanitizePlanEntry(id, isPlain(raw) && hasOwn.call(raw, id) ? raw[id] : null, null);
    });
    return out;
  }
  function sanitizeLogs(raw) {
    var out = {};
    if (!isPlain(raw)) return out;
    var ids = C.habitIds();
    Object.keys(raw).forEach(function (date) {
      if (!isValidDate(date) || !isPlain(raw[date])) return;
      var day = raw[date], entry = {}, any = false;
      ids.forEach(function (id) {
        if (!hasOwn.call(day, id)) return;
        var v = normV(id, day[id]);
        if (!isEmptyValue(id, v)) { entry[id] = v; any = true; }
      });
      if (any) out[date] = entry;
    });
    return out;
  }
  function cleanTime(v) {
    if (typeof v !== 'string') return null;
    var m = /^(\d{1,2}):(\d{2})$/.exec(v.trim());
    if (!m) return null;
    var h = +m[1], mi = +m[2];
    if (h > 23 || mi > 59) return null;
    return pad(h) + ':' + pad(mi);
  }
  function sanitizeSettings(raw, base) {
    var b = base || defaultSettings();
    var r = isPlain(raw) ? raw : {};
    var out = {
      lang: LANGS.indexOf(r.lang) >= 0 ? r.lang : b.lang,
      theme: THEMES.indexOf(r.theme) >= 0 ? r.theme : b.theme,
      sound: typeof r.sound === 'boolean' ? r.sound : b.sound,
      haptics: typeof r.haptics === 'boolean' ? r.haptics : b.haptics,
      reminders: { enabled: b.reminders.enabled, times: {} }
    };
    var rr = isPlain(r.reminders) ? r.reminders : {};
    if (typeof rr.enabled === 'boolean') out.reminders.enabled = rr.enabled;
    var rt = isPlain(rr.times) ? rr.times : {};
    C.habitIds().forEach(function (id) {
      var v = hasOwn.call(rt, id) ? rt[id] : undefined;
      var t = cleanTime(v);
      out.reminders.times[id] = t !== null ? t : (v === '' ? '' : b.reminders.times[id]);
    });
    return out;
  }
  function sanitizeProfile(raw, base) {
    var b = base || defaultProfile();
    var r = isPlain(raw) ? raw : {};
    return {
      name: typeof r.name === 'string' ? r.name.trim().slice(0, 60) : b.name,
      createdAt: isValidDate(r.createdAt) ? r.createdAt : b.createdAt
    };
  }
  function sanitizeGame(raw, base) {
    var b = base || defaultGame();
    var r = isPlain(raw) ? raw : {};
    var seen = {};
    // keep what we already had, then layer valid incoming entries on top
    [b.seenBadges, isPlain(r.seenBadges) ? r.seenBadges : {}].forEach(function (src) {
      Object.keys(src).forEach(function (k) {
        if (BAD_KEYS[k] || !/^[\w.-]{1,64}$/.test(k)) return;
        if (isValidDate(src[k])) seen[k] = src[k];
      });
    });
    var lv = typeof r.lastLevel === 'number' ? Math.floor(r.lastLevel) : NaN;
    return { seenBadges: seen, lastLevel: isFinite(lv) && lv >= 1 && lv <= 999 ? lv : b.lastLevel };
  }
  function sanitizeState(raw) {
    var r = isPlain(raw) ? raw : {};
    return {
      version: C.VERSION || 1,
      profile: sanitizeProfile(r.profile, null),
      plan: sanitizePlan(r.plan),
      logs: sanitizeLogs(r.logs),
      settings: sanitizeSettings(r.settings, null),
      game: sanitizeGame(r.game, { seenBadges: {}, lastLevel: 1 })
    };
  }
  /** Bring an older saved object up to the current version. Only v1 exists today. */
  function migrate(o) {
    if (!isPlain(o)) return o;
    if (typeof o.version !== 'number' || !(o.version >= 1)) o.version = 1;
    return o;
  }

  function deepMerge(target, patch) {
    Object.keys(patch).forEach(function (k) {
      if (BAD_KEYS[k]) return;
      if (isPlain(patch[k]) && isPlain(target[k])) deepMerge(target[k], patch[k]);
      else target[k] = clone(patch[k]);
    });
    return target;
  }

  /* =====================================================================
     Persistence (localStorage with in-memory fallback)
     ===================================================================== */
  var state = defaultState(); // usable even before init()
  var persistent = false;

  function ls() { try { return window.localStorage || null; } catch (e) { return null; } }
  function lsGet(k) { try { var s = ls(); return s ? s.getItem(k) : null; } catch (e) { return null; } }
  function lsSet(k, v) { try { var s = ls(); if (!s) return false; s.setItem(k, v); return true; } catch (e) { return false; } }
  function save() { persistent = lsSet(KEY, JSON.stringify(state)); return persistent; }
  function emit(payload) { HP.bus.emit('change', payload); }
  function applyLang(prev) {
    var lang = state.settings.lang;
    if (lang === prev) return;
    if (typeof HP.setLang === 'function') HP.setLang(lang);
    else HP.lang = lang;
  }

  /* =====================================================================
     Seed PRNG
     ===================================================================== */
  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function mulberry32(a) {
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* =====================================================================
     HP.store
     ===================================================================== */
  function plan(id) { return state.plan[id]; }
  function validHabit(id) { return typeof id === 'string' && C.habit(id) !== null; }
  function validArgs(date, id) { return isValidDate(date) && validHabit(id); }

  function rawGet(date, id) {
    var day = state.logs[date];
    return day && hasOwn.call(day, id) ? day[id] : undefined;
  }
  function getValue(date, id) {
    if (!validHabit(id)) return undefined;
    var v = rawGet(date, id);
    return v === undefined ? C.emptyValue(id) : copyValue(v);
  }
  function writeValue(date, id, value) {
    var v = normV(id, value);
    if (isEmptyValue(id, v)) {
      var day = state.logs[date];
      if (day) {
        delete day[id];
        if (Object.keys(day).length === 0) delete state.logs[date];
      }
    } else {
      if (!state.logs[date]) state.logs[date] = {};
      state.logs[date][id] = v;
    }
  }
  function commitLog(date, id) {
    save();
    emit({ type: 'log', date: date, habitId: id });
  }
  function setValue(date, id, value) {
    if (!validArgs(date, id)) return;
    writeValue(date, id, value);
    commitLog(date, id);
  }
  function addAmount(date, id, delta) {
    if (!validArgs(date, id) || C.habit(id).kind !== 'amount') return;
    var d = +delta;
    if (!isFinite(d)) return;
    var cur = rawGet(date, id) || 0;
    writeValue(date, id, cur + d);
    commitLog(date, id);
  }
  function toggleItem(date, id, itemId) {
    if (!validArgs(date, id) || C.habit(id).kind !== 'multi') return;
    var ok = C.habit(id).items.some(function (i) { return i.id === itemId; });
    if (!ok) return;
    var cur = (rawGet(date, id) || []).slice();
    var at = cur.indexOf(itemId);
    if (at >= 0) cur.splice(at, 1); else cur.push(itemId);
    writeValue(date, id, cur);
    commitLog(date, id);
  }
  function toggle(date, id) {
    if (!validArgs(date, id) || C.habit(id).kind !== 'toggle') return;
    writeValue(date, id, !rawGet(date, id));
    commitLog(date, id);
  }
  function completeHabit(date, id) {
    if (!validArgs(date, id)) return;
    var h = C.habit(id), v;
    if (h.kind === 'multi') v = h.items.map(function (i) { return i.id; });
    else if (h.kind === 'toggle') v = true;
    else v = Math.max(rawGet(date, id) || 0, plan(id).target);
    writeValue(date, id, v);
    commitLog(date, id);
  }
  function clearHabit(date, id) {
    if (!validArgs(date, id)) return;
    writeValue(date, id, C.emptyValue(id));
    commitLog(date, id);
  }
  function getLog(date) {
    var out = {};
    C.habitIds().forEach(function (id) { out[id] = getValue(date, id); });
    return out;
  }
  function hasLog(date) {
    var day = state.logs[date];
    return !!day && Object.keys(day).some(function (id) { return !isEmptyValue(id, day[id]); });
  }
  function logDates() { return Object.keys(state.logs).filter(hasLog).sort(); }
  function firstLogDate() { var l = logDates(); return l.length ? l[0] : null; }

  function getPlan() { return clone(state.plan); }
  function getTarget(id) { return validHabit(id) ? plan(id).target : undefined; }
  function getScheduledDays(id) { return validHabit(id) ? plan(id).days.slice() : []; }
  function isScheduled(id, date) { return validHabit(id) && plan(id).days.indexOf(dow(date)) >= 0; }
  function setPlan(id, patch) {
    if (!validHabit(id) || !isPlain(patch)) return;
    state.plan[id] = sanitizePlanEntry(id, patch, state.plan[id]);
    save();
    emit({ type: 'plan', habitId: id });
  }
  function resetPlan() {
    state.plan = C.defaultPlan();
    save();
    emit({ type: 'plan' });
  }

  function getSettings() { return clone(state.settings); }
  function setSettings(patch) {
    if (!isPlain(patch)) return;
    var prev = state.settings.lang;
    state.settings = sanitizeSettings(deepMerge(clone(state.settings), patch), state.settings);
    save();
    applyLang(prev);
    emit({ type: 'settings' });
  }
  function getProfile() { return clone(state.profile); }
  function setProfile(patch) {
    if (!isPlain(patch)) return;
    state.profile = sanitizeProfile(patch, state.profile);
    save();
    emit({ type: 'profile' });
  }
  function getGame() { return clone(state.game); }
  function setGame(patch) {
    if (!isPlain(patch)) return;
    state.game = sanitizeGame(deepMerge(clone(state.game), patch), state.game);
    save();
    emit({ type: 'game' });
  }

  function exportJSON() { return JSON.stringify(state, null, 2); }
  function importJSON(str) {
    if (typeof str !== 'string' || !str.trim()) return { ok: false, error: tt('store.err.empty', 'Fail kosong.', 'The file is empty.') };
    var raw;
    try { raw = JSON.parse(str); } catch (e) {
      return { ok: false, error: tt('store.err.parse', 'Fail ini bukan JSON yang sah.', 'This file is not valid JSON.') };
    }
    var bad = tt('store.err.shape', 'Fail ini bukan data My Health Plan yang sah.', 'This file is not valid My Health Plan data.');
    if (!isPlain(raw)) return { ok: false, error: bad };
    var parts = ['profile', 'plan', 'logs', 'settings', 'game'];
    var known = parts.filter(function (k) { return hasOwn.call(raw, k); });
    if (!known.length) return { ok: false, error: bad };
    // every part that is present must be an object
    for (var i = 0; i < known.length; i++) if (!isPlain(raw[known[i]])) return { ok: false, error: bad };
    if (hasOwn.call(raw, 'version') && typeof raw.version !== 'number') return { ok: false, error: bad };
    var prev = state.settings.lang;
    state = sanitizeState(migrate(raw));
    save();
    applyLang(prev);
    emit({ type: 'import' });
    return { ok: true };
  }
  function reset() {
    var prev = state.settings.lang;
    state = defaultState();
    save();
    applyLang(prev);
    emit({ type: 'reset' });
  }

  function init() {
    var prev = state.settings.lang;
    var raw = lsGet(KEY), parsed = null, usable = false;
    if (raw !== null && raw !== undefined) {
      try { parsed = JSON.parse(raw); usable = isPlain(parsed); } catch (e) { usable = false; }
      if (!usable) lsSet(CORRUPT_KEY, String(raw)); // keep the broken data so it can be recovered by hand
    }
    if (usable) {
      if (typeof parsed.version === 'number' && parsed.version > (C.VERSION || 1)) lsSet(NEWER_KEY, raw);
      state = sanitizeState(migrate(parsed));
    } else {
      state = defaultState();
    }
    save();
    applyLang(prev);
    emit({ type: 'init' });
  }

  /* ---------- demo data ---------- */
  function doneValue(id, rng) {
    var h = C.habit(id);
    if (h.kind === 'multi') return h.items.map(function (i) { return i.id; });
    if (h.kind === 'toggle') return true;
    return plan(id).target + h.step * Math.floor(rng() * 4);
  }
  var PARTIAL_FRAC = { water: [0.35, 0.85], sleep: [0.7, 0.92], walk: [0.3, 0.8] };
  function partialValue(id, rng) {
    var h = C.habit(id);
    if (h.kind === 'toggle') return null;
    if (h.kind === 'multi') {
      var n = h.items.length, k = 1 + Math.floor(rng() * Math.max(1, n - 1)), off = Math.floor(rng() * n), out = [];
      for (var i = 0; i < k; i++) out.push(h.items[(off + i) % n].id);
      return out;
    }
    var t = plan(id).target, f = PARTIAL_FRAC[id] || [0.4, 0.8];
    var v = Math.floor((t * (f[0] + rng() * (f[1] - f[0]))) / h.step) * h.step;
    if (v >= t) v = t - h.step;
    return v > 0 ? v : null;
  }
  function seedDemo(days) {
    days = parseInt(days, 10);
    if (!(days >= 1)) days = 28;
    days = Math.min(days, 730);
    var t = today(), yesterday = addDays(t, -1), first = addDays(t, -days);
    var ids = C.habitIds(), logs = {}, list = range(first, yesterday);
    function put(date, entry) {
      var clean = {}, any = false;
      ids.forEach(function (id) {
        if (!hasOwn.call(entry, id)) return;
        var v = normV(id, entry[id]);
        if (!isEmptyValue(id, v)) { clean[id] = v; any = true; }
      });
      if (any) logs[date] = clean;
    }
    list.forEach(function (date, i) {
      var rng = mulberry32(hashStr(date) ^ 0x9e3779b9);
      var progress = list.length > 1 ? i / (list.length - 1) : 1;
      var goodP = 0.6 + 0.25 * progress, r = rng(), q;
      if (date === yesterday) q = 'full';
      else q = r < goodP ? 'good' : (r < goodP + 0.2 ? 'ok' : 'bad');
      if (q === 'bad' && rng() < 0.25 && i > 0) return; // a day nothing was logged
      var p = { full: 1, good: 0.96, ok: 0.65, bad: 0.15 }[q];
      var entry = {};
      ids.forEach(function (id) {
        if (!isScheduled(id, date)) return; // rest days stay empty
        var roll = rng(), part = rng();
        var v = roll < p ? doneValue(id, rng) : (part < 0.5 ? partialValue(id, rng) : null);
        if (v !== null && v !== undefined) entry[id] = v;
      });
      put(date, entry);
    });
    // today: a partial morning
    var tr = mulberry32(hashStr(t) ^ 0x51ed270b), te = {};
    if (isScheduled('supplements', t)) te.supplements = [C.habit('supplements').items[Math.floor(tr() * 3)].id];
    if (isScheduled('water', t)) te.water = Math.min(0.75 + 0.25 * Math.floor(tr() * 3), plan('water').target - C.habit('water').step);
    if (isScheduled('sleep', t)) te.sleep = plan('sleep').target + 0.5 * Math.floor(tr() * 3);
    if (isScheduled('fasting', t)) te.fasting = true;
    put(t, te);
    state.logs = logs;
    state.profile.createdAt = first;
    save();
    emit({ type: 'import' });
    return true;
  }

  HP.store = {
    init: init,
    get: function () { return state; },
    getLog: getLog, hasLog: hasLog, getValue: getValue,
    setValue: setValue, addAmount: addAmount, toggleItem: toggleItem, toggle: toggle,
    completeHabit: completeHabit, clearHabit: clearHabit,
    logDates: logDates, firstLogDate: firstLogDate,
    getPlan: getPlan, getTarget: getTarget, getScheduledDays: getScheduledDays, isScheduled: isScheduled,
    setPlan: setPlan, resetPlan: resetPlan,
    getSettings: getSettings, setSettings: setSettings,
    getProfile: getProfile, setProfile: setProfile,
    getGame: getGame, setGame: setGame,
    exportJSON: exportJSON, importJSON: importJSON,
    reset: reset, seedDemo: seedDemo,
    isPersistent: function () { return persistent; }
  };
})();
