/* charts.js — HP.charts: pure DOM/SVG chart builders. Owner: Charts & Data-Viz.
   Every builder returns an Element, uses CSS variables / currentColor (light + dark safe),
   animates in through .ch-anim classes (charts.css; static under prefers-reduced-motion).
   Common option: animate:false disables the intro animation (use it for re-renders you don't want to replay).
   Chart text is only used for aria-labels; pass `label`/`ariaLabel` to localize, otherwise plain English
   (or the shared keys common.of / status.* when the i18n module has them). */
(function () {
  'use strict';
  var HP = window.HP;
  var h = HP.h;
  var uid = 0;

  /* ---------- helpers ---------- */
  function num(v, d) {
    v = typeof v === 'number' ? v : parseFloat(v);
    return isFinite(v) ? v : (d == null ? 0 : d);
  }
  function unit(v) { return Math.min(1, Math.max(0, num(v, 0))); }
  function pct100(v) { return Math.round(unit(v) * 100); }
  function r1(n) { return String(Math.round(n * 10) / 10); }
  function fx(n) { return (Math.round(n * 100) / 100).toString(); }
  function anim(o) { return o && o.animate === false ? '' : ' ch-anim'; }
  /** Drop null/undefined style entries (HP.h would set them to "undefined"). */
  function sv(obj) {
    var out = {};
    Object.keys(obj).forEach(function (k) { if (obj[k] != null && obj[k] !== '') out[k] = obj[k]; });
    return out;
  }
  /** Aria-only text: shared i18n key when available, else plain English. */
  function tx(key, fallback) {
    try { if (HP.i18n && HP.i18n.has && HP.i18n.has(key)) return HP.t(key); } catch (e) { /* ignore */ }
    return fallback;
  }
  function iconNode(icon, size) {
    if (icon instanceof Node) return icon;
    if (typeof icon === 'string' && icon) {
      if (HP.icons && HP.icons.svg && (!HP.icons.names || HP.icons.names.indexOf(icon) >= 0)) {
        return HP.icons.svg(icon, { size: size, stroke: 2 });
      }
      return document.createTextNode(icon); // allow an emoji / glyph
    }
    return null;
  }
  function cssColor(c) {
    if (!c) return null;
    return String(c).indexOf('--') === 0 ? 'var(' + c + ')' : c;
  }

  /* ---------- ring ---------- */
  function arc(cx, cy, r, stroke, v, color, delay) {
    var c = 2 * Math.PI * r;
    var g = h('g');
    g.appendChild(h('circle', { class: 'ch-ring-track', cx: cx, cy: cy, r: r, fill: 'none', 'stroke-width': stroke }));
    if (v > 0) {
      g.appendChild(h('circle', {
        class: 'ch-ring-arc', cx: cx, cy: cy, r: r, fill: 'none', 'stroke-width': stroke,
        'stroke-linecap': 'round', 'stroke-dasharray': fx(c), 'stroke-dashoffset': fx(c * (1 - v)),
        transform: 'rotate(-90 ' + cx + ' ' + cy + ')',
        style: sv({ '--ch-c': fx(c), '--ch-color': cssColor(color), '--ch-delay': delay ? delay + 'ms' : null })
      }));
    }
    return g;
  }

  function ring(o) {
    o = o || {};
    var size = num(o.size, 120) || 120;
    var stroke = num(o.stroke, 12);
    var v = unit(o.value);
    var pct = Math.round(v * 100);
    var cx = size / 2;
    var r = Math.max(1, (size - stroke) / 2);
    var svg = h('svg', { class: 'ch-ring-svg', viewBox: '0 0 ' + size + ' ' + size, 'aria-hidden': 'true', focusable: 'false' },
      arc(cx, cx, r, stroke, v, o.color, 0));
    if (o.track) svg.querySelector('.ch-ring-track').style.setProperty('--ch-track', cssColor(o.track));

    var label = o.label;
    if (label == null && !o.icon && o.sublabel == null) label = pct + '%';
    var ic = iconNode(o.icon, Math.round(size * 0.24));
    var center = h('div', { class: 'ch-ring-center' },
      ic ? h('span', { class: 'ch-ring-icon' }, ic) : null,
      label != null && label !== '' ? h('span', { class: 'ch-ring-label' }, String(label)) : null,
      o.sublabel != null && o.sublabel !== '' ? h('span', { class: 'ch-ring-sub' }, String(o.sublabel)) : null);

    var name = o.ariaLabel || (o.label != null && o.label !== '' ? String(o.label) : (o.sublabel ? String(o.sublabel) : 'Progress'));
    return h('div', {
      class: 'ch-ring' + anim(o), role: 'progressbar',
      'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct,
      'aria-valuetext': pct + '%' + (o.sublabel && o.ariaLabel ? '' : (o.sublabel ? ', ' + o.sublabel : '')),
      'aria-label': name,
      style: { '--ch-size': size + 'px' }
    }, svg, center);
  }

  /* ---------- multiRing ---------- */
  function multiRing(o) {
    o = o || {};
    var size = num(o.size, 180) || 180;
    var stroke = num(o.stroke, 14);
    var gap = num(o.gap, 4);
    var rings = o.rings || [];
    var cx = size / 2;
    var svg = h('svg', { class: 'ch-ring-svg', viewBox: '0 0 ' + size + ' ' + size, 'aria-hidden': 'true', focusable: 'false' });
    var parts = [];
    rings.forEach(function (rg, i) {
      var r = size / 2 - stroke / 2 - i * (stroke + gap);
      var v = unit(rg && rg.value);
      parts.push((rg && rg.label ? rg.label + ' ' : '') + Math.round(v * 100) + '%');
      if (r < stroke * 0.9) return; // too small to draw legibly
      svg.appendChild(arc(cx, cx, r, stroke, v, rg && rg.color, i * 120));
    });
    var c = o.center;
    var center = c == null || c === '' ? null : h('div', { class: 'ch-mring-center' }, c instanceof Node ? c : String(c));
    return h('div', {
      class: 'ch-ring ch-mring' + anim(o), role: 'img',
      'aria-label': o.ariaLabel || (parts.length ? parts.join(', ') : 'No data'),
      style: { '--ch-size': size + 'px' }
    }, svg, center);
  }

  /* ---------- bars (HTML flex columns; scales with container, crisp text) ---------- */
  function bars(o) {
    o = o || {};
    var data = (o.data || []).map(function (d) {
      d = d || {};
      return { label: d.label == null ? '' : String(d.label), value: Math.max(0, num(d.value, 0)), color: d.color, highlight: !!d.highlight };
    });
    var max = num(o.max, 0);
    if (!(max > 0)) max = data.reduce(function (m, d) { return Math.max(m, d.value); }, 0);
    if (!(max > 0)) max = 1;
    var height = num(o.height, 140);
    var fmt = typeof o.formatValue === 'function' ? o.formatValue : r1;
    var hasHl = data.some(function (d) { return d.highlight; });
    var step = data.length > 12 ? Math.ceil(data.length / 8) : 1;

    var cols = data.map(function (d, i) {
      var p = Math.min(1, d.value / max);
      var stack = h('div', { class: 'ch-bar-stack', style: { height: (p * 100).toFixed(1) + '%', minHeight: d.value > 0 ? '4px' : '0' } },
        o.showValues && d.value > 0 ? h('span', { class: 'ch-bar-val' }, fmt(d.value)) : null,
        h('div', { class: 'ch-bar-fill', style: sv({ '--ch-color': cssColor(d.color), '--ch-delay': Math.min(i, 14) * 40 + 'ms' }) }));
      var showLabel = i % step === 0 || i === data.length - 1;
      return h('div', { class: 'ch-bar-col' + (d.highlight ? ' ch-hl' : (hasHl ? ' ch-dim' : '')) },
        h('div', { class: 'ch-bar-track' }, stack),
        h('span', { class: 'ch-bar-label' }, showLabel ? h('span', null, d.label) : null));
    });
    var summary = o.ariaLabel || (data.length ? data.map(function (d) { return d.label + ' ' + fmt(d.value); }).join(', ') : 'No data');
    return h('div', {
      class: 'ch-bars' + anim(o) + (o.showValues ? ' ch-bars-vals' : '') + (data.length > 14 ? ' ch-bars-dense' : ''), role: 'img', 'aria-label': summary,
      style: { '--ch-h': height + 'px' }
    }, cols.length ? cols : h('div', { class: 'ch-bar-track ch-bars-empty' }));
  }

  /* ---------- line ---------- */
  function monoPath(P) {
    var n = P.length;
    var d = 'M' + fx(P[0].x) + ' ' + fx(P[0].y);
    if (n === 1) return d;
    if (n === 2) return d + 'L' + fx(P[1].x) + ' ' + fx(P[1].y);
    var dx = [], m = [], t = [], i;
    for (i = 0; i < n - 1; i++) { dx[i] = P[i + 1].x - P[i].x; m[i] = (P[i + 1].y - P[i].y) / dx[i]; }
    t[0] = m[0]; t[n - 1] = m[n - 2];
    for (i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (i = 0; i < n - 1; i++) {
      if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue; }
      var a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b;
      if (s > 9) { var k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i]; }
    }
    for (i = 0; i < n - 1; i++) {
      d += 'C' + fx(P[i].x + dx[i] / 3) + ' ' + fx(P[i].y + t[i] * dx[i] / 3) + ' ' +
        fx(P[i + 1].x - dx[i] / 3) + ' ' + fx(P[i + 1].y - t[i + 1] * dx[i] / 3) + ' ' +
        fx(P[i + 1].x) + ' ' + fx(P[i + 1].y);
    }
    return d;
  }

  function line(o) {
    o = o || {};
    var pts = (o.points || []).map(function (p) {
      var v = p && p.value != null ? parseFloat(p.value) : NaN;
      return { label: p && p.label != null ? String(p.label) : '', v: isFinite(v) ? v : null };
    });
    var min = num(o.min, 0), max = num(o.max, 100);
    if (!(max > min)) max = min + 1;
    var H = Math.max(80, num(o.height, 140));
    var area = o.area !== false;
    var fmt = typeof o.formatValue === 'function' ? o.formatValue : r1;
    var valid = pts.filter(function (p) { return p.v != null; });

    var summary;
    if (o.ariaLabel) summary = o.ariaLabel;
    else if (!valid.length) summary = 'No data';
    else {
      var vs = valid.map(function (p) { return p.v; });
      var avg = vs.reduce(function (a, b) { return a + b; }, 0) / vs.length;
      summary = (o.label ? o.label + '. ' : '') + valid.length + ' points. Latest ' + fmt(vs[vs.length - 1]) +
        ', average ' + fmt(avg) + ', from ' + fmt(Math.min.apply(null, vs)) + ' to ' + fmt(Math.max.apply(null, vs)) + '.';
    }

    var wrap = h('div', {
      class: 'ch-line' + anim(o), role: 'img', 'aria-label': summary,
      style: sv({ '--ch-color': cssColor(o.color), height: H + 'px' })
    });
    var lastW = 0, redraws = 0;

    function draw(W, animated) {
      var padL = 30, padR = 10, padT = 10, padB = 22;
      var iw = Math.max(20, W - padL - padR), ih = Math.max(30, H - padT - padB);
      var yOf = function (v) { return padT + ih - (HP.clamp(v, min, max) - min) / (max - min) * ih; };
      var n = pts.length;
      var xOf = function (i) { return n === 1 ? padL + iw / 2 : padL + iw * i / (n - 1); };
      var svg = h('svg', { viewBox: '0 0 ' + fx(W) + ' ' + H, width: '100%', height: H, 'aria-hidden': 'true', focusable: 'false' });
      var gid = 'ch-lg' + (++uid);
      var defs = h('defs', null, h('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 },
        h('stop', { offset: '0%', 'stop-color': 'currentColor', 'stop-opacity': '0.32' }),
        h('stop', { offset: '100%', 'stop-color': 'currentColor', 'stop-opacity': '0' })));
      svg.appendChild(defs);

      [min, (min + max) / 2, max].forEach(function (g, gi) {
        var y = yOf(g);
        svg.appendChild(h('line', { class: gi === 0 ? 'ch-axis-base' : 'ch-grid', x1: padL, x2: W - padR, y1: fx(y), y2: fx(y) }));
        svg.appendChild(h('text', { class: 'ch-axis', x: padL - 6, y: fx(y + 3.5), 'text-anchor': 'end' }, fmt(g)));
      });

      if (!valid.length) {
        svg.appendChild(h('text', { class: 'ch-axis ch-empty-text', x: fx(W / 2), y: fx(padT + ih / 2 + 4), 'text-anchor': 'middle' }, o.emptyLabel || 'No data yet'));
        return svg;
      }

      // x labels: up to ~5, always first and last
      var want = n <= 7 ? n : 5, shown = {};
      for (var k = 0; k < want; k++) shown[Math.round(k * (n - 1) / Math.max(1, want - 1))] = true;
      pts.forEach(function (p, i) {
        if (!shown[i] || !p.label) return;
        svg.appendChild(h('text', {
          class: 'ch-axis', x: fx(xOf(i)), y: H - 6,
          'text-anchor': n > 1 && i === 0 ? 'start' : (n > 1 && i === n - 1 ? 'end' : 'middle')
        }, p.label));
      });

      // runs of consecutive valid points (gaps for missing values)
      var runs = [], cur = [];
      pts.forEach(function (p, i) {
        if (p.v == null) { if (cur.length) runs.push(cur); cur = []; return; }
        cur.push({ x: xOf(i), y: yOf(p.v), i: i });
      });
      if (cur.length) runs.push(cur);
      var base = padT + ih;
      var cls = animated ? ' ch-line-anim' : '';
      runs.forEach(function (run) {
        if (run.length < 2) return;
        var d = monoPath(run);
        if (area) {
          svg.appendChild(h('path', { class: 'ch-line-area' + cls, d: d + 'L' + fx(run[run.length - 1].x) + ' ' + fx(base) + 'L' + fx(run[0].x) + ' ' + fx(base) + 'Z', fill: 'url(#' + gid + ')', stroke: 'none' }));
        }
        svg.appendChild(h('path', { class: 'ch-line-path' + cls, d: d, pathLength: 1, fill: 'none' }));
      });
      var lastIdx = -1;
      for (var q = pts.length - 1; q >= 0; q--) if (pts[q].v != null) { lastIdx = q; break; }
      runs.forEach(function (run) {
        run.forEach(function (pt) {
          if (!(o.showDots || run.length === 1 || pt.i === lastIdx)) return;
          var p = pts[pt.i];
          svg.appendChild(h('circle', { class: 'ch-dot' + cls, cx: fx(pt.x), cy: fx(pt.y), r: pt.i === lastIdx ? 4 : 3 },
            h('title', null, (p.label ? p.label + ': ' : '') + fmt(p.v))));
        });
      });
      return svg;
    }

    function render(W, animated) {
      lastW = W;
      HP.mount(wrap, draw(W, animated));
    }
    render(320, true);
    if (typeof ResizeObserver === 'function') {
      var ro = new ResizeObserver(function (entries) {
        var w = Math.round(entries[0].contentRect.width);
        if (w < 60 || Math.abs(w - lastW) < 4) return;
        render(w, redraws++ === 0 && o.animate !== false);
      });
      ro.observe(wrap);
    }
    return wrap;
  }

  /* ---------- sparkline ---------- */
  function sparkline(values, o) {
    o = o || {};
    var W = num(o.width, 80), H = num(o.height, 24), pad = 3;
    var vs = (values || []).map(function (v) { return parseFloat(v); }).filter(isFinite);
    var svg = h('svg', {
      class: 'ch-spark' + anim(o), viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
      style: sv({ '--ch-color': cssColor(o.color) })
    });
    var label = o.label;
    if (!vs.length) {
      svg.appendChild(h('line', { class: 'ch-spark-empty', x1: pad, x2: W - pad, y1: H / 2, y2: H / 2 }));
      svg.setAttribute('aria-label', label || 'No data');
      return svg;
    }
    var lo = Math.min.apply(null, vs), hi = Math.max.apply(null, vs);
    var xOf = function (i) { return vs.length === 1 ? W / 2 : pad + (W - 2 * pad) * i / (vs.length - 1); };
    var yOf = function (v) { return hi === lo ? H / 2 : H - pad - (v - lo) / (hi - lo) * (H - 2 * pad); };
    if (vs.length > 1) {
      svg.appendChild(h('polyline', {
        class: 'ch-spark-line', pathLength: 1, fill: 'none',
        points: vs.map(function (v, i) { return fx(xOf(i)) + ',' + fx(yOf(v)); }).join(' ')
      }));
    }
    svg.appendChild(h('circle', { class: 'ch-spark-dot', cx: fx(xOf(vs.length - 1)), cy: fx(yOf(vs[vs.length - 1])), r: 2.5 }));
    svg.setAttribute('aria-label', label || ('Trend: ' + vs.length + ' values, from ' + r1(vs[0]) + ' to ' + r1(vs[vs.length - 1])));
    return svg;
  }

  /* ---------- heatmap ---------- */
  var DAY_MS = 86400000;
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s));
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : NaN;
  }
  function fmtDate(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + '-' + p2(d.getUTCMonth() + 1) + '-' + p2(d.getUTCDate());
  }
  function dateText(s) {
    try { if (HP.dates && HP.dates.label) return HP.dates.label(s, { style: 'long' }); } catch (e) { /* ignore */ }
    return s;
  }
  function heatLevel(v) { v = unit(v); return v <= 0 ? 0 : (v <= 0.34 ? 1 : (v <= 0.67 ? 2 : (v < 0.995 ? 3 : 4))); }

  function heatmap(o) {
    o = o || {};
    var cell = num(o.cell, 14), gap = num(o.gap, 3);
    var mon = o.weekStartsMonday !== false;
    var byDate = {}, mss = [];
    (o.days || []).forEach(function (d) {
      var ms = d ? parseDate(d.date) : NaN;
      if (isNaN(ms)) return;
      byDate[fmtDate(ms)] = d; mss.push(ms);
    });
    var interactive = typeof o.onSelect === 'function';
    var rowOf = function (ms) { var w = (new Date(ms).getUTCDay() + 6) % 7; return mon ? w : (w + 1) % 7; };
    var dowOfRow = function (r) { return mon ? r : (r + 6) % 7; };
    var wrap = h('div', {
      class: 'ch-heat' + anim(o),
      style: sv({ '--ch-cell': cell + 'px', '--ch-gap': gap + 'px', '--ch-color': cssColor(o.colorVar) })
    });
    if (!mss.length) {
      wrap.setAttribute('role', 'img'); wrap.setAttribute('aria-label', o.label || 'No data');
      wrap.appendChild(h('div', { class: 'ch-heat-grid ch-heat-emptygrid' }));
      return wrap;
    }
    var first = Math.min.apply(null, mss), last = Math.max.apply(null, mss);
    var gridStart = first - rowOf(first) * DAY_MS;
    var nW = Math.floor((last - gridStart) / (7 * DAY_MS)) + 1;
    var words = o.labels || {};
    var restW = words.rest || tx('status.rest', 'rest'), futW = words.future || tx('status.upcoming', 'upcoming'), noneW = words.none || 'no data';

    var grid = h('div', { class: 'ch-heat-grid' });
    var counted = 0, sum = 0;
    for (var w = 0; w < nW; w++) {
      for (var r = 0; r < 7; r++) {
        var ms = gridStart + (w * 7 + r) * DAY_MS, ds = fmtDate(ms), d = byDate[ds];
        if (!d) { grid.appendChild(h('div', { class: 'ch-heat-cell ch-pad', 'aria-hidden': 'true' })); continue; }
        var kind, text, v = null;
        if (d.state === 'rest') { kind = 'ch-rest'; text = restW; }
        else if (d.state === 'future') { kind = 'ch-future'; text = futW; }
        else if (d.value == null || isNaN(parseFloat(d.value))) { kind = 'ch-none'; text = noneW; }
        else { v = unit(d.value); kind = 'ch-l' + heatLevel(v); text = Math.round(v * 100) + '%'; counted++; sum += v; }
        var cls = 'ch-heat-cell ' + kind + (o.selected === ds ? ' ch-sel' : '');
        var full = dateText(ds) + ', ' + text;
        if (interactive && kind !== 'ch-none') {
          grid.appendChild(h('button', {
            type: 'button', class: cls, 'aria-label': full, 'aria-pressed': o.selected === ds ? 'true' : 'false', title: full,
            dataset: { date: ds }, onclick: (function (s) { return function () { o.onSelect(s); }; })(ds)
          }));
        } else {
          grid.appendChild(h('div', { class: cls, 'aria-hidden': 'true', title: full }));
        }
      }
    }

    // day labels (Mon, Wed, Fri rows) + month labels
    var dayCol = h('div', { class: 'ch-heat-days', 'aria-hidden': 'true' });
    for (var rr = 0; rr < 7; rr++) {
      dayCol.appendChild(h('span', null, rr % 2 === 0 && HP.config && HP.config.dayName ? HP.config.dayName(dowOfRow(rr), 'short').slice(0, 3) : ''));
    }
    var marks = [];
    for (var wk = 0; wk < nW; wk++) {
      var inWeek = null;
      for (var k = 0; k < 7; k++) {
        var dd = new Date(gridStart + (wk * 7 + k) * DAY_MS);
        if (dd.getUTCDate() === 1 && gridStart + (wk * 7 + k) * DAY_MS >= first) { inWeek = dd.getUTCMonth(); break; }
      }
      if (wk === 0) marks.push({ w: 0, m: new Date(first).getUTCMonth() });
      else if (inWeek != null) marks.push({ w: wk, m: inWeek });
    }
    marks = marks.filter(function (mk, i) { return !marks[i + 1] || marks[i + 1].w - mk.w >= 3; });
    var monthRow = h('div', { class: 'ch-heat-months', 'aria-hidden': 'true' });
    marks.forEach(function (mk) {
      monthRow.appendChild(h('span', { style: { gridColumn: String(mk.w + 1) } }, HP.config && HP.config.monthName ? HP.config.monthName(mk.m, 'short') : ''));
    });

    var scroll = h('div', { class: 'ch-heat-scroll' },
      h('div', { class: 'ch-heat-inner' }, monthRow, grid));
    monthRow.style.gridTemplateColumns = 'repeat(' + nW + ', var(--ch-cell))';
    wrap.appendChild(h('div', { class: 'ch-heat-body' }, dayCol, scroll));

    if (o.legend) {
      wrap.appendChild(h('div', { class: 'ch-heat-legend', 'aria-hidden': 'true' },
        h('span', null, words.less || 'Less'),
        [0, 1, 2, 3, 4].map(function (l) { return h('i', { class: 'ch-heat-cell ch-l' + l }); }),
        h('span', null, words.more || 'More')));
    }
    var avgTxt = counted ? ' Average ' + Math.round(sum / counted * 100) + '%.' : '';
    var summary = o.label || ('Calendar heatmap, ' + mss.length + ' days.' + avgTxt);
    if (interactive) { wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-label', summary); }
    else { wrap.setAttribute('role', 'img'); wrap.setAttribute('aria-label', summary); }
    // show the most recent weeks first when the grid is wider than its container
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () { scroll.scrollLeft = scroll.scrollWidth; });
    }
    return wrap;
  }

  /* ---------- weekStrip ---------- */
  function stateIcon(state) {
    var svg = h('svg', { class: 'ch-ws-icon ch-ws-' + state, viewBox: '0 0 28 28', width: 28, height: 28, 'aria-hidden': 'true', focusable: 'false' });
    var c = function (cls, attrs) { attrs = attrs || {}; attrs['class'] = cls; attrs.cx = 14; attrs.cy = 14; return h('circle', attrs); };
    if (state === 'done') {
      svg.appendChild(c('ch-ws-fill', { r: 13 }));
      svg.appendChild(h('polyline', { class: 'ch-ws-mark', points: '8.5,14.5 12.5,18.5 19.5,10', fill: 'none' }));
    } else if (state === 'partial') {
      svg.appendChild(c('ch-ws-ring', { r: 11.5, fill: 'none' }));
      var len = 2 * Math.PI * 11.5;
      svg.appendChild(c('ch-ws-arc', { r: 11.5, fill: 'none', 'stroke-dasharray': fx(len * 0.55) + ' ' + fx(len), transform: 'rotate(-90 14 14)' }));
    } else if (state === 'miss') {
      svg.appendChild(c('ch-ws-ring', { r: 11.5, fill: 'none' }));
      svg.appendChild(h('path', { class: 'ch-ws-x', d: 'M10.5 10.5l7 7M17.5 10.5l-7 7', fill: 'none' }));
    } else if (state === 'rest') {
      svg.appendChild(c('ch-ws-dash', { r: 11.5, fill: 'none' }));
      svg.appendChild(h('path', { class: 'ch-ws-x', d: 'M10.5 14h7', fill: 'none' }));
    } else {
      svg.appendChild(c('ch-ws-future', { r: 11.5, fill: 'none' }));
    }
    return svg;
  }

  function weekStrip(o) {
    o = o || {};
    var days = o.days || [];
    var words = o.stateLabels || {};
    var names = {
      done: words.done || tx('status.done', 'done'), partial: words.partial || tx('status.partial', 'partial'),
      miss: words.miss || tx('status.missed', 'missed'), rest: words.rest || tx('status.rest', 'rest'),
      future: words.future || tx('status.upcoming', 'upcoming')
    };
    var items = days.map(function (d) {
      d = d || {};
      var st = names[d.state] ? d.state : 'future';
      var label = String(d.label == null ? '' : d.label);
      var aria = label + ', ' + names[st] + (d.today ? ', ' + tx('common.today', 'today') : '');
      var inner = [h('span', { class: 'ch-ws-day', 'aria-hidden': 'true' }, label), stateIcon(st)];
      var cls = 'ch-ws-item ch-ws-s-' + st + (d.today ? ' ch-ws-today' : '');
      if (typeof d.onClick === 'function') {
        return h('button', { type: 'button', class: cls, 'aria-label': aria, 'aria-current': d.today ? 'date' : null, onclick: d.onClick }, inner);
      }
      return h('div', { class: cls, role: 'listitem', 'aria-label': aria, 'aria-current': d.today ? 'date' : null }, inner);
    });
    var hasClick = days.some(function (d) { return d && typeof d.onClick === 'function'; });
    return h('div', hasClick
      ? { class: 'ch-weekstrip', role: 'group', 'aria-label': o.label || 'Week' }
      : { class: 'ch-weekstrip', role: 'list', 'aria-label': o.label || 'Week' }, items);
  }

  /* ---------- stars ---------- */
  var STAR = '12,2.5 14.9,8.6 21.6,9.5 16.7,14.2 17.9,20.9 12,17.7 6.1,20.9 7.3,14.2 2.4,9.5 9.1,8.6';
  function starSvg(size, cls) {
    return h('svg', { class: cls, viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': 'true', focusable: 'false' },
      h('polygon', { points: STAR, 'stroke-linejoin': 'round' }));
  }
  function stars(value, o) {
    o = o || {};
    var size = num(o.size, 18);
    var v = Math.round(HP.clamp(num(value, 0), 0, 5) * 2) / 2;
    var el = h('span', {
      class: 'ch-stars', role: 'img',
      'aria-label': o.label || (v + ' ' + tx('common.of', 'of') + ' 5'),
      style: { '--ch-star': size + 'px' }
    });
    for (var i = 0; i < 5; i++) {
      var f = HP.clamp(v - i, 0, 1);
      el.appendChild(h('span', { class: 'ch-star' },
        starSvg(size, 'ch-star-empty'),
        f > 0 ? h('span', { class: 'ch-star-fill', style: { width: (f * 100) + '%' } }, starSvg(size, 'ch-star-on')) : null));
    }
    return el;
  }

  /* ---------- meter ---------- */
  function meter(o) {
    o = o || {};
    var pct = pct100(o.value);
    return h('div', {
      class: 'ch-meter' + anim(o), role: 'progressbar',
      'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct, 'aria-valuetext': pct + '%',
      'aria-label': o.label || 'Progress',
      style: sv({ '--ch-h': num(o.height, 8) + 'px', '--ch-color': cssColor(o.color) })
    }, h('div', { class: 'ch-meter-fill', style: { width: pct + '%' } }));
  }

  HP.charts = {
    ring: ring, multiRing: multiRing, bars: bars, line: line, sparkline: sparkline,
    heatmap: heatmap, weekStrip: weekStrip, stars: stars, meter: meter
  };
})();
