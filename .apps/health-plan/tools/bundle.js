#!/usr/bin/env node
/* Bundles index.html + css + js into ONE self-contained file: dist/health-plan.html
   Usage: node tools/bundle.js            (run from anywhere) */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

// inline stylesheets
html = html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) => {
  const m = tag.match(/href=["']([^"']+)["']/i);
  if (!m || /^https?:/i.test(m[1])) return tag;
  return '<style>\n' + read(m[1]) + '\n</style>';
});

// inline scripts (keep order; neutralise closing tags inside code)
html = html.replace(/<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)>\s*<\/script>/gi, (tag, a, src) => {
  if (/^https?:/i.test(src)) return tag;
  const code = read(src).replace(/<\/script/gi, '<\\/script');
  return '<script>\n' + code + '\n</script>';
});

// single-file build has no service worker / manifest
html = html.replace(/<link\b[^>]*rel=["']manifest["'][^>]*>\s*/gi, '');
html = html.replace(/<link\b[^>]*rel=["']icon["'][^>]*>\s*/gi, '');

// make `defer` scripts run in order after parsing: inline scripts ignore defer, so move all to end of body
const scripts = [];
html = html.replace(/<script>[\s\S]*?<\/script>/g, (s) => { scripts.push(s); return ''; });
html = html.replace(/<\/body>/i, scripts.join('\n') + '\n</body>');

const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'health-plan.html'), html);
console.log('wrote dist/health-plan.html', (html.length / 1024).toFixed(1) + ' KB');

// ---- artifact build: the artifact host wraps content in its own <html><head><body> skeleton ----
{
  const full = fs.readFileSync(path.join(out, 'health-plan.html'), 'utf8');
  const title = (full.match(/<title>[\s\S]*?<\/title>/i) || ['<title>My Health Plan</title>'])[0];
  const head = (full.match(/<head>([\s\S]*?)<\/head>/i) || [, ''])[1];
  const styles = (head.match(/<style>[\s\S]*?<\/style>/gi) || []).join('\n');
  const body = (full.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, ''])[1];
  const doc = [title, styles, body].join('\n');
  fs.writeFileSync(path.join(out, 'health-plan.artifact.html'), doc);
  console.log('wrote dist/health-plan.artifact.html', (doc.length / 1024).toFixed(1) + ' KB');
}
