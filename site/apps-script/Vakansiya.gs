/**
 * Nomzod — vakansiya arizalarini qabul qilish (Google Apps Script web app, jadvalga bog'langan).
 * Bir nechta vakansiya: har biri alohida varaqqa yoziladi (VAKANSIYALAR sozlamasi, pastda).
 *
 * Ishlashi uchun shu loyihada ALOHIDA `Kalit.gs` fayli bo'lishi kerak: u global `KALIT` o'zgaruvchisini
 * e'lon qiladi (baholash kaliti, v4: {hr: {...}, sotuv: {...}}). Kalit GitHub'da YO'Q va bu faylga ko'chirilmaydi.
 * `KALIT` yoki `KALIT[vakansiya]` topilmasa, ariza xom holda saqlanadi, ball ustunlari bo'sh qoladi.
 *
 * Birinchi marta: `setup()` ni bir marta ishga tushiring (barcha varaqlar va rang shkalasi yaratiladi).
 * Ixtiyoriy: Script Properties'ga TELEGRAM_TOKEN va CHAT_ID qo'shilsa, Telegram'ga xabar keladi.
 */
var XOM = 'Javoblar_xom';
var TZ = 'Asia/Tashkent';

var XOM_HEADERS = ['Sana', 'Ism', 'Telefon', 'answers JSON', 'page', 'ua', 'Vakansiya', "Ha/Yo'q va yo'nalish JSON"];
var CV_FOLDER = 'Nomzod — Rezyumelar';
var CV_MAX = 5 * 1024 * 1024;
var HOLATLAR = ['Yangi', "Ko'rilmoqda", 'Suhbat', 'Kompaniya bilan uchrashuv', 'Qabul qilindi', 'Rad etildi'];
var BOT_MS = 8000; // shundan tez to'ldirilgan anketa — bot

var YONALISH_NOMI = { call: "Qo'ng'iroq", reception: 'Reception' };

/* ---------- vakansiyalar sozlamasi ----------
 * Yangi vakansiya: shu yerga yozuv qo'shing (+ Kalit.gs'da shu id bilan kalit, + saytda test va sahifa).
 * yn: [id, ustun nomi, (ixtiyoriy) faqat shu yo'nalish tanlanganda so'raladi]
 * tajriba(yn, types) -> {n, m}; flags(yn, types, taj) -> {belgilar: [], izoh: []} */
var VAKANSIYALAR = {
  hr: {
    title: 'HR mutaxassis',
    sheet: 'HR',
    hasTypes: false,
    sifatlar: ["Qat'iylik", "Rahbarga ta'sir va tashabbus", 'Fidbekka ochiqlik', 'Tizimli fikrlash', 'Moslashuvchanlik', 'Adolat va izchillik'],
    yn: [['y1', 'C-level bilan ishlagan'], ['y2', "Ishga olish/bo'shatish qarori"], ['y3', 'Rokirovka'],
      ['y4', "Bo'shatish suhbati"], ['y5', 'HR tizimini noldan qurgan'], ['y6', 'Jamoa boshqargan'], ['y7', "Toshkent, ofis, to'liq stavka"]],
    tajribaHeader: 'Tajriba (Ha / 6)',
    tajribaScale: [0, 3, 6], // faqat son bo'lsa rang shkalasi
    // y7 — ish sharoiti, tajriba hisobiga kirmaydi
    tajriba: function (yn) { var n = 0; ['y1', 'y2', 'y3', 'y4', 'y5', 'y6'].forEach(function (k) { if (yn[k] === 'ha') n++; }); return { n: n, m: 6 }; },
    tajribaText: function (t) { return t.n; },
    flags: function (yn, types, taj) {
      var b = [];
      if (yn.y1 === 'yoq') b.push('C-level bilan bevosita ishlamagan');
      if (yn.y7 === 'yoq') b.push("Toshkentda, ofisda, to'liq stavkada ishlay olmaydi");
      var ynBor = Object.keys(yn).some(function (k) { return yn[k]; });
      if (ynBor && taj.n < 3) b.push('Tajriba kam (Ha: ' + taj.n + ' / 6)');
      return { belgilar: b, izoh: [] };
    }
  },
  sotuv: {
    title: 'Sotuv menejeri',
    sheet: 'Sotuv',
    hasTypes: true,
    sifatlar: ['Muloqotchanlik', 'Rad javobiga chidamlilik', "Natijaga mas'uliyat", 'Mijozni tinglash', 'Halollik', 'Tartib va chidam'],
    yn: [['s1', 'Sotuvda ishlagan'], ['s2', 'Sotuv rejasi'], ['s3', 'CRM'], ['s4', 'Rus tili'],
      ['c1', "50+ qo'ng'iroq/kun", 'call'], ['c2', "Sovuq qo'ng'iroq", 'call'], ['c3', 'Smenali grafik', 'call'],
      ['r1', 'Yuzma-yuz mijoz', 'reception'], ['r2', "To'lov/shartnoma", 'reception'], ['r3', 'Mijozlar oqimi', 'reception'],
      ['s5', "Toshkent, to'liq stavka"]],
    tajribaHeader: 'Tajriba (Ha)',
    tajribaScale: null,
    // tajriba: s1, s2, s3 + tanlangan yo'nalishdagi tajriba savollari (c1, c2, r1, r2)
    tajriba: function (yn, types) {
      var ids = ['s1', 's2', 's3'];
      if (types.indexOf('call') >= 0) ids.push('c1', 'c2');
      if (types.indexOf('reception') >= 0) ids.push('r1', 'r2');
      var n = 0; ids.forEach(function (k) { if (yn[k] === 'ha') n++; });
      return { n: n, m: ids.length };
    },
    tajribaText: function (t) { return t.n + ' / ' + t.m; },
    flags: function (yn, types) {
      var b = [], z = [];
      if (yn.s5 === 'yoq') b.push("Toshkentda to'liq stavkada ishlay olmaydi");
      if (types.indexOf('call') >= 0 && yn.c3 === 'yoq') b.push("Smenali grafikda ishlay olmaydi");
      if (types.indexOf('reception') >= 0 && yn.r3 === 'yoq') b.push("Kun bo'yi mijozlar oqimi bilan ishlay olmaydi");
      if (yn.s1 === 'yoq') z.push("Sotuvda tajribasi yo'q — o'rgatish kerak bo'ladi");
      if (yn.s4 === 'yoq') z.push('Rus tilida erkin gaplasha olmaydi');
      return { belgilar: b, izoh: z };
    }
  }
};

function headers_(cfg) {
  var h = ['Sana', 'Ism familiya', 'Telefon', 'Telegram', 'Rezyume'];
  if (cfg.hasTypes) h.push("Yo'nalish");
  h.push('Ball (100)', 'Xulosa', cfg.tajribaHeader);
  cfg.yn.forEach(function (q) { h.push(q[1]); });
  cfg.sifatlar.forEach(function (n) { h.push(n); });
  return h.concat(['Belgilar', 'Izoh', 'Bitta savol javobi', 'Vaqt (daq)', 'Holat', "Mas'ul izoh"]);
}
function cfgOf_(vac) { return VAKANSIYALAR[vac] || VAKANSIYALAR.hr; }
function typesOf_(s, cfg) {
  if (!cfg.hasTypes) return [];
  var out = [];
  String(s || '').split(',').forEach(function (x) { x = x.replace(/\s/g, ''); if (YONALISH_NOMI[x] && out.indexOf(x) < 0) out.push(x); });
  return out;
}
// savol shu nomzodga tegishlimi (yo'nalishga bog'liq savollar)
function ynApplicable_(q, types) { return !q[2] || types.indexOf(q[2]) >= 0; }

/* ---------- web app ---------- */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // spam-bot (honeypot)
    var tms = Number(p.total_ms) || 0;
    if (tms > 0 && tms < BOT_MS) return json_({ ok: true }); // juda tez to'ldirilgan — saqlamaymiz

    var vac = VAKANSIYALAR[p.vacancy] ? p.vacancy : 'hr';
    var cfg = cfgOf_(vac);
    var HEADERS = headers_(cfg);
    var answers = parseAnswers_(p.answers);
    var sana = Utilities.formatDate(new Date(), TZ, 'dd.MM.yyyy HH:mm');

    answers.types = typesOf_(p.types, cfg);
    answers.yn = {};
    cfg.yn.forEach(function (q) {
      var v = String(p[q[0]] || '');
      answers.yn[q[0]] = (ynApplicable_(q, answers.types) && (v === 'ha' || v === 'yoq')) ? v : '';
    });

    // 1) xom ma'lumotni darhol saqlaymiz (ball hisoblashda xato bo'lsa ham yo'qolmasin)
    getSheet_(XOM, XOM_HEADERS).appendRow([
      sana, clean_(p.fullname, 200), clean_(p.phone, 50),
      String(p.answers || '').slice(0, 40000), clean_(p.page, 500), clean_(p.ua, 300),
      clean_(p.vacancy_title || p.vacancy, 200),
      JSON.stringify({ types: answers.types, yn: answers.yn }).slice(0, 2000)
    ]);

    // 2) ball
    var sc = null;
    try {
      if (typeof KALIT !== 'undefined' && KALIT && KALIT[vac]) sc = score_(answers, KALIT[vac], cfg);
    } catch (err) { sc = null; }

    var minutes = Math.round(tms / 6000) / 10;
    var cvUrl = '';
    try { cvUrl = saveCv_(p); } catch (err) { cvUrl = 'Fayl saqlanmadi: ' + String(err).slice(0, 200); }

    var taj = cfg.tajriba(answers.yn, answers.types);
    var vals = {
      'Sana': sana,
      'Ism familiya': clean_(p.fullname, 200),
      'Telefon': clean_(p.phone, 50),
      'Telegram': clean_(p.telegram, 100),
      'Rezyume': cvUrl || '—',
      "Yo'nalish": answers.types.map(function (t) { return YONALISH_NOMI[t]; }).join(', '),
      'Ball (100)': sc ? sc.ball : '',
      'Xulosa': sc ? sc.xulosa : '',
      'Belgilar': sc ? sc.belgilar.join('; ') : '',
      'Izoh': sc ? sc.izoh : '',
      'Bitta savol javobi': clean_(answers.savol, 5000),
      'Vaqt (daq)': minutes,
      'Holat': 'Yangi',
      "Mas'ul izoh": ''
    };
    vals[cfg.tajribaHeader] = cfg.tajribaText(taj);
    cfg.yn.forEach(function (q) { var v = answers.yn[q[0]]; vals[q[1]] = v === 'ha' ? 'Ha' : v === 'yoq' ? "Yo'q" : ''; });
    if (sc) Object.keys(sc.sifatlar).forEach(function (nom) { vals[nom] = Math.round(sc.sifatlar[nom] * 10) / 10; });
    getSheet_(cfg.sheet, HEADERS).appendRow(HEADERS.map(function (hd) { return vals[hd] !== undefined ? vals[hd] : ''; }));

    answers.vac = vac;
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
function setup() {
  getSheet_(XOM, XOM_HEADERS);
  Object.keys(VAKANSIYALAR).forEach(function (vac) { setupSheet_(VAKANSIYALAR[vac]); });
}

function setupSheet_(cfg) {
  var HEADERS = headers_(cfg);
  var sh = getSheet_(cfg.sheet, HEADERS);
  var c = function (name) { return HEADERS.indexOf(name) + 1; };
  var last = 1000;
  var rules = []; // qayta ishga tushirilsa, qoidalar takrorlanmaydi
  // ball: 0–100
  rules.push(scale_(sh.getRange(2, c('Ball (100)'), last, 1), 0, 50, 100));
  // sifatlar: 1–5
  rules.push(scale_(sh.getRange(2, c(cfg.sifatlar[0]), last, cfg.sifatlar.length), 1, 3, 5));
  // tajriba (faqat son bo'lsa)
  if (cfg.tajribaScale) rules.push(scale_(sh.getRange(2, c(cfg.tajribaHeader), last, 1), cfg.tajribaScale[0], cfg.tajribaScale[1], cfg.tajribaScale[2]));
  // Ha / Yo'q ustunlari: "Yo'q" — och qizil
  var ynRange = sh.getRange(2, c(cfg.yn[0][1]), last, cfg.yn.length);
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Yo'q").setBackground('#F4C7C3').setRanges([ynRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Ha').setBackground('#D9EAD3').setRanges([ynRange]).build());
  sh.setConditionalFormatRules(rules);
  // holat ro'yxati
  sh.getRange(2, c('Holat'), last, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(HOLATLAR, true).setAllowInvalid(true).build());
  sh.setColumnWidths(1, HEADERS.length, 130);
  sh.setColumnWidth(c('Xulosa'), 260);
  sh.setColumnWidth(c('Belgilar'), 260);
  sh.setColumnWidth(c('Izoh'), 260);
  sh.setColumnWidth(c('Bitta savol javobi'), 420);
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

/* ---------- ball hisoblash (KALIT v4, per-vakansiya; Turon testBaho mantiqi; alohida sinash mumkin) ---------- */
function score_(answers, kalit, cfg) {
  answers = answers || {};
  cfg = cfg || VAKANSIYALAR.hr;
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
  var types = answers.types || [];
  var taj = cfg.tajriba(yn, types);
  var fl = cfg.flags(yn, types, taj);
  fl.belgilar.forEach(function (b) { belgilar.push(b); });

  var ideal = vals.length > 0 && vals.every(function (v) { return v === 5; });
  var izohlar = fl.izoh.slice();
  if (ideal) izohlar.push('Barcha javoblar ideal — suhbatda misollar bilan tekshiring');

  var xulosa;
  if (umumiy >= kalit.xulosa.yashil && belgilar.length === 0) xulosa = '✅ Tavsiya: 1-suhbatga chaqirish';
  else if (umumiy >= kalit.xulosa.sariq && belgilar.length <= 1) xulosa = "🟡 Ko'rib chiqish kerak";
  else xulosa = '🔴 Mos kelmasligi mumkin';

  return { ball: Math.round(umumiy * 20), umumiy: umumiy, sifatlar: sifatlar, belgilar: belgilar, izoh: izohlar.join('; '), xulosa: xulosa, tajriba: taj };
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

function bar_(v) { var n = Math.round(v); return new Array(n + 1).join('▰') + new Array(5 - n + 1).join('▱'); }

function notifyTelegram_(p, sc, cvUrl, answers) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('TELEGRAM_TOKEN');
  var chat = props.getProperty('CHAT_ID');
  if (!token || !chat) return;
  var cfg = cfgOf_(answers && answers.vac);
  var types = (answers && answers.types) || [];
  var lines = ['🧑‍💼 Yangi nomzod — ' + (p.vacancy_title || cfg.title), ''];
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
  if (cfg.hasTypes) lines.push("🧭 Yo'nalish: " + (types.map(function (t) { return YONALISH_NOMI[t]; }).join(', ') || '—'));
  var yn = (answers && answers.yn) || {};
  var tj = cfg.tajriba(yn, types);
  lines.push('🗂 Tajriba: ' + tj.n + ' / ' + tj.m);
  cfg.yn.forEach(function (q) {
    if (!ynApplicable_(q, types)) return;
    lines.push((yn[q[0]] === 'ha' ? '✔️ ' : yn[q[0]] === 'yoq' ? '✖️ ' : '— ') + q[1]);
  });
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

if (typeof module !== 'undefined') module.exports = { score_: score_, VAKANSIYALAR: VAKANSIYALAR, headers_: headers_ };
