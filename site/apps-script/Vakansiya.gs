/**
 * Nomzod — vakansiya arizalarini qabul qilish (Google Apps Script web app, jadvalga bog'langan).
 *
 * Ishlashi uchun shu loyihada ALOHIDA `Kalit.gs` fayli bo'lishi kerak: u global `KALIT` o'zgaruvchisini
 * e'lon qiladi (baholash kaliti). Kalit GitHub'da YO'Q va bu faylga ko'chirilmaydi.
 * `KALIT` topilmasa, ariza xom holda saqlanadi, ball ustunlari bo'sh qoladi.
 *
 * Birinchi marta: `setup()` ni bir marta ishga tushiring (varaqlar va rang shkalasi yaratiladi).
 * Ixtiyoriy: Script Properties'ga TELEGRAM_TOKEN va CHAT_ID qo'shilsa, Telegram'ga xabar keladi.
 */
var NOMZODLAR = 'Nomzodlar';
var XOM = 'Javoblar_xom';
var TZ = 'Asia/Tashkent';

var HEADERS = ['Sana', 'Vakansiya', 'Ism familiya', 'Telefon', 'Telegram', 'Rezyume',
  'C-level indeks', 'Fidbekka ochiqlik', 'Moslashuvchanlik', 'Boshqaruvga moyillik', "Qat'iylik", 'Tizimli fikrlash', 'Adolat va etika', 'Insoniylik', 'Mantiqiy fikrlash',
  'Samimiylik (0–6)', 'Ishonchlilik', 'Xulosa', 'O1 javob', 'O2 javob', 'O3 javob', 'Vaqt (daq)', 'Holat', "Mas'ul izoh"];
var XOM_HEADERS = ['Sana', 'Ism', 'Telefon', 'answers JSON', 'page', 'ua'];
var DIM_ORDER = ['FB', 'MOS', 'BOSH', 'QAT', 'STR', 'ADL', 'EMP']; // 8–14-ustunlar tartibi (15-ustun: mantiqiy fikrlash)
var CV_FOLDER = 'Nomzod — Rezyumelar';
var CV_MAX = 5 * 1024 * 1024;
var HOLATLAR = ['Yangi', "Ko'rilmoqda", 'Suhbat', 'Kompaniya bilan uchrashuv', 'Qabul qilindi', 'Rad etildi'];

/* ---------- web app ---------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // spam-bot (honeypot)

    var answers = parseAnswers_(p.answers);
    var sana = Utilities.formatDate(new Date(), TZ, 'dd.MM.yyyy HH:mm');

    // 1) xom ma'lumotni darhol saqlaymiz (ball hisoblashda xato bo'lsa ham yo'qolmasin)
    getSheet_(XOM, XOM_HEADERS).appendRow([
      sana, clean_(p.fullname, 200), clean_(p.phone, 50),
      String(p.answers || '').slice(0, 45000), clean_(p.page, 500), clean_(p.ua, 300)
    ]);

    // 2) ball
    var sc = null;
    try {
      if (typeof KALIT !== 'undefined') sc = score_(answers, KALIT);
    } catch (err) { sc = null; }

    var open = (answers && answers.open) || {};
    var f = sc ? sc.final : null;
    var scoreCells = DIM_ORDER.map(function (d) { return f && f[d] !== undefined ? f[d] : ''; });
    scoreCells.push(sc ? sc.log : '');
    var minutes = Math.round((Number(p.total_ms) || 0) / 6000) / 10;

    var cvUrl = '';
    try { cvUrl = saveCv_(p); } catch (err) { cvUrl = 'Fayl saqlanmadi: ' + String(err).slice(0, 200); }

    var row = [
      sana, clean_(p.vacancy_title || p.vacancy, 200), clean_(p.fullname, 200), clean_(p.phone, 50), clean_(p.telegram, 100),
      cvUrl,
      sc ? sc.clevelIndex : ''
    ].concat(scoreCells).concat([
      sc ? 6 - sc.lieCount : '',
      sc ? sc.reliability : '',
      sc ? sc.xulosa : '',
      clean_(open.o1, 5000), clean_(open.o2, 5000), clean_(open.o3, 5000),
      minutes, 'Yangi', ''
    ]);
    getSheet_(NOMZODLAR, HEADERS).appendRow(row);

    notifyTelegram_(p, sc, cvUrl);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return json_({ ok: true, service: 'Nomzod vakansiyalar' });
}

/* ---------- rezyume faylini Drive'ga saqlash ---------- */
function saveCv_(p) {
  if (!p.cv_b64) return '';
  var bytes = Utilities.base64Decode(String(p.cv_b64));
  if (bytes.length > CV_MAX) return 'Fayl juda katta';
  var ext = String(p.cv_name || '').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'pdf';
  var who = String(p.fullname || 'nomzod').replace(/[\\/:*?"<>|]/g, ' ').trim().slice(0, 80);
  var name = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd') + ' — ' + who + ' — ' + (p.vacancy_title || p.vacancy || '') + '.' + ext;
  var mime = String(p.cv_mime || 'application/octet-stream').slice(0, 100);
  var it = DriveApp.getFoldersByName(CV_FOLDER);
  var folder = it.hasNext() ? it.next() : DriveApp.createFolder(CV_FOLDER);
  var file = folder.createFile(Utilities.newBlob(bytes, mime, name));
  return file.getUrl();
}

/* ---------- bir martalik sozlash ---------- */
function setup() {
  var sh = getSheet_(NOMZODLAR, HEADERS);
  getSheet_(XOM, XOM_HEADERS);
  var last = 1000;
  // ball ustunlari (7–15): 0–100 rang shkalasi
  var rules = []; // qayta ishga tushirilsa, qoidalar takrorlanmaydi
  rules.push(scale_(sh.getRange(2, 7, last, 9), 0, 50, 100));
  // samimiylik (16): 0–6
  rules.push(scale_(sh.getRange(2, 16, last, 1), 0, 3, 6));
  sh.setConditionalFormatRules(rules);
  // holat ro'yxati (23-ustun)
  sh.getRange(2, 23, last, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(HOLATLAR, true).setAllowInvalid(true).build());
  sh.setColumnWidths(1, HEADERS.length, 130);
  sh.setColumnWidth(18, 320);
  sh.setColumnWidths(19, 3, 360);
}

function scale_(range, min, mid, max) {
  return SpreadsheetApp.newConditionalFormatRule()
    .setGradientMinpointWithValue('#F4C7C3', SpreadsheetApp.InterpolationType.NUMBER, String(min))
    .setGradientMidpointWithValue('#FFFFFF', SpreadsheetApp.InterpolationType.NUMBER, String(mid))
    .setGradientMaxpointWithValue('#B7E1CD', SpreadsheetApp.InterpolationType.NUMBER, String(max))
    .setRanges([range]).build();
}

function getSheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sh;
}

/* ---------- ball hisoblash (KALIT v2; alohida sinash mumkin) ---------- */
function score_(answers, kalit) {
  answers = answers || {};
  var dims = kalit.dims;
  var stmtAns = answers.statements || {};

  // bo'lim (logic / daily) bo'yicha o'lchovlar foizi
  function sectionPct(sec) {
    var ans = answers[sec] || {}, key = kalit[sec] || {};
    var raw = {}, max = {}, min = {};
    dims.forEach(function (d) { raw[d] = 0; max[d] = 0; min[d] = 0; });
    var w = function (opt, d) { return (opt && typeof opt === 'object' && opt[d]) || 0; };
    Object.keys(key).forEach(function (id) {
      var opts = key[id], ids = Object.keys(opts);
      var a = ans[id], pick = a && ids.indexOf(a.pick) >= 0 ? a.pick : null;
      dims.forEach(function (d) {
        var hi = -Infinity, lo = Infinity;
        ids.forEach(function (o) { var v = w(opts[o], d); if (v > hi) hi = v; if (v < lo) lo = v; });
        if (isFinite(hi)) { max[d] += hi; min[d] += lo; }
        if (pick) raw[d] += w(opts[pick], d);
      });
    });
    var pct = {};
    dims.forEach(function (d) {
      var range = max[d] - min[d];
      pct[d] = range > 0 ? clamp_((raw[d] - min[d]) / range * 100) : 50;
    });
    return pct;
  }
  var logicPct = sectionPct('logic'), dailyPct = sectionPct('daily');

  // qadriyatlar tartibi
  var order = Array.isArray(answers.values) ? answers.values : [];
  var vKeys = Object.keys(kalit.values || {}), n = vKeys.length;
  var valuesPct = {};
  dims.forEach(function (d) { valuesPct[d] = 50; });
  vKeys.forEach(function (vid) {
    var d = kalit.values[vid], r = order.indexOf(vid) + 1; // 1-o'rin = 1
    if (valuesPct[d] === undefined) return;
    valuesPct[d] = r > 0 && n > 1 ? clamp_((n - r) / (n - 1) * 100) : 50;
  });

  var mix = kalit.mix, fin = {};
  dims.forEach(function (d) {
    fin[d] = clamp_(Math.round(mix.logic * logicPct[d] + mix.daily * dailyPct[d] + mix.values * valuesPct[d]));
  });

  // mantiqiy fikrlash (LOG) va mantiqsiz javoblar
  var lAns = answers.logic || {}, lKey = kalit.logic || {}, lIds = Object.keys(lKey);
  var okCount = 0, illCount = 0;
  lIds.forEach(function (id) {
    var a = lAns[id], v = a && lKey[id][a.pick];
    if (v === undefined) return;
    if (v === 'ill') illCount++; else okCount++;
  });
  var LOG = lIds.length ? clamp_(Math.round(100 * okCount / lIds.length)) : 0;

  var cl = 0;
  Object.keys(kalit.clevel).forEach(function (k) { cl += kalit.clevel[k] * (k === 'LOG' ? LOG : (fin[k] || 0)); });
  var clevelIndex = clamp_(Math.round(cl));

  var lieCount = 0;
  Object.keys(kalit.lie).forEach(function (id) { if (stmtAns[id] === kalit.lie[id]) lieCount++; });

  var times = [];
  lIds.forEach(function (id) {
    var a = lAns[id];
    if (a && typeof a.ms === 'number' && isFinite(a.ms) && a.ms > 0) times.push(a.ms);
  });
  var medianMs = median_(times);

  var reliability = 'Yuqori';
  if (lieCount >= 3) reliability = "Past — o'zini ideal ko'rsatishga moyil";
  else if (lieCount === 2) reliability = "O'rta";
  if (illCount >= 4) reliability += " · ko'p mantiqsiz javob — e'tiborsiz to'ldirgan bo'lishi mumkin";
  if (medianMs !== null && medianMs < 7000) reliability += ' · juda tez javob bergan';

  var notes = [];
  if (fin.QAT >= 65 && fin.EMP < 40) notes.push("Qat'iy, lekin insoniy tomoni zaifroq");
  if (fin.EMP >= 65 && fin.QAT < 40) notes.push('Yumshoq — qiyin qarorlardan qochishi mumkin');
  if (fin.FB < 40) notes.push('Fidbekka yopiqroq');
  if (fin.ADL < 40) notes.push("Etika/maxfiylik bo'yicha xavf — suhbatda tekshiring");
  if (fin.BOSH < 35) notes.push('Tashabbus kam');
  if (fin.STR >= 70) notes.push('Tizimli fikrlaydi');
  if (LOG < 50) notes.push('Mantiqiy xulosa chiqarishda zaif');
  if (clevelIndex >= 65) notes.push('C-level bilan ishlashga kuchli nomzod');
  else if (clevelIndex >= 52) notes.push("O'rta — suhbatda chuqurroq tekshiring");
  else notes.push('C-level rol uchun zaifroq');

  return {
    final: fin, log: LOG, clevelIndex: clevelIndex, lieCount: lieCount, illCount: illCount, reliability: reliability,
    xulosa: notes.join('; '), logicPct: logicPct, dailyPct: dailyPct, valuesPct: valuesPct, medianMs: medianMs
  };
}

function clamp_(x) { return Math.max(0, Math.min(100, x)); }
function median_(a) {
  if (!a.length) return null;
  var s = a.slice().sort(function (x, y) { return x - y; }), m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/* ---------- yordamchilar ---------- */
function parseAnswers_(s) {
  try {
    var o = JSON.parse(String(s || '{}'));
    return o && typeof o === 'object' ? o : {};
  } catch (e) { return {}; }
}

// Formula sifatida o'qilmasligi va juda uzun bo'lmasligi uchun
function clean_(v, limit) {
  v = String(v == null ? '' : v).slice(0, limit || 2000);
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function notifyTelegram_(p, sc, cvUrl) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('TELEGRAM_TOKEN');
  var chat = props.getProperty('CHAT_ID');
  if (!token || !chat) return;
  var text = 'Yangi ariza — ' + (p.vacancy_title || 'vakansiya') + '\n\n' +
    'Ism: ' + (p.fullname || '—') + '\nTelefon: ' + (p.phone || '—') +
    '\nTelegram: ' + (p.telegram || '—') + '\nRezyume: ' + (cvUrl || '—') +
    (sc ? '\nC-level indeks: ' + sc.clevelIndex + '\nMantiqiy fikrlash: ' + sc.log + '\nIshonchlilik: ' + sc.reliability + '\nXulosa: ' + sc.xulosa : '\n(ball hisoblanmadi)');
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'post', contentType: 'application/json',
      payload: JSON.stringify({ chat_id: chat, text: text }), muteHttpExceptions: true
    });
  } catch (e) {}
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

if (typeof module !== 'undefined') module.exports = { score_: score_ };
