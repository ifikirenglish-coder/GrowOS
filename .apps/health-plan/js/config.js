/* config.js — habit definitions, default plan, XP/rating constants. Loaded 2nd. Owner: Architect. Pure data + small pure helpers. */
(function () {
  'use strict';
  var HP = window.HP;

  var DAYS = [
    { idx: 0, bm: { short: 'Isn', full: 'Isnin' }, en: { short: 'Mon', full: 'Monday' } },
    { idx: 1, bm: { short: 'Sel', full: 'Selasa' }, en: { short: 'Tue', full: 'Tuesday' } },
    { idx: 2, bm: { short: 'Rab', full: 'Rabu' }, en: { short: 'Wed', full: 'Wednesday' } },
    { idx: 3, bm: { short: 'Kha', full: 'Khamis' }, en: { short: 'Thu', full: 'Thursday' } },
    { idx: 4, bm: { short: 'Jum', full: 'Jumaat' }, en: { short: 'Fri', full: 'Friday' } },
    { idx: 5, bm: { short: 'Sab', full: 'Sabtu' }, en: { short: 'Sat', full: 'Saturday' } },
    { idx: 6, bm: { short: 'Aha', full: 'Ahad' }, en: { short: 'Sun', full: 'Sunday' } }
  ];
  var MONTHS = {
    bm: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  var HABITS = [
    {
      id: 'supplements', icon: 'pill', color: '#FF6B1A', kind: 'multi',
      name: { bm: 'Suplemen', en: 'Supplements' },
      desc: { bm: 'Sokong imuniti, kesihatan usus & kesihatan menyeluruh.', en: 'Supports immunity, gut and overall health.' },
      items: [
        { id: 'omega3', emoji: '🐟', name: { bm: 'Omega-3', en: 'Omega-3' } },
        { id: 'probiotic', emoji: '🦠', name: { bm: 'Probiotik', en: 'Probiotic' } },
        { id: 'vitc', emoji: '🍊', name: { bm: 'Vitamin C', en: 'Vitamin C' } }
      ],
      unit: null, defaultTarget: 3, fixedTarget: true, defaultDays: [0, 1, 2, 3, 4, 5, 6]
    },
    {
      id: 'water', icon: 'droplet', color: '#1E9BF0', kind: 'amount',
      name: { bm: 'Air Putih', en: 'Water' },
      desc: { bm: 'Minum sekurang-kurangnya 2 liter sehari.', en: 'Drink at least 2 litres a day.' },
      unit: { bm: 'L', en: 'L' }, step: 0.25, min: 0, max: 6, defaultTarget: 2,
      targetRange: { min: 1, max: 4, step: 0.25 }, quick: [0.25, 0.5], defaultDays: [0, 1, 2, 3, 4, 5, 6]
    },
    {
      id: 'sleep', icon: 'bed', color: '#7B61FF', kind: 'amount',
      name: { bm: 'Tidur', en: 'Sleep' },
      desc: { bm: 'Pastikan tidur mencukupi untuk pemulihan badan & minda.', en: 'Get enough sleep to recover body and mind.' },
      unit: { bm: 'jam', en: 'h' }, step: 0.5, min: 0, max: 14, defaultTarget: 7, // plan says 7–9 h; done when value >= target
      targetRange: { min: 6, max: 9, step: 0.5 }, presets: [6, 7, 8, 9], defaultDays: [0, 1, 2, 3, 4, 5, 6]
    },
    {
      id: 'walk', icon: 'walk', color: '#22B573', kind: 'amount',
      name: { bm: 'Brisk Walk', en: 'Brisk Walk' },
      desc: { bm: 'Kekal aktif, sihat jantung dan lebih bertenaga.', en: 'Stay active, heart-healthy and energised.' },
      unit: { bm: 'min', en: 'min' }, step: 5, min: 0, max: 240, defaultTarget: 30,
      targetRange: { min: 10, max: 90, step: 5 }, quick: [10, 15, 30], defaultDays: [0, 1, 2, 3, 4]
    },
    {
      id: 'fasting', icon: 'utensils', color: '#F5A524', kind: 'toggle',
      name: { bm: 'Puasa Berselang (IF)', en: 'Intermittent Fasting (IF)' },
      desc: { bm: 'Amalkan puasa berselang untuk kesihatan & kecergasan.', en: 'Practise intermittent fasting for health and vitality.' },
      unit: null, defaultTarget: 1, fixedTarget: true, defaultDays: [0, 1, 2, 3, 4, 6]
    }
  ];

  var C = (HP.config = {
    VERSION: 1,
    STORAGE_KEY: 'hp.v1',
    DAYS: DAYS,
    HABITS: HABITS,
    /** XP table (gamify.js is the only consumer). */
    XP: { perHabit: 10, perfectDayBonus: 20, bonusOnRestDay: 5, streakBonusPerDay: 1, streakBonusCap: 10 },
    /** A scheduled day counts toward the streak when its pct >= this. */
    STREAK_MIN_PCT: 70,
    /** Rating thresholds on a 0-100 commitment pct. stars = round(pct/20*2)/2 (0..5). */
    GRADES: [
      { grade: 'S', min: 95, key: 'legend', color: '#FF6B1A' },
      { grade: 'A', min: 85, key: 'great', color: '#22B573' },
      { grade: 'B', min: 70, key: 'good', color: '#1E9BF0' },
      { grade: 'C', min: 50, key: 'keepgoing', color: '#F5A524' },
      { grade: 'D', min: 0, key: 'restart', color: '#9AA0A6' }
    ],
    /** Weekly goals shown in the plan summary (derived from plan so edits stay consistent). */

    habit: function (id) { for (var i = 0; i < HABITS.length; i++) if (HABITS[i].id === id) return HABITS[i]; return null; },
    habitIds: function () { return HABITS.map(function (h) { return h.id; }); },
    name: function (id) { var h = C.habit(id); return h ? HP.tr(h.name) : id; },
    desc: function (id) { var h = C.habit(id); return h ? HP.tr(h.desc) : ''; },
    unitLabel: function (id) { var h = C.habit(id); return h && h.unit ? HP.tr(h.unit) : ''; },
    itemName: function (habitId, itemId) {
      var h = C.habit(habitId); if (!h || !h.items) return itemId;
      for (var i = 0; i < h.items.length; i++) if (h.items[i].id === itemId) return HP.tr(h.items[i].name);
      return itemId;
    },
    dayName: function (idx, style) { var d = DAYS[((idx % 7) + 7) % 7]; return (d[HP.lang] || d.en)[style === 'full' ? 'full' : 'short']; },
    monthName: function (m0, style) { var n = (MONTHS[HP.lang] || MONTHS.en)[m0]; return style === 'short' ? n.slice(0, 3) : n; },

    /** Default (empty) value for a habit: [] | 0 | false */
    emptyValue: function (id) { var h = C.habit(id); return h.kind === 'multi' ? [] : (h.kind === 'toggle' ? false : 0); },
    /** Validate / clamp a raw value to the habit's domain. Always returns a valid value. */
    normalize: function (id, v) {
      var h = C.habit(id); if (!h) return v;
      if (h.kind === 'multi') {
        var ok = h.items.map(function (i) { return i.id; });
        return (Array.isArray(v) ? v : []).filter(function (x, i, a) { return ok.indexOf(x) >= 0 && a.indexOf(x) === i; });
      }
      if (h.kind === 'toggle') return !!v;
      var n = parseFloat(v); if (!isFinite(n)) n = 0;
      n = Math.min(h.max, Math.max(h.min, n));
      return Math.round(n * 100) / 100;
    },
    /** 0..1 progress of a value vs target (target ignored for multi/toggle). */
    progressOf: function (id, value, target) {
      var h = C.habit(id); if (!h) return 0;
      var v = C.normalize(id, value);
      if (h.kind === 'multi') return h.items.length ? v.length / h.items.length : 0;
      if (h.kind === 'toggle') return v ? 1 : 0;
      var t = target > 0 ? target : h.defaultTarget;
      return Math.min(1, v / t);
    },
    isDone: function (id, value, target) { return C.progressOf(id, value, target) >= 0.9999; },
    /** Human text for a value, e.g. "1.5 L", "7.5 jam", "30 min", "2/3". Localized unit. */
    format: function (id, value) {
      var h = C.habit(id); var v = C.normalize(id, value);
      if (h.kind === 'multi') return v.length + '/' + h.items.length;
      if (h.kind === 'toggle') return v ? '✓' : '-';
      var s = (Math.round(v * 100) / 100).toString();
      return s + ' ' + HP.tr(h.unit);
    },
    defaultPlan: function () {
      var p = {};
      HABITS.forEach(function (h) { p[h.id] = { days: h.defaultDays.slice(), target: h.defaultTarget }; });
      return p;
    }
  });
})();
