/* app.js — App shell: boot, routing, nav, HUD, theme/lang, change handling, welcome sheet. Loaded LAST. Owner: App Shell agent. */
(function () {
  'use strict';
  var HP = window.HP;

  var VIEW_IDS = ['today', 'progress', 'plan', 'rewards', 'settings'];
  var FALLBACK_ICON = { today: 'home', progress: 'chart-bar', plan: 'calendar', rewards: 'trophy', settings: 'settings' };
  var WELCOME_KEY = 'hp.welcomed';
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  /* ---------- strings ---------- */
  if (HP.i18n && HP.i18n.register) {
    HP.i18n.register({
      bm: {
        'shell.nav': 'Menu utama',
        'shell.streakLabel': 'Rentetan {n} {unit}. Buka ganjaran.',
        'shell.levelLabel': 'Tahap {n}, {name}, {xp} XP. Buka ganjaran.',
        'app.errorTitle': 'Maaf, skrin ini bermasalah',
        'app.errorBody': 'Data anda selamat. Cuba muat semula halaman.',
        'app.reload': 'Muat semula',
        'app.perfect': 'Hari sempurna! {xp} XP hari ini',
        'app.perfectPlain': 'Hari sempurna!',
        'app.badge': 'Lencana baharu: {name}',
        'app.levelUp': 'Naik tahap! Tahap {level}: {name}',
        'app.welcome.title': 'Selamat datang!',
        'app.welcome.body': 'Jejak lima tabiat kesihatan harian anda di satu tempat. Mudah, ringkas dan tanpa tekanan.',
        'app.welcome.name': 'Nama anda (pilihan)',
        'app.welcome.namePh': 'Contoh: Aisyah',
        'app.welcome.lang': 'Bahasa',
        'app.welcome.start': 'Mula'
      },
      en: {
        'shell.nav': 'Main menu',
        'shell.streakLabel': 'Streak: {n} {unit}. Open rewards.',
        'shell.levelLabel': 'Level {n}, {name}, {xp} XP. Open rewards.',
        'app.errorTitle': 'Sorry, this screen had a problem',
        'app.errorBody': 'Your data is safe. Try reloading the page.',
        'app.reload': 'Reload',
        'app.perfect': 'Perfect day! {xp} XP today',
        'app.perfectPlain': 'Perfect day!',
        'app.badge': 'New badge: {name}',
        'app.levelUp': 'Level up! Level {level}: {name}',
        'app.welcome.title': 'Welcome!',
        'app.welcome.body': 'Track your five daily health habits in one place. Simple, short and no pressure.',
        'app.welcome.name': 'Your name (optional)',
        'app.welcome.namePh': 'Example: Aisyah',
        'app.welcome.lang': 'Language',
        'app.welcome.start': 'Start'
      }
    });
  }

  /* ---------- state ---------- */
  var currentId = null;
  var selectedDate = null; // null = follow "today"
  var navItems = {};
  var hud = {};
  var perfectCache = {};
  var lastToday = null;
  var booted = false;

  /* ---------- small helpers ---------- */
  function today() {
    if (HP.dates && HP.dates.today) return HP.dates.today();
    var d = new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function settings() {
    try { return (HP.store && HP.store.getSettings()) || {}; } catch (e) { return {}; }
  }
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignore */ }
  }
  function viewEl() { return document.getElementById('view'); }
  function jumpTo(y) {
    try { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, y); }
  }
  function safe(label, fn) {
    try { return fn(); } catch (e) { console.error('[HP.app] ' + label + ' failed', e); return undefined; }
  }
  function showFatal(err) {
    console.error('[HP.app] fatal', err);
    var el = document.getElementById('boot-error');
    if (el) el.className = 'show';
  }

  /* ---------- date ---------- */
  function getDate() { return selectedDate || today(); }
  function setDate(str) {
    if (!str || !DATE_RE.test(str)) selectedDate = null;
    else selectedDate = (str === today()) ? null : str;
    primePerfect(getDate());
  }

  /* ---------- theme ---------- */
  function applyTheme() {
    var theme = settings().theme;
    var root = document.documentElement;
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
    var dark = theme === 'dark';
    if (theme !== 'light' && theme !== 'dark') {
      dark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', dark ? '#151515' : '#FF6B1A');
    var metaScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaScheme) metaScheme.setAttribute('content', theme === 'light' ? 'light' : (theme === 'dark' ? 'dark' : 'light dark'));
  }

  function applyLang() {
    var lang = settings().lang === 'en' ? 'en' : 'bm';
    if (HP.setLang) HP.setLang(lang);
  }

  /* ---------- title / brand ---------- */
  function viewTitle(id) {
    var v = HP.views[id];
    return HP.t((v && v.titleKey) || ('nav.' + id));
  }
  function updateTitle() {
    document.title = (currentId ? viewTitle(currentId) + ' \u00B7 ' : '') + HP.t('app.name');
    var c = viewEl();
    if (c && currentId) c.setAttribute('aria-label', viewTitle(currentId));
  }
  function updateBrand() {
    var el = document.querySelector('.app-brand-name');
    if (el) el.textContent = HP.t('app.name');
  }

  /* ---------- nav ---------- */
  function iconNode(name, size, cls) {
    try {
      if (HP.icons && HP.icons.svg && name) {
        var s = HP.icons.svg(name, { size: size, class: cls || '' });
        if (s && s.setAttribute) { s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false'); }
        return s;
      }
    } catch (e) { console.error(e); }
    return null;
  }

  function buildNav() {
    var nav = document.getElementById('nav');
    if (!nav) {
      nav = HP.h('nav', { class: 'app-nav', id: 'nav' });
      var app = document.getElementById('app') || document.body;
      app.appendChild(nav);
    }
    nav.setAttribute('aria-label', HP.t('shell.nav'));
    navItems = {};
    var items = VIEW_IDS.map(function (id) {
      var v = HP.views[id];
      var label = HP.h('span', { class: 'nav-label' }, HP.t('nav.' + id));
      var a = HP.h('a', {
        class: 'nav-item', href: '#/' + id, dataset: { view: id },
        onclick: function (e) { onNavClick(e, id); }
      }, iconNode((v && v.icon) || FALLBACK_ICON[id], 24, 'nav-icon'), label);
      navItems[id] = { el: a, label: label };
      return a;
    });
    HP.mount(nav, items);
  }

  function updateNavLabels() {
    var nav = document.getElementById('nav');
    if (nav) nav.setAttribute('aria-label', HP.t('shell.nav'));
    VIEW_IDS.forEach(function (id) {
      if (navItems[id]) navItems[id].label.textContent = HP.t('nav.' + id);
    });
  }

  function updateNav() {
    VIEW_IDS.forEach(function (id) {
      var it = navItems[id];
      if (!it) return;
      if (id === currentId) it.el.setAttribute('aria-current', 'page');
      else it.el.removeAttribute('aria-current');
    });
  }

  function onNavClick(e, id) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    if (id === 'today') setDate(null); // tapping the Today tab always means "today"
    if (id === currentId) {
      jumpTo(0);
      var c = viewEl();
      if (c) c.scrollTop = 0;
      if (id === 'today') renderActive();
      return;
    }
    navigate(id);
  }

  /* ---------- HUD ---------- */
  function buildHud() {
    hud.streakBtn = document.getElementById('hud-streak');
    hud.streakNum = document.getElementById('hud-streak-num');
    hud.levelBtn = document.getElementById('hud-level');
    hud.levelEmoji = document.getElementById('hud-level-emoji');
    hud.levelNum = document.getElementById('hud-level-num');
    hud.xpFill = document.getElementById('hud-xp-fill');
    var toRewards = function () { navigate('rewards'); };
    if (hud.streakBtn) hud.streakBtn.addEventListener('click', toRewards);
    if (hud.levelBtn) hud.levelBtn.addEventListener('click', toRewards);
  }

  function updateHud() {
    var g = null;
    try { g = HP.gamify && HP.gamify.compute(); } catch (e) { console.error('[HP.app] gamify.compute failed', e); }
    if (!g) return;
    var n = (g.streak && g.streak.current) || 0;
    if (hud.streakNum) hud.streakNum.textContent = String(n);
    if (hud.streakBtn) {
      var sl = HP.t('shell.streakLabel', { n: n, unit: HP.t(n === 1 ? 'common.day' : 'common.days') });
      hud.streakBtn.setAttribute('aria-label', sl);
      hud.streakBtn.setAttribute('title', sl);
    }
    if (hud.levelEmoji && g.levelEmoji) hud.levelEmoji.textContent = g.levelEmoji;
    if (hud.levelNum) hud.levelNum.textContent = String(g.level);
    if (hud.xpFill) hud.xpFill.style.width = Math.round(HP.clamp(g.levelPct || 0, 0, 1) * 100) + '%';
    if (hud.levelBtn) {
      var ll = HP.t('shell.levelLabel', { n: g.level, name: HP.tr(g.levelName), xp: g.xp });
      hud.levelBtn.setAttribute('aria-label', ll);
      hud.levelBtn.setAttribute('title', ll);
    }
  }

  /* ---------- rendering ---------- */
  function errorCard() {
    return HP.h('div', { class: 'page' },
      HP.h('div', { class: 'card stack', role: 'alert' },
        HP.h('h2', { class: 'h3' }, HP.t('app.errorTitle')),
        HP.h('p', { class: 'muted' }, HP.t('app.errorBody')),
        HP.h('div', { class: 'row' },
          HP.h('button', { class: 'btn btn-primary', type: 'button', onclick: function () { location.reload(); } }, HP.t('app.reload')))));
  }

  function renderActive(opts) {
    var container = viewEl();
    if (!container || !currentId) return;
    var fresh = !!(opts && opts.fresh);
    var fk = null, sel = null, winY = 0, boxY = 0;
    if (!fresh) {
      var ae = document.activeElement;
      if (ae && ae !== document.body && container.contains(ae) && ae.dataset && ae.dataset.fk) {
        fk = ae.dataset.fk;
        try { if (typeof ae.selectionStart === 'number') sel = [ae.selectionStart, ae.selectionEnd]; } catch (e) { /* ignore */ }
      }
      winY = window.scrollY || window.pageYOffset || 0;
      boxY = container.scrollTop || 0;
    }
    var view = HP.views[currentId];
    container.setAttribute('data-view', currentId);
    try {
      if (!view || typeof view.render !== 'function') throw new Error('View "' + currentId + '" is not registered');
      view.render(container);
    } catch (err) {
      console.error('[HP.app] view "' + currentId + '" failed to render', err);
      try { HP.mount(container, errorCard()); } catch (e2) { console.error(e2); }
    }
    if (fresh) {
      jumpTo(0);
      container.scrollTop = 0;
      try { container.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      return;
    }
    jumpTo(winY);
    container.scrollTop = boxY;
    if (fk) {
      var el = container.querySelector('[data-fk="' + fk.replace(/(["\\])/g, '\\$1') + '"]');
      if (el && typeof el.focus === 'function') {
        try { el.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
        if (sel && typeof el.setSelectionRange === 'function') {
          try { el.setSelectionRange(sel[0], sel[1]); } catch (e) { /* ignore */ }
        }
      }
    }
  }
  var scheduleRender = HP.debounce(function () { renderActive(); }, 30);

  /* ---------- routing ---------- */
  function parseHash() {
    var m = /^#\/?([a-z]+)/.exec(window.location.hash || '');
    var id = m && m[1];
    return VIEW_IDS.indexOf(id) >= 0 ? id : 'today';
  }
  function syncHash(id, replace) {
    var want = '#/' + id;
    if (window.location.hash === want) return;
    try {
      if (replace) window.history.replaceState(null, '', want);
      else window.history.pushState(null, '', want);
    } catch (e) {
      window.location.hash = want;
    }
  }
  function onHashChange() {
    var id = parseHash();
    if (id !== currentId) navigate(id);
  }

  function navigate(id, opts) {
    opts = opts || {};
    if (VIEW_IDS.indexOf(id) < 0) id = 'today';
    if (opts.date) setDate(opts.date);
    var changed = id !== currentId;
    currentId = id;
    syncHash(id, opts.replace);
    updateNav();
    updateTitle();
    renderActive({ fresh: changed });
    HP.bus.emit('navigate', { view: id, params: opts });
  }

  /* ---------- perfect-day detection ---------- */
  function dayPerfect(date) {
    try { return !!HP.scoring.dayScore(date).perfect; } catch (e) { console.error('[HP.app] dayScore failed', e); return null; }
  }
  function primePerfect(date) {
    if (!HP.scoring || !date || perfectCache[date] !== undefined) return;
    var p = dayPerfect(date);
    if (p !== null) perfectCache[date] = p;
  }
  function primeAll() {
    if (!HP.scoring || !HP.dates) return;
    var t = today();
    primePerfect(t);
    primePerfect(getDate());
    for (var i = 1; i <= 14; i++) primePerfect(HP.dates.addDays(t, -i));
  }
  function detectPerfect(date) {
    if (!HP.scoring || !date) return;
    var after = dayPerfect(date);
    if (after === null) return;
    var before = perfectCache[date];
    perfectCache[date] = after;
    if (before === false && after && !(HP.dates && HP.dates.isFuture(date))) firePerfect(date);
  }
  function firePerfect(date) {
    HP.bus.emit('perfect', { date: date });
    var xp = 0;
    try { xp = (HP.gamify && HP.gamify.xpForDay(date)) || 0; } catch (e) { /* ignore */ }
    var msg = xp > 0 ? HP.t('app.perfect', { xp: xp }) : HP.t('app.perfectPlain');
    if (HP.ui) {
      safe('celebrate', function () { HP.ui.celebrate('perfect'); });
      safe('toast', function () { HP.ui.toast(msg, { type: 'success', emoji: '\uD83C\uDF1F' }); });
    }
  }

  /* ---------- bus handlers ---------- */
  function runCheckProgress() {
    if (HP.gamify && HP.gamify.checkProgress) safe('checkProgress', function () { HP.gamify.checkProgress(); });
  }

  function onChange(p) {
    var type = p && p.type;
    if (type === 'settings') {
      applyTheme();
      var lang = settings().lang;
      if (lang && lang !== HP.lang && HP.setLang) HP.setLang(lang); // emits 'lang'
    }
    if (type === 'log') {
      detectPerfect(p.date);
    } else if (type === 'init' || type === 'plan' || type === 'import' || type === 'reset') {
      perfectCache = {};
      primeAll();
    }
    if (type !== 'game' && type !== 'settings' && type !== 'profile') runCheckProgress();
    updateHud();
    scheduleRender();
  }

  function onLang() {
    updateNavLabels();
    updateBrand();
    updateHud();
    updateTitle();
    scheduleRender();
  }

  function onBadge(p) {
    var b = p && p.badge;
    if (!b || !HP.ui) return;
    safe('badge toast', function () {
      HP.ui.toast(HP.t('app.badge', { name: HP.tr(b.name) }), { type: 'badge', emoji: b.emoji });
      HP.ui.celebrate('badge');
    });
  }

  function onLevelUp(p) {
    if (!p || !HP.ui) return;
    safe('level toast', function () {
      var emoji = '';
      try { emoji = HP.gamify.compute().levelEmoji || ''; } catch (e) { /* ignore */ }
      HP.ui.toast(HP.t('app.levelUp', { level: p.level, name: HP.tr(p.name) }), { type: 'level', emoji: emoji || undefined });
      HP.ui.celebrate('level');
    });
  }

  function checkRollover() {
    if (document.visibilityState === 'hidden') return;
    var t = today();
    if (t === lastToday) return;
    lastToday = t;
    perfectCache = {};
    primeAll();
    updateHud();
    renderActive();
  }

  /* ---------- welcome sheet ---------- */
  function markWelcomed() { lsSet(WELCOME_KEY, '1'); }

  function maybeWelcome() {
    var name = '';
    try { name = (HP.store.getProfile() || {}).name || ''; } catch (e) { /* ignore */ }
    if (name || lsGet(WELCOME_KEY)) return;
    openWelcome({ name: '' });
  }

  function openWelcome(state) {
    if (!HP.ui || !HP.ui.sheet) return;
    var superseded = false;
    var handle = null;
    var input = HP.h('input', {
      class: 'input', id: 'welcome-name', type: 'text', maxlength: 40, autocomplete: 'given-name',
      enterkeyhint: 'done', placeholder: HP.t('app.welcome.namePh'), value: state.name || ''
    });
    var langCtl = HP.ui.segmented ? HP.ui.segmented({
      options: [{ value: 'bm', label: 'Bahasa Malaysia' }, { value: 'en', label: 'English' }],
      value: HP.lang,
      label: HP.t('app.welcome.lang'),
      onChange: function (v) {
        if (v === HP.lang) return;
        state.name = input.value;
        superseded = true;
        if (handle) handle.close();
        try { HP.store.setSettings({ lang: v }); } catch (e) { console.error(e); }
        setTimeout(function () { openWelcome(state); }, 260);
      }
    }) : null;

    var content = HP.h('div', { class: 'stack' },
      HP.h('p', { class: 'muted' }, HP.t('app.welcome.body')),
      HP.h('div', { class: 'field' },
        HP.h('label', { for: 'welcome-name' }, HP.t('app.welcome.name')),
        input),
      langCtl ? HP.h('div', { class: 'field' },
        HP.h('span', { class: 'small muted' }, HP.t('app.welcome.lang')),
        langCtl) : null);

    handle = HP.ui.sheet({
      title: HP.t('app.welcome.title'),
      content: content,
      actions: [{
        label: HP.t('app.welcome.start'), kind: 'primary',
        onClick: function () {
          var name = String(input.value || '').trim().slice(0, 40);
          if (name) safe('setProfile', function () { HP.store.setProfile({ name: name }); });
          markWelcomed();
        }
      }],
      onClose: function () { if (!superseded) markWelcomed(); }
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    try {
      if (!HP.store || !HP.views) throw new Error('Core modules missing');
      HP.store.init();
      applyLang();
      applyTheme();
      buildHud();
      buildNav();
      updateBrand();

      HP.bus.on('change', onChange);
      HP.bus.on('lang', onLang);
      HP.bus.on('badge', onBadge);
      HP.bus.on('levelup', onLevelUp);
      window.addEventListener('hashchange', onHashChange);
      window.addEventListener('popstate', onHashChange);
      document.addEventListener('visibilitychange', checkRollover);
      window.addEventListener('focus', checkRollover);
      if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var onMq = function () { if (!settings().theme || settings().theme === 'auto') applyTheme(); };
        if (mq.addEventListener) mq.addEventListener('change', onMq);
        else if (mq.addListener) mq.addListener(onMq);
      }

      if (HP.pwa && HP.pwa.register) safe('pwa.register', function () { HP.pwa.register(); });
      if (HP.reminders && HP.reminders.start) safe('reminders.start', function () { HP.reminders.start(); });

      lastToday = today();
      primeAll();
      runCheckProgress(); // silent when history already exists
      updateHud();
      navigate(parseHash(), { replace: true });
      booted = true;
      HP.app.booted = true;
      setTimeout(function () { safe('welcome', maybeWelcome); }, 400);
    } catch (err) {
      showFatal(err);
    }
  }

  /* ---------- public API ---------- */
  HP.app = {
    booted: false,
    navigate: navigate,
    getDate: getDate,
    setDate: setDate,
    renderActive: function () { renderActive(); },
    current: function () { return currentId; }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
