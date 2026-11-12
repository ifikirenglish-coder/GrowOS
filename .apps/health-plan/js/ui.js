/* ui.js — shared UI components: toast, sheet, confirm, stepper, switch, segmented, chip, empty state,
   confetti, celebrate, haptics, sound, animateNumber. Owner: UI Components. Loaded after charts, before reminders. */
(function () {
  'use strict';
  var HP = window.HP;
  var ui = (HP.ui = HP.ui || {});

  /* ---------- i18n (i18n.js loads before this file) ---------- */
  if (HP.i18n && HP.i18n.register) {
    HP.i18n.register({
      bm: {
        'ui.close': 'Tutup',
        'ui.dismiss': 'Tutup pemberitahuan',
        'ui.dialog': 'Dialog',
        'ui.increase': 'Tambah {label}',
        'ui.decrease': 'Kurang {label}'
      },
      en: {
        'ui.close': 'Close',
        'ui.dismiss': 'Dismiss notification',
        'ui.dialog': 'Dialog',
        'ui.increase': 'Increase {label}',
        'ui.decrease': 'Decrease {label}'
      }
    });
  }
  function T(key, params) { return String(HP.t(key, params) || ''); }

  /* ---------- helpers ---------- */
  function reduced() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }
  function icon(name, size) {
    try {
      if (!name || !HP.icons || !HP.icons.svg) return null;
      var el = HP.icons.svg(name, { size: size || 20 });
      if (el && el.setAttribute) { el.setAttribute('aria-hidden', 'true'); el.setAttribute('focusable', 'false'); }
      return el;
    } catch (e) { return null; }
  }
  function settings() {
    try { return (HP.store && HP.store.getSettings && HP.store.getSettings()) || {}; } catch (e) { return {}; }
  }
  function decimals(n) {
    var s = String(n);
    return s.indexOf('.') < 0 ? 0 : s.split('.')[1].length;
  }
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function focusables(root) {
    return HP.$$(FOCUSABLE, root).filter(function (el) { return el.getClientRects().length > 0; });
  }

  /* ================= TOAST ================= */
  var stack = null;
  var TOAST_MAX = 3;
  var TOAST_ICON = { success: 'check-circle', info: 'info', badge: 'medal', level: 'star' };

  function getStack() {
    if (stack && document.body.contains(stack)) return stack;
    stack = HP.h('div', { class: 'toast-stack', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'false', 'aria-relevant': 'additions text' });
    document.body.appendChild(stack);
    return stack;
  }
  function liveToasts() {
    return stack ? HP.$$('.toast', stack).filter(function (t) { return !t._gone; }) : [];
  }
  function dismissToast(el, instant) {
    if (!el || el._gone) return;
    el._gone = true;
    clearTimeout(el._timer);
    var remove = function () { if (el.parentNode) el.parentNode.removeChild(el); };
    if (instant || reduced()) { remove(); return; }
    el.classList.add('is-leaving');
    setTimeout(remove, 220);
  }
  function armToast(el, duration) {
    clearTimeout(el._timer);
    if (duration > 0) el._timer = setTimeout(function () { dismissToast(el); }, duration);
  }

  ui.toast = function (message, opts) {
    opts = opts || {};
    var type = TOAST_ICON[opts.type] ? opts.type : 'info';
    var duration = opts.duration == null ? 3200 : opts.duration;
    var host = getStack();
    var key = typeof message === 'string' ? type + '|' + message : null;

    if (key) { // same message already showing: refresh it instead of stacking duplicates
      var same = liveToasts().filter(function (t) { return t.dataset.key === key; })[0];
      if (same) {
        armToast(same, duration);
        same.classList.remove('is-pulse');
        void same.offsetWidth;
        same.classList.add('is-pulse');
        return { dismiss: function () { dismissToast(same); } };
      }
    }

    var lead;
    if (opts.emoji) lead = HP.h('span', { class: 'toast-icon toast-emoji', 'aria-hidden': 'true' }, opts.emoji);
    else {
      var ic = icon(opts.icon || TOAST_ICON[type], 20);
      lead = ic ? HP.h('span', { class: 'toast-icon' }, ic) : null;
    }
    var el = HP.h('div', { class: 'toast toast-' + type, title: null }, lead, HP.h('span', { class: 'toast-text' }, message));
    if (key) el.dataset.key = key;
    el.addEventListener('click', function () { dismissToast(el); });
    host.appendChild(el);

    var live = liveToasts();
    while (live.length > TOAST_MAX) dismissToast(live.shift(), true);
    armToast(el, duration);
    return { dismiss: function () { dismissToast(el); } };
  };

  /* ================= SHEET ================= */
  var sheetStack = [];
  var lockCount = 0;
  var sheetUid = 0;
  var docListening = false;

  function lockScroll() {
    if (lockCount++ === 0) {
      document.documentElement.classList.add('hp-scroll-lock');
      document.body.classList.add('hp-scroll-lock');
    }
  }
  function unlockScroll() {
    if (lockCount > 0 && --lockCount === 0) {
      document.documentElement.classList.remove('hp-scroll-lock');
      document.body.classList.remove('hp-scroll-lock');
    }
  }
  function topSheet() { return sheetStack[sheetStack.length - 1]; }

  function onDocKey(e) {
    var top = topSheet();
    if (!top) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      e.stopPropagation();
      top.close();
      return;
    }
    if (e.key !== 'Tab') return;
    var f = focusables(top.el);
    var a = document.activeElement;
    if (!f.length) { e.preventDefault(); top.el.focus(); return; }
    var first = f[0], last = f[f.length - 1];
    if (!top.el.contains(a)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && (a === first || a === top.el)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  }
  function onDocFocusIn(e) {
    var top = topSheet();
    if (!top || top.backdrop.contains(e.target)) return;
    if (stack && stack.contains(e.target)) return;
    var f = focusables(top.el);
    (f[0] || top.el).focus({ preventScroll: true });
  }
  function listenDoc(on) {
    if (on === docListening) return;
    docListening = on;
    var fn = on ? 'addEventListener' : 'removeEventListener';
    document[fn]('keydown', onDocKey, true);
    document[fn]('focusin', onDocFocusIn);
  }

  function restoreFocus(opener) {
    var target = opener;
    if (target && !document.body.contains(target) && target.dataset && target.dataset.fk) {
      target = document.querySelector('[data-fk="' + String(target.dataset.fk).replace(/"/g, '\\"') + '"]');
    }
    if (target && target.focus && document.body.contains(target)) {
      try { target.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    }
  }

  function enableDrag(grip, sheetEl, close) {
    var startY = null, dy = 0;
    grip.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      startY = e.clientY; dy = 0;
      try { grip.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      sheetEl.classList.add('is-dragging');
    });
    grip.addEventListener('pointermove', function (e) {
      if (startY == null) return;
      dy = Math.max(0, e.clientY - startY);
      sheetEl.style.transform = 'translateY(' + dy + 'px)';
    });
    var end = function () {
      if (startY == null) return;
      startY = null;
      sheetEl.classList.remove('is-dragging');
      var far = dy > 90;
      sheetEl.style.transform = '';
      if (far) close();
    };
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
  }

  ui.sheet = function (opts) {
    opts = opts || {};
    var id = 'hp-sheet-' + (++sheetUid);
    var opener = document.activeElement;
    var closed = false;
    var api = {};

    var titleEl = opts.title ? HP.h('h2', { class: 'sheet-title', id: id + '-title' }, opts.title) : null;
    var closeBtn = HP.h('button', { type: 'button', class: 'sheet-close', 'aria-label': T('ui.close'), onclick: function () { api.close(); } }, icon('x', 22));
    var grip = HP.h('div', { class: 'sheet-grip', 'aria-hidden': 'true' }, HP.h('span', { class: 'sheet-handle' }));
    var head = HP.h('div', { class: 'sheet-head' }, titleEl || HP.h('span', { class: 'sheet-title' }), closeBtn);
    var body = HP.h('div', { class: 'sheet-body' }, opts.content);

    var actionBtns = (opts.actions || []).map(function (a) {
      var kind = a.kind === 'danger' || a.kind === 'ghost' ? a.kind : 'primary';
      var b = HP.h('button', { type: 'button', class: 'btn btn-' + kind }, a.label);
      if (a.focus) b.setAttribute('data-autofocus', '');
      b.addEventListener('click', function (ev) {
        try { if (a.onClick) a.onClick(ev); } catch (err) { console.error('[HP.ui.sheet] action failed', err); }
        if (!a.keepOpen) api.close();
      });
      return b;
    });
    var actions = actionBtns.length ? HP.h('div', { class: 'sheet-actions' }, actionBtns) : null;

    var sheetEl = HP.h('div', {
      class: 'sheet', id: id, role: 'dialog', 'aria-modal': 'true', tabindex: '-1',
      'aria-labelledby': titleEl ? id + '-title' : null,
      'aria-label': titleEl ? null : T('ui.dialog')
    }, grip, head, body, actions);
    var backdrop = HP.h('div', { class: 'sheet-backdrop' }, sheetEl);

    var downTarget = null;
    backdrop.addEventListener('pointerdown', function (e) { downTarget = e.target; });
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop && (downTarget === null || downTarget === backdrop)) api.close();
      downTarget = null;
    });
    enableDrag(grip, sheetEl, function () { api.close(); });

    var entry = { el: sheetEl, backdrop: backdrop, close: function () { api.close(); } };

    api.el = sheetEl;
    api.close = function () {
      if (closed) return;
      closed = true;
      var i = sheetStack.indexOf(entry);
      if (i >= 0) sheetStack.splice(i, 1);
      unlockScroll();
      if (!sheetStack.length) listenDoc(false);
      backdrop.classList.remove('is-open');
      backdrop.style.pointerEvents = 'none';
      restoreFocus(opener);
      var remove = function () { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); };
      if (reduced()) remove(); else setTimeout(remove, 300);
      try { if (opts.onClose) opts.onClose(); } catch (err) { console.error('[HP.ui.sheet] onClose failed', err); }
    };

    document.body.appendChild(backdrop);
    sheetStack.push(entry);
    lockScroll();
    listenDoc(true);

    if (reduced()) backdrop.classList.add('is-open');
    else requestAnimationFrame(function () { requestAnimationFrame(function () { if (!closed) backdrop.classList.add('is-open'); }); });

    var auto = backdrop.querySelector('[data-autofocus],[autofocus]');
    (auto || sheetEl).focus({ preventScroll: true });
    return api;
  };

  ui.closeSheets = function () {
    sheetStack.slice().reverse().forEach(function (s) { s.close(); });
  };

  ui.confirm = function (opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var result = false;
      var danger = !!opts.danger;
      ui.sheet({
        title: opts.title || T('common.confirm'),
        content: opts.message ? HP.h('p', { class: 'sheet-message' }, opts.message) : null,
        actions: [
          { label: opts.cancelLabel || T('common.cancel'), kind: 'ghost', focus: danger, onClick: function () { result = false; } },
          { label: opts.confirmLabel || T('common.confirm'), kind: danger ? 'danger' : 'primary', focus: !danger, onClick: function () { result = true; } }
        ],
        onClose: function () { resolve(result); }
      });
    });
  };

  /* ================= STEPPER ================= */
  ui.stepper = function (o) {
    o = o || {};
    var min = o.min == null ? 0 : +o.min;
    var max = o.max == null ? 100 : +o.max;
    var step = o.step > 0 ? +o.step : 1;
    var dp = decimals(step);
    var label = o.label || '';
    var value;
    var liveTimer;

    function clampv(v) { return HP.round(HP.clamp(+v || 0, min, max), 4); }
    function text(v) { return o.format ? String(o.format(v)) : String(HP.round(v, Math.max(dp, 2))) + (o.unit ? ' ' + HP.tr(o.unit) : ''); }
    value = clampv(o.value);

    var numEl = HP.h('span', { class: 'stepper-num' });
    var unitEl = o.unit && !o.format ? HP.h('span', { class: 'stepper-unit' }, HP.tr(o.unit)) : null;
    var valEl = HP.h('div', {
      class: 'stepper-value', role: 'spinbutton', tabindex: '0', 'aria-label': label || null,
      'aria-valuemin': min, 'aria-valuemax': max
    }, numEl, unitEl);
    var live = HP.h('span', { class: 'stepper-live', 'aria-live': 'polite', 'aria-atomic': 'true' });
    var minus, plus;

    function render() {
      numEl.textContent = o.format ? String(o.format(value)) : String(HP.round(value, Math.max(dp, 2)));
      valEl.setAttribute('aria-valuenow', String(value));
      valEl.setAttribute('aria-valuetext', text(value));
      minus.setAttribute('aria-disabled', value <= min ? 'true' : 'false');
      plus.setAttribute('aria-disabled', value >= max ? 'true' : 'false');
    }
    function setValue(v) {
      var nv = clampv(v);
      if (nv === value) return false;
      value = nv;
      render();
      if (!reduced()) { valEl.classList.remove('is-bump'); void valEl.offsetWidth; valEl.classList.add('is-bump'); }
      clearTimeout(liveTimer);
      liveTimer = setTimeout(function () {
        if (document.activeElement !== valEl) live.textContent = text(value);
      }, 300);
      if (o.onChange) o.onChange(value);
      return true;
    }

    function makeBtn(dir) {
      var b = HP.h('button', {
        type: 'button', class: 'stepper-btn stepper-' + (dir > 0 ? 'plus' : 'minus'),
        'aria-label': T(dir > 0 ? 'ui.increase' : 'ui.decrease', { label: label }).trim()
      }, icon(dir > 0 ? 'plus' : 'minus', 24));
      var timer = null, reps = 0, byPointer = false;
      function stop() { clearTimeout(timer); timer = null; }
      function tick() {
        if (!setValue(value + dir * step)) { stop(); return; }
        reps++;
        timer = setTimeout(tick, reps > 12 ? 45 : 90);
      }
      b.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        byPointer = true; reps = 0;
        try { b.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        setValue(value + dir * step);
        stop();
        timer = setTimeout(tick, 420);
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) {
        b.addEventListener(ev, function () { stop(); setTimeout(function () { byPointer = false; }, 350); });
      });
      b.addEventListener('click', function () {
        if (byPointer) { byPointer = false; return; } // already applied on pointerdown
        setValue(value + dir * step); // keyboard / assistive tech activation
      });
      b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      return b;
    }
    minus = makeBtn(-1);
    plus = makeBtn(1);

    valEl.addEventListener('keydown', function (e) {
      var handled = true;
      switch (e.key) {
        case 'ArrowUp': case 'ArrowRight': setValue(value + step); break;
        case 'ArrowDown': case 'ArrowLeft': setValue(value - step); break;
        case 'PageUp': setValue(value + step * 5); break;
        case 'PageDown': setValue(value - step * 5); break;
        case 'Home': setValue(min); break;
        case 'End': setValue(max); break;
        default: handled = false;
      }
      if (handled) e.preventDefault();
    });

    var root = HP.h('div', { class: 'stepper' }, minus, valEl, plus, live);
    root.setValue = function (v) { setValue(v); };
    render();
    return root;
  };

  /* ================= SWITCH ================= */
  ui.toggleSwitch = function (o) {
    o = o || {};
    var on = !!o.checked;
    var el = HP.h('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(on), 'aria-label': o.label || null },
      HP.h('span', { class: 'switch-track', 'aria-hidden': 'true' }, HP.h('span', { class: 'switch-thumb' })));
    el.addEventListener('click', function () {
      on = !on;
      el.setAttribute('aria-checked', String(on));
      if (o.onChange) o.onChange(on);
    });
    el.setChecked = function (v) { on = !!v; el.setAttribute('aria-checked', String(on)); };
    return el;
  };

  /* ================= SEGMENTED ================= */
  ui.segmented = function (o) {
    o = o || {};
    var options = o.options || [];
    var value = o.value;
    var root = HP.h('div', { class: 'segmented', role: 'radiogroup', 'aria-label': o.label || null });
    var btns = options.map(function (op, i) {
      var b = HP.h('button', { type: 'button', class: 'segmented-opt', role: 'radio' }, op.label);
      b.addEventListener('click', function () { select(i, false); });
      b.addEventListener('keydown', function (e) {
        var n = options.length, to = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (i + 1) % n;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (i - 1 + n) % n;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = n - 1;
        if (to >= 0) { e.preventDefault(); select(to, true); }
      });
      return b;
    });
    function paint() {
      var anyOn = options.some(function (op) { return op.value === value; });
      btns.forEach(function (b, i) {
        var on = options[i].value === value;
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.tabIndex = on || (!anyOn && i === 0) ? 0 : -1;
      });
    }
    function select(i, focus) {
      if (focus) btns[i].focus();
      if (options[i].value === value) return;
      value = options[i].value;
      paint();
      if (o.onChange) o.onChange(value);
    }
    btns.forEach(function (b) { root.appendChild(b); });
    paint();
    return root;
  };

  /* ================= CHIP / EMPTY STATE ================= */
  ui.chip = function (txt, o) {
    o = o || {};
    var tone = { neutral: 1, brand: 1, ok: 1, warn: 1 }[o.tone] ? o.tone : 'neutral';
    return HP.h('span', { class: 'chip chip-' + tone }, icon(o.icon, 14), txt);
  };

  ui.emptyState = function (o) {
    o = o || {};
    var glyph = null;
    if (o.icon) {
      var known = HP.icons && HP.icons.names && HP.icons.names.indexOf(o.icon) >= 0;
      glyph = known ? icon(o.icon, 32) : HP.h('span', { class: 'empty-emoji', 'aria-hidden': 'true' }, o.icon);
    }
    return HP.h('div', { class: 'empty' },
      glyph ? HP.h('div', { class: 'empty-icon' }, glyph) : null,
      o.title ? HP.h('div', { class: 'empty-title', role: 'heading', 'aria-level': '3' }, o.title) : null,
      o.body ? HP.h('p', { class: 'empty-body' }, o.body) : null,
      o.action ? HP.h('button', { type: 'button', class: 'btn btn-primary', onclick: o.action.onClick }, o.action.label) : null);
  };

  /* ================= ANIMATE NUMBER ================= */
  ui.animateNumber = function (el, to, o) {
    if (!el) return function () {};
    o = o || {};
    var from = o.from == null ? 0 : +o.from;
    var ms = o.ms == null ? 600 : o.ms;
    var dp = o.dp || 0;
    var suffix = o.suffix || '';
    to = +to || 0;
    var show = function (v) { el.textContent = String(HP.round(v, dp).toFixed(dp)) + suffix; };
    if (el._hpAnim) cancelAnimationFrame(el._hpAnim);
    if (reduced() || ms <= 0 || from === to) { show(to); el._hpAnim = 0; return function () {}; }
    var t0 = null;
    function frame(ts) {
      if (t0 == null) t0 = ts;
      var p = Math.min(1, (ts - t0) / ms);
      var eased = 1 - Math.pow(1 - p, 3);
      show(from + (to - from) * eased);
      el._hpAnim = p < 1 ? requestAnimationFrame(frame) : 0;
    }
    show(from);
    el._hpAnim = requestAnimationFrame(frame);
    return function () { if (el._hpAnim) cancelAnimationFrame(el._hpAnim); el._hpAnim = 0; };
  };

  /* ================= CONFETTI ================= */
  var CONFETTI_CLASSES = ['c0', 'c1', 'c2', 'c3', 'c4']; // brand orange, amber, green, blue, purple (see ui.css)
  var MAX_PIECES = 150;
  var livePieces = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }

  /** origin: {x,y} in px, or fractions of the viewport when both are between 0 and 1. */
  ui.confetti = function (o) {
    if (reduced() || !document.body) return;
    o = o || {};
    var count = HP.clamp(Math.round(o.count == null ? 60 : o.count), 0, MAX_PIECES);
    if (!count || livePieces + count > MAX_PIECES * 2) return;
    var w = window.innerWidth || 390, h = window.innerHeight || 700;
    var ox = w / 2, oy = h * 0.38;
    if (o.origin && isFinite(o.origin.x) && isFinite(o.origin.y)) {
      var frac = o.origin.x <= 1 && o.origin.y <= 1;
      ox = frac ? o.origin.x * w : o.origin.x;
      oy = frac ? o.origin.y * h : o.origin.y;
    }
    var spread = Math.min(260, 110 + count * 1.4);
    var layer = HP.h('div', { class: 'confetti-layer', 'aria-hidden': 'true' });
    for (var i = 0; i < count; i++) {
      var up = -rand(90, 90 + spread * 0.9);
      var p = HP.h('span', { class: 'confetti-piece ' + CONFETTI_CLASSES[i % CONFETTI_CLASSES.length] + (Math.random() < 0.3 ? ' confetti-round' : '') });
      p.style.left = ox + 'px';
      p.style.top = oy + 'px';
      p.style.width = Math.round(rand(6, 10)) + 'px';
      p.style.height = Math.round(rand(8, 14)) + 'px';
      p.style.setProperty('--dx', Math.round(rand(-spread, spread)) + 'px');
      p.style.setProperty('--up', Math.round(up) + 'px');
      p.style.setProperty('--dy', Math.round(rand(80, 340)) + 'px');
      p.style.setProperty('--rot', Math.round(rand(-540, 540)) + 'deg');
      p.style.animationDuration = rand(1.1, 1.65).toFixed(2) + 's';
      p.style.animationDelay = rand(0, 0.08).toFixed(2) + 's';
      layer.appendChild(p);
    }
    livePieces += count;
    document.body.appendChild(layer);
    setTimeout(function () {
      livePieces = Math.max(0, livePieces - count);
      if (layer.parentNode) layer.parentNode.removeChild(layer);
    }, 1850);
  };

  /* ================= HAPTIC / SOUND ================= */
  ui.haptic = function (pattern) {
    if (settings().haptics === false) return false;
    try { return !!(navigator.vibrate && navigator.vibrate(pattern == null ? 10 : pattern)); } catch (e) { return false; }
  };

  var AC = window.AudioContext || window.webkitAudioContext;
  var audioCtx = null;
  var gestured = false;
  function unlockAudio() {
    gestured = true;
    if (audioCtx && audioCtx.state === 'suspended') { try { audioCtx.resume(); } catch (e) { /* ignore */ } }
  }
  ['pointerdown', 'touchstart', 'keydown', 'click'].forEach(function (ev) {
    document.addEventListener(ev, unlockAudio, { capture: true, passive: true });
  });
  function getCtx() {
    if (!AC || !gestured) return null; // browsers block audio before a user gesture
    if (!audioCtx) { try { audioCtx = new AC(); } catch (e) { return null; } }
    if (audioCtx.state === 'suspended') { try { audioCtx.resume(); } catch (e) { /* ignore */ } }
    return audioCtx;
  }
  var SOUNDS = {
    tick: [[1500, 0, 0.035, 'triangle', 0.05]],
    success: [[659.25, 0, 0.12, 'sine', 0.09], [987.77, 0.11, 0.22, 'sine', 0.09]],
    level: [[523.25, 0, 0.12, 'sine', 0.09], [659.25, 0.1, 0.12, 'sine', 0.09], [783.99, 0.2, 0.34, 'sine', 0.1]]
  };
  ui.playSound = function (name) {
    if (settings().sound === false) return;
    var notes = SOUNDS[name];
    var ctx = notes && getCtx();
    if (!ctx) return;
    try {
      var t0 = ctx.currentTime + 0.01;
      notes.forEach(function (n) {
        var osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.type = n[3];
        osc.frequency.value = n[0];
        gain.gain.setValueAtTime(0.0001, t0 + n[1]);
        gain.gain.exponentialRampToValueAtTime(n[4], t0 + n[1] + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + n[1] + n[2]);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0 + n[1]);
        osc.stop(t0 + n[1] + n[2] + 0.03);
      });
    } catch (e) { /* audio is optional */ }
  };

  /* ================= CELEBRATE ================= */
  var CELEBRATE = {
    habit: { count: 26, origin: { x: 0.5, y: 0.55 }, haptic: 12, sound: 'tick' },
    perfect: { count: 90, origin: { x: 0.5, y: 0.35 }, haptic: [30, 40, 30, 40, 60], sound: 'success' },
    badge: { count: 60, origin: { x: 0.5, y: 0.4 }, haptic: [20, 30, 40], sound: 'success' },
    level: { count: 120, origin: { x: 0.5, y: 0.3 }, haptic: [30, 50, 30, 50, 90], sound: 'level' }
  };
  ui.celebrate = function (kind) {
    var c = CELEBRATE[kind] || CELEBRATE.habit;
    ui.confetti({ count: c.count, origin: c.origin });
    ui.haptic(c.haptic);
    ui.playSound(c.sound);
  };
})();
