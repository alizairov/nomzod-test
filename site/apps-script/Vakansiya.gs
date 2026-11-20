/**
 * Nomzod — vakansiya arizalarini qabul qilish (Google Apps Script web app, jadvalga bog'langan).
 *
 * Ishlashi uchun shu loyihada ALOHIDA `Kalit.gs` fayli bo'lishi kerak: u global `KALIT` o'zgaruvchisini
 * e'lon qiladi (baholash kaliti, v3). Kalit GitHub'da YO'Q va bu faylga ko'chirilmaydi.
 * `KALIT` topilmasa, ariza xom holda saqlanadi, ball ustunlari bo'sh qoladi.
 *
 * Birinchi marta: `setup()` ni bir marta ishga tushiring (varaqlar va rang shkalasi yaratiladi).
 * Ixtiyoriy: Script Properties'ga TELEGRAM_TOKEN va CHAT_ID qo'shilsa, Telegram'ga xabar keladi.
 */
var NOMZODLAR = 'Nomzodlar';
var XOM = 'Javoblar_xom';
var TZ = 'Asia/Tashkent';

// 1-qadamdagi Ha/Yo'q savollar (qisqa nomlari). y7 — ish sharoiti, tajriba hisobiga kirmaydi.
var YN = [['y1', 'C-level bilan ishlagan'], ['y2', 'Ishga olish/bo\'shatish qarori'], ['y3', 'Rokirovka'],
  ['y4', "Bo'shatish suhbati"], ['y5', 'HR tizimini noldan qurgan'], ['y6', 'Jamoa boshqargan'], ['y7', "Toshkent, ofis, to'liq stavka"]];
// Sifat ustunlari (KALIT v3 tartibida). KALIT bo'lmasa ham sarlavhalar o'zgarmaydi.
var SIFATLAR = ["Qat'iylik", "Rahbarga ta'sir va tashabbus", 'Fidbekka ochiqlik', 'Tizimli fikrlash', 'Moslashuvchanlik', 'Adolat va izchillik'];
var HEADERS = ['Sana', 'Vakansiya', 'Ism familiya', 'Telefon', 'Telegram', 'Rezyume', 'Ball (100)', 'Xulosa', 'Tajriba (Ha / 6)']
  .concat(['y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7'].map(function (k) { return ynName_(k); }))
  .concat(SIFATLAR)
  .concat(['Belgilar', 'Izoh', 'Bitta savol javobi', 'Vaqt (daq)', 'Holat', "Mas'ul izoh"]);
var XOM_HEADERS = ['Sana', 'Ism', 'Telefon', 'answers JSON', 'page', 'ua'];
var CV_FOLDER = 'Nomzod — Rezyumelar';
var CV_MAX = 5 * 1024 * 1024;
var HOLATLAR = ['Yangi', "Ko'rilmoqda", 'Suhbat', 'Kompaniya bilan uchrashuv', 'Qabul qilindi', 'Rad etildi'];
var BOT_MS = 8000; // shundan tez to'ldirilgan anketa — bot

/* ---------- web app ---------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // spam-bot (honeypot)
    var tms = Number(p.total_ms) || 0;
    if (tms > 0 && tms < BOT_MS) return json_({ ok: true }); // juda tez to'ldirilgan — saqlamaymiz

    var answers = parseAnswers_(p.answers);
    var sana = Utilities.formatDate(new Date(), TZ, 'dd.MM.yyyy HH:mm');

    // 1) xom ma'lumotni darhol saqlaymiz (ball hisoblashda xato bo'lsa ham yo'qolmasin)
    getSheet_(XOM, XOM_HEADERS).appendRow([
      sana, clean_(p.fullname, 200), clean_(p.phone, 50),
      String(p.answers || '').slice(0, 45000), clean_(p.page, 500), clean_(p.ua, 300)
    ]);

    // 2) ball
    answers.yn = {};
    YN.forEach(function (q) { var v = String(p[q[0]] || ''); answers.yn[q[0]] = (v === 'ha' || v === 'yoq') ? v : ''; });
    var sc = null;
    try {
      if (typeof KALIT !== 'undefined') sc = score_(answers, KALIT);
    } catch (err) { sc = null; }

    var minutes = Math.round(tms / 6000) / 10;
    var cvUrl = '';
    try { cvUrl = saveCv_(p); } catch (err) { cvUrl = 'Fayl saqlanmadi: ' + String(err).slice(0, 200); }

    var vals = {
      'Sana': sana,
      'Vakansiya': clean_(p.vacancy_title || p.vacancy, 200),
      'Ism familiya': clean_(p.fullname, 200),
      'Telefon': clean_(p.phone, 50),
      'Telegram': clean_(p.telegram, 100),
      'Rezyume': cvUrl,
      'Ball (100)': sc ? sc.ball : '',
      'Xulosa': sc ? sc.xulosa : '',
      'Tajriba (Ha / 6)': tajriba_(answers.yn),
      'Belgilar': sc ? sc.belgilar.join('; ') : '',
      'Izoh': sc ? sc.izoh : '',
      'Bitta savol javobi': clean_(answers.savol, 5000),
      'Vaqt (daq)': minutes,
      'Holat': 'Yangi',
      "Mas'ul izoh": ''
    };
    YN.forEach(function (q) { var v = answers.yn[q[0]]; vals[q[1]] = v === 'ha' ? 'Ha' : v === 'yoq' ? "Yo'q" : ''; });
    if (sc) Object.keys(sc.sifatlar).forEach(function (nom) { vals[nom] = Math.round(sc.sifatlar[nom] * 10) / 10; });
    getSheet_(NOMZODLAR, HEADERS).appendRow(HEADERS.map(function (hd) { return vals[hd] !== undefined ? vals[hd] : ''; }));

    notifyTelegram_(p, sc, cvUrl, answers);
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
function col_(name) { return HEADERS.indexOf(name) + 1; }

function setup() {
  var sh = getSheet_(NOMZODLAR, HEADERS);
  getSheet_(XOM, XOM_HEADERS);
  var last = 1000;
  var rules = []; // qayta ishga tushirilsa, qoidalar takrorlanmaydi
  // ball: 0–100
  rules.push(scale_(sh.getRange(2, col_('Ball (100)'), last, 1), 0, 50, 100));
  // sifatlar: 1–5
  rules.push(scale_(sh.getRange(2, col_(SIFATLAR[0]), last, SIFATLAR.length), 1, 3, 5));
  // tajriba: 0–6
  rules.push(scale_(sh.getRange(2, col_('Tajriba (Ha / 6)'), last, 1), 0, 3, 6));
  // Ha / Yo'q ustunlari: "Yo'q" — och qizil
  var ynRange = sh.getRange(2, col_(YN[0][1]), last, YN.length);
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Yo'q").setBackground('#F4C7C3').setRanges([ynRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Ha').setBackground('#D9EAD3').setRanges([ynRange]).build());
  sh.setConditionalFormatRules(rules);
  // holat ro'yxati
  sh.getRange(2, col_('Holat'), last, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(HOLATLAR, true).setAllowInvalid(true).build());
  sh.setColumnWidths(1, HEADERS.length, 130);
  sh.setColumnWidth(col_('Xulosa'), 260);
  sh.setColumnWidth(col_('Belgilar'), 260);
  sh.setColumnWidth(col_('Izoh'), 260);
  sh.setColumnWidth(col_('Bitta savol javobi'), 420);
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

/* ---------- ball hisoblash (KALIT v3; Turon testBaho mantiqi; alohida sinash mumkin) ---------- */
function score_(answers, kalit) {
  answers = answers || {};
  var test = answers.test || {};
  var sifatlar = {}, vals = [];
  Object.keys(kalit.sifatlar).forEach(function (nom) {
    var q = kalit.sifatlar[nom].map(function (id) {
      var rev = /R$/.test(id);
      var x = Number(test[id.replace(/R$/, '')]) || 3;
      return rev ? 6 - x : x;
    });
    var avg = q.reduce(function (a, b) { return a + b; }, 0) / q.length;
    sifatlar[nom] = avg; vals.push(avg);
  });
  var umumiy = vals.length ? vals.reduce(function (a, b) { return a + b; }, 0) / vals.length : 0;

  var belgilar = [];
  Object.keys(sifatlar).forEach(function (nom) {
    if (sifatlar[nom] < kalit.pastChegara) belgilar.push('Past: ' + nom.toLowerCase());
  });
  var javoblar = kalit.ids.map(function (id) { return test[id]; });
  var xil = {};
  javoblar.forEach(function (v) { xil[String(v)] = 1; });
  if (Object.keys(xil).length === 1) belgilar.push('Hamma gapga bir xil javob berilgan');
  var savol = String(answers.savol || '');
  if (savol.length < kalit.qisqaJavob) belgilar.push('Javob juda qisqa');

  var yn = answers.yn || {};
  if (yn.y1 === 'yoq') belgilar.push('C-level bilan bevosita ishlamagan');
  if (yn.y7 === 'yoq') belgilar.push("Toshkentda, ofisda, to'liq stavkada ishlay olmaydi");
  var taj = tajriba_(yn);
  var ynBor = Object.keys(yn).some(function (k) { return yn[k]; });
  if (ynBor && taj < 3) belgilar.push('Tajriba kam (Ha: ' + taj + ' / 6)');

  var ideal = vals.length > 0 && vals.every(function (v) { return v === 5; });
  var izoh = ideal ? 'Barcha javoblar ideal — suhbatda misollar bilan tekshiring' : '';

  var xulosa;
  if (umumiy >= kalit.xulosa.yashil && belgilar.length === 0) xulosa = '✅ Tavsiya: 1-suhbatga chaqirish';
  else if (umumiy >= kalit.xulosa.sariq && belgilar.length <= 1) xulosa = "🟡 Ko'rib chiqish kerak";
  else xulosa = '🔴 Mos kelmasligi mumkin';

  return { ball: Math.round(umumiy * 20), umumiy: umumiy, sifatlar: sifatlar, belgilar: belgilar, izoh: izoh, xulosa: xulosa };
}

/* ---------- yordamchilar ---------- */
function ynName_(k) { for (var i = 0; i < YN.length; i++) if (YN[i][0] === k) return YN[i][1]; return k; }
function tajriba_(yn) {
  yn = yn || {}; var n = 0;
  ['y1', 'y2', 'y3', 'y4', 'y5', 'y6'].forEach(function (k) { if (yn[k] === 'ha') n++; });
  return n;
}
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

function bar_(v) { var n = Math.round(v); return new Array(n + 1).join('▰') + new Array(5 - n + 1).join('▱'); }

function notifyTelegram_(p, sc, cvUrl, answers) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('TELEGRAM_TOKEN');
  var chat = props.getProperty('CHAT_ID');
  if (!token || !chat) return;
  var lines = ['🧑‍💼 Yangi nomzod — ' + (p.vacancy_title || 'vakansiya'), ''];
  if (sc) {
    lines.push(sc.xulosa);
    lines.push('Xarakter testi: ' + sc.umumiy.toFixed(1) + ' / 5');
    Object.keys(sc.sifatlar).forEach(function (nom) { lines.push(bar_(sc.sifatlar[nom]) + ' ' + nom + ': ' + sc.sifatlar[nom].toFixed(1)); });
    if (sc.izoh) lines.push('ℹ️ ' + sc.izoh);
    if (sc.belgilar.length) lines.push('⚠️ ' + sc.belgilar.join('; '));
  } else {
    lines.push('(ball hisoblanmadi)');
  }
  lines.push('');
  lines.push('👤 ' + (p.fullname || '—'));
  lines.push('📞 ' + (p.phone || '—') + (p.telegram ? ' · ' + p.telegram : ''));
  lines.push('📎 Rezyume: ' + (cvUrl || '—'));
  var yn = (answers && answers.yn) || {};
  lines.push('🗂 Tajriba: ' + tajriba_(yn) + ' / 6');
  YN.forEach(function (q) { lines.push((yn[q[0]] === 'ha' ? '✔️ ' : yn[q[0]] === 'yoq' ? '✖️ ' : '— ') + q[1]); });
  lines.push('');
  lines.push(String((answers && answers.savol) || '—'));
  var text = lines.join('\n').slice(0, 4000);
  try {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'post', contentType: 'application/json',
      payload: JSON.stringify({ chat_id: chat, text: text, disable_web_page_preview: true }), muteHttpExceptions: true
    });
  } catch (e) {}
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

if (typeof module !== 'undefined') module.exports = { score_: score_ };
