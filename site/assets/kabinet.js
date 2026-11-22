/* Nomzod kabinet (ATS) — maxfiy sahifa. Matnlar to'g'ridan-to'g'ri YANGI lotin alifbosida yozilgan (alphabet.js yuklanmaydi).
   Nomzod ma'lumotlari faqat textContent orqali chiqariladi (foydalanuvchi ma'lumoti uchun innerHTML ishlatilmaydi). */
(function () {
  'use strict';
  var doc = document;
  var cfg = window.NOMZOD_CONFIG || {};
  var API = String(cfg.apiBase || '').replace(/\/+$/, '');
  var TKEY = 'nmzd-kabinet-token', UKEY = 'nmzd-kabinet-ui';
  var root = doc.getElementById('root'), toastBox = doc.getElementById('toasts');
  var mq = window.matchMedia ? window.matchMedia('(max-width:699px)') : { matches: false, addEventListener: function () {} };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ustunlar (pipeline) ---------- */
  var COLS = [
    { id: 'yangi', t: 'Yangi', c: '#3A3D6E' },
    { id: 'saralash', t: 'Saralanmoqda', c: '#5560B0' },
    { id: 'telefon', t: 'Telefon suhbati', c: '#7A2E5C' },
    { id: 'suhbat', t: '1-suhbat', c: '#A33A63' },
    { id: 'taqdim', t: 'Mijozga taqdim etildi', c: '#D13445' },
    { id: 'mijoz', t: 'Mijoz bilan suhbat', c: '#E0485A' },
    { id: 'taklif', t: 'Taklif berildi', c: '#E8705F' },
    { id: 'joylashdi', t: 'Işga joylaşdi', c: '#1C8A5E' },
    { id: 'zaxira', t: 'Zaxira', c: '#9A9BB0', side: true },
    { id: 'rad', t: 'Rad etildi', c: '#9A9BB0', side: true }
  ];
  var COLMAP = {}; COLS.forEach(function (c) { COLMAP[c.id] = c; });
  var VAC_NAME = { hr: 'HR', sotuv: 'Sotuv' };
  var TYPE_NAME = { call: 'Qönğiroq', reception: 'Reception' };

  /* ---------- eski alifbodan yangisiga (faqat testlar matni va server xabarlari uchun) ---------- */
  var APOS = "['ʻ‘’`]";
  var RULES = [[new RegExp('O' + APOS, 'g'), 'Ö'], [new RegExp('o' + APOS, 'g'), 'ö'], [new RegExp('G' + APOS, 'g'), 'Ğ'], [new RegExp('g' + APOS, 'g'), 'ğ'],
    [/S[hH]/g, 'Ş'], [/sh/g, 'ş'], [/C[hH]/g, 'Ç'], [/ch/g, 'ç']];
  function toNew(s) { s = String(s == null ? '' : s); for (var i = 0; i < RULES.length; i++) s = s.replace(RULES[i][0], RULES[i][1]); return s; }

  /* ---------- yordamchilar ---------- */
  function h(tag, attrs, kids) {
    var e = doc.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'text') e.textContent = v;
      else if (k === 'class') e.className = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? doc.createTextNode(c) : c); });
    return e;
  }
  var NS = 'http://www.w3.org/2000/svg';
  var IC = { // ishonchli doimiy SVG yo'llar (foydalanuvchi ma'lumoti emas)
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    clip: '<path d="m21 11-9 9a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/>',
    archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M3 3l18 18M10.6 5.1A9.7 9.7 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 4.4-1"/>',
    chev: '<path d="m15 18-6-6 6-6"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5"/>'
  };
  function icon(n) { var s = doc.createElementNS(NS, 'svg'); s.setAttribute('class', 'i'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = IC[n]; return s; }
  function stars(n, big) {
    var w = h('span', { class: 'stars', 'aria-label': n + ' / 5' });
    for (var i = 1; i <= 5; i++) {
      var s = doc.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
      if (i > n) s.setAttribute('class', 'off');
      s.innerHTML = '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>';
      w.appendChild(s);
    }
    return w;
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  var ui = (function () { try { return JSON.parse(lsGet(UKEY) || '{}') || {}; } catch (e) { return {}; } })();
  if (!ui.collapsed) ui.collapsed = { zaxira: true, rad: true };
  function saveUi() { lsSet(UKEY, JSON.stringify({ vac: ui.vac || '', xul: ui.xul || '', archived: !!ui.archived, collapsed: ui.collapsed })); }

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function fmtDate(iso) {
    var d = new Date(iso); if (isNaN(d)) return '';
    try {
      var p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tashkent', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
        .formatToParts(d).forEach(function (x) { p[x.type] = x.value; });
      return p.day + '.' + p.month + '.' + p.year + ' ' + (p.hour === '24' ? '00' : p.hour) + ':' + p.minute;
    } catch (e) { return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  }
  function rel(iso) {
    var d = new Date(iso); if (isNaN(d)) return '';
    var s = Math.max(0, (Date.now() - d.getTime()) / 1000);
    if (s < 60) return 'hozir';
    if (s < 3600) return Math.floor(s / 60) + ' daqiqa oldin';
    if (s < 86400) return Math.floor(s / 3600) + ' soat oldin';
    if (s < 86400 * 30) return Math.floor(s / 86400) + ' kun oldin';
    return fmtDate(iso).slice(0, 10);
  }
  function xk(x) { x = String(x || ''); return x.indexOf('✅') === 0 ? 'yashil' : x.indexOf('🟡') === 0 ? 'sariq' : x.indexOf('🔴') === 0 ? 'qizil' : ''; }
  function tgUser(s) {
    s = String(s || '').trim().replace(/^https?:\/\/(t\.me|telegram\.me)\//i, '').replace(/^@/, '').split(/[/?#]/)[0];
    return /^[A-Za-z0-9_]{3,32}$/.test(s) ? s : '';
  }
  function telHref(p) { var d = String(p || '').replace(/[^\d+]/g, ''); return d.length >= 7 ? 'tel:' + d : ''; }
  function typesOf(l) { return String(l.types || '').split(',').filter(function (x) { return TYPE_NAME[x]; }); }

  /* ---------- toast ---------- */
  function toast(msg, err) {
    var t = h('div', { class: 'toast' + (err ? ' toast--err' : ''), text: msg });
    toastBox.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, err ? 5200 : 2800);
  }

  /* ---------- API ---------- */
  var token = lsGet(TKEY) || '';
  var inflight = 0;
  function call(method, path, body, raw) {
    var headers = {};
    if (token) headers.Authorization = 'Bearer ' + token;
    var opt = { method: method, headers: headers };
    if (body !== undefined) { headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(body); }
    return fetch(API + path, opt).then(function (r) {
      if (r.status === 401 && path !== '/api/login') { logout('Seans tugadi. Qayta kiring.'); var e1 = new Error('auth'); e1.handled = true; throw e1; }
      if (raw && r.ok) return r;
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || (j && j.ok === false)) { var e = new Error(toNew((j && j.error) || 'Xatolik')); e.status = r.status; throw e; }
        return j;
      });
    }, function () { var e = new Error('Server bilan aloqa yöq'); e.net = true; throw e; });
  }

  /* ---------- testlar (savol matnlari) ---------- */
  var TESTS = {};
  function loadTest(id) {
    return new Promise(function (res) {
      var s = doc.createElement('script');
      s.src = '../assets/tests/' + id + '.js?v=4';
      s.onload = function () { try { TESTS[id] = window.VACANCY_TEST; } catch (e) {} res(); };
      s.onerror = function () { res(); };
      doc.head.appendChild(s);
    });
  }
  var testsReady = loadTest('hr').then(function () { return loadTest('sotuv'); });

  /* ---------- holat ---------- */
  var S = { leads: [], loaded: false, q: '', vac: ui.vac || '', xul: ui.xul || '', archived: !!ui.archived, mob: 'yangi', drawer: null, last: 0 };
  var el = {}; // asosiy elementlar
  function byId(id) { for (var i = 0; i < S.leads.length; i++) if (S.leads[i].id === id) return S.leads[i]; return null; }

  /* ================= LOGIN ================= */
  function showSetup() {
    root.textContent = '';
    root.appendChild(h('main', { class: 'login' }, [h('div', { class: 'setup' }, [
      h('h1', { text: 'Kabinet hali sozlanmagan' }),
      h('p', { class: 'login__sub' }, ['assets/config.js içidagi ', h('code', { text: 'apiBase' }), " maydoniga Worker manzilini yozing (masalan https://nomzod-kabinet.xxx.workers.dev). Batafsil: kabinet-api/README.md."])
    ])]));
  }
  function showLogin(msg) {
    if (S.timer) { clearInterval(S.timer); S.timer = null; }
    closeDrawer(true);
    root.textContent = '';
    var err = h('p', { class: 'msg', role: 'alert', hidden: true });
    var info = h('p', { class: 'msg msg--info', hidden: !msg, text: msg || '' });
    var pw = h('input', { class: 'inp', id: 'pw', type: 'password', autocomplete: 'current-password', required: true, 'aria-describedby': 'pw-err' });
    var tgl = h('button', { class: 'pw__t', type: 'button', 'aria-label': "Parolni körsatiş", 'aria-pressed': 'false' }, [icon('eye')]);
    tgl.addEventListener('click', function () {
      var show = pw.type === 'password'; pw.type = show ? 'text' : 'password';
      tgl.setAttribute('aria-pressed', String(show)); tgl.setAttribute('aria-label', show ? 'Parolni yaşiriş' : 'Parolni körsatiş');
      tgl.textContent = ''; tgl.appendChild(icon(show ? 'eyeoff' : 'eye')); pw.focus();
    });
    var btn = h('button', { class: 'btn btn--red btn--block', type: 'submit', text: 'Kiriş' });
    err.id = 'pw-err';
    var form = h('form', { novalidate: true }, [
      info, err,
      h('label', { class: 'field', for: 'pw' }, [h('span', { text: 'Parol' }), h('div', { class: 'pw' }, [pw, tgl])]),
      btn
    ]);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true; pw.removeAttribute('aria-invalid');
      if (!pw.value) { err.textContent = 'Parolni kiriting'; err.hidden = false; pw.setAttribute('aria-invalid', 'true'); pw.focus(); return; }
      btn.classList.add('is-loading'); btn.disabled = true;
      call('POST', '/api/login', { password: pw.value }).then(function (j) {
        token = j.token; lsSet(TKEY, token); showApp();
      }, function (e2) {
        btn.classList.remove('is-loading'); btn.disabled = false;
        err.textContent = e2.status === 401 ? 'Parol notöğri' : e2.net ? 'Server bilan aloqa yöq. Internetni tekşiring' : e2.message;
        err.hidden = false; pw.setAttribute('aria-invalid', 'true'); pw.select();
      });
    });
    root.appendChild(h('main', { class: 'login' }, [h('div', { class: 'login__card' }, [
      h('img', { class: 'login__logo', src: '../assets/logo.svg', alt: 'Nomzod' }),
      h('h1', { text: 'Kabinet' }),
      h('p', { class: 'login__sub', text: 'Rekruter iş joyi. Davom etiş uçun parolni kiriting.' }),
      form
    ])]));
    pw.focus();
  }
  function logout(msg) {
    token = ''; lsDel(TKEY); S.leads = []; S.loaded = false;
    showLogin(msg || '');
  }

  /* ================= ILOVA ================= */
  function showApp() {
    root.textContent = '';
    S.loaded = false;
    var search = h('input', { class: 'inp', type: 'search', id: 'q', placeholder: 'Ism, telefon yoki Telegram', 'aria-label': 'Nomzodni qidiriş', autocomplete: 'off', value: S.q });
    search.addEventListener('input', function () { S.q = search.value; renderBoard(); });
    var vacBtns = [['', 'Barçasi'], ['hr', 'HR'], ['sotuv', 'Sotuv']].map(function (v) {
      var b = h('button', { type: 'button', 'aria-pressed': String(S.vac === v[0]), text: v[1] });
      b.addEventListener('click', function () { S.vac = v[0]; ui.vac = v[0]; saveUi(); vacBtns.forEach(function (x, i) { x.setAttribute('aria-pressed', String([''].concat(['hr', 'sotuv'])[i] === S.vac)); }); renderBoard(); });
      return b;
    });
    var xsel = h('select', { class: 'sel', 'aria-label': 'Xulosa böyiça filtr' }, [
      h('option', { value: '', text: 'Xulosa: hammasi' }), h('option', { value: 'yashil', text: '✅ Tavsiya' }),
      h('option', { value: 'sariq', text: "🟡 Körib çiqiş" }), h('option', { value: 'qizil', text: '🔴 Mos emas' })]);
    xsel.value = S.xul;
    xsel.addEventListener('change', function () { S.xul = xsel.value; ui.xul = S.xul; saveUi(); renderBoard(); });
    var arch = h('input', { type: 'checkbox', id: 'arch' }); arch.checked = S.archived;
    arch.addEventListener('change', function () { S.archived = arch.checked; ui.archived = S.archived; saveUi(); refresh(); });
    el.refreshBtn = h('button', { class: 'btn btn--line btn--icon', type: 'button', title: 'Yangilaş', 'aria-label': 'Yangilaş' }, [icon('refresh')]);
    el.refreshBtn.addEventListener('click', function () { refresh(true); });
    var addBtn = h('button', { class: 'btn btn--red btn--add', type: 'button' }, [icon('plus'), 'Nomzod qöşiş']);
    addBtn.addEventListener('click', openAdd);
    var csvBtn = h('button', { class: 'btn btn--line btn--csv', type: 'button', 'aria-label': 'CSV yuklab oliş', title: 'CSV yuklab oliş' }, [icon('download'), h('span', { class: 'btn__t', text: 'CSV yuklab oliş' })]);
    csvBtn.addEventListener('click', downloadCsv);
    var out = h('button', { class: 'btn btn--ghost btn--sm', type: 'button' }, [icon('logout'), 'Çiqiş']);
    out.addEventListener('click', function () { logout(''); });

    el.banner = h('div', { class: 'banner', role: 'alert', hidden: true });
    el.stats = h('div', { class: 'stats', 'aria-label': 'Statistika' });
    el.tabs = h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Bosqiçlar' });
    el.board = h('div', { class: 'board', 'aria-label': 'Nomzodlar doskasi' });
    root.appendChild(h('div', { class: 'app' }, [
      h('header', { class: 'topbar' }, [
        h('div', { class: 'topbar__brand' }, [h('img', { src: '../assets/logo-white.svg', alt: 'Nomzod' }), h('span', { class: 'topbar__tag', text: 'Kabinet' })]),
        h('div', { class: 'topbar__sp' }), out
      ]),
      el.banner,
      h('div', { class: 'tools' }, [
        h('div', { class: 'search' }, [icon('search'), search]),
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Vakansiya' }, vacBtns), xsel,
        h('label', { class: 'sw' }, [arch, h('span', { class: 'sw__k' }), h('span', { text: 'Arxivni körsatiş' })]),
        h('div', { class: 'tools__sp' }), el.refreshBtn, csvBtn, addBtn
      ]),
      el.stats, el.tabs,
      h('div', { class: 'boardwrap' }, [el.board])
    ]));
    bindBoard();
    renderBoard();
    refresh();
    if (S.timer) clearInterval(S.timer);
    S.timer = setInterval(function () { autoRefresh(); }, 60000);
  }

  /* ---------- yuklash ---------- */
  function refresh(manual) {
    var reqs = [call('GET', '/api/leads?archived=0')];
    if (S.archived) reqs.push(call('GET', '/api/leads?archived=1'));
    if (el.refreshBtn) el.refreshBtn.disabled = true;
    return Promise.all(reqs).then(function (rs) {
      var all = [];
      rs.forEach(function (r) { all = all.concat(r.leads || []); });
      S.leads = all; S.loaded = true; S.last = Date.now();
      if (el.banner) el.banner.hidden = true;
      if (!S.dragging) renderBoard();
      if (S.drawer) syncDrawerFromList();
      if (manual) toast('Yangilandi');
    }).catch(function (e) {
      if (e.handled) return;
      S.loaded = true;
      showBanner(e.net ? 'Server bilan aloqa yöq. Internetni tekşirib, qayta urinib köring.' : e.message);
      renderBoard();
    }).then(function () { if (el.refreshBtn) el.refreshBtn.disabled = false; });
  }
  function showBanner(msg) {
    el.banner.textContent = '';
    var retry = h('button', { class: 'btn btn--danger btn--sm', type: 'button', text: 'Qayta urinib köriş' });
    retry.addEventListener('click', function () { refresh(true); });
    el.banner.appendChild(h('span', { text: msg })); el.banner.appendChild(retry);
    el.banner.hidden = false;
  }
  function autoRefresh() {
    if (doc.visibilityState !== 'visible' || S.drawer || S.dragging || inflight || doc.querySelector('.modal') || !token) return;
    refresh();
  }
  doc.addEventListener('visibilitychange', function () { if (doc.visibilityState === 'visible' && token && el.board && Date.now() - S.last > 60000) autoRefresh(); });

  /* ---------- filtr ---------- */
  function visibleLeads() {
    var q = S.q.trim().toLowerCase(), qd = q.replace(/\D/g, '');
    return S.leads.filter(function (l) {
      if (!S.archived && l.archived) return false;
      if (S.vac && l.vacancy !== S.vac) return false;
      if (S.xul && xk(l.xulosa) !== S.xul) return false;
      if (q) {
        var hit = String(l.fullname || '').toLowerCase().indexOf(q) >= 0 || String(l.telegram || '').toLowerCase().indexOf(q) >= 0 ||
          (qd.length >= 3 && String(l.phone || '').replace(/\D/g, '').indexOf(qd) >= 0) || String(l.phone || '').toLowerCase().indexOf(q) >= 0;
        if (!hit) return false;
      }
      return true;
    });
  }
  function sortCol(a, b) { return (a.position - b.position) || (String(b.created_at).localeCompare(String(a.created_at))); }
  function colItems(vis, id) { return vis.filter(function (l) { return l.status === id; }).sort(sortCol); }

  /* ---------- statistika ---------- */
  function renderStats() {
    var act = S.leads.filter(function (l) { return !l.archived; });
    var w7 = Date.now() - 7 * 86400000, n7 = act.filter(function (l) { return new Date(l.created_at).getTime() >= w7; }).length;
    el.stats.textContent = '';
    el.stats.appendChild(h('span', { class: 'stat stat--main' }, ['Jami ', h('b', { text: String(act.length) })]));
    el.stats.appendChild(h('span', { class: 'stat stat--main stat--new' }, ['Yangi (7 kun) ', h('b', { text: String(n7) })]));
    COLS.forEach(function (c) {
      var n = act.filter(function (l) { return l.status === c.id; }).length;
      var s = h('span', { class: 'stat', title: c.t }, [h('i'), c.t + ' ', h('b', { text: String(n) })]);
      s.firstChild.style.setProperty('--dot', c.c);
      el.stats.appendChild(s);
    });
  }

  /* ---------- doska ---------- */
  function cardEl(l) {
    var x = xk(l.xulosa);
    var top = h('div', { class: 'card__top' }, [h('div', { class: 'card__name', text: l.fullname || '—' })]);
    if (l.has_cv) top.appendChild(h('span', { class: 'card__cv', title: 'Rezyume bor' }, [icon('clip')]));
    var row = h('div', { class: 'card__row' }, [h('span', { class: 'chip chip--' + (l.vacancy === 'sotuv' ? 'sotuv' : 'hr'), text: VAC_NAME[l.vacancy] || l.vacancy || '' })]);
    typesOf(l).forEach(function (t) { row.appendChild(h('span', { class: 'chip chip--t', text: TYPE_NAME[t] })); });
    if (l.ball !== null && l.ball !== undefined) {
      row.appendChild(h('span', { class: 'ball', title: x ? toNew(l.xulosa) : '' }, [h('span', { class: 'dot dot--' + (x || 'none') }), l.ball + '/100']));
    } else row.appendChild(h('span', { class: 'chip chip--t', text: 'Ball yöq' }));
    if (l.belgilar > 0) row.appendChild(h('span', { class: 'chip chip--warn', title: 'Belgilar soni' }, ['⚠ ' + l.belgilar]));
    var kids = [top, row];
    if (l.client) kids.push(h('div', { class: 'card__row' }, [h('span', { class: 'chip chip--client', title: 'Mijoz', text: l.client })]));
    var foot = h('div', { class: 'card__foot' }, [h('span', { title: fmtDate(l.created_at), text: rel(l.created_at) })]);
    if (l.rating) foot.appendChild(stars(l.rating));
    kids.push(foot);
    var c = h('article', { class: 'card' + (l.archived ? ' card--archived' : ''), 'data-id': l.id, tabindex: '0', role: 'button',
      'aria-label': (l.fullname || '') + '. ' + (COLMAP[l.status] ? COLMAP[l.status].t : '') + (l.archived ? '. Arxivda' : '') }, kids);
    return c;
  }
  function renderBoard() {
    if (!el.board) return;
    var scrollL = el.board.scrollLeft, bodies = {};
    Array.prototype.forEach.call(el.board.querySelectorAll('.col'), function (c) { var b = c.querySelector('.col__body'); if (b) bodies[c.getAttribute('data-col')] = b.scrollTop; });
    var vis = visibleLeads();
    el.board.textContent = '';
    if (!S.mob || !COLMAP[S.mob]) S.mob = 'yangi';
    COLS.forEach(function (c) {
      var items = colItems(vis, c.id), collapsed = !!c.side && !!ui.collapsed[c.id];
      var cnt = h('span', { class: 'col__n', text: String(items.length), 'aria-label': items.length + ' ta' });
      var head = h('div', { class: 'col__h' }, [h('span', { class: 'col__t', text: c.t }), cnt]);
      if (c.side) {
        var tg = h('button', { class: 'col__tg', type: 'button', 'aria-expanded': String(!collapsed), 'aria-label': c.t + (collapsed ? ': oçiş' : ': yiğiş') }, [icon('chev')]);
        tg.firstChild.style.transform = collapsed ? 'none' : 'rotate(-90deg)';
        tg.addEventListener('click', function (e) { e.stopPropagation(); ui.collapsed[c.id] = !ui.collapsed[c.id]; saveUi(); renderBoard(); });
        head.insertBefore(tg, head.firstChild);
      }
      var body = h('div', { class: 'col__body' });
      if (!S.loaded) { for (var i = 0; i < (c.id === 'yangi' ? 3 : c.side ? 0 : 1); i++) body.appendChild(h('div', { class: 'skel' })); }
      else if (!items.length) body.appendChild(h('div', { class: 'col__empty', text: S.q || S.vac || S.xul ? 'Topilmadi' : 'Bu bosqiçda nomzod yöq' }));
      items.forEach(function (l) { body.appendChild(cardEl(l)); });
      var col = h('section', { class: 'col' + (c.side ? ' col--side' : '') + (collapsed ? ' col--collapsed' : '') + (c.id === S.mob ? ' is-active' : ''), 'data-col': c.id, 'aria-label': c.t }, [head, body]);
      col.style.setProperty('--acc', c.c);
      if (collapsed) col.addEventListener('click', function () { ui.collapsed[c.id] = false; saveUi(); renderBoard(); });
      el.board.appendChild(col);
      if (bodies[c.id]) body.scrollTop = bodies[c.id];
    });
    el.board.scrollLeft = scrollL;
    renderTabs(vis);
    renderStats();
    if (S.loaded && !S.leads.length && !S.q) {
      // butunlay bo'sh holat: yangi ustunda ko'rsatma
      var yb = el.board.querySelector('[data-col="yangi"] .col__body');
      if (yb) { yb.textContent = ''; yb.appendChild(h('div', { class: 'col__empty', text: 'Hozirça nomzod yöq. Saytdagi anketa yoki "Nomzod qöşiş" orqali qöşiladi.' })); }
    }
  }
  function renderTabs(vis) {
    el.tabs.textContent = '';
    COLS.forEach(function (c) {
      var n = colItems(vis, c.id).length;
      var t = h('button', { class: 'tab', type: 'button', role: 'tab', 'aria-selected': String(c.id === S.mob) }, [c.t, h('small', { text: String(n) })]);
      t.addEventListener('click', function () { S.mob = c.id; renderBoard(); var a = el.tabs.querySelector('[aria-selected=true]'); if (a && a.scrollIntoView) a.scrollIntoView({ inline: 'center', block: 'nearest' }); });
      el.tabs.appendChild(t);
    });
  }

  /* ---------- ko'chirish (optimistik) ---------- */
  function calcPos(prev, next) {
    if (prev && next) return (prev.position + next.position) / 2;
    if (prev) return prev.position + 1000;
    if (next) return next.position - 1000;
    return 0;
  }
  function patchLead(id, body) {
    inflight++;
    return call('PATCH', '/api/leads/' + id, body).then(function (r) { inflight--; return r; }, function (e) { inflight--; throw e; });
  }
  function moveLead(id, status, prev, next, focus) {
    var l = byId(id); if (!l) return;
    var old = { status: l.status, position: l.position };
    var pos = calcPos(prev, next);
    if (old.status === status && old.position === pos) return;
    l.status = status; l.position = pos;
    renderBoard();
    if (focus) focusCard(id);
    patchLead(id, { status: status, position: pos }).then(function () {
      if (S.drawer && S.drawer.id === id) { S.drawer.lead.status = status; loadDetail(id, true); }
    }, function (e) {
      if (e.handled) return;
      l.status = old.status; l.position = old.position; renderBoard();
      toast('Köçirib bölmadi: ' + e.message, true);
    });
  }
  function focusCard(id) { var c = el.board.querySelector('.card[data-id="' + id + '"]'); if (c) c.focus({ preventScroll: false }); }

  /* ---------- sürish (Pointer Events) ---------- */
  var drag = null, suppressClick = false;
  function bindBoard() {
    el.board.addEventListener('pointerdown', onDown);
    el.board.addEventListener('click', function (e) {
      if (suppressClick) { e.preventDefault(); e.stopPropagation(); return; }
      var c = e.target.closest('.card'); if (c) openDrawer(c.getAttribute('data-id'));
    });
    el.board.addEventListener('keydown', onCardKey);
  }
  function onCardKey(e) {
    var c = e.target.closest && e.target.closest('.card'); if (!c || e.target !== c) return;
    var id = c.getAttribute('data-id'), l = byId(id); if (!l) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDrawer(id); return; }
    if (!e.altKey) return;
    var vis = visibleLeads(), k = e.key, ci = COLS.map(function (x) { return x.id; }).indexOf(l.status);
    if (k === 'ArrowLeft' || k === 'ArrowRight') {
      e.preventDefault();
      var ni = ci + (k === 'ArrowLeft' ? -1 : 1); if (ni < 0 || ni >= COLS.length) return;
      var tid = COLS[ni].id, items = colItems(vis, tid);
      moveLead(id, tid, null, items[0] || null, true); toast('Köçirildi: ' + COLS[ni].t);
    } else if (k === 'ArrowUp' || k === 'ArrowDown') {
      e.preventDefault();
      var items2 = colItems(vis, l.status), i = items2.indexOf(l);
      if (k === 'ArrowUp' && i > 0) moveLead(id, l.status, items2[i - 2] || null, items2[i - 1], true);
      else if (k === 'ArrowDown' && i >= 0 && i < items2.length - 1) moveLead(id, l.status, items2[i + 1], items2[i + 2] || null, true);
    }
  }
  function onDown(e) {
    if (mq.matches || drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
    var card = e.target.closest('.card'); if (!card || e.target.closest('a,button,input,select,textarea')) return;
    drag = { card: card, id: card.getAttribute('data-id'), sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, type: e.pointerType, started: false, timer: null };
    if (e.pointerType !== 'mouse') drag.timer = setTimeout(function () { if (drag && !drag.started) startDrag(); }, 320);
    doc.addEventListener('pointermove', onMove);
    doc.addEventListener('pointerup', onUp);
    doc.addEventListener('pointercancel', onCancel);
    doc.addEventListener('keydown', onDragKey);
  }
  function blockTouch(e) { if (e.cancelable) e.preventDefault(); }
  function startDrag() {
    var d = drag, r = d.card.getBoundingClientRect();
    d.started = true; S.dragging = true; clearTimeout(d.timer);
    d.ox = d.lx - r.left; d.oy = d.ly - r.top;
    d.ghost = d.card.cloneNode(true); d.ghost.classList.add('ghost'); d.ghost.removeAttribute('tabindex');
    d.ghost.style.width = r.width + 'px'; d.ghost.style.left = r.left + 'px'; d.ghost.style.top = r.top + 'px';
    d.ph = h('div', { class: 'ph' }); d.ph.style.height = r.height + 'px';
    d.card.parentNode.insertBefore(d.ph, d.card);
    d.card.classList.add('is-hidden');
    doc.body.appendChild(d.ghost); doc.body.classList.add('is-dragging');
    doc.addEventListener('touchmove', blockTouch, { passive: false });
    d.raf = requestAnimationFrame(autoScroll);
    updateTarget();
  }
  function onMove(e) {
    if (!drag || e.pointerId === undefined) return;
    drag.lx = e.clientX; drag.ly = e.clientY;
    if (!drag.started) {
      var dist = Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy);
      if (drag.type === 'mouse') { if (dist > 6) startDrag(); }
      else if (dist > 10) endDrag(); // barmoq sürildi — bu sahifa aylantirish
      return;
    }
    e.preventDefault();
    drag.ghost.style.left = (drag.lx - drag.ox) + 'px'; drag.ghost.style.top = (drag.ly - drag.oy) + 'px';
    updateTarget();
  }
  function updateTarget() {
    var d = drag, g = d.ghost; g.style.left = (d.lx - d.ox) + 'px'; g.style.top = (d.ly - d.oy) + 'px';
    var t = doc.elementFromPoint(d.lx, d.ly), col = t && t.closest ? t.closest('.col') : null;
    Array.prototype.forEach.call(el.board.querySelectorAll('.col.is-over'), function (c) { if (c !== col) c.classList.remove('is-over'); });
    if (!col) return;
    col.classList.add('is-over'); d.col = col;
    var body = col.querySelector('.col__body'), cards = Array.prototype.filter.call(body.querySelectorAll('.card'), function (c) { return !c.classList.contains('is-hidden'); });
    var before = null;
    for (var i = 0; i < cards.length; i++) { var r = cards[i].getBoundingClientRect(); if (d.ly < r.top + r.height / 2) { before = cards[i]; break; } }
    if (col.classList.contains('col--collapsed')) { before = null; }
    var want = before || null;
    if (d.ph.parentNode !== body || d.ph.nextElementSibling !== want) {
      if (want) body.insertBefore(d.ph, want); else body.appendChild(d.ph);
    }
  }
  function autoScroll() {
    var d = drag; if (!d || !d.started) return;
    var br = el.board.getBoundingClientRect(), edge = 70, sp = 0;
    if (d.lx < br.left + edge) sp = -Math.ceil((br.left + edge - d.lx) / 5); else if (d.lx > br.right - edge) sp = Math.ceil((d.lx - (br.right - edge)) / 5);
    if (sp) { el.board.scrollLeft += Math.max(-22, Math.min(22, sp)); updateTarget(); }
    var body = d.col && d.col.querySelector('.col__body');
    if (body && !d.col.classList.contains('col--collapsed')) {
      var r = body.getBoundingClientRect(), vs = 0;
      if (d.ly < r.top + 60) vs = -Math.ceil((r.top + 60 - d.ly) / 4); else if (d.ly > r.bottom - 60) vs = Math.ceil((d.ly - (r.bottom - 60)) / 4);
      if (vs) { body.scrollTop += Math.max(-22, Math.min(22, vs)); updateTarget(); }
    }
    d.raf = requestAnimationFrame(autoScroll);
  }
  function endDrag() {
    var d = drag; if (!d) return;
    clearTimeout(d.timer); if (d.raf) cancelAnimationFrame(d.raf);
    doc.removeEventListener('pointermove', onMove); doc.removeEventListener('pointerup', onUp); doc.removeEventListener('pointercancel', onCancel);
    doc.removeEventListener('keydown', onDragKey); doc.removeEventListener('touchmove', blockTouch);
    if (d.started) {
      if (d.ghost && d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
      doc.body.classList.remove('is-dragging');
      Array.prototype.forEach.call(el.board.querySelectorAll('.col.is-over'), function (c) { c.classList.remove('is-over'); });
    }
    drag = null; S.dragging = false;
    return d;
  }
  function onCancel() { var d = endDrag(); if (d && d.started) { if (d.ph.parentNode) d.ph.parentNode.removeChild(d.ph); d.card.classList.remove('is-hidden'); } }
  function onDragKey(e) { if (e.key === 'Escape') { e.stopPropagation(); onCancel(); } }
  function onUp() {
    var d = endDrag(); if (!d || !d.started) return;
    suppressClick = true; setTimeout(function () { suppressClick = false; }, 60);
    var ph = d.ph, col = ph.closest ? ph.closest('.col') : null;
    if (!col || !col.getAttribute('data-col')) { if (ph.parentNode) ph.parentNode.removeChild(ph); d.card.classList.remove('is-hidden'); return; }
    var status = col.getAttribute('data-col'), body = col.querySelector('.col__body');
    var prevEl = ph.previousElementSibling, nextEl = ph.nextElementSibling;
    function ld(n) { while (n && !(n.classList && n.classList.contains('card') && !n.classList.contains('is-hidden'))) n = null; return n ? byId(n.getAttribute('data-id')) : null; }
    var prev = ld(prevEl), next = ld(nextEl);
    if (col.classList.contains('col--collapsed')) { var arr = colItems(visibleLeads(), status); prev = arr[arr.length - 1] || null; next = null; }
    if (ph.parentNode) ph.parentNode.removeChild(ph); d.card.classList.remove('is-hidden');
    if (prev && prev.id === d.id) prev = null; if (next && next.id === d.id) next = null;
    moveLead(d.id, status, prev, next, false);
  }

  /* ================= DRAWER ================= */
  var lastFocus = null;
  function setInert(n, on) { if (!n) return; if (on) n.setAttribute('inert', ''); else n.removeAttribute('inert'); }
  function openDrawer(id) {
    var l = byId(id); if (!l) return;
    if (S.drawer) closeDrawer(true);
    lastFocus = doc.activeElement;
    S.drawer = { id: id, lead: Object.assign({}, l), full: false };
    var scrim = h('div', { class: 'scrim' });
    scrim.addEventListener('click', function () { closeDrawer(); });
    var dw = h('aside', { class: 'drawer', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'dw-name' });
    S.drawer.scrim = scrim; S.drawer.el = dw;
    doc.body.appendChild(scrim); doc.body.appendChild(dw);
    setInert(root, true);
    buildDrawer();
    loadDetail(id);
    var f = dw.querySelector('.dw__close'); if (f) f.focus();
  }
  function closeDrawer(quiet) {
    var d = S.drawer; if (!d) return;
    S.drawer = null;
    if (d.scrim && d.scrim.parentNode) d.scrim.parentNode.removeChild(d.scrim);
    if (d.el && d.el.parentNode) d.el.parentNode.removeChild(d.el);
    setInert(root, false);
    if (!quiet) {
      var c = el.board && el.board.querySelector('.card[data-id="' + d.id + '"]');
      if (c) c.focus({ preventScroll: true }); else if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
  }
  function syncDrawerFromList() {
    var d = S.drawer; if (!d) return;
    var l = byId(d.id); if (!l) return;
    Object.keys(l).forEach(function (k) { if (['yn', 'answers', 'scores', 'events'].indexOf(k) < 0) d.lead[k] = l[k]; });
  }
  function loadDetail(id, keepOpen) {
    return call('GET', '/api/leads/' + id).then(function (r) {
      var d = S.drawer; if (!d || d.id !== id) return;
      testsReady.then(function () {
        if (!S.drawer || S.drawer.id !== id) return;
        var cur = S.drawer.lead, keep = { status: cur.status, rating: cur.rating, client: cur.client, archived: cur.archived };
        S.drawer.lead = Object.assign({}, r.lead, keepOpen ? keep : {}); S.drawer.full = true;
        if (keepOpen) { paintBody(); } else buildDrawer();
      });
    }, function (e) {
      if (e.handled) return;
      var d = S.drawer; if (!d || d.id !== id) return;
      var b = d.el.querySelector('.dw__body'); if (b) { b.textContent = ''; b.appendChild(h('div', { class: 'empty' }, [h('h3', { text: 'Yuklab bölmadi' }), h('p', { text: e.message })])); }
    });
  }
  function patchField(body, okMsg) {
    var d = S.drawer, id = d.id, l = byId(id);
    var oldL = l ? Object.assign({}, l) : null, oldD = Object.assign({}, d.lead);
    Object.keys(body).forEach(function (k) { if (l) l[k] = body[k]; d.lead[k] = body[k]; });
    renderBoard();
    return patchLead(id, body).then(function () {
      if (okMsg) toast(okMsg);
      if (S.drawer && S.drawer.id === id) loadDetail(id, true);
    }, function (e) {
      if (e.handled) return;
      if (l && oldL) Object.keys(body).forEach(function (k) { l[k] = oldL[k]; });
      if (S.drawer && S.drawer.id === id) { S.drawer.lead = oldD; buildDrawer(); }
      renderBoard();
      toast('Saqlab bölmadi: ' + e.message, true);
    });
  }

  function buildDrawer() {
    var d = S.drawer; if (!d) return;
    var l = d.lead, dw = d.el, prevScroll = dw.querySelector('.dw__body') ? dw.querySelector('.dw__body').scrollTop : 0;
    dw.textContent = '';
    var close = h('button', { class: 'btn btn--line btn--icon dw__close', type: 'button', 'aria-label': 'Yopiş' }, [icon('x')]);
    close.addEventListener('click', function () { closeDrawer(); });
    var meta = h('div', { class: 'dw__meta' }, [h('span', { class: 'chip chip--' + (l.vacancy === 'sotuv' ? 'sotuv' : 'hr'), text: VAC_NAME[l.vacancy] || l.vacancy || '' })]);
    typesOf(l).forEach(function (t) { meta.appendChild(h('span', { class: 'chip chip--t', text: TYPE_NAME[t] })); });
    meta.appendChild(h('span', { title: fmtDate(l.created_at), text: fmtDate(l.created_at) + ' · ' + rel(l.created_at) }));
    if (l.archived) meta.appendChild(h('span', { class: 'chip chip--warn', text: 'Arxivda' }));

    var sel = h('select', { class: 'sel', id: 'dw-status' }, COLS.map(function (c) { return h('option', { value: c.id, text: c.t }); }));
    sel.value = l.status;
    sel.addEventListener('change', function () {
      var items = colItems(visibleLeads(), sel.value).filter(function (x) { return x.id !== l.id; });
      var tgt = items[0] || null, pos = calcPos(null, tgt);
      patchField({ status: sel.value, position: pos }, 'Holat özgardi');
    });
    var rg = h('div', { role: 'radiogroup', 'aria-label': 'Baho', class: 'rate', style: 'display:flex;gap:2px' });
    for (var i = 1; i <= 5; i++) (function (n) {
      var b = h('button', { type: 'button', role: 'radio', 'aria-checked': String(l.rating === n), 'aria-label': n + ' yulduz', class: 'btn btn--icon', style: 'padding:6px;border-color:transparent' });
      var sv = doc.createElementNS(NS, 'svg'); sv.setAttribute('viewBox', '0 0 24 24'); sv.setAttribute('aria-hidden', 'true');
      sv.style.cssText = 'width:22px;height:22px;stroke:none;fill:' + ((l.rating && n <= l.rating) ? '#E5A50A' : '#D5D6E3');
      sv.innerHTML = '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>';
      b.appendChild(sv);
      b.addEventListener('click', function () { patchField({ rating: l.rating === n ? null : n }); });
      rg.appendChild(b);
    })(i);
    var client = h('input', { class: 'inp', id: 'dw-client', type: 'text', maxlength: '200', placeholder: 'Kompaniya nomi', value: l.client || '' });
    function saveClient() { var v = client.value.trim(); if (v !== (S.drawer && S.drawer.lead.client || '')) patchField({ client: v }); }
    client.addEventListener('blur', saveClient);
    client.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); client.blur(); } });

    var acts = h('div', { class: 'dw__act' });
    var tg = tgUser(l.telegram);
    if (tg) acts.appendChild(h('a', { class: 'btn btn--line btn--sm', href: 'https://t.me/' + tg, target: '_blank', rel: 'noopener noreferrer' }, [icon('send'), 'Telegram']));
    var tel = telHref(l.phone);
    if (tel) acts.appendChild(h('a', { class: 'btn btn--line btn--sm', href: tel }, [icon('phone'), 'Qönğiroq']));
    if (l.phone) {
      var cp = h('button', { class: 'btn btn--line btn--sm', type: 'button' }, [icon('copy'), 'Raqamni nusxalaş']);
      cp.addEventListener('click', function () { copyText(l.phone); });
      acts.appendChild(cp);
    }
    if (l.has_cv) {
      var cvb = h('button', { class: 'btn btn--line btn--sm', type: 'button' }, [icon('file'), 'Rezyumeni oçiş']);
      cvb.addEventListener('click', function () { openCv(l.id, l.fullname); });
      acts.appendChild(cvb);
    }
    var ab = h('button', { class: 'btn btn--line btn--sm', type: 'button' }, [icon('archive'), l.archived ? 'Arxivdan çiqariş' : 'Arxivga olış']);
    ab.addEventListener('click', function () {
      var to = l.archived ? 0 : 1;
      patchField({ archived: to }, to ? 'Arxivga olindi' : 'Arxivdan çiqarildi').then(function () { if (to && !S.archived) closeDrawer(); });
    });
    acts.appendChild(ab);
    var del = h('button', { class: 'btn btn--danger btn--sm', type: 'button' }, [icon('trash'), 'Öçiriş']);
    del.addEventListener('click', function () {
      confirmBox("Nomzodni öçirişni xohlaysizmi?", (l.fullname || '') + ' va uning barça tarixi, rezyumesi butunlay öçiriladi. Buni ortga qaytarib bölmaydi.', 'Öçiriş').then(function (ok) {
        if (!ok) return;
        call('DELETE', '/api/leads/' + l.id).then(function () {
          S.leads = S.leads.filter(function (x) { return x.id !== l.id; }); closeDrawer(true); renderBoard(); toast('Öçirildi');
        }, function (e) { if (!e.handled) toast(e.message, true); });
      });
    });
    acts.appendChild(del);

    dw.appendChild(h('div', { class: 'dw__head' }, [
      h('div', { class: 'dw__row' }, [h('h2', { class: 'dw__name', id: 'dw-name', text: l.fullname || '—' }), close]),
      meta,
      h('div', { class: 'dw__ctl' }, [
        h('label', { class: 'field', for: 'dw-status' }, [h('span', { text: 'Bosqiç' }), sel]),
        h('div', { class: 'field' }, [h('span', { class: 'lbl', text: 'Baho' }), rg]),
        h('label', { class: 'field field--wide', for: 'dw-client' }, [h('span', { text: 'Qaysi kompaniyaga taqdim etildi' }), client])
      ]),
      h('div', { class: 'dw__contact', style: 'margin-top:12px;font-size:.92rem;color:var(--muted)' }, [
        h('span', { text: l.phone || '—' }), l.telegram ? h('span', { text: '  ·  ' + l.telegram }) : null]),
      acts
    ]));
    dw.appendChild(h('div', { class: 'dw__body' }));
    paintBody();
    var b = dw.querySelector('.dw__body'); if (b && prevScroll) b.scrollTop = prevScroll;
  }

  function secEl(title, kids) { return h('section', { class: 'sec' }, [h('h3', { class: 'sec__h', text: title })].concat(kids)); }
  function paintBody() {
    var d = S.drawer; if (!d) return;
    var body = d.el.querySelector('.dw__body'); if (!body) return;
    var l = d.lead, sc = l.scores, T = TESTS[l.vacancy] || {}, scroll = body.scrollTop;
    body.textContent = '';
    if (!d.full) { body.appendChild(h('div', { class: 'skel', style: 'height:80px;margin-top:16px' })); body.appendChild(h('div', { class: 'skel', style: 'height:140px;margin-top:12px' })); body.appendChild(h('div', { class: 'skel', style: 'height:100px;margin-top:12px' })); return; }

    /* Tarix + eslatma (eng tepada qulay bo'lishi uchun birinchi) */
    var ta = h('textarea', { class: 'inp', id: 'note-t', rows: '3', maxlength: '5000', placeholder: 'Eslatma yozing: qönğiroq natijasi, kelişuv…', 'aria-label': 'Yangi eslatma' });
    var nb = h('button', { class: 'btn btn--red btn--sm', type: 'button', text: 'Saqlaş' });
    function saveNote() {
      var v = ta.value.trim(); if (!v || nb.disabled) return;
      nb.disabled = true; var id = d.id;
      call('POST', '/api/leads/' + id + '/notes', { text: v }).then(function (r) {
        nb.disabled = false; if (!S.drawer || S.drawer.id !== id) return;
        ta.value = ''; var ev = r.event || { at: new Date().toISOString(), type: 'note', text: v };
        S.drawer.lead.events = [ev].concat(S.drawer.lead.events || []); paintHistory(); toast('Eslatma saqlandi');
      }, function (e) { nb.disabled = false; if (!e.handled) toast('Saqlab bölmadi: ' + e.message, true); });
    }
    nb.addEventListener('click', saveNote);
    ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); saveNote(); } });
    var hist = h('section', { class: 'sec', id: 'sec-hist' }, [h('h3', { class: 'sec__h', text: 'Tarix' }),
      h('div', { class: 'noteform' }, [ta, h('div', { class: 'noteform__r' }, [h('small', { text: 'Ctrl/⌘ + Enter — saqlaş' }), nb])]),
      h('ol', { class: 'tl', id: 'tl' })]);

    /* Xulosa */
    var x = xk(l.xulosa);
    var xs = h('div', { class: 'xul xul--' + (x || 'none') }, [h('span', { text: l.xulosa ? toNew(l.xulosa) : 'Ball hisoblanmagan' })]);
    if (l.ball !== null && l.ball !== undefined) xs.appendChild(h('span', { class: 'xul__ball' }, [String(l.ball), h('small', { text: ' / 100' })]));
    var xsec = [xs];
    if (sc && sc.tajribaText !== undefined && sc.tajribaText !== null && l.vacancy) {
      xsec.push(h('p', { class: 'note-izoh', text: 'Tajriba: ' + sc.tajribaText + (l.vacancy === 'hr' ? ' / 6' : '') }));
    }
    if (sc && sc.belgilar && sc.belgilar.length) {
      var ch = h('div', { class: 'chips' }); sc.belgilar.forEach(function (b) { ch.appendChild(h('span', { class: 'chip chip--warn', text: '⚠ ' + toNew(b) })); });
      xsec.push(ch);
    }
    if (sc && sc.izoh) xsec.push(h('p', { class: 'note-izoh', text: 'ℹ ' + toNew(sc.izoh) }));

    var secs = [secEl('Xulosa', xsec)];

    /* Ha/Yo'q */
    var yn = l.yn || {}, ynKeys = Object.keys(yn);
    if (T.yn && T.yn.length) {
      var ul = h('ul', { class: 'yn' }), types = typesOf(l), any = false;
      T.yn.forEach(function (q) {
        if (q.for && types.indexOf(q.for) < 0) return;
        var v = yn[q.id]; if (v === 'ha' || v === 'yoq') any = true;
        ul.appendChild(h('li', { class: v === 'yoq' ? 'is-no' : '' }, [h('span', { class: v === 'ha' ? 'ha' : v === 'yoq' ? 'yoq' : 'na' }, [h('b', { text: v === 'ha' ? 'Ha' : v === 'yoq' ? 'Yöq' : '—' })]), h('span', { text: toNew(q.text) })]));
      });
      if (any) secs.push(secEl('Ha / Yöq javoblar', [ul]));
    } else if (ynKeys.length) {
      var ul2 = h('ul', { class: 'yn' }); ynKeys.forEach(function (k) { ul2.appendChild(h('li', {}, [h('b', { text: yn[k] || '—' }), h('span', { text: k })])); });
      secs.push(secEl('Ha / Yöq javoblar', [ul2]));
    }

    /* Xarakter testi */
    if (sc && sc.sifatlar) {
      var bars = h('div', { class: 'bars' });
      Object.keys(sc.sifatlar).forEach(function (nm) {
        var v = Number(sc.sifatlar[nm]) || 0, cls = v < 3 ? 'bar--low' : v < 4 ? 'bar--mid' : '';
        var fill = h('i'); fill.style.width = Math.max(0, Math.min(100, v / 5 * 100)) + '%';
        bars.appendChild(h('div', { class: 'bar ' + cls }, [h('span', { text: toNew(nm) }), h('div', { class: 'bar__t', role: 'img', 'aria-label': v.toFixed(1) + ' / 5' }, [fill]), h('b', { text: v.toFixed(1) })]));
      });
      secs.push(secEl('Xarakter testi', [bars]));
    }

    /* Bitta savol + xom javoblar */
    var an = l.answers || {}, a2 = [];
    if (an.savol !== undefined) {
      if (T.question && T.question.text) a2.push(h('p', { class: 'ans__q', text: toNew(T.question.text) }));
      a2.push(h('div', { class: 'ans', text: an.savol || '—' }));
    }
    if (an.test && T.test && T.test.items) {
      var ol = h('ol', {});
      T.test.items.forEach(function (it) { ol.appendChild(h('li', {}, [toNew(it[1]), h('b', { text: an.test[it[0]] ? String(an.test[it[0]]) : '—' })])); });
      a2.push(h('details', { class: 'raw' }, [h('summary', { text: 'Xom javoblar (12 ta gap, 1–5)' }), ol]));
    }
    if (a2.length) secs.push(secEl('Bitta savol javobi', a2));
    secs.push(hist);
    secs.forEach(function (s) { body.appendChild(s); });
    paintHistory();
    body.scrollTop = scroll;
  }
  function evText(e) {
    var t = String(e.text || '');
    if (e.type === 'status') return 'Holat: ' + ((COLMAP[e.from_status] || {}).t || e.from_status || '—') + ' → ' + ((COLMAP[e.to_status] || {}).t || e.to_status || '—');
    if (e.type === 'create') return t.indexOf("Qo'lda qo'shildi: ") === 0 ? 'Qölda qöşildi: ' + t.slice(18) : 'Anketa yuborildi';
    if (e.type === 'edit') return t.replace(/^(Ism|Telefon|Telegram) o'zgartirildi: /, '$1 özgartirildi: ');
    return t;
  }
  function paintHistory() {
    var d = S.drawer; if (!d) return;
    var tl = d.el.querySelector('#tl'); if (!tl) return;
    tl.textContent = '';
    (d.lead.events || []).forEach(function (e) {
      tl.appendChild(h('li', { class: 't-' + e.type }, [h('span', { class: 'tl__tx' + (e.type === 'status' ? ' tl__st' : ''), text: evText(e) }), h('span', { class: 'tl__d', title: fmtDate(e.at), text: fmtDate(e.at) + ' · ' + rel(e.at) })]));
    });
    if (!(d.lead.events || []).length) tl.appendChild(h('li', { text: 'Tarix hozirça böş' }));
  }

  /* ---------- amallar ---------- */
  function copyText(t) {
    function done() { toast('Nusxalandi'); }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(done, fallback); } else fallback();
    function fallback() {
      var ta = h('textarea', { style: 'position:fixed;opacity:0' }); ta.value = t; doc.body.appendChild(ta); ta.select();
      try { doc.execCommand('copy'); done(); } catch (e) { toast('Nusxalab bölmadi', true); }
      doc.body.removeChild(ta);
    }
  }
  function openCv(id) {
    var w = null; try { w = window.open('about:blank', '_blank'); } catch (e) {}
    call('GET', '/api/leads/' + id + '/cv', undefined, true).then(function (r) { return r.blob(); }).then(function (b) {
      var url = URL.createObjectURL(b);
      if (w) w.location.href = url; else { var a = h('a', { href: url, target: '_blank', rel: 'noopener' }); doc.body.appendChild(a); a.click(); doc.body.removeChild(a); }
      setTimeout(function () { URL.revokeObjectURL(url); }, 120000);
    }).catch(function (e) { if (w) w.close(); if (!e.handled) toast('Rezyumeni oçib bölmadi' + (e.message ? ': ' + e.message : ''), true); });
  }
  function downloadCsv() {
    call('GET', '/api/export.csv', undefined, true).then(function (r) { return r.blob(); }).then(function (b) {
      var url = URL.createObjectURL(b), a = h('a', { href: url, download: 'nomzodlar.csv' });
      doc.body.appendChild(a); a.click(); doc.body.removeChild(a); setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
    }).catch(function (e) { if (!e.handled) toast('Yuklab bölmadi: ' + e.message, true); });
  }

  /* ---------- modal ---------- */
  function modal(box, onClose) {
    var prev = doc.activeElement, m = h('div', { class: 'modal', role: 'presentation' }, [box]);
    var dwEl = S.drawer && S.drawer.el;
    function close(v) {
      if (m.parentNode) m.parentNode.removeChild(m);
      if (dwEl) setInert(dwEl, false); else setInert(root, false);
      if (S.drawer && S.drawer.scrim) setInert(S.drawer.scrim, false);
      if (prev && prev.focus && doc.contains(prev)) prev.focus();
      if (onClose) onClose(v);
    }
    m.addEventListener('mousedown', function (e) { if (e.target === m) close(null); });
    m.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(null); } });
    if (dwEl) setInert(dwEl, true); else setInert(root, true);
    if (S.drawer && S.drawer.scrim) setInert(S.drawer.scrim, true);
    doc.body.appendChild(m);
    return { el: m, close: close };
  }
  function confirmBox(title, text, okLabel) {
    return new Promise(function (res) {
      var ok = h('button', { class: 'btn btn--red', type: 'button', text: okLabel || 'Ha' });
      var no = h('button', { class: 'btn btn--line', type: 'button', text: 'Bekor qilış' });
      var box = h('div', { class: 'modal__box', role: 'alertdialog', 'aria-modal': 'true', 'aria-labelledby': 'cf-t' }, [h('h2', { id: 'cf-t', text: title }), h('p', { text: text }), h('div', { class: 'modal__act' }, [no, ok])]);
      var m = modal(box, function (v) { res(!!v); });
      ok.addEventListener('click', function () { m.close(true); }); no.addEventListener('click', function () { m.close(false); });
      no.focus();
    });
  }
  function openAdd() {
    var name = h('input', { class: 'inp', id: 'ad-n', type: 'text', maxlength: '200', required: true, autocomplete: 'off' });
    var phone = h('input', { class: 'inp', id: 'ad-p', type: 'tel', maxlength: '50', placeholder: '+998 ', autocomplete: 'off' });
    var tg = h('input', { class: 'inp', id: 'ad-t', type: 'text', maxlength: '100', placeholder: '@username', autocomplete: 'off', autocapitalize: 'none' });
    var vac = h('select', { class: 'inp', id: 'ad-v' }, [h('option', { value: 'hr', text: 'HR mutaxassis' }), h('option', { value: 'sotuv', text: 'Sotuv menejeri' })]);
    if (S.vac) vac.value = S.vac;
    var src = h('input', { class: 'inp', id: 'ad-s', type: 'text', maxlength: '300', placeholder: 'Masalan: Instagram, tavsiya, hh.uz', autocomplete: 'off' });
    var err = h('p', { class: 'msg', role: 'alert', hidden: true });
    var ok = h('button', { class: 'btn btn--red', type: 'submit', text: 'Qöşiş' });
    var no = h('button', { class: 'btn btn--line', type: 'button', text: 'Bekor qilış' });
    var form = h('form', { novalidate: true }, [
      h('h2', { id: 'ad-h', text: 'Nomzod qöşiş' }), h('p', { text: 'Anketa töldirmagan nomzodni qölda qöşiş.' }), err,
      h('label', { class: 'field', for: 'ad-n' }, [h('span', { text: 'Ism familiya *' }), name]),
      h('label', { class: 'field', for: 'ad-p' }, [h('span', { text: 'Telefon' }), phone]),
      h('label', { class: 'field', for: 'ad-t' }, [h('span', { text: 'Telegram' }), tg]),
      h('label', { class: 'field', for: 'ad-v' }, [h('span', { text: 'Vakansiya' }), vac]),
      h('label', { class: 'field', for: 'ad-s' }, [h('span', { text: 'Manba (qayerdan topildi)' }), src]),
      h('div', { class: 'modal__act' }, [no, ok])
    ]);
    var box = h('div', { class: 'modal__box', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ad-h' }, [form]);
    var m = modal(box);
    no.addEventListener('click', function () { m.close(null); });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); err.hidden = true;
      if (name.value.trim().length < 2) { err.textContent = 'Ism familiyani kiriting'; err.hidden = false; name.focus(); return; }
      ok.classList.add('is-loading'); ok.disabled = true;
      call('POST', '/api/leads', { fullname: name.value.trim(), phone: phone.value.trim(), telegram: tg.value.trim(), vacancy: vac.value, source: src.value.trim() }).then(function () {
        m.close(true); toast('Nomzod qöşildi'); S.mob = 'yangi'; refresh();
      }, function (e2) { ok.classList.remove('is-loading'); ok.disabled = false; if (!e2.handled) { err.textContent = e2.message; err.hidden = false; } });
    });
    name.focus();
  }

  /* ---------- umumiy klaviatura ---------- */
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.drawer && !doc.querySelector('.modal') && !drag) { e.preventDefault(); closeDrawer(); }
  });
  var mqh = function () { if (el.board) renderBoard(); };
  if (mq.addEventListener) mq.addEventListener('change', mqh); else if (mq.addListener) mq.addListener(mqh);

  /* ---------- boshlash ---------- */
  if (!API) showSetup();
  else if (token) showApp();
  else showLogin('');
})();
