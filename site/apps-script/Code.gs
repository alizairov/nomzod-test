/**
 * Nomzod — saytdan kelgan arizalarni qabul qilish (Google Apps Script web app).
 * Arizalar "Nomzod — Arizalar" Google Sheets jadvaliga yoziladi.
 * Ixtiyoriy: Script Properties'ga TELEGRAM_TOKEN va CHAT_ID qo'shilsa, Telegram'ga ham xabar keladi.
 */
var SPREADSHEET_ID = '1q-GFGhILy6lPtAH-7_j4XwjWZG_I27_93Qjaz9ZMpJ8';
var SHEET_NAME = 'Arizalar';
var HEADERS = ['Sana', 'Ism', 'Telefon', 'Kompaniya', 'Xizmat', 'Izoh', 'Sahifa', 'Holat', "Mas'ul izoh"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // spam-bot (honeypot)
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
    var sana = Utilities.formatDate(new Date(), 'Asia/Tashkent', 'dd.MM.yyyy HH:mm');
    var row = [sana, clean_(p.name), clean_(p.phone), clean_(p.company), clean_(p.service), clean_(p.comment), clean_(p.page), 'Yangi', ''];
    sh.appendRow(row);
    notifyTelegram_(row);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return json_({ ok: true, service: 'Nomzod arizalar' });
}

// Formula sifatida o'qilmasligi va juda uzun bo'lmasligi uchun
function clean_(v) {
  v = String(v || '').slice(0, 2000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function notifyTelegram_(r) {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty('TELEGRAM_TOKEN');
  var chat = props.getProperty('CHAT_ID');
  if (!token || !chat) return;
  var text = '🆕 Yangi ariza — Nomzod\n\n' +
    'Ism: ' + r[1] + '\nTelefon: ' + String(r[2]).replace(/^'/, '') +
    '\nKompaniya: ' + (r[3] || '—') + '\nXizmat: ' + r[4] +
    '\nIzoh: ' + (r[5] || '—') + '\nSana: ' + r[0];
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
