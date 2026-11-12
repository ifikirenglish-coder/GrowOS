/* insights.js — Coach & Insights. Owner: Coach & Insights agent.
   HP.insights = { coachMessage(date?), nextAction(date?), habitTip(habitId, date?), weeklyReview(anyDateInWeek) }
   All strings are bilingual ([bm, en] pairs, optional third item = English singular when n === 1) and are
   resolved against HP.lang at call time, so they are always already localized. Placeholders use {name}.
   Every dependency (HP.scoring, HP.gamify, HP.store, HP.dates) is guarded: if one is missing or throws,
   the module falls back to a generic friendly message and never throws.
   Test hook: set window.__HP_HOUR__ (number, 0..24, fractions ok) to override the clock for "today". */
(function () {
  'use strict';
  var HP = window.HP;

  /* ------------------------------------------------------------------ helpers */
  function safe(fn, fallback) { try { var v = fn(); return v === undefined ? fallback : v; } catch (e) { return fallback; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function localStr(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function todayStr() { return safe(function () { return HP.dates.today(); }, null) || localStr(new Date()); }
  function nowHour() {
    if (typeof window.__HP_HOUR__ === 'number') return window.__HP_HOUR__;
    var d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  }
  function langIdx() { return HP.lang === 'en' ? 1 : 0; }
  /** Pick text from a [bm, en, enSingular?] pair. */
  function pick(pair, params) {
    var s;
    if (typeof pair === 'string') s = pair;
    else if (langIdx() === 1) s = (params && params.n === 1 && pair[2]) ? pair[2] : pair[1];
    else s = pair[0];
    return fmt(s, params);
  }
  function fmt(s, params) {
    s = String(s == null ? '' : s).replace(/\{(\w+)\}/g, function (m, k) {
      return params && params[k] != null ? String(params[k]) : '';
    });
    return noDash(s);
  }
  /** Insurance: the style guide bans em/en dashes in copy. */
  function noDash(s) { return s.replace(/\s*[—–]\s*/g, ', '); }
  function num(n, dp) {
    var f = Math.pow(10, dp == null ? 2 : dp);
    return String(Math.round((+n || 0) * f) / f);
  }
  function listNames(arr) {
    var and = langIdx() === 1 ? ' and ' : ' dan ';
    if (arr.length <= 1) return arr.join('');
    return arr.slice(0, -1).join(', ') + and + arr[arr.length - 1];
  }
  function hname(id) { return safe(function () { return HP.config.name(id); }, id); }
  function minPct() { return safe(function () { return HP.config.STREAK_MIN_PCT; }, 70) || 70; }
  function dateLabel(d) { return safe(function () { return HP.dates.label(d, { style: 'long' }); }, d) || d; }
  function getTarget(id) {
    var t = safe(function () { return HP.store.getTarget(id); }, null);
    if (t > 0) return t;
    var h = safe(function () { return HP.config.habit(id); }, null);
    return h ? h.defaultTarget : 1;
  }
  function dayOfYear(dateStr) {
    var p = String(dateStr).split('-');
    var y = +p[0], m = +p[1] - 1, d = +p[2];
    return Math.floor((Date.UTC(y, m, d) - Date.UTC(y, 0, 0)) / 86400000);
  }

  /** dayScore via HP.scoring, else a minimal local computation from store/config, else null. */
  function getDay(date) {
    var ds = safe(function () { return HP.scoring.dayScore(date); }, null);
    if (ds && Array.isArray(ds.habits)) return ds;
    return safe(function () {
      var habits = HP.config.habitIds().map(function (id) {
        var scheduled = HP.store.isScheduled(id, date);
        var value = HP.store.getValue(date, id);
        var target = getTarget(id);
        var done = HP.config.isDone(id, value, target);
        return { id: id, scheduled: scheduled, value: value, progress: HP.config.progressOf(id, value, target), done: done, bonus: !scheduled && done };
      });
      var sched = habits.filter(function (h) { return h.scheduled; });
      var doneN = sched.filter(function (h) { return h.done; }).length;
      var mean = sched.length ? sched.reduce(function (a, h) { return a + h.progress; }, 0) / sched.length : 1;
      return {
        date: date, habits: habits, scheduledCount: sched.length, doneCount: doneN,
        logged: HP.store.hasLog(date), pct: Math.round(mean * 100),
        perfect: sched.length > 0 && doneN === sched.length, isRest: sched.length === 0
      };
    }, null);
  }

  /* ------------------------------------------------------------------ coach copy
     Entry: { tone, emoji, t: title pair, b: body pair, a: nextAction pair }  (pairs are [bm, en]) */
  var M = {
    fallback: { tone: 'cheer', emoji: '🌱',
      t: ['Langkah kecil hari ini', 'Small steps today'],
      b: ['Pilih satu tabiat dan tandakan. Itu permulaan yang baik.', 'Pick one habit and tick it off. That is a good start.'] },
    welcome: { tone: 'cheer', emoji: '🌱',
      t: ['Selamat datang', 'Welcome'],
      b: ['Mulakan dengan satu perkara kecil hari ini, seperti segelas air.', 'Start with one small thing today, like a glass of water.'] },
    future: { tone: 'calm', emoji: '📅',
      t: ['Belum lagi', 'Not yet'],
      b: ['Hari ini belum tiba. Nikmati hari ini dahulu.', 'This day has not arrived yet. Enjoy today first.'] },
    'past.perfect': { tone: 'calm', emoji: '✅',
      t: ['Semua siap', 'All done'],
      b: ['Anda lengkapkan semua {total} tabiat pada {date}.', 'You completed all {total} habits on {date}.'] },
    'past.rest': { tone: 'calm', emoji: '🌿',
      t: ['Hari Rehat', 'A rest day'],
      b: ['{date} ialah hari Rehat. Rehat sebahagian daripada pelan.', '{date} was a Rehat day. Rest is part of the plan.'] },
    'past.none': { tone: 'calm', emoji: '📅',
      t: ['Tiada rekod', 'Nothing logged'],
      b: ['Tiada apa dicatat untuk {date}. Anda masih boleh tambah apa yang anda ingat.', 'Nothing was logged for {date}. You can still add what you remember.'] },
    'past.some': { tone: 'calm', emoji: '📅',
      t: ['Ringkasan hari itu', 'Day recap'],
      b: ['{done} daripada {total} tabiat siap pada {date}. {best} paling baik hari itu.', '{done} of {total} habits done on {date}. {best} went best that day.'] },
    'past.some0': { tone: 'calm', emoji: '📅',
      t: ['Ringkasan hari itu', 'Day recap'],
      b: ['{done} daripada {total} tabiat siap pada {date}.', '{done} of {total} habits done on {date}.'] },
    rest: { tone: 'calm', emoji: '🌿',
      t: ['Hari Rehat', 'Rehat day'],
      b: ['Rehat sebahagian daripada pelan. Berehat dengan tenang dan datang semula esok.', 'Rehat is part of the plan. Rest well and come back fresh tomorrow.'] },
    restBonus: { tone: 'calm', emoji: '🌿',
      t: ['Hari Rehat', 'Rehat day'],
      b: ['Rehat sebahagian daripada pelan. {name} hari ini ialah bonus, dan berehat pun tidak mengapa.', 'Rehat is part of the plan. {name} today is a bonus, and resting is fine too.'] },
    'milestone.3': { tone: 'celebrate', emoji: '🔥',
      t: ['{n} hari berturut-turut', '{n} days in a row'],
      b: ['Rentak mula terbentuk. Teruskan.', 'A rhythm is forming. Keep it going.'] },
    'milestone.7': { tone: 'celebrate', emoji: '🔥',
      t: ['{n} hari berturut-turut', '{n} days in a row'],
      b: ['Seminggu penuh. Tabiat anda semakin kukuh.', 'A full week. Your habits are getting stronger.'] },
    'milestone.14': { tone: 'celebrate', emoji: '🔥',
      t: ['{n} hari berturut-turut', '{n} days in a row'],
      b: ['Dua minggu tanpa putus. Itu disiplin yang nyata.', 'Two weeks strong. That is real consistency.'] },
    'milestone.30': { tone: 'celebrate', emoji: '🏆',
      t: ['{n} hari berturut-turut', '{n} days in a row'],
      b: ['Sebulan penuh. Ini sudah jadi cara hidup.', 'A whole month. This is a way of life now.'] },
    perfect: { tone: 'celebrate', emoji: '🎉',
      t: ['Hari sempurna', 'Perfect day'],
      b: ['Semua tabiat siap hari ini. Anda patut berbangga.', 'Every habit is done today. You should be proud.'] },
    perfectStreak: { tone: 'celebrate', emoji: '🎉',
      t: ['Hari sempurna', 'Perfect day'],
      b: ['Semua siap hari ini, dan {n} hari berturut-turut. Syabas.', 'All done today, and {n} days in a row. Nice work.'] },
    risk: { tone: 'nudge', emoji: '🔥',
      t: ['Lindungi rentak anda', 'Protect your streak'],
      b: ['Rentak {n} hari anda masih hidup. Siapkan {name} malam ini untuk menyambungnya.', 'Your {n}-day streak is still alive. Finishing {name} tonight would keep it going.'] },
    last: { tone: 'cheer', emoji: '💪',
      t: ['Hampir siap', 'Almost there'],
      b: ['Tinggal {name} sahaja hari ini. Anda sudah dekat.', 'Only {name} is left today. You are close.'] },
    next: { tone: 'cheer', emoji: '🌱',
      t: ['Seterusnya: {name}', 'Up next: {name}'],
      b: ['Pilih satu langkah kecil dan buat sekarang.', 'Pick one small step and do it now.'],
      a: ['Buat {name} sekarang.', 'Do {name} now.'] },

    'sup.morning': { tone: 'cheer', emoji: '💊',
      t: ['Selamat pagi', 'Good morning'],
      b: ['Mulakan dengan {items} dan segelas air. Kemenangan mudah dahulu.', 'Start with your {items} and a glass of water. Easy wins first.'],
      a: ['Ambil {items} bersama sarapan.', 'Take your {items} with breakfast.'] },
    'sup.late': { tone: 'nudge', emoji: '💊',
      t: ['Suplemen menunggu', 'Supplements waiting'],
      b: ['Ambil {items} bersama hidangan seterusnya supaya mudah diingat.', 'Take your {items} with your next meal so it is easy to remember.'],
      a: ['Ambil {items} bersama hidangan seterusnya.', 'Take your {items} with your next meal.'] },
    'water.morning': { tone: 'cheer', emoji: '💧',
      t: ['Mulakan dengan air', 'Start with water'],
      b: ['Segelas air selepas bangun ialah permulaan mudah. Sasaran hari ini {target} L.', 'A glass of water after waking is an easy start. Today\'s goal is {target} L.'],
      a: ['Minum segelas air sekarang.', 'Drink a glass of water now.'] },
    'water.behind': { tone: 'nudge', emoji: '💧',
      t: ['Semak air', 'Water check'],
      b: ['Anda di {have} L. Sekitar {pace} L pada waktu ini ialah rentak yang baik, jadi ambil segelas.', 'You are at {have} L. About {pace} L by now is a good pace, so grab a glass.'],
      a: ['Minum segelas air. Baki {left} L hari ini.', 'Drink a glass of water. {left} L to go today.'] },
    'water.ok': { tone: 'cheer', emoji: '💧',
      t: ['Air ikut rentak', 'Water on pace'],
      b: ['Air anda ikut rentak. Teruskan minum sedikit demi sedikit.', 'Your water is on pace. Keep sipping at an easy pace.'],
      a: ['Teruskan minum. Baki {left} L.', 'Keep sipping. {left} L to go.'] },
    'water.night': { tone: 'calm', emoji: '💧',
      t: ['Air sebelum tidur', 'Water before bed'],
      b: ['Baki air {left} L. Minum sedikit sahaja menjelang tidur supaya lena tidak terganggu.', '{left} L left to go. Take small sips close to bedtime so your sleep stays smooth.'],
      a: ['Minum sedikit sahaja sekarang.', 'Take a few small sips now.'] },
    'walk.morning': { tone: 'cheer', emoji: '🚶',
      t: ['Jalan pagi', 'Morning walk'],
      b: ['Jalan pantas {mins} minit ialah cara yang baik untuk mulakan hari. Pastikan anda boleh bercakap tetapi tidak boleh menyanyi.', 'A {mins}-minute brisk walk is a nice way to start the day. Aim for a pace where you can talk but not sing.'],
      a: ['Jalan pantas {mins} minit.', 'Take a {mins}-minute brisk walk.'] },
    'walk.midday': { tone: 'cheer', emoji: '🚶',
      t: ['Masa untuk jalan', 'Walk time'],
      b: ['Rehat sebentar dan jalan pantas {mins} minit. Anda patut boleh bercakap tetapi tidak boleh menyanyi.', 'Take a break for a {mins}-minute brisk walk. You should be able to talk but not sing.'],
      a: ['Jalan pantas {mins} minit.', 'Take a {mins}-minute brisk walk.'] },
    'walk.evening': { tone: 'cheer', emoji: '🚶',
      t: ['Jalan petang', 'Evening walk'],
      b: ['Jalan pantas {mins} minit sesuai untuk petang ini. Pilih rentak yang membolehkan anda bercakap tetapi tidak menyanyi.', 'A {mins}-minute brisk walk fits nicely this evening. Go at a pace where you can talk but not sing.'],
      a: ['Jalan pantas {mins} minit.', 'Take a {mins}-minute brisk walk.'] },
    'walk.night': { tone: 'calm', emoji: '🚶',
      t: ['Jalan ringkas', 'A short stroll'],
      b: ['Sudah lewat untuk jalan jauh. Jalan santai sebentar pun menambah minit anda.', 'It is late for a long walk. Even a gentle stroll adds minutes to your total.'],
      a: ['Jalan santai sebentar.', 'Take a short, easy stroll.'] },
    'fasting.early': { tone: 'cheer', emoji: '🍽️',
      t: ['Hari puasa berselang', 'IF day'],
      b: ['Hari ini ialah hari IF. Tandakan selepas anda tamatkan tempoh puasa.', 'Today is an IF day. Mark it once you finish your fasting window.'],
      a: ['Tandakan IF selepas tempoh puasa tamat.', 'Mark IF once your fasting window is done.'] },
    'fasting.late': { tone: 'cheer', emoji: '🍽️',
      t: ['Hari puasa berselang', 'IF day'],
      b: ['Tamatkan puasa dengan hidangan seimbang, kemudian tandakan di sini.', 'Break your fast with a balanced meal, then tick it off here.'],
      a: ['Tandakan IF hari ini.', 'Mark today\'s IF.'] },
    'sleep.plan': { tone: 'cheer', emoji: '🌙',
      t: ['Rancang tidur', 'Plan your sleep'],
      b: ['Tetapkan waktu tidur yang awal malam ini untuk cecah {target} jam.', 'Pick an early bedtime tonight to reach {target} hours.'],
      a: ['Tetapkan waktu tidur untuk {target} jam.', 'Pick a bedtime for {target} hours.'] },
    'sleep.wind': { tone: 'calm', emoji: '🌙',
      t: ['Masa bertenang', 'Wind-down time'],
      b: ['Malapkan lampu dan letak telefon. Tidur {target} jam anda bermula dari sini.', 'Dim the lights and put the phone down. Your {target} hours start here.'],
      a: ['Letak telefon dan bersedia untuk tidur.', 'Put the phone down and get ready for bed.'] }
  };

  /** Build a coach message from an entry key. */
  function build(key, params) {
    var e = M[key] || M.fallback;
    return { tone: e.tone, emoji: e.emoji, title: pick(e.t, params), body: pick(e.b, params) };
  }

  /* ------------------------------------------------------------------ next-action picking */
  function phaseOf(hour) {
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 16) return 'midday';
    if (hour >= 16 && hour < 21) return 'evening';
    return 'night';
  }
  var PRI = {
    morning: { supplements: 100, water: 90, walk: 60, fasting: 40, sleep: 30 },
    midday: { supplements: 95, water: 45, walk: 70, fasting: 40, sleep: 20 },
    evening: { supplements: 95, water: 50, walk: 100, fasting: 80, sleep: 70 },
    night: { supplements: 95, water: 40, walk: 30, fasting: 80, sleep: 100 }
  };

  /** Describe one pending habit for this moment: which copy to use, params, priority. */
  function describe(h, phase, hour) {
    var id = h.id, params = { name: hname(id) }, key = 'next';
    var pri = (PRI[phase] && PRI[phase][id]) != null ? PRI[phase][id] : 10;
    var target = getTarget(id);
    if (id === 'supplements') {
      var all = safe(function () { return HP.config.habit('supplements').items; }, []) || [];
      var have = Array.isArray(h.value) ? h.value : [];
      var missing = all.filter(function (it) { return have.indexOf(it.id) < 0; });
      var names = missing.length === all.length || !missing.length
        ? (langIdx() === 1 ? 'supplements' : 'suplemen')
        : listNames(missing.map(function (it) { return safe(function () { return HP.tr(it.name); }, it.id); }));
      params.items = names;
      key = phase === 'morning' ? 'sup.morning' : 'sup.late';
    } else if (id === 'water') {
      var cur = +h.value || 0;
      var pace = target * HP.clamp((hour - 7) / 14, 0, 1);
      var behind = cur < pace - 0.2;
      params.have = num(cur); params.target = num(target); params.pace = num(Math.round(pace * 4) / 4);
      params.left = num(Math.max(0, target - cur));
      if (phase === 'morning') key = 'water.morning';
      else if (phase === 'night') key = 'water.night';
      else {
        key = behind ? 'water.behind' : 'water.ok';
        if (behind) pri = phase === 'midday' ? 100 : 92;
      }
    } else if (id === 'walk') {
      var rem = Math.max(0, target - (+h.value || 0));
      params.mins = Math.max(5, Math.ceil(rem / 5) * 5);
      key = 'walk.' + phase;
      if (phase === 'evening' && hour >= 20) pri = 40;
    } else if (id === 'fasting') {
      key = (phase === 'morning' || phase === 'midday') ? 'fasting.early' : 'fasting.late';
    } else if (id === 'sleep') {
      params.target = num(target, 1);
      var wind = hour >= 20 || hour < 5;
      key = wind ? 'sleep.wind' : 'sleep.plan';
      if (wind) pri = 98;
    }
    return { habitId: id, key: key, params: params, pri: pri, phase: phase };
  }

  function pending(ds) { return ds.habits.filter(function (h) { return h.scheduled && !h.done; }); }

  function pickNext(ds, hour) {
    var phase = phaseOf(hour), best = null;
    pending(ds).forEach(function (h) {
      var d = describe(h, phase, hour);
      if (!best || d.pri > best.pri) best = d;
    });
    return best;
  }

  /* ------------------------------------------------------------------ tips */
  var TIPS = {
    water: [
      ['Minum sedikit demi sedikit. Separuh air menjelang 2 petang menjadikan malam lebih mudah.', 'Sip steadily. About half your water by 2 pm keeps the evening easy.'],
      ['Letak botol air di tempat yang nampak. Melihatnya sudah separuh tabiat.', 'Keep a bottle where you can see it. Seeing it is half the habit.'],
      ['Minum segelas air sebaik bangun, sebelum kopi atau teh.', 'Have a glass of water when you wake up, before your coffee or tea.'],
      ['Kaitkan air dengan perkara yang anda sudah buat: selepas gosok gigi dan sebelum setiap hidangan.', 'Pair water with things you already do: after brushing your teeth and before each meal.'],
      ['Mahu makan snek waktu petang? Cuba segelas air dahulu, kemudian putuskan.', 'Reaching for a snack mid-afternoon? Try a glass of water first, then decide.'],
      ['Air kosong rasa membosankan? Letak hirisan lemon atau timun.', 'Plain water feels boring? Add a slice of lemon or cucumber.'],
      ['Kurangkan minum dalam dua jam sebelum tidur supaya lena tidak terganggu.', 'Slow down in the last two hours before bed so your sleep stays smooth.']
    ],
    sleep: [
      ['Tidur dan bangun pada waktu yang sama, termasuk hujung minggu, membantu badan anda selesa.', 'Going to bed and waking up at the same time, even on weekends, helps your body settle.'],
      ['Malapkan lampu dan letak telefon 30 minit sebelum tidur.', 'Dim the lights and put your phone down 30 minutes before bed.'],
      ['Rutin bertenang yang ringkas membantu: regangan, mandi air suam, atau beberapa muka surat buku.', 'A short wind-down helps: a stretch, a warm shower, or a few pages of a book.'],
      ['Pastikan bilik sejuk, gelap dan senyap.', 'Keep your room cool, dark and quiet.'],
      ['Simpan kopi dan teh untuk waktu pagi dan awal petang.', 'Save coffee and tea for the morning and early afternoon.'],
      ['Sukar lelap? Cuba pernafasan perlahan: tarik 4 kiraan, hembus 6 kiraan.', 'Lying awake? Try slow breathing: in for 4 counts, out for 6.'],
      ['Tulis senarai tugas esok sebelum tidur supaya fikiran boleh berehat.', 'Write tomorrow\'s to-do list before bed so your mind can rest.']
    ],
    walk: [
      ['Jalan pantas bermaksud anda boleh bercakap tetapi tidak boleh menyanyi.', 'Brisk means you can talk but not sing.'],
      ['Mulakan dengan 5 minit jalan santai, kemudian laju sedikit demi sedikit.', 'Start with 5 easy minutes, then pick up the pace little by little.'],
      ['Tiada masa 30 minit? Tiga jalan 10 minit akan bertambah jadi 30 minit.', 'No time for 30 minutes? Three 10-minute walks add up to 30.'],
      ['Jalan singkat selepas makan ialah cara mudah untuk masukkan langkah.', 'A short walk after a meal is an easy way to fit steps in.'],
      ['Berdiri tegak, lemaskan bahu dan ayun lengan dengan selesa.', 'Stand tall, relax your shoulders and swing your arms.'],
      ['Kasut yang selesa memudahkan anda berkata ya.', 'Comfortable shoes make it easier to say yes.'],
      ['Jalan bersama kawan atau dengar muzik, dan masa berlalu pantas.', 'Walk with a friend or some music and the time flies.'],
      ['Hujan? Jalan berpusing di dalam rumah atau di pusat beli-belah.', 'Rainy day? Walk laps indoors or in a mall.']
    ],
    supplements: [
      ['Pilih satu pengikat harian seperti sarapan, supaya anda tidak perlu ingat.', 'Pick a daily anchor like breakfast so you do not have to remember.'],
      ['Letak suplemen di sebelah sesuatu yang anda guna setiap pagi, seperti cerek atau berus gigi.', 'Keep them next to something you use every morning, like the kettle or toothbrush.'],
      ['Ramai orang rasa suplemen lebih selesa diambil bersama hidangan.', 'Many people find supplements easier to take with a meal.'],
      ['Kotak pil mingguan menjadikan tabiat ini kerja dua saat.', 'A weekly pill box turns this habit into a two-second job.'],
      ['Terlepas satu? Tidak mengapa. Sambung semula pada pengikat anda yang seterusnya.', 'Missed one? No stress. Pick it up again at your next anchor.'],
      ['Tetapkan peringatan harian di Tetapan pada waktu yang sama setiap hari.', 'Set a daily reminder in Settings for the same time each day.'],
      ['Baca label dan ikut arahan pada pek anda. Jika anda ada masalah kesihatan atau mengambil ubat, bincang dengan doktor anda.', 'Check the label and follow the directions on your pack. If you have a health condition or take medicine, talk to your doctor.']
    ],
    fasting: [
      ['Pilih tempoh makan yang sesuai dengan hidup anda, bukan hidup orang lain.', 'Choose an eating window that fits your life, not someone else\'s.'],
      ['Air kosong dan teh tanpa gula ialah kawan anda semasa tempoh puasa.', 'Water and plain tea are your friends during the fasting window.'],
      ['Tamatkan puasa dengan hidangan seimbang, kemudian bersikap lembut pada diri sendiri.', 'Break your fast with a balanced meal, then go easy on yourself.'],
      ['Rasa tidak sedap badan? Makan sentiasa boleh. Dengar badan anda.', 'Feeling off? Eating is always okay. Listen to your body.'],
      ['Pagi yang sibuk membuat tempoh puasa berlalu lebih cepat.', 'A busy morning makes the fasting window pass faster.'],
      ['Tidak perlu sempurna setiap hari. Pelan anda sudah ada hari rehat.', 'Not every day has to be perfect. Your plan already has a rest day built in.'],
      ['Jika anda ada masalah kesihatan, mengandung atau mengambil ubat, bincang dengan doktor sebelum berpuasa.', 'If you have a health condition, are pregnant or take medicine, talk to your doctor before fasting.']
    ],
    generic: [
      ['Kemenangan kecil bertambah. Satu tabiat hari ini lebih baik daripada tiada.', 'Small wins add up. One habit today beats none.'],
      ['Siap lebih baik daripada sempurna.', 'Done is better than perfect.'],
      ['Terlepas sehari tidak memadam kemajuan anda. Mulakan semula hari ini.', 'Missing a day does not undo your progress. Just start again today.'],
      ['Kaitkan tabiat baharu dengan sesuatu yang anda sudah buat setiap hari.', 'Link a new habit to something you already do every day.'],
      ['Raikan kemenangan kecil anda. Anda layak menerimanya.', 'Celebrate your small wins. You earned them.'],
      ['Jika anda ada masalah kesihatan, bincang dengan doktor sebelum mengubah rutin anda.', 'If you have a health condition, talk to your doctor before changing your routine.']
    ]
  };

  function habitTip(habitId, date) {
    return safe(function () {
      var list = TIPS[habitId] || TIPS.generic;
      var ids = safe(function () { return HP.config.habitIds(); }, []) || [];
      var off = Math.max(0, ids.indexOf(habitId));
      var idx = (dayOfYear(date || todayStr()) + off * 2) % list.length;
      return pick(list[idx]);
    }, '') || pick(TIPS.generic[0]);
  }

  /* ------------------------------------------------------------------ coach */
  function streakInfo() {
    return safe(function () { return HP.gamify.compute().streak; }, null) || { current: 0, best: 0 };
  }

  function recap(d, ds) {
    var p = { date: dateLabel(d), total: ds.scheduledCount, done: ds.doneCount };
    if (ds.isRest) return build('past.rest', p);
    if (ds.perfect) return build('past.perfect', p);
    if (!ds.logged) return build('past.none', p);
    var best = null;
    ds.habits.forEach(function (h) { if (h.scheduled && h.progress > 0 && (!best || h.progress > best.progress)) best = h; });
    if (best) { p.best = hname(best.id); return build('past.some', p); }
    return build('past.some0', p);
  }

  function coachMessage(date) {
    return safe(function () {
      var today = todayStr();
      var d = date || today;
      if (d > today) return build('future');
      var ds = getDay(d);
      if (!ds) return build('fallback');
      if (d < today) return recap(d, ds);

      var hour = nowHour();
      var streak = streakInfo().current || 0;
      var qualified = ds.pct >= minPct();

      if (ds.isRest) {
        var bonus = ds.habits.filter(function (h) { return h.bonus; })[0];
        return bonus ? build('restBonus', { name: hname(bonus.id) }) : build('rest');
      }
      if ([3, 7, 14, 30].indexOf(streak) >= 0 && (ds.perfect || qualified)) {
        return build('milestone.' + streak, { n: streak });
      }
      if (ds.perfect) return streak >= 2 ? build('perfectStreak', { n: streak }) : build('perfect');

      var next = pickNext(ds, hour);
      if (!next) return build('fallback');
      var nextName = hname(next.habitId);

      if (hour >= 18 && streak >= 2 && !qualified) return build('risk', { n: streak, name: nextName });
      var neverLogged = safe(function () { return HP.store.logDates().length === 0; }, false);
      if (neverLogged && !ds.logged) return build('welcome');
      if (pending(ds).length === 1 && ds.doneCount >= 1) return build('last', { name: nextName });
      return build(next.key, next.params);
    }, null) || build('fallback');
  }

  function nextAction(date) {
    return safe(function () {
      var d = date || todayStr();
      if (d !== todayStr()) return null;
      var ds = getDay(d);
      if (!ds || ds.isRest || ds.perfect) return null;
      var n = pickNext(ds, nowHour());
      if (!n) return null;
      var e = M[n.key] || M.next;
      return { habitId: n.habitId, text: pick(e.a || M.next.a, n.params) };
    }, null);
  }

  /* ------------------------------------------------------------------ weekly review */
  var HEAD = {
    legend: ['Minggu legenda', 'Legendary week'],
    great: ['Minggu yang cemerlang', 'A great week'],
    good: ['Minggu yang baik', 'A solid week'],
    keepgoing: ['Terus bergerak', 'Keep it moving'],
    restart: ['Permulaan baharu', 'A fresh start']
  };
  var SUM = {
    done: ['Anda siapkan {done} daripada {total} tabiat yang dirancang minggu ini ({pct}%).', 'You completed {done} of {total} planned habits this week ({pct}%).'],
    early: ['Minggu ini baru bermula. Belum ada apa-apa yang perlu dikejar.', 'This week is just starting. Nothing to catch up on yet.']
  };
  var HL = {
    best: ['Paling konsisten: {name}, {done} daripada {total} hari.', 'Most consistent: {name}, {done} of {total} days.'],
    walk: ['Anda berjalan {n} minit minggu ini.', 'You walked {n} minutes this week.', 'You walked 1 minute this week.'],
    perfect: ['{n} hari sempurna minggu ini.', '{n} perfect days this week.', '1 perfect day this week.'],
    streak: ['Rentak semasa anda ialah {n} hari.', 'Your current streak is {n} days.'],
    run: ['Anda ada {n} hari kukuh berturut-turut.', 'You had {n} strong days in a row.'],
    water: ['Anda minum {n} L air minggu ini.', 'You drank {n} L of water this week.'],
    sleep: ['Anda capai sasaran tidur pada {done} daripada {total} malam.', 'You hit your sleep goal on {done} of {total} nights.', 'You hit your sleep goal on 1 of {total} nights.'],
    supplements: ['Suplemen lengkap pada {done} daripada {total} hari.', 'Supplements fully done on {done} of {total} days.', 'Supplements fully done on 1 of {total} days.'],
    none: ['Setiap minggu ialah permulaan baharu. Catat satu tabiat hari ini.', 'Every week is a fresh start. Log one habit today.']
  };
  var FOCUS_TIP = {
    water: ['Letak botol air dalam pandangan dan minum sepanjang hari.', 'Keep a bottle in sight and sip all day.'],
    sleep: ['Pilih waktu tidur dan set penggera bertenang 30 minit sebelum itu.', 'Pick a bedtime and set a wind-down alarm 30 minutes before it.'],
    walk: ['Tetapkan satu slot masa untuknya. Sepuluh minit pun membantu.', 'Set a fixed time slot for it. Even 10 minutes helps.'],
    supplements: ['Kaitkan dengan sarapan supaya anda tidak perlu ingat.', 'Link them to breakfast so you never have to remember.'],
    fasting: ['Pilih tempoh makan yang sesuai dengan hari anda dan kekalkan.', 'Choose an eating window that suits your day and keep it steady.']
  };
  var FOCUS = ['Fokus pada {name} seterusnya. {tip}', 'Focus on {name} next. {tip}'];
  var WEEK_FALLBACK = {
    headline: ['Minggu anda', 'Your week'],
    summary: ['Catat tabiat anda dan ringkasan minggu akan muncul di sini.', 'Log your habits and your weekly summary will show up here.']
  };

  function gradeKey(ws) {
    if (ws.rating && HEAD[ws.rating.key]) return ws.rating.key;
    var pct = +ws.pct || 0;
    var grades = safe(function () { return HP.config.GRADES; }, []) || [];
    for (var i = 0; i < grades.length; i++) if (pct >= grades[i].min) return grades[i].key;
    return 'restart';
  }

  function longestRun(ws) {
    var min = minPct(), run = 0, best = 0;
    (ws.days || []).forEach(function (d) {
      if (!d || d.isFuture || d.isRest) return;
      if (d.pct >= min) { run++; if (run > best) best = run; }
      else if (!(d.isToday && !d.started)) run = 0;
    });
    return best;
  }

  function weeklyReview(anyDateInWeek) {
    var generic = { headline: pick(WEEK_FALLBACK.headline), summary: pick(WEEK_FALLBACK.summary), highlights: [], focus: null };
    return safe(function () {
      var ws = HP.scoring.weekScore(anyDateInWeek || todayStr());
      if (!ws || !ws.habits) return generic;
      var out = { headline: pick(HEAD[gradeKey(ws)]), highlights: [], focus: null };
      var hasData = ws.scheduledTotal > 0 && ws.daysElapsed > 0;
      out.summary = hasData
        ? pick(SUM.done, { done: ws.doneTotal, total: ws.scheduledTotal, pct: Math.round(ws.pct) })
        : pick(SUM.early);

      var ids = Object.keys(ws.habits).filter(function (id) { return ws.habits[id] && ws.habits[id].scheduled > 0; });
      function ratio(id) { return ws.habits[id].done / ws.habits[id].scheduled; }

      var cands = [];
      var best = null;
      ids.forEach(function (id) {
        if (ws.habits[id].done > 0 && (!best || ratio(id) > ratio(best) || (ratio(id) === ratio(best) && ws.habits[id].scheduled > ws.habits[best].scheduled))) best = id;
      });
      if (best) cands.push(pick(HL.best, { name: hname(best), done: ws.habits[best].done, total: ws.habits[best].scheduled }));
      var walk = ws.habits.walk;
      if (walk && walk.total > 0) cands.push(pick(HL.walk, { n: Math.round(walk.total) }));
      if (ws.perfectDays > 0) cands.push(pick(HL.perfect, { n: ws.perfectDays }));
      var cur = streakInfo().current || 0;
      var run = longestRun(ws);
      if (cur >= 2) cands.push(pick(HL.streak, { n: cur }));
      else if (run >= 2) cands.push(pick(HL.run, { n: run }));
      var water = ws.habits.water;
      if (water && water.total > 0) cands.push(pick(HL.water, { n: num(water.total, 1) }));
      var sleep = ws.habits.sleep;
      if (sleep && sleep.scheduled > 0 && sleep.done > 0) cands.push(pick(HL.sleep, { n: sleep.done, done: sleep.done, total: sleep.scheduled }));
      var sup = ws.habits.supplements;
      if (sup && sup.scheduled > 0 && sup.done > 0) cands.push(pick(HL.supplements, { n: sup.done, done: sup.done, total: sup.scheduled }));
      out.highlights = cands.slice(0, 4);
      if (!out.highlights.length) out.highlights = [pick(HL.none)];

      // Focus: the weakest scheduled habit that did not reach 100%.
      if (hasData) {
        var weak = null;
        ids.forEach(function (id) {
          if (ratio(id) < 1 && (!weak || ratio(id) < ratio(weak))) weak = id;
        });
        if (weak) {
          out.focus = { habitId: weak, text: pick(FOCUS, { name: hname(weak), tip: pick(FOCUS_TIP[weak] || TIPS.generic[1]) }) };
        }
      }
      return out;
    }, generic);
  }

  HP.insights = {
    coachMessage: coachMessage,
    nextAction: nextAction,
    habitTip: habitTip,
    weeklyReview: weeklyReview
  };
})();
