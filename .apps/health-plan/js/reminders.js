/* reminders.js — in-app reminder scheduler, notifications and .ics export. Owner: PWA & Reminders Engineer. */
(function () {
  'use strict';
  var HP = window.HP;

  var FIRED_KEY = 'hp.reminders.fired';
  var TICK_MS = 30000;
  var GRACE_MIN = 1; // still fire if the timer was throttled and we are a minute late
  var TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
  var ICS_DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  if (HP.i18n && HP.i18n.register) {
    HP.i18n.register({
      bm: {
        'reminders.supplements': 'Masa untuk suplemen anda 💊',
        'reminders.water': 'Masa untuk segelas air 💧',
        'reminders.sleep': 'Jom bersiap untuk tidur lena 😴',
        'reminders.walk': 'Jom jalan pantas {min} minit 🚶',
        'reminders.fasting': 'Ingat puasa berselang hari ini 🍽️',
        'reminders.generic': 'Masa untuk {habit}',
        'reminders.cta': 'Ketik untuk tandakan selesai.',
        'reminders.ics.desc': 'Langkah kecil setiap hari membawa perubahan besar. Healthy Me, Happier Me!',
        'reminders.ics.none': 'Tiada peringatan dihidupkan lagi.',
        'reminders.test': 'Peringatan sedia! Anda akan dimaklumkan tepat pada masanya 🎉'
      },
      en: {
        'reminders.supplements': 'Time for your supplements 💊',
        'reminders.water': 'Time for a glass of water 💧',
        'reminders.sleep': 'Time to wind down for a good sleep 😴',
        'reminders.walk': "Let's go for a {min} minute brisk walk 🚶",
        'reminders.fasting': 'Remember your intermittent fasting today 🍽️',
        'reminders.generic': 'Time for {habit}',
        'reminders.cta': 'Tap to mark it done.',
        'reminders.ics.desc': 'Small steps every day add up. Healthy Me, Happier Me!',
        'reminders.ics.none': 'No reminders are switched on yet.',
        'reminders.test': 'Reminders are ready! We will nudge you right on time 🎉'
      }
    });
  }

  /* ---------- helpers ---------- */
  function cfg() {
    var s = HP.store && HP.store.getSettings ? HP.store.getSettings() : null;
    var r = (s && s.reminders) || {};
    return { enabled: !!r.enabled, times: r.times || {} };
  }
  function validTime(t) { return typeof t === 'string' && TIME_RE.test(t); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hhmm(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function toMin(t) { var m = TIME_RE.exec(t); return parseInt(m[1], 10) * 60 + parseInt(m[2], 10); }

  function reminderText(id) {
    var key = 'reminders.' + id;
    if (HP.i18n && HP.i18n.has && HP.i18n.has(key)) {
      var params = {};
      if (id === 'walk' && HP.store && HP.store.getTarget) params.min = HP.store.getTarget('walk');
      else if (id === 'walk') params.min = 30;
      return HP.t(key, params);
    }
    return HP.t('reminders.generic', { habit: HP.config.name(id) });
  }

  /* ---------- fired-today memory ---------- */
  function readFired(today) {
    var raw = null;
    try { raw = window.localStorage.getItem(FIRED_KEY); } catch (e) { /* ignore */ }
    if (raw == null) { try { raw = window.sessionStorage.getItem(FIRED_KEY); } catch (e2) { /* ignore */ } }
    var obj = null;
    try { obj = raw ? JSON.parse(raw) : null; } catch (e3) { obj = null; }
    if (!obj || obj.date !== today || typeof obj.ids !== 'object' || !obj.ids) obj = { date: today, ids: {} };
    return obj;
  }
  function writeFired(obj) {
    var s = JSON.stringify(obj);
    try { window.localStorage.setItem(FIRED_KEY, s); return; } catch (e) { /* ignore */ }
    try { window.sessionStorage.setItem(FIRED_KEY, s); } catch (e2) { /* ignore */ }
  }

  /* ---------- notifications ---------- */
  function supported() { return typeof window.Notification !== 'undefined'; }
  function permission() {
    return supported() ? (window.Notification.permission || 'default') : 'unsupported';
  }

  function toast(body) {
    if (HP.ui && HP.ui.toast) HP.ui.toast(body, { type: 'info', icon: 'bell', duration: 6000 });
  }

  /** Show a reminder for one habit. Returns a Promise (never rejects). */
  function notify(id, bodyOverride) {
    var title = HP.t('app.name');
    var body = bodyOverride || reminderText(id);
    var viaToast = function () { toast(body); };
    if (permission() !== 'granted') { viaToast(); return Promise.resolve('toast'); }
    var opts = {
      body: body,
      icon: 'icons/icon.svg',
      badge: 'icons/icon.svg',
      tag: 'hp-reminder-' + id,
      lang: HP.lang === 'en' ? 'en' : 'ms',
      data: { habitId: id }
    };
    var reg = HP.pwa && HP.pwa.getRegistration ? HP.pwa.getRegistration() : Promise.resolve(null);
    return reg.then(function (r) {
      if (r && r.showNotification) {
        return r.showNotification(title, opts).then(function () { return 'sw'; });
      }
      new window.Notification(title, opts);
      return 'notification';
    }).catch(function () {
      try { new window.Notification(title, opts); return 'notification'; } catch (e) { viaToast(); return 'toast'; }
    });
  }

  /* ---------- scheduler ---------- */
  var timer = null;

  /** Check what is due. `now` is optional (Date) for tests. Returns array of habit ids fired. */
  function check(now) {
    var c = cfg();
    if (!c.enabled || !HP.scoring || !HP.dates) return [];
    now = now || new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var today = HP.dates.today();
    var due = [];
    HP.config.habitIds().forEach(function (id) {
      var t = c.times[id];
      if (!validTime(t)) return;
      var diff = nowMin - toMin(t);
      if (diff >= 0 && diff <= GRACE_MIN) due.push(id);
    });
    if (!due.length) return [];

    var fired = readFired(today);
    var score;
    try { score = HP.scoring.dayScore(today); } catch (e) { return []; }
    var out = [];
    due.forEach(function (id) {
      if (fired.ids[id]) return;
      var h = null;
      for (var i = 0; i < score.habits.length; i++) if (score.habits[i].id === id) { h = score.habits[i]; break; }
      if (!h || !h.scheduled || h.done) return;
      fired.ids[id] = true;
      out.push(id);
    });
    if (out.length) {
      writeFired(fired);
      out.forEach(function (id) { notify(id); });
    }
    return out;
  }

  /* ---------- .ics ---------- */
  function utf8Len(cp) { return cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4; }

  /** RFC 5545 folding: max 75 octets per line, continuation lines start with one space. Never splits a character. */
  function fold(line) {
    var chars = Array.from(line);
    var out = [], cur = '', bytes = 0, limit = 75;
    chars.forEach(function (ch) {
      var n = utf8Len(ch.codePointAt(0));
      if (bytes + n > limit) {
        out.push(cur);
        cur = ' ' + ch; bytes = 1 + n; limit = 75;
      } else { cur += ch; bytes += n; }
    });
    out.push(cur);
    return out.join('\r\n');
  }

  function esc(text) {
    return String(text).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  }

  function ymd(d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); }
  function localStamp(d) { return ymd(d) + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00'; }
  function utcStamp(d) {
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
  }

  function scheduledDays(id) {
    var days = HP.store && HP.store.getScheduledDays ? HP.store.getScheduledDays(id) : null;
    if (!Array.isArray(days)) { var h = HP.config.habit(id); days = h ? h.defaultDays : [0, 1, 2, 3, 4, 5, 6]; }
    return days.filter(function (d, i, a) { return d >= 0 && d <= 6 && a.indexOf(d) === i; }).sort(function (a, b) { return a - b; });
  }

  /** First local Date >= now (at the reminder time) falling on one of `days` (Mon=0). */
  function nextOccurrence(days, time, now) {
    var m = TIME_RE.exec(time);
    var hh = parseInt(m[1], 10), mm = parseInt(m[2], 10);
    var todayStr = HP.dates.today();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    for (var i = 0; i < 8; i++) {
      var ds = HP.dates.addDays(todayStr, i);
      if (days.indexOf(HP.dates.dow(ds)) < 0) continue;
      if (i === 0 && nowMin >= hh * 60 + mm) continue;
      var base = HP.dates.parse(ds);
      return new Date(base.getFullYear(), base.getMonth(), base.getDate(), hh, mm, 0);
    }
    return null;
  }

  function buildICS(nowArg) {
    var now = nowArg || new Date();
    var c = cfg();
    var stamp = utcStamp(now);
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//My Health Plan//Reminders//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:' + esc(HP.t('app.name'))
    ];
    if (c.enabled) {
      HP.config.habitIds().forEach(function (id) {
        var t = c.times[id];
        if (!validTime(t)) return;
        var days = scheduledDays(id);
        if (!days.length) return;
        var start = nextOccurrence(days, t, now);
        if (!start) return;
        var end = new Date(start.getTime() + 10 * 60000);
        var rrule = days.length === 7 ? 'FREQ=DAILY' : 'FREQ=WEEKLY;BYDAY=' + days.map(function (d) { return ICS_DAYS[d]; }).join(',');
        var summary = HP.t('app.name') + ': ' + HP.config.name(id);
        var desc = reminderText(id) + ' ' + HP.t('reminders.ics.desc');
        lines.push(
          'BEGIN:VEVENT',
          'UID:hp-reminder-' + id + '-' + t.replace(':', '') + '@my-health-plan',
          'DTSTAMP:' + stamp,
          'DTSTART:' + localStamp(start),
          'DTEND:' + localStamp(end),
          'RRULE:' + rrule,
          'SUMMARY:' + esc(summary),
          'DESCRIPTION:' + esc(desc),
          'TRANSP:TRANSPARENT',
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          'DESCRIPTION:' + esc(summary),
          'TRIGGER:PT0S',
          'END:VALARM',
          'END:VEVENT'
        );
      });
    }
    lines.push('END:VCALENDAR');
    return lines.map(fold).join('\r\n') + '\r\n';
  }

  function hasAnyReminder() {
    var c = cfg();
    if (!c.enabled) return false;
    return HP.config.habitIds().some(function (id) { return validTime(c.times[id]); });
  }

  function downloadICS() {
    if (!hasAnyReminder()) { toast(HP.t('reminders.ics.none')); return false; }
    var blob = new Blob([buildICS()], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'my-health-plan-reminders.ics';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    return true;
  }

  /* ---------- public API ---------- */
  HP.reminders = {
    supported: supported,
    permission: permission,
    /** → Promise<'granted'|'denied'|'default'|'unsupported'> */
    request: function () {
      if (!supported() || !window.Notification.requestPermission) return Promise.resolve('unsupported');
      try {
        var res = window.Notification.requestPermission(function () {}); // legacy callback form is harmless
        return Promise.resolve(res).then(function () { return permission(); }, function () { return permission(); });
      } catch (e) { return Promise.resolve(permission()); }
    },
    start: function () {
      if (timer) return;
      timer = setInterval(function () { check(); }, TICK_MS);
      if (typeof document !== 'undefined' && document.addEventListener) {
        document.addEventListener('visibilitychange', onVisible);
      }
      check();
    },
    stop: function () {
      if (timer) { clearInterval(timer); timer = null; }
      if (typeof document !== 'undefined' && document.removeEventListener) {
        document.removeEventListener('visibilitychange', onVisible);
      }
    },
    check: check,
    /** Fire a sample reminder now (for a "Test" button in Settings). */
    test: function () { return notify('water', HP.t('reminders.test')); },
    buildICS: buildICS,
    downloadICS: downloadICS
  };

  function onVisible() { if (!document.hidden) check(); }
})();
