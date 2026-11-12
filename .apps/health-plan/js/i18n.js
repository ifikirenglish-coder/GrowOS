/* i18n.js - translations, HP.t, HP.setLang, HP.i18n. Loaded 3rd. Owner: Localization.
   Default language is Bahasa Malaysia ('bm'); English ('en') is the fallback. */
(function () {
  'use strict';
  var HP = window.HP;
  var LANGS = ['bm', 'en'];
  var HTML_LANG = { bm: 'ms', en: 'en' };
  var DECIMAL = { bm: '.', en: '.' }; // hook: change here if a locale needs ','

  var dict = { bm: Object.create(null), en: Object.create(null) };
  var missing = new Set();

  function lookup(lang, key) {
    var d = dict[lang];
    var v = d ? d[key] : undefined;
    return typeof v === 'string' ? v : undefined;
  }

  /** HP.t(key, params) -> string. Falls back to en, then to the key. Never throws. */
  function t(key, params) {
    try {
      if (key == null) return '';
      key = String(key);
      var s = lookup(HP.lang, key);
      if (s === undefined) s = lookup('en', key);
      if (s === undefined) {
        missing.add(key);
        return key;
      }
      if (s.indexOf('{') < 0) return s;
      return s.replace(/\{(\w+)\}/g, function (m, name) {
        if (params && typeof params === 'object' && Object.prototype.hasOwnProperty.call(params, name) && params[name] != null) {
          return String(params[name]);
        }
        return '';
      });
    } catch (e) {
      return key == null ? '' : String(key);
    }
  }

  function applyDocLang(lang) {
    try {
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = HTML_LANG[lang] || 'en';
      }
    } catch (e) { /* ignore */ }
  }

  /** HP.setLang('bm'|'en'). Invalid values are ignored. Emits bus 'lang' only when changed. Returns HP.lang. */
  function setLang(lang) {
    if (LANGS.indexOf(lang) < 0) return HP.lang;
    var changed = HP.lang !== lang;
    HP.lang = lang;
    applyDocLang(lang);
    if (changed && HP.bus && typeof HP.bus.emit === 'function') HP.bus.emit('lang', { lang: lang });
    return HP.lang;
  }

  /** Merge dictionaries. Later registrations win. Non-string values are ignored. */
  function register(dicts) {
    if (!dicts || typeof dicts !== 'object') return;
    LANGS.forEach(function (lang) {
      var src = dicts[lang];
      if (!src || typeof src !== 'object') return;
      Object.keys(src).forEach(function (k) {
        var v = src[k];
        if (typeof v === 'number') v = String(v);
        if (typeof v === 'string') dict[lang][k] = v;
      });
    });
  }

  function has(key) {
    key = String(key);
    return lookup(HP.lang, key) !== undefined || lookup('en', key) !== undefined;
  }

  /** plural(n, {one, other, zero?}). "{n}" in the text is replaced by the localized number. BM has no plural forms, so both may be equal. */
  function plural(n, forms) {
    if (typeof forms === 'string') return forms.replace(/\{n\}/g, number(n));
    if (!forms || typeof forms !== 'object') return String(n);
    var form = n === 0 && forms.zero != null ? forms.zero : (Number(n) === 1 ? forms.one : forms.other);
    if (form == null) form = forms.other != null ? forms.other : (forms.one != null ? forms.one : '');
    return String(form).replace(/\{n\}/g, number(n));
  }

  /** number(n, dp): localized decimal. With dp, fixed decimals; without, up to 2 decimals with trailing zeros trimmed. */
  function number(n, dp) {
    var x = Number(n);
    if (!isFinite(x)) x = 0;
    var s;
    if (dp != null && dp >= 0) {
      s = x.toFixed(Math.min(20, Math.floor(dp)));
    } else {
      s = String(Math.round(x * 100) / 100);
    }
    var sep = DECIMAL[HP.lang] || '.';
    return sep === '.' ? s : s.replace('.', sep);
  }

  HP.t = t;
  HP.setLang = setLang;
  HP.i18n = {
    langs: LANGS.slice(),
    register: register,
    has: has,
    plural: plural,
    number: number,
    /** Dev aid: keys that were requested through HP.t but exist in no language. */
    missing: function () { return Array.from(missing); },
    clearMissing: function () { missing.clear(); },
    /** Rebuild habit.* and day.* keys from HP.config (called once at load; call again if config changes). */
    syncConfig: syncConfig
  };

  /* ------------------------------------------------------------------
     Shared strings (SPEC section 5)
     ------------------------------------------------------------------ */
  register({
    bm: {
      'app.name': 'My Health Plan',
      'app.tagline': 'Healthy Me, Happier Me!',

      'nav.today': 'Hari Ini',
      'nav.progress': 'Kemajuan',
      'nav.plan': 'Pelan',
      'nav.rewards': 'Ganjaran',
      'nav.settings': 'Tetapan',

      'common.save': 'Simpan',
      'common.cancel': 'Batal',
      'common.done': 'Selesai',
      'common.undo': 'Buat asal',
      'common.reset': 'Set semula',
      'common.confirm': 'Sahkan',
      'common.yes': 'Ya',
      'common.no': 'Tidak',
      'common.close': 'Tutup',
      'common.edit': 'Ubah',
      'common.add': 'Tambah',
      'common.back': 'Kembali',
      'common.next': 'Seterusnya',
      'common.today': 'Hari ini',
      'common.yesterday': 'Semalam',
      'common.tomorrow': 'Esok',
      'common.week': 'Minggu',
      'common.month': 'Bulan',
      'common.all': 'Semua',
      'common.days': 'hari',
      'common.day': 'hari',
      'common.of': 'daripada',
      'common.loading': 'Memuatkan...',

      'unit.l': 'L',
      'unit.h': 'jam',
      'unit.min': 'min',
      'unit.item': 'item',
      'unit.times': 'kali',

      'rating.legend': 'Legenda',
      'rating.great': 'Hebat',
      'rating.good': 'Bagus',
      'rating.keepgoing': 'Teruskan',
      'rating.restart': 'Mula semula',

      'status.done': 'Selesai',
      'status.partial': 'Separuh jalan',
      'status.missed': 'Belum siap',
      'status.rest': 'Rehat',
      'status.upcoming': 'Akan datang',
      'status.bonus': 'Bonus',

      'error.generic': 'Maaf, ada yang tidak kena. Cuba lagi sekejap lagi.'
    },
    en: {
      'app.name': 'My Health Plan',
      'app.tagline': 'Healthy Me, Happier Me!',

      'nav.today': 'Today',
      'nav.progress': 'Progress',
      'nav.plan': 'Plan',
      'nav.rewards': 'Rewards',
      'nav.settings': 'Settings',

      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.done': 'Done',
      'common.undo': 'Undo',
      'common.reset': 'Reset',
      'common.confirm': 'Confirm',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.close': 'Close',
      'common.edit': 'Edit',
      'common.add': 'Add',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.today': 'Today',
      'common.yesterday': 'Yesterday',
      'common.tomorrow': 'Tomorrow',
      'common.week': 'Week',
      'common.month': 'Month',
      'common.all': 'All',
      'common.days': 'days',
      'common.day': 'day',
      'common.of': 'of',
      'common.loading': 'Loading...',

      'unit.l': 'L',
      'unit.h': 'h',
      'unit.min': 'min',
      'unit.item': 'item',
      'unit.times': 'times',

      'rating.legend': 'Legend',
      'rating.great': 'Great',
      'rating.good': 'Good',
      'rating.keepgoing': 'Keep going',
      'rating.restart': 'Restart',

      'status.done': 'Done',
      'status.partial': 'Halfway',
      'status.missed': 'Not done',
      'status.rest': 'Rest',
      'status.upcoming': 'Upcoming',
      'status.bonus': 'Bonus',

      'error.generic': 'Sorry, something went wrong. Please try again in a moment.'
    }
  });

  /* ------------------------------------------------------------------
     Generated from HP.config: habit.<id>.name/desc/item.<itemId>, day.short.N, day.full.N
     ------------------------------------------------------------------ */
  function syncConfig() {
    var C = HP.config;
    if (!C) return;
    var bm = {};
    var en = {};
    (C.HABITS || []).forEach(function (h) {
      var p = 'habit.' + h.id + '.';
      if (h.name) { bm[p + 'name'] = h.name.bm; en[p + 'name'] = h.name.en; }
      if (h.desc) { bm[p + 'desc'] = h.desc.bm; en[p + 'desc'] = h.desc.en; }
      (h.items || []).forEach(function (it) {
        if (it.name) { bm[p + 'item.' + it.id] = it.name.bm; en[p + 'item.' + it.id] = it.name.en; }
      });
    });
    (C.DAYS || []).forEach(function (d) {
      bm['day.short.' + d.idx] = d.bm.short;
      bm['day.full.' + d.idx] = d.bm.full;
      en['day.short.' + d.idx] = d.en.short;
      en['day.full.' + d.idx] = d.en.full;
    });
    register({ bm: bm, en: en });
  }
  syncConfig();

  // Make <html lang> correct from the first moment (default 'bm' -> 'ms').
  applyDocLang(HP.lang);
})();
