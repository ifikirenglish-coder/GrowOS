/* core.js — namespace, event bus, tiny DOM helper. Loaded FIRST. Owner: Architect (do not edit unless you are the Architect/QA fixing a bug). */
(function () {
  'use strict';
  var HP = (window.HP = window.HP || {});
  HP.lang = 'bm'; // 'bm' | 'en' — i18n.js changes it via HP.setLang()
  HP.views = {}; // views register here: HP.views.today = {...}

  /* ---------- tiny utils ---------- */
  HP.clamp = function (n, lo, hi) { return Math.min(hi, Math.max(lo, n)); };
  HP.round = function (n, dp) { var f = Math.pow(10, dp || 0); return Math.round(n * f) / f; };
  HP.debounce = function (fn, ms) {
    var t;
    return function () {
      var a = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, a); }, ms == null ? 50 : ms);
    };
  };
  /** Pick a localized string from {bm:'..', en:'..'}. Plain strings pass through. */
  HP.tr = function (obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[HP.lang] != null ? obj[HP.lang] : (obj.en != null ? obj.en : (obj.bm != null ? obj.bm : ''));
  };
  /** Placeholder until i18n.js replaces it. */
  HP.t = HP.t || function (key) { return key; };

  /* ---------- event bus ---------- */
  var handlers = {};
  HP.bus = {
    /** returns an unsubscribe function */
    on: function (evt, fn) {
      (handlers[evt] = handlers[evt] || []).push(fn);
      return function () { HP.bus.off(evt, fn); };
    },
    off: function (evt, fn) {
      handlers[evt] = (handlers[evt] || []).filter(function (f) { return f !== fn; });
    },
    emit: function (evt, payload) {
      (handlers[evt] || []).slice().forEach(function (fn) {
        try { fn(payload); } catch (e) { console.error('[HP.bus] handler for "' + evt + '" failed', e); }
      });
    }
  };
  /* Events (payloads):
     'change'   {type:'init'|'log'|'plan'|'settings'|'profile'|'game'|'import'|'reset', date?, habitId?}
     'lang'     {lang}
     'navigate' {view, params}
     'badge'    {badge}            (new badge unlocked — emitted by HP.gamify.checkProgress)
     'levelup'  {level, name}      (emitted by HP.gamify.checkProgress)
     'perfect'  {date}             (a day just became perfect — emitted by app.js)
  */

  /* ---------- DOM helper ----------
     h('div', {class:'card', onclick:fn, dataset:{fk:'x'}, 'aria-label':'..'}, 'text', childNode, [arr], null)
     Strings become TEXT nodes (safe). Use attrs.html only for trusted static SVG/HTML strings. */
  HP.h = function (tag, attrs) {
    var svgNS = 'http://www.w3.org/2000/svg';
    var isSvg = /^(svg|g|path|circle|rect|line|polyline|polygon|text|defs|linearGradient|stop|title|desc|use|ellipse|clipPath|mask)$/.test(tag);
    var el = isSvg ? document.createElementNS(svgNS, tag) : document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'class' || k === 'className') el.setAttribute('class', v);
        else if (k === 'style' && typeof v === 'object') Object.keys(v).forEach(function (s) {
          if (s.indexOf('--') === 0) el.style.setProperty(s, v[s]); else el.style[s] = v[s];
        });
        else if (k === 'dataset') Object.keys(v).forEach(function (d) { el.dataset[d] = v[d]; });
        else if (k === 'html') el.innerHTML = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'value' && !isSvg) el.value = v;
        else if (k === 'checked' && !isSvg) el.checked = !!v;
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, String(v));
      });
    }
    var add = function (c) {
      if (c == null || c === false || c === true) return;
      if (Array.isArray(c)) return c.forEach(add);
      if (c instanceof Node) return el.appendChild(c);
      el.appendChild(document.createTextNode(String(c)));
    };
    for (var i = 2; i < arguments.length; i++) add(arguments[i]);
    return el;
  };
  HP.$ = function (sel, root) { return (root || document).querySelector(sel); };
  HP.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  /** Replace all children of `el` with `nodes` (node | string | array). */
  HP.mount = function (el, nodes) {
    while (el.firstChild) el.removeChild(el.firstChild);
    var add = function (c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return c.forEach(add);
      el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    };
    add(nodes);
    return el;
  };
})();
