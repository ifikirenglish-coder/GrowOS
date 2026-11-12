/* views/settings.js — Settings & Data view. Owner: Settings & Data View Developer.
   Registers HP.views.settings. Reads/writes only through HP.store; no bus subscriptions. */
(function () {
  'use strict';
  var HP = window.HP;
  var h = HP.h;

  /* ---------- strings ---------- */
  HP.i18n.register({
    bm: {
      'settings.profile.title': 'Profil',
      'settings.name.label': 'Nama anda',
      'settings.name.placeholder': 'Contoh: Aisyah',
      'settings.greeting': 'Hai, {name}!',
      'settings.greetingEmpty': 'Hai! Tambah nama anda untuk sapaan peribadi.',
      'settings.memberSince': 'Ahli sejak',

      'settings.appearance.title': 'Paparan & bahasa',
      'settings.lang.label': 'Bahasa',
      'settings.theme.label': 'Tema',
      'settings.theme.auto': 'Auto',
      'settings.theme.light': 'Cerah',
      'settings.theme.dark': 'Gelap',
      'settings.sound.label': 'Bunyi',
      'settings.sound.hint': 'Bunyi kecil bila anda siapkan tabiat.',
      'settings.haptics.label': 'Getaran',
      'settings.haptics.hint': 'Getaran ringan pada telefon anda.',

      'settings.reminders.title': 'Peringatan',
      'settings.reminders.master': 'Hidupkan peringatan',
      'settings.reminders.perm.granted': 'Notifikasi dibenarkan',
      'settings.reminders.perm.denied': 'Notifikasi disekat. Ubah dalam tetapan pelayar anda.',
      'settings.reminders.perm.default': 'Notifikasi belum dibenarkan',
      'settings.reminders.perm.unsupported': 'Notifikasi tidak disokong pada pelayar ini',
      'settings.reminders.allow': 'Benarkan notifikasi',
      'settings.reminders.offHint': 'Hidupkan peringatan untuk pilih masa bagi setiap tabiat.',
      'settings.reminders.timeFor': 'Masa peringatan untuk {habit}',
      'settings.reminders.switchFor': 'Peringatan untuk {habit}',
      'settings.reminders.explain': 'Peringatan muncul semasa apl ini dibuka. Untuk amaran harian yang boleh dipercayai, tambahkannya ke kalendar telefon anda.',
      'settings.reminders.scheduledOnly': 'Tabiat yang tidak dijadualkan pada sesuatu hari tidak akan mengingatkan anda pada hari itu.',
      'settings.reminders.ics': 'Tambah ke kalendar (.ics)',
      'settings.reminders.icsNone': 'Pilih sekurang-kurangnya satu masa peringatan dahulu.',
      'settings.reminders.icsDone': 'Fail kalendar dimuat turun.',
      'settings.reminders.icsFail': 'Tidak dapat menyediakan fail kalendar.',

      'settings.install.title': 'Pasang apl',
      'settings.install.body': 'Pasang untuk buka terus dari skrin utama, juga tanpa internet.',
      'settings.install.button': 'Pasang',
      'settings.install.ios': 'Ketik butang Kongsi (Share), kemudian pilih Tambah ke Skrin Utama (Add to Home Screen).',
      'settings.install.done': 'Dipasang ✓',

      'settings.data.title': 'Data anda',
      'settings.data.privacy': 'Data kekal pada peranti ini. Tiada apa dihantar ke mana-mana pelayan.',
      'settings.data.noStorage': 'Pelayar ini tidak membenarkan simpanan. Data anda hanya kekal sementara halaman ini dibuka. Eksport sandaran untuk simpan.',
      'settings.data.daysLogged': 'Hari direkodkan',
      'settings.data.firstLog': 'Rekod pertama',
      'settings.data.none': 'Belum ada',
      'settings.data.export': 'Eksport sandaran',
      'settings.data.exportHint': 'Simpan salinan data anda sebagai fail.',
      'settings.data.exported': 'Sandaran dimuat turun.',
      'settings.data.exportFail': 'Tidak dapat eksport sandaran.',
      'settings.data.import': 'Import sandaran',
      'settings.data.importHint': 'Pulihkan data daripada fail sandaran.',
      'settings.data.importTitle': 'Import sandaran?',
      'settings.data.importMsg': 'Ini menggantikan data semasa anda.',
      'settings.data.importConfirm': 'Ganti data',
      'settings.data.imported': 'Sandaran dipulihkan.',
      'settings.data.importFail': 'Fail sandaran ini tidak sah.',
      'settings.data.sample': 'Muat data contoh',
      'settings.data.sampleHint': 'Cuba apl dengan 28 hari rekod contoh.',
      'settings.data.sampleTitle': 'Muat data contoh?',
      'settings.data.sampleMsg': 'Ini menggantikan semua rekod harian anda dengan data contoh. Eksport sandaran dahulu jika anda mahu simpan rekod semasa.',
      'settings.data.sampleConfirm': 'Muat data contoh',
      'settings.data.sampleDone': 'Data contoh dimuatkan.',
      'settings.data.reset': 'Set semula semua',
      'settings.data.resetHint': 'Padam semua rekod, pelan dan tetapan pada peranti ini.',
      'settings.data.reset1Title': 'Set semula semuanya?',
      'settings.data.reset1Msg': 'Ini memadam semua rekod, pelan dan tetapan pada peranti ini. Ia tidak boleh diundur.',
      'settings.data.reset1Confirm': 'Teruskan',
      'settings.data.reset2Title': 'Betul-betul pasti?',
      'settings.data.reset2Msg': 'Ini langkah terakhir. Eksport sandaran dahulu jika anda mahu simpan data anda.',
      'settings.data.reset2Confirm': 'Ya, padam semuanya',
      'settings.data.resetDone': 'Semua data telah dipadam.',

      'settings.about.title': 'Tentang',
      'settings.about.version': 'Versi {v}',
      'settings.about.disclaimer': 'Apl ini penjejak tabiat, bukan nasihat perubatan. Untuk soalan kesihatan, tanya doktor anda.'
    },
    en: {
      'settings.profile.title': 'Profile',
      'settings.name.label': 'Your name',
      'settings.name.placeholder': 'e.g. Aisyah',
      'settings.greeting': 'Hi, {name}!',
      'settings.greetingEmpty': 'Hi! Add your name for a personal greeting.',
      'settings.memberSince': 'Member since',

      'settings.appearance.title': 'Appearance & language',
      'settings.lang.label': 'Language',
      'settings.theme.label': 'Theme',
      'settings.theme.auto': 'Auto',
      'settings.theme.light': 'Light',
      'settings.theme.dark': 'Dark',
      'settings.sound.label': 'Sound',
      'settings.sound.hint': 'Small sounds when you finish a habit.',
      'settings.haptics.label': 'Haptics',
      'settings.haptics.hint': 'A light buzz on your phone.',

      'settings.reminders.title': 'Reminders',
      'settings.reminders.master': 'Turn on reminders',
      'settings.reminders.perm.granted': 'Notifications allowed',
      'settings.reminders.perm.denied': 'Notifications are blocked. Change this in your browser settings.',
      'settings.reminders.perm.default': 'Notifications not allowed yet',
      'settings.reminders.perm.unsupported': 'This browser cannot show notifications',
      'settings.reminders.allow': 'Allow notifications',
      'settings.reminders.offHint': 'Turn reminders on to pick a time for each habit.',
      'settings.reminders.timeFor': 'Reminder time for {habit}',
      'settings.reminders.switchFor': 'Reminder for {habit}',
      'settings.reminders.explain': 'Reminders appear while the app is open. For reliable daily alerts, add them to your phone calendar.',
      'settings.reminders.scheduledOnly': 'Habits that are not scheduled on a day will not remind you on that day.',
      'settings.reminders.ics': 'Add to calendar (.ics)',
      'settings.reminders.icsNone': 'Pick at least one reminder time first.',
      'settings.reminders.icsDone': 'Calendar file downloaded.',
      'settings.reminders.icsFail': 'Could not prepare the calendar file.',

      'settings.install.title': 'Install app',
      'settings.install.body': 'Install it to open from your home screen, even offline.',
      'settings.install.button': 'Install',
      'settings.install.ios': 'Tap the Share button, then choose Add to Home Screen.',
      'settings.install.done': 'Installed ✓',

      'settings.data.title': 'Your data',
      'settings.data.privacy': 'Data stays on this device. Nothing is sent to any server.',
      'settings.data.noStorage': 'This browser is blocking storage. Your data only lasts while this page is open. Export a backup to keep it.',
      'settings.data.daysLogged': 'Days logged',
      'settings.data.firstLog': 'First log',
      'settings.data.none': 'None yet',
      'settings.data.export': 'Export backup',
      'settings.data.exportHint': 'Save a copy of your data as a file.',
      'settings.data.exported': 'Backup downloaded.',
      'settings.data.exportFail': 'Could not export the backup.',
      'settings.data.import': 'Import backup',
      'settings.data.importHint': 'Restore your data from a backup file.',
      'settings.data.importTitle': 'Import backup?',
      'settings.data.importMsg': 'This replaces your current data.',
      'settings.data.importConfirm': 'Replace data',
      'settings.data.imported': 'Backup restored.',
      'settings.data.importFail': 'This backup file is not valid.',
      'settings.data.sample': 'Load sample data',
      'settings.data.sampleHint': 'Try the app with 28 days of sample logs.',
      'settings.data.sampleTitle': 'Load sample data?',
      'settings.data.sampleMsg': 'This replaces all your daily logs with sample data. Export a backup first if you want to keep your current logs.',
      'settings.data.sampleConfirm': 'Load sample data',
      'settings.data.sampleDone': 'Sample data loaded.',
      'settings.data.reset': 'Reset everything',
      'settings.data.resetHint': 'Delete all logs, your plan and settings on this device.',
      'settings.data.reset1Title': 'Reset everything?',
      'settings.data.reset1Msg': 'This deletes all logs, your plan and settings on this device. It cannot be undone.',
      'settings.data.reset1Confirm': 'Continue',
      'settings.data.reset2Title': 'Really sure?',
      'settings.data.reset2Msg': 'This is the last step. Export a backup first if you want to keep your data.',
      'settings.data.reset2Confirm': 'Yes, delete everything',
      'settings.data.resetDone': 'All data has been deleted.',

      'settings.about.title': 'About',
      'settings.about.version': 'Version {v}',
      'settings.about.disclaimer': 'This app is a habit tracker, not medical advice. For health questions, ask your doctor.'
    }
  });

  var DEFAULT_TIMES = { supplements: '08:00', water: '10:00', walk: '18:30', sleep: '22:00', fasting: '12:00' };

  /* ---------- helpers ---------- */
  function icon(name, size) { return HP.icons.svg(name, { size: size || 20 }); }

  function fk(el, key) { el.dataset.fk = key; return el; }

  function rerender() {
    if (HP.app && typeof HP.app.renderActive === 'function') HP.app.renderActive();
  }

  function todayStr() {
    if (HP.dates && HP.dates.today) return HP.dates.today();
    var d = new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function dateLabel(str) {
    if (!str) return '';
    try { return HP.dates.label(str, { style: 'long' }) + ' ' + str.slice(0, 4); } catch (e) { return str; }
  }

  function toast(msg, type) {
    HP.ui.toast(msg, { type: type || 'info', icon: type === 'success' ? 'check-circle' : 'info' });
  }

  function errText(e) {
    var s = e && e.error;
    if (!s) return HP.t('settings.data.importFail');
    return HP.i18n.has && HP.i18n.has(s) ? HP.t(s) : String(s);
  }

  function section(iconName, titleText, children, extraClass) {
    return h('section', { class: 'card settings-card' + (extraClass ? ' ' + extraClass : '') },
      h('h2', { class: 'card-title settings-card-title' }, icon(iconName, 20), h('span', null, titleText)),
      children
    );
  }

  /** Row with text on the left and a control on the right. */
  function row(label, hint, control, key) {
    return h('div', { class: 'settings-row' },
      h('div', { class: 'settings-row-text' },
        h('div', { class: 'settings-row-label' }, label),
        hint ? h('div', { class: 'settings-hint' }, hint) : null
      ),
      h('div', { class: 'settings-row-control' }, control)
    );
  }

  function actionRow(iconName, label, hint, onClick, key, kind) {
    return h('div', { class: 'settings-action' },
      h('button', {
        type: 'button', class: 'btn ' + (kind || 'btn-ghost') + ' btn-block settings-action-btn',
        onclick: onClick, dataset: { fk: key }
      }, icon(iconName, 18), h('span', null, label)),
      hint ? h('p', { class: 'settings-hint' }, hint) : null
    );
  }

  /* ---------- 1. Profile ---------- */
  function profileCard() {
    var profile = HP.store.getProfile() || {};
    var greetText = function (name) {
      name = (name || '').trim();
      return name ? HP.t('settings.greeting', { name: name }) : HP.t('settings.greetingEmpty');
    };
    var preview = h('p', { class: 'settings-greeting', 'aria-live': 'polite' }, greetText(profile.name));
    var save = function (el) {
      var v = el.value.trim();
      if (v !== (HP.store.getProfile().name || '')) HP.store.setProfile({ name: v });
    };
    var input = h('input', {
      type: 'text', id: 'settings-name', class: 'input', value: profile.name || '',
      placeholder: HP.t('settings.name.placeholder'), maxlength: 40, autocomplete: 'given-name',
      autocapitalize: 'words', enterkeyhint: 'done', dataset: { fk: 'settings-name' },
      oninput: function (e) { preview.textContent = greetText(e.target.value); },
      onchange: function (e) { save(e.target); },
      onkeydown: function (e) { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } }
    });
    return section('user', HP.t('settings.profile.title'), [
      h('div', { class: 'field' },
        h('label', { for: 'settings-name', class: 'settings-row-label' }, HP.t('settings.name.label')),
        input
      ),
      preview,
      profile.createdAt ? h('p', { class: 'settings-hint' }, HP.t('settings.memberSince') + ': ', h('strong', null, dateLabel(profile.createdAt))) : null
    ]);
  }

  /* ---------- 2. Appearance & language ---------- */
  function appearanceCard() {
    var s = HP.store.getSettings();
    var lang = fk(HP.ui.segmented({
      options: [{ value: 'bm', label: 'Bahasa Malaysia' }, { value: 'en', label: 'English' }],
      value: s.lang, label: HP.t('settings.lang.label'),
      onChange: function (v) { HP.store.setSettings({ lang: v }); }
    }), 'settings-lang');
    var theme = fk(HP.ui.segmented({
      options: [
        { value: 'auto', label: HP.t('settings.theme.auto') },
        { value: 'light', label: HP.t('settings.theme.light') },
        { value: 'dark', label: HP.t('settings.theme.dark') }
      ],
      value: s.theme, label: HP.t('settings.theme.label'),
      onChange: function (v) { HP.store.setSettings({ theme: v }); }
    }), 'settings-theme');
    var sound = fk(HP.ui.toggleSwitch({
      checked: !!s.sound, label: HP.t('settings.sound.label'),
      onChange: function (v) { HP.store.setSettings({ sound: !!v }); }
    }), 'settings-sound');
    var haptics = fk(HP.ui.toggleSwitch({
      checked: !!s.haptics, label: HP.t('settings.haptics.label'),
      onChange: function (v) { HP.store.setSettings({ haptics: !!v }); }
    }), 'settings-haptics');

    return section('globe', HP.t('settings.appearance.title'), [
      h('div', { class: 'settings-block' }, h('div', { class: 'settings-row-label' }, HP.t('settings.lang.label')), lang),
      h('div', { class: 'settings-block' }, h('div', { class: 'settings-row-label' }, HP.t('settings.theme.label')), theme),
      h('div', { class: 'divider' }),
      row(HP.t('settings.sound.label'), HP.t('settings.sound.hint'), sound),
      row(HP.t('settings.haptics.label'), HP.t('settings.haptics.hint'), haptics)
    ]);
  }

  /* ---------- 3. Reminders ---------- */
  function permission() {
    try { return HP.reminders && HP.reminders.permission ? HP.reminders.permission() : 'unsupported'; } catch (e) { return 'unsupported'; }
  }

  function permissionNode() {
    var p = permission();
    var tone = p === 'granted' ? 'ok' : (p === 'default' ? 'neutral' : 'warn');
    var ic = p === 'granted' ? 'check-circle' : (p === 'default' ? 'bell' : 'info');
    var nodes = [HP.ui.chip(HP.t('settings.reminders.perm.' + p), { tone: tone, icon: ic })];
    if (p === 'default' && HP.reminders && HP.reminders.request) {
      nodes.push(h('button', {
        type: 'button', class: 'btn btn-ghost btn-sm', dataset: { fk: 'settings-allow-notif' },
        onclick: function () {
          Promise.resolve(HP.reminders.request()).catch(function () {}).then(rerender);
        }
      }, HP.t('settings.reminders.allow')));
    }
    return h('div', { class: 'settings-perm row row-wrap', 'aria-live': 'polite' }, nodes);
  }

  function reminderRow(id, times) {
    var name = HP.config.name(id);
    var color = HP.config.habit(id).color;
    var val = times[id] || '';
    var on = !!val;
    var sw = fk(HP.ui.toggleSwitch({
      checked: on, label: HP.t('settings.reminders.switchFor', { habit: name }),
      onChange: function (v) {
        var t = {}; t[id] = v ? (DEFAULT_TIMES[id] || '09:00') : '';
        HP.store.setSettings({ reminders: { times: t } });
      }
    }), 'settings-rem-sw-' + id);
    var controls = [];
    if (on) {
      controls.push(h('input', {
        type: 'time', class: 'input settings-time', value: val, step: 60,
        'aria-label': HP.t('settings.reminders.timeFor', { habit: name }),
        dataset: { fk: 'settings-rem-time-' + id },
        onchange: function (e) {
          var t = {}; t[id] = e.target.value || '';
          HP.store.setSettings({ reminders: { times: t } });
        }
      }));
    }
    controls.push(sw);
    return h('div', { class: 'settings-rem-row' },
      h('span', { class: 'settings-habit-icon', style: { '--hc': color }, 'aria-hidden': 'true' }, icon(HP.config.habit(id).icon, 18)),
      h('span', { class: 'settings-rem-name' }, name),
      h('div', { class: 'settings-rem-controls' }, controls)
    );
  }

  function remindersCard() {
    var rem = HP.store.getSettings().reminders || { enabled: false, times: {} };
    var times = rem.times || {};
    var enabled = !!rem.enabled;
    var master = fk(HP.ui.toggleSwitch({
      checked: enabled, label: HP.t('settings.reminders.master'),
      onChange: function (v) {
        HP.store.setSettings({ reminders: { enabled: !!v } });
        if (v && HP.reminders && permission() === 'default' && HP.reminders.request) {
          Promise.resolve(HP.reminders.request()).catch(function () {}).then(rerender);
        }
      }
    }), 'settings-rem-master');

    var body = [row(HP.t('settings.reminders.master'), null, master)];
    if (enabled) {
      body.push(permissionNode());
      body.push(h('div', { class: 'settings-rem-list' }, HP.config.habitIds().map(function (id) { return reminderRow(id, times); })));
      body.push(h('p', { class: 'settings-hint' }, icon('calendar', 14), ' ', HP.t('settings.reminders.scheduledOnly')));
    } else {
      body.push(h('p', { class: 'settings-hint' }, HP.t('settings.reminders.offHint')));
    }
    body.push(h('div', { class: 'divider' }));
    body.push(h('p', { class: 'settings-explain' }, HP.t('settings.reminders.explain')));
    if (HP.reminders && typeof HP.reminders.downloadICS === 'function') {
      body.push(h('button', {
        type: 'button', class: 'btn btn-ghost btn-block settings-action-btn', dataset: { fk: 'settings-ics' },
        onclick: function () {
          var any = Object.keys(HP.store.getSettings().reminders.times || {}).some(function (k) {
            return !!HP.store.getSettings().reminders.times[k];
          });
          if (!any) { toast(HP.t('settings.reminders.icsNone')); return; }
          try { HP.reminders.downloadICS(); toast(HP.t('settings.reminders.icsDone'), 'success'); }
          catch (e) { toast(HP.t('settings.reminders.icsFail')); }
        }
      }, icon('calendar', 18), h('span', null, HP.t('settings.reminders.ics'))));
    }
    return section('bell', HP.t('settings.reminders.title'), body);
  }

  /* ---------- 4. Install ---------- */
  function installCard() {
    var pwa = HP.pwa;
    if (!pwa) return null;
    var standalone = !!(pwa.isStandalone && pwa.isStandalone());
    var canInstall = !!(pwa.canInstall && pwa.canInstall());
    var ios = !!(pwa.isIOS && pwa.isIOS());
    var body = [];
    if (standalone) {
      body.push(HP.ui.chip(HP.t('settings.install.done'), { tone: 'ok', icon: 'check-circle' }));
    } else if (canInstall) {
      body.push(h('p', { class: 'settings-explain' }, HP.t('settings.install.body')));
      body.push(h('button', {
        type: 'button', class: 'btn btn-primary btn-block', dataset: { fk: 'settings-install' },
        onclick: function () {
          Promise.resolve(pwa.install()).catch(function () {}).then(rerender);
        }
      }, icon('download', 18), h('span', null, HP.t('settings.install.button'))));
    } else if (ios) {
      body.push(h('p', { class: 'settings-explain settings-install-steps' }, icon('share', 18), h('span', null, HP.t('settings.install.ios'))));
    } else {
      return null;
    }
    return section('download', HP.t('settings.install.title'), body);
  }

  /* ---------- 5. Your data ---------- */
  function exportBackup() {
    try {
      var json = HP.store.exportJSON();
      var blob = new Blob([json], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = h('a', { href: url, download: 'my-health-plan-backup-' + todayStr() + '.json', style: { display: 'none' } });
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 1000);
      toast(HP.t('settings.data.exported'), 'success');
    } catch (e) {
      toast(HP.t('settings.data.exportFail'));
    }
  }

  function readFile(file) {
    if (file.text) return file.text();
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(String(fr.result)); };
      fr.onerror = function () { reject(fr.error); };
      fr.readAsText(file);
    });
  }

  function onImportFile(e) {
    var input = e.target;
    var file = input.files && input.files[0];
    if (!file) return;
    var done = function () { try { input.value = ''; } catch (x) { /* ignore */ } };
    if (file.size > 5 * 1024 * 1024) { toast(HP.t('settings.data.importFail')); done(); return; }
    readFile(file).then(function (text) {
      return HP.ui.confirm({
        title: HP.t('settings.data.importTitle'), message: HP.t('settings.data.importMsg'),
        confirmLabel: HP.t('settings.data.importConfirm'), cancelLabel: HP.t('common.cancel'), danger: true
      }).then(function (ok) {
        if (!ok) return;
        var r = HP.store.importJSON(text);
        if (r && r.ok) toast(HP.t('settings.data.imported'), 'success');
        else toast(errText(r));
      });
    }).catch(function () { toast(HP.t('settings.data.importFail')); }).then(done, done);
  }

  function loadSample() {
    HP.ui.confirm({
      title: HP.t('settings.data.sampleTitle'), message: HP.t('settings.data.sampleMsg'),
      confirmLabel: HP.t('settings.data.sampleConfirm'), cancelLabel: HP.t('common.cancel'), danger: true
    }).then(function (ok) {
      if (!ok) return;
      HP.store.seedDemo(28);
      toast(HP.t('settings.data.sampleDone'), 'success');
    });
  }

  function resetAll() {
    HP.ui.confirm({
      title: HP.t('settings.data.reset1Title'), message: HP.t('settings.data.reset1Msg'),
      confirmLabel: HP.t('settings.data.reset1Confirm'), cancelLabel: HP.t('common.cancel'), danger: true
    }).then(function (ok1) {
      if (!ok1) return null;
      return HP.ui.confirm({
        title: HP.t('settings.data.reset2Title'), message: HP.t('settings.data.reset2Msg'),
        confirmLabel: HP.t('settings.data.reset2Confirm'), cancelLabel: HP.t('common.cancel'), danger: true
      }).then(function (ok2) {
        if (!ok2) return;
        HP.store.reset();
        toast(HP.t('settings.data.resetDone'), 'success');
      });
    });
  }

  function dataCard() {
    var dates = HP.store.logDates() || [];
    var first = HP.store.firstLogDate();
    var fileInput = h('input', {
      type: 'file', accept: 'application/json,.json', class: 'settings-file', tabindex: '-1',
      'aria-hidden': 'true', onchange: onImportFile
    });
    var importBtn = actionRow('upload', HP.t('settings.data.import'), HP.t('settings.data.importHint'),
      function () { fileInput.click(); }, 'settings-import');

    return section('shield', HP.t('settings.data.title'), [
      h('p', { class: 'settings-privacy' }, icon('lock', 16), h('span', null, HP.t('settings.data.privacy'))),
      (HP.store.isPersistent && !HP.store.isPersistent()) ? h('p', { class: 'settings-privacy settings-nostorage', role: 'status' }, icon('info', 16), h('span', null, HP.t('settings.data.noStorage'))) : null,
      h('dl', { class: 'settings-kv' },
        h('div', null, h('dt', null, HP.t('settings.data.daysLogged')), h('dd', { class: 'num' }, String(dates.length))),
        h('div', null, h('dt', null, HP.t('settings.data.firstLog')), h('dd', null, first ? dateLabel(first) : HP.t('settings.data.none')))
      ),
      h('div', { class: 'divider' }),
      actionRow('download', HP.t('settings.data.export'), HP.t('settings.data.exportHint'), exportBackup, 'settings-export'),
      importBtn,
      fileInput,
      actionRow('sparkles', HP.t('settings.data.sample'), HP.t('settings.data.sampleHint'), loadSample, 'settings-sample'),
      h('div', { class: 'divider' }),
      h('div', { class: 'settings-danger' },
        actionRow('trash', HP.t('settings.data.reset'), HP.t('settings.data.resetHint'), resetAll, 'settings-reset', 'btn-danger')
      )
    ]);
  }

  /* ---------- 6. About ---------- */
  function aboutCard() {
    return section('info', HP.t('settings.about.title'), [
      h('div', { class: 'settings-about' },
        h('div', { class: 'settings-about-name' }, HP.t('app.name')),
        h('div', { class: 'settings-about-tagline' }, HP.t('app.tagline')),
        h('div', { class: 'settings-hint' }, HP.t('settings.about.version', { v: HP.config.VERSION }))
      ),
      h('p', { class: 'settings-hint' }, HP.t('settings.about.disclaimer'))
    ]);
  }

  /* ---------- view ---------- */
  HP.views.settings = {
    id: 'settings',
    icon: 'settings',
    titleKey: 'nav.settings',
    render: function (container) {
      var cards = [
        h('h1', { class: 'page-title' }, HP.t('nav.settings')),
        profileCard(),
        appearanceCard(),
        remindersCard(),
        installCard(),
        dataCard(),
        aboutCard()
      ];
      HP.mount(container, h('div', { class: 'page settings-page stack' }, cards));
    }
  };
})();
