/* pwa.js — service worker registration + install prompt. Owner: PWA & Reminders Engineer. */
(function () {
  'use strict';
  var HP = window.HP;

  var deferredPrompt = null;
  var installed = false;
  var registration = null;
  var registerPromise = null;

  function emit() {
    if (HP.bus) HP.bus.emit('pwa', { canInstall: api.canInstall(), installed: installed, standalone: api.isStandalone() });
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); // keep the event so Settings can offer an Install button
    deferredPrompt = e;
    emit();
  });
  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    installed = true;
    emit();
  });

  var api = (HP.pwa = {
    /** Registers sw.js. Resolves to the registration, or null when unsupported or failed. Never rejects. */
    register: function () {
      if (registerPromise) return registerPromise;
      var proto = window.location && window.location.protocol;
      if ((proto !== 'http:' && proto !== 'https:') || !('serviceWorker' in navigator)) {
        return (registerPromise = Promise.resolve(null));
      }
      registerPromise = new Promise(function (resolve) {
        var go = function () {
          try {
            navigator.serviceWorker.register('sw.js', { scope: './' }).then(function (reg) {
              registration = reg;
              resolve(reg);
            }, function () { resolve(null); });
          } catch (e) { resolve(null); }
        };
        if (document.readyState === 'complete') go();
        else window.addEventListener('load', go, { once: true });
      });
      return registerPromise;
    },

    /** Resolves to the active SW registration or null (used by reminders to show notifications). */
    getRegistration: function () {
      if (registration) return Promise.resolve(registration);
      if (!('serviceWorker' in navigator) || !navigator.serviceWorker.getRegistration) return Promise.resolve(null);
      try {
        return navigator.serviceWorker.getRegistration().then(function (r) {
          if (r) registration = r;
          return r || null;
        }, function () { return null; });
      } catch (e) { return Promise.resolve(null); }
    },

    canInstall: function () { return !!deferredPrompt && !api.isStandalone(); },

    /** → 'accepted' | 'dismissed' | 'unavailable' */
    install: function () {
      if (!deferredPrompt) return Promise.resolve('unavailable');
      var p = deferredPrompt;
      deferredPrompt = null;
      try {
        p.prompt();
        return Promise.resolve(p.userChoice).then(function (choice) {
          emit();
          return choice && choice.outcome === 'accepted' ? 'accepted' : 'dismissed';
        }, function () { emit(); return 'unavailable'; });
      } catch (e) {
        emit();
        return Promise.resolve('unavailable');
      }
    },

    isStandalone: function () {
      try {
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
      } catch (e) { /* ignore */ }
      return window.navigator.standalone === true;
    },

    isIOS: function () {
      var ua = (navigator.userAgent || '');
      if (/iphone|ipad|ipod/i.test(ua)) return true;
      // iPadOS 13+ reports as Mac with touch support
      return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    }
  });
})();
