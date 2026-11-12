/* icons.js — hand-drawn 24x24 stroke icon set. Owner: Iconography.
   HP.icons.svg(name, {size, stroke, class, fill, label}) -> SVGElement
   HP.icons.html(name, opts) -> string (trusted static markup)
   HP.icons.names -> array
   opts.fill=true fills icons that look good filled (star, heart, flame, droplet, trophy, crown, medal, moon, sun, zap, bell, play...). */
(function () {
  'use strict';
  var HP = window.HP;

  /* ---------- tiny shape builders (shared by DOM and string output) ---------- */
  function P(d) { return { t: 'path', a: { d: d } }; }
  function C(cx, cy, r) { return { t: 'circle', a: { cx: cx, cy: cy, r: r } }; }
  function L(x1, y1, x2, y2) { return { t: 'line', a: { x1: x1, y1: y1, x2: x2, y2: y2 } }; }
  function R(x, y, w, h, rx) { return { t: 'rect', a: { x: x, y: y, width: w, height: h, rx: rx || 0 } }; }
  function PL(points) { return { t: 'polyline', a: { points: points } }; }
  function PG(points) { return { t: 'polygon', a: { points: points } }; }
  function G(transform, kids) { return { t: 'g', a: { transform: transform }, c: kids }; }

  function f2(n) { return (Math.round(n * 100) / 100).toString(); }
  function polar(cx, cy, r, deg) {
    var a = (deg - 90) * Math.PI / 180;
    return f2(cx + r * Math.cos(a)) + ',' + f2(cy + r * Math.sin(a));
  }
  /** 5-point star polygon, soft because of round joins. */
  function starPoints() {
    var pts = [];
    for (var i = 0; i < 5; i++) {
      pts.push(polar(12, 12.8, 9.6, i * 72));
      pts.push(polar(12, 12.8, 4.3, i * 72 + 36));
    }
    return pts.join(' ');
  }
  /** 8-tooth cog outline. */
  function gearPoints() {
    var pts = [], n = 8, step = 360 / n;
    for (var k = 0; k < n; k++) {
      var a = k * step;
      pts.push(polar(12, 12, 7.4, a - 14));
      pts.push(polar(12, 12, 9.7, a - 8));
      pts.push(polar(12, 12, 9.7, a + 8));
      pts.push(polar(12, 12, 7.4, a + 14));
    }
    return pts.join(' ');
  }

  /* ---------- the icon set ---------- */
  var ICONS = {}, ORDER = [];
  function def(name, kids, fillable) {
    ICONS[name] = { k: kids, f: !!fillable };
    ORDER.push(name);
  }

  // Habits
  def('pill', [
    G('rotate(-45 12 12)', [R(2.5, 7.8, 19, 8.4, 4.2), L(12, 7.8, 12, 16.2)])
  ]);
  def('droplet', [
    P('M12 2.8C9.3 6.2 5.5 10.2 5.5 14.4a6.5 6.5 0 0 0 13 0C18.5 10.2 14.7 6.2 12 2.8Z'),
    P('M8.8 15.2a3.3 3.3 0 0 0 2.4 2.6')
  ], true);
  def('bed', [
    P('M3 19V5'), P('M3 15h18'), P('M21 19v-5a2 2 0 0 0-2-2h-8v3'), C(7, 10.8, 2)
  ]);
  def('walk', [
    C(14, 4.2, 1.9),
    P('M13.2 8.4 11.3 14'),
    P('M12.9 9.4 9.2 10.6 7.6 13.2'),
    P('M12.9 9.4 16.4 11.4 18.6 10.6'),
    P('M11.3 14l3.2 2.8.4 4.2'),
    P('M11.3 14 8.8 17.4 5.6 19.6')
  ]);
  def('utensils', [
    P('M4.5 3v5a2.5 2.5 0 0 0 5 0V3'), P('M7 3v5'), P('M7 11v10'),
    P('M17 3c-2 0-3.2 2.2-3.2 5s1.2 4.5 3.2 4.5 3.2-1.7 3.2-4.5S19 3 17 3Z'), P('M17 12.5V21')
  ]);

  // Rewards and feeling
  def('heart', [
    P('M12 20C5 15.5 3 12 3 8.8A4.8 4.8 0 0 1 12 6.6 4.8 4.8 0 0 1 21 8.8C21 12 19 15.5 12 20Z')
  ], true);
  def('flame', [
    P('M12 2.8c1 3.6 6 6.2 6 11.7a6 6 0 0 1-12 0c0-2.7 1.4-4.3 2.6-5.5.3 1.4 1 2.2 1.8 2.4-.2-3.4.4-6.2 1.6-8.6Z'),
    P('M12 20.2c-1.7 0-2.8-1.1-2.8-2.6 0-1.5 1.2-2.2 2.8-3.9 1.6 1.7 2.8 2.4 2.8 3.9 0 1.5-1.1 2.6-2.8 2.6Z')
  ], true);
  def('trophy', [
    P('M7.5 3.5h9V9a4.5 4.5 0 0 1-9 0V3.5Z'),
    P('M7.5 5H4.5v1.2A3.3 3.3 0 0 0 7.7 9.5'),
    P('M16.5 5h3v1.2a3.3 3.3 0 0 1-3.2 3.3'),
    P('M12 13.5v3.5'), P('M8.5 20.5h7'), P('M9.5 20.5v-1.5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1.5')
  ], true);
  def('star', [PG(starPoints())], true);
  def('medal', [
    P('M8.4 11.2 5.6 3h4.2l2.2 4.6'), P('M15.6 11.2 18.4 3h-4.2L12 7.6'),
    C(12, 15.2, 5.6), C(12, 15.2, 2.3)
  ], true);
  def('crown', [
    PG('3.5,7.5 8,12 12,5 16,12 20.5,7.5 18.8,17.5 5.2,17.5'), P('M5.5 20.8h13')
  ], true);
  def('target', [C(12, 12, 9.5), C(12, 12, 5.5), C(12, 12, 1.2)]);
  def('sparkles', [
    P('M9.5 6.5c.7 4.6 2.2 6.3 7 7-4.8.7-6.3 2.4-7 7-.7-4.6-2.2-6.3-7-7 4.8-.7 6.3-2.4 7-7Z'),
    P('M18.2 2.6c.3 1.9.9 2.6 2.7 2.9-1.8.3-2.4 1-2.7 2.9-.3-1.9-.9-2.6-2.7-2.9 1.8-.3 2.4-1 2.7-2.9Z'),
    P('M18.4 15.2c.2 1.4.7 1.9 2 2.1-1.3.2-1.8.7-2 2.1-.2-1.4-.7-1.9-2-2.1 1.3-.2 1.8-.7 2-2.1Z')
  ], true);
  def('zap', [PG('13,2.5 4.5,13.5 11,13.5 10,21.5 19.5,10 13,10')], true);
  def('leaf', [
    P('M19.5 4.5C10 4.5 4.5 9 4.5 15.5c0 1.5.4 2.8 1 3.9 1.1.6 2.4 1 3.9 1C16 20.4 19.5 14 19.5 4.5Z'),
    P('M5.5 19.5C8 14 11.5 10.5 15.5 8.5')
  ]);
  def('sprout', [
    P('M12 21v-8'),
    P('M12 13c0-4-2.5-6.5-7.5-6.5 0 4 2.5 6.5 7.5 6.5Z'),
    P('M12 11c0-3.5 2.2-5.8 7-5.8 0 3.8-2.4 5.8-7 5.8Z'),
    P('M8.5 21h7')
  ]);
  def('smile', [C(12, 12, 9.5), P('M8 14a4.6 4.6 0 0 0 8 0'), P('M9 9.6h.01'), P('M15 9.6h.01')]);
  def('shield', [
    P('M12 2.8l7.5 2.8v6c0 4.8-3.2 8.4-7.5 9.9-4.3-1.5-7.5-5.1-7.5-9.9v-6L12 2.8Z'),
    PL('8.8,12 11.2,14.4 15.4,9.8')
  ]);

  // Navigation and structure
  def('home', [
    PL('3.5,11 12,3.5 20.5,11'), P('M5.5 9.5v11h13v-11'), P('M10 20.5V15h4v5.5')
  ]);
  def('chart-bar', [R(3.8, 12, 4.4, 8.5, 1.2), R(9.8, 3.5, 4.4, 17, 1.2), R(15.8, 8.5, 4.4, 12, 1.2)]);
  def('calendar', [
    R(3, 4.5, 18, 16.5, 3), L(3, 10, 21, 10), L(8, 2.5, 8, 6.5), L(16, 2.5, 16, 6.5),
    P('M8 14.5h.01'), P('M12 14.5h.01'), P('M16 14.5h.01'), P('M8 17.8h.01'), P('M12 17.8h.01')
  ]);
  def('settings', [PG(gearPoints()), C(12, 12, 3)]);
  def('user', [C(12, 8, 4), P('M4.5 20.5c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5')]);
  def('globe', [
    C(12, 12, 9.5), L(2.5, 12, 21.5, 12),
    P('M12 2.5c2.6 2.6 4 5.8 4 9.5s-1.4 6.9-4 9.5c-2.6-2.6-4-5.8-4-9.5s1.4-6.9 4-9.5Z')
  ]);
  def('chevron-left', [PL('14.5,5.5 8,12 14.5,18.5')]);
  def('chevron-right', [PL('9.5,5.5 16,12 9.5,18.5')]);
  def('chevron-up', [PL('5.5,14.5 12,8 18.5,14.5')]);
  def('chevron-down', [PL('5.5,9.5 12,16 18.5,9.5')]);

  // Actions and status
  def('check', [PL('4.5,12.5 9.8,17.8 19.5,7')]);
  def('check-circle', [C(12, 12, 9.5), PL('7.8,12.4 10.7,15.3 16.3,9')]);
  def('plus', [L(12, 5, 12, 19), L(5, 12, 19, 12)]);
  def('minus', [L(5, 12, 19, 12)]);
  def('x', [L(6, 6, 18, 18), L(18, 6, 6, 18)]);
  def('lock', [R(4.8, 10.5, 14.4, 10.5, 2.6), P('M8 10.5v-3a4 4 0 0 1 8 0v3'), P('M12 14.6v2.6')]);
  def('bell', [
    P('M18 9.5a6 6 0 0 0-12 0c0 5.2-2 6.6-2 7.8h16c0-1.2-2-2.6-2-7.8Z'), P('M10 20.5a2.3 2.3 0 0 0 4 0')
  ], true);
  def('download', [P('M12 3.5v11'), PL('7.5,10.5 12,15 16.5,10.5'), P('M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2')]);
  def('upload', [P('M12 15.5v-12'), PL('7.5,8 12,3.5 16.5,8'), P('M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2')]);
  def('trash', [
    P('M4 6.5h16'), P('M9 6.5V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5v2'),
    P('M6 6.5l1 12.8a2 2 0 0 0 2 1.7h6a2 2 0 0 0 2-1.7l1-12.8'), P('M10 11v6'), P('M14 11v6')
  ]);
  def('edit', [
    P('M4 20l.9-4.2L16.3 4.4a2.2 2.2 0 0 1 3.1 0l.2.2a2.2 2.2 0 0 1 0 3.1L8.2 19.1 4 20Z'), P('M14 6.8l3.2 3.2')
  ]);
  def('moon', [P('M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z')], true);
  def('sun', [
    C(12, 12, 4.2), L(12, 2.5, 12, 4.8), L(12, 19.2, 12, 21.5), L(2.5, 12, 4.8, 12), L(19.2, 12, 21.5, 12),
    L(5.3, 5.3, 6.9, 6.9), L(17.1, 17.1, 18.7, 18.7), L(18.7, 5.3, 17.1, 6.9), L(6.9, 17.1, 5.3, 18.7)
  ], true);
  def('clock', [C(12, 12, 9.5), PL('12,6.5 12,12 15.5,14')]);
  def('refresh', [P('M20.5 12a8.5 8.5 0 1 1-8.5-8.5c2.4 0 4.6 1 6.2 2.6l2.3 2.4'), PL('20.5,3.5 20.5,8.5 15.5,8.5')]);
  def('info', [C(12, 12, 9.5), P('M12 11v5.5'), P('M12 7.8h.01')]);
  def('share', [
    C(18, 5.5, 2.8), C(6, 12, 2.8), C(18, 18.5, 2.8), L(8.5, 10.7, 15.5, 6.8), L(8.5, 13.3, 15.5, 17.2)
  ]);
  def('play', [PG('7.5,4.5 19,12 7.5,19.5')], true);
  def('pause', [R(6, 4.5, 4, 15, 1.2), R(14, 4.5, 4, 15, 1.2)], true);

  // Extras (not required by the spec, handy for other agents)
  def('arrow-left', [L(20, 12, 4.5, 12), PL('10.5,6 4.5,12 10.5,18')]);
  def('arrow-right', [L(4, 12, 19.5, 12), PL('13.5,6 19.5,12 13.5,18')]);
  def('undo', [P('M4.5 9h10a5 5 0 0 1 0 10H9'), PL('8.5,4.5 4,9 8.5,13.5')]);
  def('trending-up', [PL('3,17 9.5,10.5 13.5,14.5 21,7'), PL('15,7 21,7 21,13')]);
  def('lightbulb', [
    P('M9 17.5h6'), P('M10 20.8h4'),
    P('M8.8 14.4C7.2 13.2 6 11.4 6 9.3a6 6 0 0 1 12 0c0 2.1-1.2 3.9-2.8 5.1-.5.4-.7.9-.7 1.6h-5c0-.7-.2-1.2-.7-1.6Z')
  ]);
  def('gift', [
    R(3.5, 9, 17, 4, 1.2), P('M5 13v6.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V13'), L(12, 9, 12, 21),
    P('M12 9C9.5 9 7.3 8 7.3 6.2 7.3 4.8 8.4 4 9.5 4 11 4 12 6 12 9Z'),
    P('M12 9c2.5 0 4.7-1 4.7-2.8C16.7 4.8 15.6 4 14.5 4 13 4 12 6 12 9Z')
  ]);
  def('flag', [P('M5.5 21V3.5'), P('M5.5 4.5h12l-2.8 4 2.8 4h-12')]);
  def('search', [C(10.5, 10.5, 6.5), L(15.3, 15.3, 20.5, 20.5)]);
  def('copy', [R(8.5, 8.5, 12, 12, 2.5), P('M15.5 8.5V6A2.5 2.5 0 0 0 13 3.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5')]);
  def('dots', [P('M5.5 12h.01'), P('M12 12h.01'), P('M18.5 12h.01')]);

  var FALLBACK = [C(12, 12, 8.5)];
  var ALIASES = {
    water: 'droplet', supplement: 'pill', supplements: 'pill', sleep: 'bed', fasting: 'utensils', gear: 'settings', cog: 'settings',
    'bar-chart': 'chart-bar', chart: 'chart-bar', progress: 'chart-bar', today: 'home', plan: 'calendar', rewards: 'trophy',
    tick: 'check', close: 'x', add: 'plus', remove: 'minus', delete: 'trash', pencil: 'edit', refresh: 'refresh', reload: 'refresh',
    bolt: 'zap', fire: 'flame', happy: 'smile', language: 'globe', alarm: 'bell', notification: 'bell', time: 'clock',
    plant: 'sprout', seedling: 'sprout', award: 'medal', rating: 'star'
  };

  /* ---------- rendering ---------- */
  function resolve(name) {
    var key = String(name == null ? '' : name).toLowerCase().replace(/[_\s]+/g, '-');
    if (ICONS[key]) return ICONS[key];
    if (ALIASES[key] && ICONS[ALIASES[key]]) return ICONS[ALIASES[key]];
    return null;
  }

  function num(v, dflt, lo, hi) {
    var n = parseFloat(v);
    if (!isFinite(n)) n = dflt;
    return Math.min(hi, Math.max(lo, n));
  }

  function rootAttrs(def_, opts) {
    var o = opts || {};
    var size = num(o.size, 24, 4, 512);
    var stroke = num(o.stroke, 2, 0.25, 6);
    var filled = !!o.fill && !!(def_ && def_.f);
    var a = {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size, height: size, viewBox: '0 0 24 24',
      fill: filled ? 'currentColor' : 'none',
      stroke: 'currentColor', 'stroke-width': stroke,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      focusable: 'false'
    };
    var cls = 'hp-icon' + (o.class ? ' ' + o.class : (o.className ? ' ' + o.className : ''));
    a['class'] = cls;
    if (o.label) { a.role = 'img'; a['aria-label'] = String(o.label); }
    else a['aria-hidden'] = 'true';
    return a;
  }

  function toNode(s) {
    var el = HP.h(s.t, s.a);
    if (s.c) s.c.forEach(function (k) { el.appendChild(toNode(k)); });
    return el;
  }

  function esc(v) {
    return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function attrStr(a) {
    return Object.keys(a).map(function (k) { return k + '="' + esc(a[k]) + '"'; }).join(' ');
  }
  function toStr(s) {
    var inner = s.c ? s.c.map(toStr).join('') : '';
    return '<' + s.t + ' ' + attrStr(s.a) + (s.c ? '>' + inner + '</' + s.t + '>' : '/>');
  }

  function svg(name, opts) {
    var d = resolve(name);
    var kids = d ? d.k : FALLBACK;
    var el = HP.h('svg', rootAttrs(d, opts));
    el.style.flex = 'none';
    kids.forEach(function (k) { el.appendChild(toNode(k)); });
    return el;
  }

  function html(name, opts) {
    var d = resolve(name);
    var kids = d ? d.k : FALLBACK;
    var a = rootAttrs(d, opts);
    a.style = 'flex:none';
    return '<svg ' + attrStr(a) + '>' + kids.map(toStr).join('') + '</svg>';
  }

  HP.icons = {
    svg: svg,
    html: html,
    names: ORDER.slice(),
    has: function (name) { return !!resolve(name); }
  };
})();
