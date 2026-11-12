/* sw.js — My Health Plan service worker. Owner: PWA & Reminders Engineer.
   Offline-first app shell: precache + stale-while-revalidate for same-origin GETs. */
'use strict';

var VERSION = 'hp-v1';
var CACHE = VERSION;

var SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-maskable.svg',
  'css/base.css',
  'css/ui.css',
  'css/charts.css',
  'css/today.css',
  'css/progress.css',
  'css/plan.css',
  'css/rewards.css',
  'css/settings.css',
  'js/core.js',
  'js/config.js',
  'js/i18n.js',
  'js/icons.js',
  'js/store.js',
  'js/scoring.js',
  'js/gamify.js',
  'js/insights.js',
  'js/charts.js',
  'js/ui.js',
  'js/reminders.js',
  'js/pwa.js',
  'js/views/today.js',
  'js/views/progress.js',
  'js/views/plan.js',
  'js/views/rewards.js',
  'js/views/settings.js',
  'js/app.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // Add one by one so a missing file never blocks the install.
      return Promise.allSettled(SHELL.map(function (url) {
        return cache.add(new Request(url, { cache: 'reload' }));
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) {
        return k.indexOf('hp-') === 0 && k !== CACHE;
      }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isCacheable(res) {
  return res && res.status === 200 && (res.type === 'basic' || res.type === 'default');
}

function offlineIndex(cache) {
  return cache.match('index.html').then(function (r) { return r || cache.match('./'); });
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      var isNav = req.mode === 'navigate';
      return cache.match(req, { ignoreSearch: true }).then(function (cached) {
        var network = fetch(req).then(function (res) {
          if (isCacheable(res)) cache.put(req, res.clone()).catch(function () {});
          return res;
        });
        if (cached) {
          network.catch(function () {}); // background refresh; ignore offline errors
          return cached;
        }
        return network.catch(function () {
          if (isNav) {
            return offlineIndex(cache).then(function (r) { return r || Response.error(); });
          }
          return Response.error();
        });
      });
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var target = new URL('./index.html', self.registration.scope).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.indexOf(self.registration.scope) === 0 && 'focus' in c) return c.focus();
      }
      return self.clients.openWindow ? self.clients.openWindow(target) : undefined;
    })
  );
});
