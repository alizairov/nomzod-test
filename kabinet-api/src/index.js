/**
 * Nomzod kabinet — Cloudflare Worker (D1 + KV). Bog'liqliksiz, oddiy ES module.
 * Ommaviy: POST /api/apply (saytdagi anketa) va POST /api/disc (DISC testi). Qolgan hamma narsa — parol bilan (Bearer token).
 * Baholash kaliti (KALIT v4) D1'dagi settings(key='kalit') qatorida turadi, repoda YO'Q.
 * Baholash mantig'i site/apps-script/Vakansiya.gs dagi score_ ning aniq ko'chirmasi.
 */

const STATUSES = ['yangi', 'saralash', 'telefon', 'suhbat', 'taqdim', 'mijoz', 'taklif', 'joylashdi', 'zaxira', 'rad'];
const BOT_MS = 8000;
const CV_MAX = 5 * 1024 * 1024;
const CV_EXT = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };
const YONALISH_NOMI = { call: "Qo'ng'iroq", reception: 'Reception' };
const ORIGINS = ['https://nmzd.uz', 'https://www.nmzd.uz', 'https://alizairov.github.io'];

/* ---------- vakansiyalar sozlamasi (Vakansiya.gs dan) ---------- */
const VAKANSIYALAR = {
  hr: {
    title: 'HR mutaxassis',
    hasTypes: false,
    yn: [['y1'], ['y2'], ['y3'], ['y4'], ['y5'], ['y6'], ['y7']],
    tajriba(yn) { let n = 0; ['y1', 'y2', 'y3', 'y4', 'y5', 'y6'].forEach((k) => { if (yn[k] === 'ha') n++; }); return { n, m: 6 }; },
    tajribaText(t) { return String(t.n); },
    flags(yn, types, taj) {
      const b = [];
      if (yn.y1 === 'yoq') b.push('C-level bilan bevosita ishlamagan');
      if (yn.y7 === 'yoq') b.push("Toshkentda, ofisda, to'liq stavkada ishlay olmaydi");
      const ynBor = Object.keys(yn).some((k) => yn[k]);
      if (ynBor && taj.n < 3) b.push('Tajriba kam (Ha: ' + taj.n + ' / 6)');
      return { belgilar: b, izoh: [] };
    },
  },
  amaliyot: {
    title: 'HR amaliyotchi',
    hasTypes: false,
    yn: [['y1'], ['y2'], ['y3'], ['y4'], ['y5'], ['y6']],
    tajriba(yn) { let n = 0; ['y1', 'y2', 'y3', 'y4'].forEach((k) => { if (yn[k] === 'ha') n++; }); return { n, m: 4 }; },
    tajribaText(t) { return t.n + ' / ' + t.m; },
    flags(yn) {
      const b = [], z = [];
      if (yn.y6 === 'yoq') b.push("Toshkentda, ofisda amaliyot o'ta olmaydi");
      if (yn.y3 === 'yoq') z.push("Notanish odamlar bilan gaplashish qiyin — rekrutingga moslash kerak");
      if (yn.y5 === 'yoq') z.push('Rus tilida erkin gaplasha olmaydi');
      return { belgilar: b, izoh: z };
    },
  },
  sotuv: {
    title: 'Sotuv menejeri',
    hasTypes: true,
    yn: [['s1'], ['s2'], ['s3'], ['s4'], ['c1', 'call'], ['c2', 'call'], ['c3', 'call'], ['r1', 'reception'], ['r2', 'reception'], ['r3', 'reception'], ['s5']],
    tajriba(yn, types) {
      const ids = ['s1', 's2', 's3'];
      if (types.indexOf('call') >= 0) ids.push('c1', 'c2');
      if (types.indexOf('reception') >= 0) ids.push('r1', 'r2');
      let n = 0; ids.forEach((k) => { if (yn[k] === 'ha') n++; });
      return { n, m: ids.length };
    },
    tajribaText(t) { return t.n + ' / ' + t.m; },
    flags(yn, types) {
      const b = [], z = [];
      if (yn.s5 === 'yoq') b.push("Toshkentda to'liq stavkada ishlay olmaydi");
      if (types.indexOf('call') >= 0 && yn.c3 === 'yoq') b.push('Smenali grafikda ishlay olmaydi');
      if (types.indexOf('reception') >= 0 && yn.r3 === 'yoq') b.push("Kun bo'yi mijozlar oqimi bilan ishlay olmaydi");
      if (yn.s1 === 'yoq') z.push("Sotuvda tajribasi yo'q — o'rgatish kerak bo'ladi");
      if (yn.s4 === 'yoq') z.push('Rus tilida erkin gaplasha olmaydi');
      return { belgilar: b, izoh: z };
    },
  },
};

function typesOf(s, cfg) {
  if (!cfg.hasTypes) return [];
  const out = [];
  String(s || '').split(',').forEach((x) => { x = x.replace(/\s/g, ''); if (YONALISH_NOMI[x] && out.indexOf(x) < 0) out.push(x); });
  return out;
}
const ynApplicable = (q, types) => !q[1] || types.indexOf(q[1]) >= 0;

/* ---------- ball hisoblash (Vakansiya.gs score_ ning ko'chirmasi) ---------- */
export function score_(answers, kalit, cfg) {
  answers = answers || {};
  cfg = cfg || VAKANSIYALAR.hr;
  const test = answers.test || {};
  const sifatlar = {}, vals = [];
  Object.keys(kalit.sifatlar).forEach((nom) => {
    const q = kalit.sifatlar[nom].map((id) => {
      const rev = /R$/.test(id);
      const x = Number(test[id.replace(/R$/, '')]) || 3;
      return rev ? 6 - x : x;
    });
    const avg = q.reduce((a, b) => a + b, 0) / q.length;
    sifatlar[nom] = avg; vals.push(avg);
  });
  const umumiy = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;

  const belgilar = [];
  Object.keys(sifatlar).forEach((nom) => {
    if (sifatlar[nom] < kalit.pastChegara) belgilar.push('Past: ' + nom.toLowerCase());
  });
  const javoblar = kalit.ids.map((id) => test[id]);
  const xil = {};
  javoblar.forEach((v) => { xil[String(v)] = 1; });
  if (Object.keys(xil).length === 1) belgilar.push('Hamma gapga bir xil javob berilgan');
  const savol = String(answers.savol || '');
  if (savol.length < kalit.qisqaJavob) belgilar.push('Javob juda qisqa');

  const yn = answers.yn || {};
  const types = answers.types || [];
  const taj = cfg.tajriba(yn, types);
  const fl = cfg.flags(yn, types, taj);
  fl.belgilar.forEach((b) => { belgilar.push(b); });

  const ideal = vals.length > 0 && vals.every((v) => v === 5);
  const izohlar = fl.izoh.slice();
  if (ideal) izohlar.push('Barcha javoblar ideal — suhbatda misollar bilan tekshiring');

  let xulosa;
  if (umumiy >= kalit.xulosa.yashil && belgilar.length === 0) xulosa = '✅ Tavsiya: 1-suhbatga chaqirish';
  else if (umumiy >= kalit.xulosa.sariq && belgilar.length <= 1) xulosa = "🟡 Ko'rib chiqish kerak";
  else xulosa = '🔴 Mos kelmasligi mumkin';

  return { ball: Math.round(umumiy * 20), umumiy, sifatlar, belgilar, izoh: izohlar.join('; '), xulosa, tajriba: taj };
}
export { VAKANSIYALAR };

/* ---------- yordamchilar ---------- */
const enc = new TextEncoder();
const now = () => new Date().toISOString();
const clip = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
function b64u(bytes) {
  let s = ''; const a = new Uint8Array(bytes);
  for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64uToStr(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
  return new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0)));
}
function newId() { return 'l' + hex(crypto.getRandomValues(new Uint8Array(8)).buffer); }
function safeParse(s, d) { try { const o = JSON.parse(s); return o == null ? d : o; } catch (e) { return d; } }

function corsHeaders(request) {
  const o = request.headers.get('Origin');
  const h = { Vary: 'Origin' };
  if (o && (ORIGINS.indexOf(o) >= 0 || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o))) {
    h['Access-Control-Allow-Origin'] = o;
    h['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, DELETE, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
    h['Access-Control-Expose-Headers'] = 'Content-Disposition';
    h['Access-Control-Max-Age'] = '86400';
  }
  return h;
}
function reply(request, body, status, extra) {
  const h = Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, corsHeaders(request), extra || {});
  return new Response(JSON.stringify(body), { status: status || 200, headers: h });
}
const fail = (request, status, error) => reply(request, { ok: false, error }, status);

/* ---------- sozlamalar (D1) ---------- */
let kalitCache = null, secretCache = null;
async function getSetting(env, key) {
  const r = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first();
  return r ? r.value : null;
}
async function getKalit(env) {
  if (kalitCache) return kalitCache;
  const v = await getSetting(env, 'kalit');
  const k = v ? safeParse(v, null) : null;
  if (k) kalitCache = k;
  return k;
}
async function getSecret(env) {
  if (secretCache) return secretCache;
  let v = await getSetting(env, 'session_secret');
  if (!v) {
    const fresh = hex(crypto.getRandomValues(new Uint8Array(32)).buffer);
    await env.DB.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').bind('session_secret', fresh).run();
    v = await getSetting(env, 'session_secret'); // poyga bo'lsa, yutgan qiymat
  }
  secretCache = v;
  return v;
}

/* ---------- auth ---------- */
async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', key, enc.encode(data));
}
async function safeEqual(a, b) {
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const A = new Uint8Array(x), B = new Uint8Array(y);
  let d = 0; for (let i = 0; i < A.length; i++) d |= A[i] ^ B[i];
  return d === 0;
}
async function makeToken(env) {
  const body = b64u(enc.encode(JSON.stringify({ sub: 'admin', exp: Date.now() + 30 * 86400000 })));
  const sig = b64u(await hmac(await getSecret(env), body));
  return body + '.' + sig;
}
async function authed(request, env) {
  const m = /^Bearer\s+(\S+)$/.exec(request.headers.get('Authorization') || '');
  if (!m) return false;
  const parts = m[1].split('.');
  if (parts.length !== 2) return false;
  try {
    const expect = b64u(await hmac(await getSecret(env), parts[0]));
    if (!(await safeEqual(expect, parts[1]))) return false;
    const p = JSON.parse(b64uToStr(parts[0]));
    return p && p.sub === 'admin' && p.exp > Date.now();
  } catch (e) { return false; }
}

/* ---------- oddiy rate limit (KV) ---------- */
function clientIp(request) { return request.headers.get('CF-Connecting-IP') || 'local'; }
async function rlGet(env, key) { const v = await env.CV.get(key); return v ? Number(v) || 0 : 0; }
async function rlInc(env, key, ttl) { const n = (await rlGet(env, key)) + 1; await env.CV.put(key, String(n), { expirationTtl: ttl }); return n; }

/* ---------- Telegram ---------- */
function notifyTelegram(env, ctx, lead, sc, types) {
  if (!env.TELEGRAM_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const lines = ['🧑‍💼 Yangi nomzod — ' + lead.vacancy_title, ''];
  if (sc) lines.push(sc.xulosa + ' · ' + sc.ball + '/100');
  lines.push('👤 ' + lead.fullname);
  lines.push('📞 ' + lead.phone + (lead.telegram ? ' · ' + lead.telegram : ''));
  if (types.length) lines.push("🧭 Yo'nalish: " + types.map((t) => YONALISH_NOMI[t]).join(', '));
  if (sc && sc.belgilar.length) lines.push('⚠️ ' + sc.belgilar.join('; '));
  if (env.KABINET_URL) { lines.push(''); lines.push(env.KABINET_URL); }
  const p = fetch('https://api.telegram.org/bot' + env.TELEGRAM_TOKEN + '/sendMessage', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines.join('\n').slice(0, 4000), disable_web_page_preview: true }),
  }).catch(() => {});
  ctx.waitUntil(p);
}

/* ---------- POST /api/apply ---------- */
async function handleApply(request, env, ctx) {
  const ip = clientIp(request);
  const rlKey = 'rl:apply:' + ip;
  if ((await rlGet(env, rlKey)) >= 5) return fail(request, 429, "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring");

  let fd;
  try { fd = await request.formData(); } catch (e) { return fail(request, 400, "Noto'g'ri so'rov"); }
  const f = (k) => { const v = fd.get(k); return typeof v === 'string' ? v : ''; };

  if (f('website')) return reply(request, { ok: true });
  const tms = Number(f('total_ms')) || 0;
  if (tms > 0 && tms < BOT_MS) return reply(request, { ok: true });

  const vac = VAKANSIYALAR[f('vacancy')] ? f('vacancy') : 'hr';
  const cfg = VAKANSIYALAR[vac];
  const fullname = clip(f('fullname'), 200);
  const phone = clip(f('phone'), 50);
  if (fullname.length < 3) return fail(request, 400, 'Ism familiya kerak');
  if (phone.replace(/\D/g, '').length < 9) return fail(request, 400, 'Telefon raqam kerak');

  let raw = {};
  try { raw = JSON.parse(f('answers').slice(0, 40000) || '{}'); } catch (e) { raw = {}; }
  if (!raw || typeof raw !== 'object') raw = {};
  const test = {};
  if (raw.test && typeof raw.test === 'object') Object.keys(raw.test).slice(0, 40).forEach((k) => { test[clip(k, 10)] = clip(raw.test[k], 2); });
  const answers = { test, savol: clip(raw.savol, 5000) };
  answers.types = typesOf(f('types'), cfg);
  answers.yn = {};
  cfg.yn.forEach((q) => {
    const v = f(q[0]);
    answers.yn[q[0]] = (ynApplicable(q, answers.types) && (v === 'ha' || v === 'yoq')) ? v : '';
  });

  let cv = fd.get('cv'), cvBuf = null, cvName = '', cvMime = '';
  if (cv && typeof cv !== 'string' && cv.size > 0) {
    if (cv.size > CV_MAX) return fail(request, 413, 'Fayl hajmi 5 MB dan oshmasin');
    const ext = String(cv.name || '').split('.').pop().toLowerCase();
    if (!CV_EXT[ext]) return fail(request, 400, 'Faqat PDF, Word yoki rasm (JPG, PNG) fayl yuklang');
    cvBuf = await cv.arrayBuffer();
    cvName = clip(cv.name, 150); cvMime = CV_EXT[ext];
  }

  let sc = null;
  try { const K = await getKalit(env); if (K && K[vac]) sc = score_(answers, K[vac], cfg); } catch (e) { sc = null; }
  const taj = cfg.tajriba(answers.yn, answers.types);

  const id = newId(), t = now();
  const lead = { fullname, phone, telegram: clip(f('telegram'), 100), vacancy_title: clip(f('vacancy_title') || cfg.title, 200) };
  const cvKey = cvBuf ? 'cv/' + id : null;
  if (cvBuf) await env.CV.put(cvKey, cvBuf, { metadata: { name: cvName, mime: cvMime } });
  const scores = sc ? { sifatlar: sc.sifatlar, umumiy: sc.umumiy, belgilar: sc.belgilar, izoh: sc.izoh, tajriba: taj, tajribaText: cfg.tajribaText(taj) } : null;
  try {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO leads (id, created_at, updated_at, vacancy, vacancy_title, fullname, phone, telegram, types, cv_key, cv_name, cv_mime, yn, answers, scores, ball, xulosa, status, position, total_ms, page, ua, archived) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0)')
        .bind(id, t, t, vac, lead.vacancy_title, fullname, phone, lead.telegram, answers.types.join(','), cvKey, cvName || null, cvMime || null,
          JSON.stringify(answers.yn), JSON.stringify({ test, savol: answers.savol }), scores ? JSON.stringify(scores) : null,
          sc ? sc.ball : null, sc ? sc.xulosa : null, 'yangi', -Date.now(), Math.round(tms), clip(f('page'), 500), clip(f('ua'), 300)),
      env.DB.prepare('INSERT INTO events (lead_id, at, type, text) VALUES (?,?,?,?)').bind(id, t, 'create', 'Anketa yuborildi'),
    ]);
  } catch (e) {
    if (cvKey) { try { await env.CV.delete(cvKey); } catch (x) {} }
    return fail(request, 500, 'Saqlab bo\'lmadi');
  }
  await rlInc(env, rlKey, 600);
  notifyTelegram(env, ctx, lead, sc, answers.types);
  return reply(request, { ok: true });
}

/* ---------- POST /api/login ---------- */
async function handleLogin(request, env) {
  if (!env.ADMIN_PASSWORD) return fail(request, 503, 'ADMIN_PASSWORD sozlanmagan');
  const ip = clientIp(request), key = 'rl:login:' + ip;
  if ((await rlGet(env, key)) >= 5) return fail(request, 429, "Juda ko'p noto'g'ri urinish. 15 daqiqadan keyin qayta urinib ko'ring");
  let body = {};
  try { body = await request.json(); } catch (e) {}
  const pw = typeof body.password === 'string' ? body.password : '';
  if (!pw || !(await safeEqual(pw, String(env.ADMIN_PASSWORD)))) {
    await rlInc(env, key, 900);
    return fail(request, 401, "Parol noto'g'ri");
  }
  return reply(request, { token: await makeToken(env) });
}

/* ---------- leadlar ---------- */
const LIST_COLS = "id, created_at, vacancy, vacancy_title, fullname, phone, telegram, types, ball, xulosa, status, position, rating, client, archived, (cv_key IS NOT NULL AND cv_key != '') AS has_cv, COALESCE(json_array_length(json_extract(scores, '$.belgilar')), 0) AS belgilar, json_extract(screening, '$.score') AS scr_score, json_extract(screening, '$.verdict') AS scr_verdict";
const escLike = (s) => s.replace(/[\\%_]/g, (c) => '\\' + c);
const fixRow = (r) => Object.assign(r, { has_cv: !!r.has_cv });

async function listLeads(request, env, url) {
  const where = [], args = [];
  where.push('archived = ?'); args.push(url.searchParams.get('archived') === '1' ? 1 : 0);
  const vac = url.searchParams.get('vacancy');
  if (vac) { where.push('vacancy = ?'); args.push(vac); }
  const q = clip(url.searchParams.get('q'), 100);
  if (q) {
    const like = '%' + escLike(q) + '%';
    where.push("(fullname LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\' OR telegram LIKE ? ESCAPE '\\')");
    args.push(like, like, like);
  }
  const rs = await env.DB.prepare('SELECT ' + LIST_COLS + ' FROM leads WHERE ' + where.join(' AND ') + ' ORDER BY position ASC, created_at DESC LIMIT 3000').bind(...args).all();
  return reply(request, { ok: true, leads: (rs.results || []).map(fixRow) });
}

async function getLead(request, env, id) {
  const r = await env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(id).first();
  if (!r) return fail(request, 404, 'Topilmadi');
  const ev = await env.DB.prepare('SELECT id, at, type, text, from_status, to_status FROM events WHERE lead_id = ? ORDER BY at DESC, id DESC').bind(id).all();
  const lead = Object.assign({}, r, {
    has_cv: !!r.cv_key, yn: safeParse(r.yn, {}), answers: safeParse(r.answers, {}), scores: safeParse(r.scores, null), screening: safeParse(r.screening, null), events: ev.results || [],
  });
  delete lead.cv_key; delete lead.ua;
  return reply(request, { ok: true, lead });
}

/* ---------- saralash suhbati (screening) ---------- */
const SCR_MAX_BYTES = 30 * 1024;
const SCR_TEXT_MAX = 3000;
const SCR_VERDICTS = { otdi: 'Keyingi bosqichga', zaxira: 'Zaxiraga', rad: 'Rad etish' };
const SCR_ID = /^[A-Za-z0-9_-]{1,40}$/;
const isPlain = (o) => o !== null && typeof o === 'object' && !Array.isArray(o);
/** Kiruvchi screening obyektini tekshiradi. { error } yoki { value } (score hisoblangan) qaytaradi. */
function validateScreening(s, serverNow) {
  if (!isPlain(s)) return { error: "Saralash ma'lumoti noto'g'ri" };
  let size = 0;
  try { size = enc.encode(JSON.stringify(s)).length; } catch (e) { return { error: "Saralash ma'lumoti noto'g'ri" }; }
  if (size > SCR_MAX_BYTES) return { error: "Saralash ma'lumoti juda katta (30 KB dan oshmasin)" };
  const answers = {}, ratings = {};
  if (s.answers !== undefined) {
    if (!isPlain(s.answers)) return { error: "Javoblar noto'g'ri" };
    const ks = Object.keys(s.answers);
    if (ks.length > 100) return { error: "Javoblar juda ko'p" };
    for (const k of ks) {
      const v = s.answers[k];
      if (!SCR_ID.test(k) || typeof v !== 'string' || v.length > SCR_TEXT_MAX) return { error: "Javob noto'g'ri yoki 3000 belgidan uzun" };
      if (v.trim()) answers[k] = v;
    }
  }
  if (s.ratings !== undefined) {
    if (!isPlain(s.ratings)) return { error: "Baholar noto'g'ri" };
    const ks = Object.keys(s.ratings);
    if (ks.length > 50) return { error: "Baholar juda ko'p" };
    for (const k of ks) {
      const v = s.ratings[k];
      if (!SCR_ID.test(k) || typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > 5) return { error: "Baho 1 dan 5 gacha bo'lishi kerak" };
      ratings[k] = v;
    }
  }
  let verdict = null;
  if (s.verdict !== undefined && s.verdict !== null) {
    if (typeof s.verdict !== 'string' || !SCR_VERDICTS[s.verdict]) return { error: "Noto'g'ri qaror" };
    verdict = s.verdict;
  }
  let comment = '';
  if (s.comment !== undefined && s.comment !== null) {
    if (typeof s.comment !== 'string' || s.comment.length > SCR_TEXT_MAX) return { error: "Izoh 3000 belgidan oshmasin" };
    comment = s.comment;
  }
  let v = 1;
  if (s.v !== undefined) {
    if (typeof s.v !== 'number' || !Number.isInteger(s.v) || s.v < 1 || s.v > 1000) return { error: "Noto'g'ri versiya" };
    v = s.v;
  }
  // updated_at: mijoz vaqti (qoralama bilan solishtirish uchun); noto'g'ri yoki kelajakdagi bo'lsa — server vaqti
  let updated = serverNow;
  if (typeof s.updated_at === 'string' && s.updated_at.length <= 40) {
    const ms = Date.parse(s.updated_at);
    if (isFinite(ms) && ms <= Date.now() + 86400000) updated = new Date(ms).toISOString();
  }
  const rv = Object.keys(ratings).map((k) => ratings[k]);
  const score = rv.length ? Math.round((rv.reduce((a, b) => a + b, 0) / rv.length) * 10) / 10 : null;
  return { value: { v, answers, ratings, verdict, comment, score, updated_at: updated } };
}
const fmtScr = (n) => (n === null || n === undefined ? '' : Number(n).toFixed(1));

const EDIT_NAMES = { fullname: 'Ism', phone: 'Telefon', telegram: 'Telegram', client: 'Mijoz', rating: 'Baho', archived: 'Arxiv' };
async function patchLead(request, env, id) {
  let b = {};
  try { b = await request.json(); } catch (e) { return fail(request, 400, "Noto'g'ri so'rov"); }
  const cur = await env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(id).first();
  if (!cur) return fail(request, 404, 'Topilmadi');
  const sets = [], args = [], events = [], t = now();
  if (b.status !== undefined) {
    if (STATUSES.indexOf(b.status) < 0) return fail(request, 400, "Noto'g'ri status");
    if (b.status !== cur.status) {
      sets.push('status = ?'); args.push(b.status);
      events.push(['status', null, cur.status, b.status]);
    }
  }
  if (b.position !== undefined) {
    const p = Number(b.position);
    if (!isFinite(p)) return fail(request, 400, "Noto'g'ri position");
    sets.push('position = ?'); args.push(p);
  }
  if (b.rating !== undefined) {
    let r = b.rating === null || b.rating === '' ? null : Math.round(Number(b.rating));
    if (r !== null && !(r >= 1 && r <= 5)) return fail(request, 400, "Noto'g'ri baho");
    if (r !== cur.rating) { sets.push('rating = ?'); args.push(r); events.push(['edit', 'Baho: ' + (r === null ? 'olib tashlandi' : r + ' / 5')]); }
  }
  if (b.client !== undefined) {
    const c = clip(b.client, 200) || null;
    if (c !== (cur.client || null)) { sets.push('client = ?'); args.push(c); events.push(['edit', 'Mijoz: ' + (c || 'olib tashlandi')]); }
  }
  if (b.archived !== undefined) {
    const a = b.archived ? 1 : 0;
    if (a !== (cur.archived || 0)) { sets.push('archived = ?'); args.push(a); events.push(['edit', a ? 'Arxivga olindi' : 'Arxivdan chiqarildi']); }
  }
  ['fullname', 'phone', 'telegram'].forEach((k) => {
    if (b[k] === undefined) return;
    const v = clip(b[k], k === 'fullname' ? 200 : 100);
    if (k === 'fullname' && v.length < 2) return;
    if (v !== (cur[k] || '')) { sets.push(k + ' = ?'); args.push(v); events.push(['edit', EDIT_NAMES[k] + ' o\'zgartirildi: ' + v]); }
  });
  let scrOut;
  if (b.screening !== undefined) {
    if (b.screening === null) {
      if (cur.screening) { sets.push('screening = ?'); args.push(null); }
      scrOut = null;
    } else {
      const r = validateScreening(b.screening, t);
      if (r.error) return fail(request, 400, r.error);
      const json = JSON.stringify(r.value);
      scrOut = r.value;
      if (json !== cur.screening) {
        sets.push('screening = ?'); args.push(json);
        const oldV = (safeParse(cur.screening, null) || {}).verdict || null;
        if (r.value.verdict && r.value.verdict !== oldV) {
          events.push(['screening', 'Saralash: ' + SCR_VERDICTS[r.value.verdict] + (r.value.score !== null ? ' · ' + fmtScr(r.value.score) + '/5' : '')]);
        }
      }
    }
  }
  const extra = scrOut === undefined ? {} : { screening: scrOut };
  if (!sets.length) return reply(request, Object.assign({ ok: true }, extra));
  sets.push('updated_at = ?'); args.push(t);
  const stmts = [env.DB.prepare('UPDATE leads SET ' + sets.join(', ') + ' WHERE id = ?').bind(...args, id)];
  events.forEach((e) => stmts.push(env.DB.prepare('INSERT INTO events (lead_id, at, type, text, from_status, to_status) VALUES (?,?,?,?,?,?)').bind(id, t, e[0], e[1], e[2] || null, e[3] || null)));
  await env.DB.batch(stmts);
  return reply(request, Object.assign({ ok: true }, extra));
}

async function addNote(request, env, id) {
  let b = {};
  try { b = await request.json(); } catch (e) {}
  const text = clip(b.text, 5000);
  if (!text) return fail(request, 400, 'Matn bo\'sh');
  const r = await env.DB.prepare('SELECT id FROM leads WHERE id = ?').bind(id).first();
  if (!r) return fail(request, 404, 'Topilmadi');
  const t = now();
  const res = await env.DB.prepare('INSERT INTO events (lead_id, at, type, text) VALUES (?,?,?,?)').bind(id, t, 'note', text).run();
  return reply(request, { ok: true, event: { id: res.meta && res.meta.last_row_id, at: t, type: 'note', text } });
}

async function createLead(request, env) {
  let b = {};
  try { b = await request.json(); } catch (e) { return fail(request, 400, "Noto'g'ri so'rov"); }
  const fullname = clip(b.fullname, 200);
  if (fullname.length < 2) return fail(request, 400, 'Ism kerak');
  const vac = VAKANSIYALAR[b.vacancy] ? b.vacancy : 'hr';
  const source = clip(b.source, 300) || "ko'rsatilmagan";
  const id = newId(), t = now();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO leads (id, created_at, updated_at, vacancy, vacancy_title, fullname, phone, telegram, types, status, position, archived) VALUES (?,?,?,?,?,?,?,?,?,?,?,0)')
      .bind(id, t, t, vac, VAKANSIYALAR[vac].title, fullname, clip(b.phone, 50), clip(b.telegram, 100), '', 'yangi', -Date.now()),
    env.DB.prepare('INSERT INTO events (lead_id, at, type, text) VALUES (?,?,?,?)').bind(id, t, 'create', "Qo'lda qo'shildi: " + source),
  ]);
  return reply(request, { ok: true, id }, 201);
}

async function deleteLead(request, env, id) {
  const r = await env.DB.prepare('SELECT cv_key FROM leads WHERE id = ?').bind(id).first();
  if (!r) return fail(request, 404, 'Topilmadi');
  await env.DB.batch([env.DB.prepare('DELETE FROM events WHERE lead_id = ?').bind(id), env.DB.prepare('DELETE FROM leads WHERE id = ?').bind(id)]);
  if (r.cv_key) { try { await env.CV.delete(r.cv_key); } catch (e) {} }
  return reply(request, { ok: true });
}

async function getCv(request, env, id) {
  const r = await env.DB.prepare('SELECT cv_key, cv_name FROM leads WHERE id = ?').bind(id).first();
  if (!r || !r.cv_key) return fail(request, 404, 'Fayl yo\'q');
  const o = await env.CV.getWithMetadata(r.cv_key, { type: 'arrayBuffer' });
  if (!o || !o.value) return fail(request, 404, 'Fayl yo\'q');
  const name = (o.metadata && o.metadata.name) || r.cv_name || 'rezyume';
  const ext = String(name).split('.').pop().toLowerCase();
  const mime = CV_EXT[ext] || 'application/octet-stream';
  const h = Object.assign({
    'Content-Type': mime,
    'Content-Disposition': "inline; filename*=UTF-8''" + encodeURIComponent(name),
    'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store',
  }, corsHeaders(request));
  return new Response(o.value, { status: 200, headers: h });
}

async function stats(request, env) {
  const [st, vc, nw, tot] = await Promise.all([
    env.DB.prepare('SELECT status, COUNT(*) AS n FROM leads WHERE archived = 0 GROUP BY status').all(),
    env.DB.prepare('SELECT vacancy, COUNT(*) AS n FROM leads WHERE archived = 0 GROUP BY vacancy').all(),
    env.DB.prepare('SELECT COUNT(*) AS n FROM leads WHERE archived = 0 AND created_at >= ?').bind(new Date(Date.now() - 7 * 86400000).toISOString()).first(),
    env.DB.prepare('SELECT COUNT(*) AS n FROM leads WHERE archived = 0').first(),
  ]);
  const status = {}, vacancy = {};
  STATUSES.forEach((s) => { status[s] = 0; });
  (st.results || []).forEach((r) => { status[r.status] = r.n; });
  (vc.results || []).forEach((r) => { vacancy[r.vacancy] = r.n; });
  return reply(request, { ok: true, total: tot.n, new7: nw.n, status, vacancy });
}

function csvCell(v) {
  v = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(v) && !/^\+?[\d\s()-]{5,}$/.test(v)) v = "'" + v; // formula in'ektsiyadan himoya (telefon raqam bundan mustasno)
  return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}
async function exportCsv(request, env) {
  const rs = await env.DB.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  const head = ['Sana', 'Ism familiya', 'Telefon', 'Telegram', 'Vakansiya', "Yo'nalish", 'Ball', 'Xulosa', 'Belgilar', 'Holat', 'Baho', 'Mijoz', 'Arxiv', 'Bitta savol javobi', 'Saralash bali', 'Saralash qarori', 'ID'];
  const lines = [head.map(csvCell).join(',')];
  (rs.results || []).forEach((r) => {
    const sc = safeParse(r.scores, null) || {}, an = safeParse(r.answers, {}) || {}, scr = safeParse(r.screening, null) || {};
    lines.push([r.created_at, r.fullname, r.phone, r.telegram, r.vacancy_title, (r.types || '').split(',').filter(Boolean).map((x) => YONALISH_NOMI[x] || x).join(', '),
      r.ball, r.xulosa, (sc.belgilar || []).join('; '), r.status, r.rating, r.client, r.archived ? 'ha' : '', an.savol, fmtScr(scr.score), SCR_VERDICTS[scr.verdict] || '', r.id].map(csvCell).join(','));
  });
  const h = Object.assign({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="nomzodlar.csv"', 'Cache-Control': 'no-store' }, corsHeaders(request));
  return new Response('﻿' + lines.join('\r\n'), { status: 200, headers: h });
}

/* ---------- DISC testi ---------- */
/* Kalit: savol raqami -> { tip: variant harfi }. Variant harfi qaysi tipga ball berishini bildiradi.
   7- va 10-savolda faqat A/B: bitta variant ikki tipga ball beradi. Jami har doim 17 ball (13 + 2 + 2). */
const DISC_TYPES = ['D', 'I', 'S', 'C'];
const DISC_KEY = {
  1: { D: 'B', I: 'A', S: 'C', C: 'D' },
  2: { D: 'C', I: 'B', S: 'A', C: 'D' },
  3: { D: 'D', I: 'B', S: 'C', C: 'A' },
  4: { D: 'A', I: 'C', S: 'D', C: 'B' },
  5: { D: 'C', I: 'B', S: 'A', C: 'D' },
  6: { D: 'C', I: 'A', S: 'D', C: 'B' },
  7: { D: 'B', I: 'B', S: 'A', C: 'A' },
  8: { D: 'B', I: 'C', S: 'A', C: 'D' },
  9: { D: 'A', I: 'D', S: 'B', C: 'C' },
  10: { D: 'A', I: 'B', S: 'B', C: 'A' },
  11: { D: 'B', I: 'C', S: 'D', C: 'A' },
  12: { D: 'D', I: 'A', S: 'B', C: 'C' },
  13: { D: 'B', I: 'A', S: 'C', C: 'D' },
  14: { D: 'B', I: 'C', S: 'D', C: 'A' },
  15: { D: 'A', I: 'B', S: 'C', C: 'D' },
};
const DISC_Q = 15;
const DISC_TOTAL = 17;
const discLetters = (q) => (q === 7 || q === 10 ? ['A', 'B'] : ['A', 'B', 'C', 'D']);
/** Tanlangan variant qaysi tip(lar)ga ball beradi: ['D', 'I'] */
export function discTypesFor(q, letter) { return DISC_TYPES.filter((t) => DISC_KEY[q] && DISC_KEY[q][t] === letter); }
/** Javoblarni (answers = { "1": "A", ... }) tekshiradi; { error } yoki { answers } (katta harfli, tozalangan) qaytaradi. */
export function discValidate(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { error: 'Javoblar topilmadi' };
  const out = {};
  for (let q = 1; q <= DISC_Q; q++) {
    const v = typeof raw[q] === 'string' ? raw[q].trim().toUpperCase() : '';
    if (!v) return { error: 'Barcha savollarga javob bering' };
    if (discLetters(q).indexOf(v) < 0) return { error: 'Noto\'g\'ri javob variant: ' + q + '-savol' };
    out[q] = v;
  }
  return { answers: out };
}
/** Sof funksiya (tarmoq/DB yo'q): { d, i, s, c, pct: {D,I,S,C} (yig'indisi 100), primary: 'D' | 'D/I' ... } */
export function discScore(answers) {
  const n = { D: 0, I: 0, S: 0, C: 0 };
  for (let q = 1; q <= DISC_Q; q++) discTypesFor(q, answers[q]).forEach((t) => { n[t]++; });
  // foizlar: eng katta qoldiq usuli (floor + qolgan ballarni eng katta qoldiqqa; teng bo'lsa D, I, S, C tartibida) — yig'indisi aniq 100
  const quota = {}, pct = {};
  let left = 100;
  DISC_TYPES.forEach((t) => { quota[t] = (n[t] / DISC_TOTAL) * 100; pct[t] = Math.floor(quota[t] + 1e-9); left -= pct[t]; });
  DISC_TYPES.slice().sort((x, y) => (quota[y] - pct[y]) - (quota[x] - pct[x]) || DISC_TYPES.indexOf(x) - DISC_TYPES.indexOf(y))
    .slice(0, left).forEach((t) => { pct[t]++; });
  const max = Math.max(n.D, n.I, n.S, n.C);
  const primary = DISC_TYPES.filter((t) => n[t] === max).join('/');
  return { d: n.D, i: n.I, s: n.S, c: n.C, pct, primary };
}

const DISC_COLS = 'id, created_at, lang, fullname, phone, telegram, position, company, d, i, s, c, pct, primary_type, total_ms, note, archived';
const fixDisc = (r) => Object.assign(r, { pct: safeParse(r.pct, { D: 0, I: 0, S: 0, C: 0 }) });

function notifyDisc(env, ctx, r, sc) {
  if (!env.TELEGRAM_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  const lines = ['🧭 Yangi DISC: ' + r.fullname + ' — ' + DISC_TYPES.map((t) => t + ' ' + sc.pct[t] + '%').join(' · '), ''];
  lines.push('🏷 Asosiy tip: ' + sc.primary);
  lines.push('📞 ' + r.phone + (r.telegram ? ' · ' + r.telegram : ''));
  const wp = [r.position, r.company].filter(Boolean).join(' · ');
  if (wp) lines.push('💼 ' + wp);
  if (env.KABINET_URL) { lines.push(''); lines.push(env.KABINET_URL); }
  const p = fetch('https://api.telegram.org/bot' + env.TELEGRAM_TOKEN + '/sendMessage', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines.join('\n').slice(0, 4000), disable_web_page_preview: true }),
  }).catch(() => {});
  ctx.waitUntil(p);
}

/* POST /api/disc (ommaviy) */
async function handleDisc(request, env, ctx) {
  const ip = clientIp(request);
  const rlKey = 'rl:disc:' + ip;
  if ((await rlGet(env, rlKey)) >= 5) return fail(request, 429, "Juda ko'p urinish. Birozdan keyin qayta urinib ko'ring");
  let b = {};
  try { b = await request.json(); } catch (e) { return fail(request, 400, "Noto'g'ri so'rov"); }
  if (!b || typeof b !== 'object' || Array.isArray(b)) return fail(request, 400, "Noto'g'ri so'rov");
  if (b.website) return reply(request, { ok: true }); // bot tuzog'i (yashirin maydon)

  const fullname = clip(b.fullname, 120);
  const phone = clip(b.phone, 20);
  if (fullname.length < 2) return fail(request, 400, 'Ism familiya kerak');
  if (phone.length < 7 || phone.replace(/\D/g, '').length < 7) return fail(request, 400, 'Telefon raqam kerak');
  const v = discValidate(b.answers);
  if (v.error) return fail(request, 400, v.error);

  const sc = discScore(v.answers);
  const id = 'd' + hex(crypto.getRandomValues(new Uint8Array(8)).buffer), t = now();
  const row = {
    id, lang: b.lang === 'ru' ? 'ru' : 'uz', fullname, phone, telegram: clip(b.telegram, 100), position: clip(b.position, 100), company: clip(b.company, 150),
  };
  const tms = Math.max(0, Math.min(86400000, Math.round(Number(b.total_ms) || 0)));
  try {
    await env.DB.prepare('INSERT INTO disc_results (id, created_at, lang, fullname, phone, telegram, position, company, answers, d, i, s, c, pct, primary_type, total_ms, ua, note, archived) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0)')
      .bind(id, t, row.lang, fullname, phone, row.telegram, row.position, row.company, JSON.stringify(v.answers), sc.d, sc.i, sc.s, sc.c, JSON.stringify(sc.pct), sc.primary, tms,
        clip(request.headers.get('User-Agent'), 300), '').run();
  } catch (e) {
    return fail(request, 500, 'Saqlab bo\'lmadi');
  }
  await rlInc(env, rlKey, 600);
  notifyDisc(env, ctx, row, sc);
  return reply(request, { ok: true });
}

async function listDisc(request, env, url) {
  const where = ['archived = ?'], args = [url.searchParams.get('archived') === '1' ? 1 : 0];
  const q = clip(url.searchParams.get('q'), 100);
  if (q) {
    const like = '%' + escLike(q) + '%';
    where.push("(fullname LIKE ? ESCAPE '\\' OR phone LIKE ? ESCAPE '\\' OR telegram LIKE ? ESCAPE '\\' OR position LIKE ? ESCAPE '\\' OR company LIKE ? ESCAPE '\\')");
    args.push(like, like, like, like, like);
  }
  const rs = await env.DB.prepare('SELECT ' + DISC_COLS + ' FROM disc_results WHERE ' + where.join(' AND ') + ' ORDER BY created_at DESC LIMIT 3000').bind(...args).all();
  return reply(request, { ok: true, results: (rs.results || []).map(fixDisc) });
}

async function getDisc(request, env, id) {
  const r = await env.DB.prepare('SELECT ' + DISC_COLS + ', answers FROM disc_results WHERE id = ?').bind(id).first();
  if (!r) return fail(request, 404, 'Topilmadi');
  const result = fixDisc(r);
  result.answers = safeParse(r.answers, {});
  // har bir javob qaysi tip(lar)ga ball bergani (kalit mijozga yuborilmaydi, shu yerda hisoblanadi)
  result.letters = {};
  for (let q = 1; q <= DISC_Q; q++) result.letters[q] = discTypesFor(q, result.answers[q]);
  return reply(request, { ok: true, result });
}

async function patchDisc(request, env, id) {
  let b = {};
  try { b = await request.json(); } catch (e) { return fail(request, 400, "Noto'g'ri so'rov"); }
  const cur = await env.DB.prepare('SELECT id FROM disc_results WHERE id = ?').bind(id).first();
  if (!cur) return fail(request, 404, 'Topilmadi');
  const sets = [], args = [];
  if (b.note !== undefined) { sets.push('note = ?'); args.push(clip(b.note, 5000)); }
  if (b.archived !== undefined) { sets.push('archived = ?'); args.push(b.archived ? 1 : 0); }
  if (b.company !== undefined) { sets.push('company = ?'); args.push(clip(b.company, 120)); }
  if (b.position !== undefined) { sets.push('position = ?'); args.push(clip(b.position, 120)); }
  if (sets.length) await env.DB.prepare('UPDATE disc_results SET ' + sets.join(', ') + ' WHERE id = ?').bind(...args, id).run();
  return reply(request, { ok: true });
}

async function deleteDisc(request, env, id) {
  const r = await env.DB.prepare('SELECT id FROM disc_results WHERE id = ?').bind(id).first();
  if (!r) return fail(request, 404, 'Topilmadi');
  await env.DB.prepare('DELETE FROM disc_results WHERE id = ?').bind(id).run();
  return reply(request, { ok: true });
}

async function discStats(request, env) {
  const d7 = new Date(Date.now() - 7 * 86400000).toISOString(), d30 = new Date(Date.now() - 30 * 86400000).toISOString();
  const [tot, pr, av, w] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) AS n FROM disc_results WHERE archived = 0').first(),
    env.DB.prepare('SELECT primary_type, COUNT(*) AS n FROM disc_results WHERE archived = 0 GROUP BY primary_type').all(),
    env.DB.prepare("SELECT AVG(json_extract(pct, '$.D')) AS d, AVG(json_extract(pct, '$.I')) AS i, AVG(json_extract(pct, '$.S')) AS s, AVG(json_extract(pct, '$.C')) AS c FROM disc_results WHERE archived = 0").first(),
    env.DB.prepare('SELECT SUM(created_at >= ?) AS d7, SUM(created_at >= ?) AS d30 FROM disc_results WHERE archived = 0').bind(d7, d30).first(),
  ]);
  // primary: bitta harfli tiplar; mixed: teng ball (masalan "D/I") — alohida sanaladi
  const primary = { D: 0, I: 0, S: 0, C: 0 };
  let mixed = 0;
  (pr.results || []).forEach((r) => { if (primary[r.primary_type] !== undefined) primary[r.primary_type] += r.n; else mixed += r.n; });
  const r1 = (x) => Math.round((Number(x) || 0) * 10) / 10;
  return reply(request, {
    ok: true, total: tot.n, primary, mixed,
    avg_pct: { D: r1(av && av.d), I: r1(av && av.i), S: r1(av && av.s), C: r1(av && av.c) },
    last7: (w && w.d7) || 0, last30: (w && w.d30) || 0,
  });
}

/* ---------- marshrutlash ---------- */
export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request) });
    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, '') || '/';
      const m = request.method;
      if (path === '/' && m === 'GET') return reply(request, { ok: true, service: 'Nomzod kabinet' });
      if (path === '/api/apply' && m === 'POST') return await handleApply(request, env, ctx);
      if (path === '/api/login' && m === 'POST') return await handleLogin(request, env);
      if (path === '/api/disc' && m === 'POST') return await handleDisc(request, env, ctx);
      if (path.indexOf('/api/') !== 0) return fail(request, 404, 'Topilmadi');

      if (!(await authed(request, env))) return fail(request, 401, 'Kirish talab qilinadi');

      if (path === '/api/leads' && m === 'GET') return await listLeads(request, env, url);
      if (path === '/api/leads' && m === 'POST') return await createLead(request, env);
      if (path === '/api/stats' && m === 'GET') return await stats(request, env);
      if (path === '/api/disc' && m === 'GET') return await listDisc(request, env, url);
      if (path === '/api/disc/stats' && m === 'GET') return await discStats(request, env);
      const dm = /^\/api\/disc\/([A-Za-z0-9_-]{1,40})$/.exec(path);
      if (dm) {
        if (m === 'GET') return await getDisc(request, env, dm[1]);
        if (m === 'PATCH') return await patchDisc(request, env, dm[1]);
        if (m === 'DELETE') return await deleteDisc(request, env, dm[1]);
      }
      if (path === '/api/export.csv' && m === 'GET') return await exportCsv(request, env);
      const mm = /^\/api\/leads\/([A-Za-z0-9_-]{1,40})(?:\/(notes|cv))?$/.exec(path);
      if (mm) {
        const id = mm[1], sub = mm[2];
        if (!sub && m === 'GET') return await getLead(request, env, id);
        if (!sub && m === 'PATCH') return await patchLead(request, env, id);
        if (!sub && m === 'DELETE') return await deleteLead(request, env, id);
        if (sub === 'notes' && m === 'POST') return await addNote(request, env, id);
        if (sub === 'cv' && m === 'GET') return await getCv(request, env, id);
      }
      return fail(request, 404, 'Topilmadi');
    } catch (e) {
      return fail(request, 500, 'Server xatosi');
    }
  },
};
