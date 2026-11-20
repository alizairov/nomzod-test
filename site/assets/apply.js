/* Vakansiya arizasi — ko'p bosqichli forma (umumiy mexanizm).
   Savollar window.VACANCY_TEST dan olinadi, vakansiya turi formadagi data-vacancy atributidan.
   Baholash bu yerda YO'Q: javoblar serverga xom holda yuboriladi. Matnlar eski lotin alifbosida. */
(function () {
  'use strict';
  var doc = document;
  var form = doc.getElementById('apply-form');
  var T = window.VACANCY_TEST;
  if (!form || !T) return;

  var VAC = form.getAttribute('data-vacancy') || T.id || 'hr';
  var KEY = 'nmzd-apply-' + VAC + '-v2';
  var cfg = window.NOMZOD_CONFIG || {};
  var DEMO = /(?:^|[?&])demo=1(?:&|$)/.test(location.search);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var S = { INTRO: 0, PROFILE: 1, LOGIC: 2, DAILY: 3, VAL: 4, OPEN: 5, DONE: 6 };
  var PARTS = 5;
  var PART_NAMES = ['', "Ma'lumotlar", 'Mantiqiy fikrlash', 'Kundalik vaziyatlar', "O'zingiz haqingizda", 'Ochiq savollar'];
  var MIN_OPEN = 40;
  var TG = 'https://t.me/ali_zairov';

  function $(id) { return doc.getElementById(id); }
  function h(tag, attrs, kids) {
    var e = doc.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'class') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? doc.createTextNode(c) : c); });
    return e;
  }

  /* ---------- holat (localStorage) ---------- */
  function newState() {
    return { v: 2, step: S.INTRO, q: 0, seed: (Math.random() * 4294967296) >>> 0, startedAt: 0,
      profile: {}, logic: {}, daily: {}, ms: {}, order: {}, values: [], stmt: {}, open: {}, consent: false };
  }
  var restored = false;
  var state = (function () {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.v === 2 && typeof s.step === 'number' && s.step >= 0 && s.step < S.DONE) {
          var base = newState();
          Object.keys(base).forEach(function (k) { if (s[k] === undefined || s[k] === null) s[k] = base[k]; });
          restored = s.step > S.INTRO;
          return s;
        }
      }
    } catch (e) {}
    return newState();
  })();
  var finished = false;
  function save() {
    if (finished) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function clearSaved() { try { localStorage.removeItem(KEY); } catch (e) {} }

  /* ---------- tasodifiy tartib (urug' bilan) ---------- */
  function hashStr(s) { var x = 2166136261; for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function orderIds(key, ids) {
    var cur = state.order[key];
    var ok = Array.isArray(cur) && cur.length === ids.length && ids.every(function (id) { return cur.indexOf(id) >= 0; });
    if (!ok) {
      var r = rng(state.seed ^ hashStr(key)), a = ids.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      state.order[key] = a;
    }
    return state.order[key];
  }

  /* ---------- vaqt hisobi (har bir vaziyat uchun) ---------- */
  var timing = null;
  function startTimer(sid) { stopTimer(); if (!doc.hidden) timing = { sid: sid, t0: Date.now() }; }
  function stopTimer() {
    if (!timing) return;
    state.ms[timing.sid] = (state.ms[timing.sid] || 0) + (Date.now() - timing.t0);
    timing = null;
    save();
  }
  doc.addEventListener('visibilitychange', function () {
    if (doc.hidden) stopTimer();
    else if (isItemStep(state.step) && !finished) startTimer(curItem().id);
  });
  window.addEventListener('pagehide', function () { stopTimer(); });

  /* ---------- umumiy: xato ko'rsatish ---------- */
  function setErr(name, msg) {
    var el = form.querySelector('.err[data-for="' + name + '"]');
    if (!el) return;
    el.textContent = msg;
    var f = el.closest('.field');
    if (!f) return;
    f.classList.toggle('invalid', !!msg);
    Array.prototype.forEach.call(f.querySelectorAll('input:not([type=radio]):not([type=checkbox]),textarea'), function (i) {
      i.setAttribute('aria-invalid', msg ? 'true' : 'false');
    });
  }
  function wireErrIds() {
    Array.prototype.forEach.call(form.querySelectorAll('.err[data-for]'), function (el) {
      var f = el.closest('.field'); if (!f) return;
      if (!el.id) el.id = 'err-' + el.getAttribute('data-for');
      var t = f.tagName === 'FIELDSET' ? f : f.querySelector('input:not([type=radio]):not([type=checkbox]),textarea,input[type=checkbox]');
      if (t) t.setAttribute('aria-describedby', ((t.getAttribute('aria-describedby') || '') + ' ' + el.id).trim());
    });
  }
  function focusFirstInvalid() {
    var f = form.querySelector('.wz__step:not([hidden]) .field.invalid');
    if (!f) return;
    var c = f.querySelector('input,textarea,button');
    f.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    if (c) c.focus({ preventScroll: true });
  }
  // foydalanuvchi tuzatganda xato yo'qoladi
  form.addEventListener('input', clearErrOnEdit);
  form.addEventListener('change', clearErrOnEdit);
  function clearErrOnEdit(e) {
    var f = e.target.closest && e.target.closest('.field.invalid');
    if (!f) return;
    var er = f.querySelector('.err[data-for]');
    if (er) setErr(er.getAttribute('data-for'), '');
  }

  /* ---------- 1-bosqich: ma'lumotlar ---------- */
  var profSec = form.querySelector('.wz__step[data-step="1"]');
  var phone = $('a-phone');
  function formatPhone(raw) {
    var d = raw.replace(/\D/g, '');
    if (d.indexOf('998') === 0) d = d.slice(3);
    d = d.slice(0, 9);
    var out = '+998 ';
    if (d.length) out += d.slice(0, 2);
    if (d.length > 2) out += ' ' + d.slice(2, 5);
    if (d.length > 5) out += ' ' + d.slice(5, 7);
    if (d.length > 7) out += ' ' + d.slice(7, 9);
    return out;
  }
  phone.addEventListener('input', function () { phone.value = formatPhone(phone.value); });
  phone.addEventListener('focus', function () { if (!phone.value) phone.value = '+998 '; });
  phone.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && phone.value.length <= 5) e.preventDefault(); });

  /* rezyume fayli: xotirada saqlanadi (localStorage'ga sig'maydi) */
  var CV_MAX = 5 * 1024 * 1024, CV_EXT = /\.(pdf|docx?|jpe?g|png)$/i;
  var cvInput = $('a-cvfile'), cvNameEl = $('a-cv-name'), cvData = null;
  function paintCv() {
    var f = cvInput.closest('.field');
    if (cvData) { cvNameEl.textContent = cvData.name; f.classList.add('has-file'); }
    else if (state.profile.cv_name) { cvNameEl.textContent = 'Faylni qayta tanlang: ' + state.profile.cv_name; f.classList.remove('has-file'); }
    else { cvNameEl.textContent = 'Faylni tanlang'; f.classList.remove('has-file'); }
  }
  cvInput.addEventListener('change', function () {
    var file = cvInput.files && cvInput.files[0];
    if (!file) return;
    if (!CV_EXT.test(file.name)) { cvData = null; paintCv(); setErr('cv', 'Faqat PDF, Word yoki rasm (JPG, PNG) fayl yuklang'); return; }
    if (file.size > CV_MAX) { cvData = null; paintCv(); setErr('cv', 'Fayl hajmi 5 MB dan oshmasin'); return; }
    var r = new FileReader();
    r.onload = function () {
      var url = String(r.result || '');
      cvData = { name: file.name, mime: file.type || 'application/octet-stream', b64: url.slice(url.indexOf(',') + 1) };
      state.profile.cv_name = file.name; save(); setErr('cv', ''); paintCv();
    };
    r.onerror = function () { cvData = null; paintCv(); setErr('cv', "Faylni o'qib bo'lmadi, boshqa fayl tanlang"); };
    r.readAsDataURL(file);
  });

  var profNames = [];
  Array.prototype.forEach.call(profSec.querySelectorAll('[name]'), function (el) {
    if (profNames.indexOf(el.name) < 0) profNames.push(el.name);
  });
  function getVal(name) {
    var els = profSec.querySelectorAll('[name="' + name + '"]');
    if (!els.length) return '';
    var t = els[0].type;
    if (t === 'checkbox') {
      return Array.prototype.filter.call(els, function (e) { return e.checked; }).map(function (e) { return e.value; });
    }
    if (t === 'radio') {
      var c = Array.prototype.filter.call(els, function (e) { return e.checked; })[0];
      return c ? c.value : '';
    }
    return els[0].value;
  }
  function setVal(name, v) {
    var els = profSec.querySelectorAll('[name="' + name + '"]');
    if (!els.length || v === undefined) return;
    var t = els[0].type;
    if (t === 'checkbox') Array.prototype.forEach.call(els, function (e) { e.checked = (v || []).indexOf(e.value) >= 0; });
    else if (t === 'radio') Array.prototype.forEach.call(els, function (e) { e.checked = (e.value === v); });
    else els[0].value = v;
  }
  function readProfile() { profNames.forEach(function (n) { state.profile[n] = getVal(n); }); }
  profSec.addEventListener('input', function () { readProfile(); save(); });
  profSec.addEventListener('change', function () { readProfile(); save(); });
  profNames.forEach(function (n) { if (n in state.profile) setVal(n, state.profile[n]); });
  paintCv();
  phone.value = formatPhone(phone.value || '');

  function validateProfile() {
    var first = null;
    function bad(name, msg) { setErr(name, msg); if (msg && !first) first = name; }
    Array.prototype.forEach.call(profSec.querySelectorAll('.field'), function (f) {
      var er = f.querySelector('.err[data-for]'); if (!er) return;
      var name = er.getAttribute('data-for'), v = name === 'cv' ? (cvData ? cvData.name : '') : getVal(name);
      var req = f.hasAttribute('data-req');
      var empty = Array.isArray(v) ? !v.length : !String(v).trim();
      var msg = '';
      if (req && empty) msg = name === 'cv' ? (state.profile.cv_name ? 'Sahifa qayta ochilgani uchun rezyumeni qayta yuklang' : 'Rezyumeingizni yuklang')
        : (f.tagName === 'FIELDSET') ? 'Variantlardan birini tanlang' : "Maydonni to'ldiring";
      if (!msg && !empty) {
        v = String(v).trim();
        if (name === 'fullname' && v.length < 3) msg = 'Ism va familiyangizni kiriting';
        else if (name === 'phone') {
          var d = v.replace(/\D/g, '');
          if (!(d.length === 12 && d.indexOf('998') === 0)) msg = "Telefon raqamni to'liq kiriting";
        }
      }
      bad(name, msg);
    });
    return first;
  }

  /* ---------- 2–3-bosqich: mantiqiy fikrlash va kundalik vaziyatlar (bittadan) ---------- */
  var SEC = {};
  SEC[S.LOGIC] = { key: 'logic', box: $('wz-logic'), label: 'Savol', data: T.logic };
  SEC[S.DAILY] = { key: 'daily', box: $('wz-daily'), label: 'Vaziyat', data: T.daily };
  function isItemStep(n) { return n === S.LOGIC || n === S.DAILY; }
  function curSec() { return SEC[state.step]; }
  function curItems() { return curSec().data.items; }
  function curItem() { return curItems()[state.q]; }
  function itemDone(sec, id) {
    var a = state[sec.key][id];
    return !!(a && sec.data.items.some(function (it) {
      return it.id === id && it.options.some(function (o) { return o.id === a.pick; });
    }));
  }
  function firstIncomplete(sec) {
    var it = sec.data.items;
    for (var i = 0; i < it.length; i++) if (!itemDone(sec, it[i].id)) return i;
    return -1;
  }
  function renderItem() {
    var sec = curSec(), it = curItem(), n = curItems().length, box = sec.box;
    var byId = {}; it.options.forEach(function (o) { byId[o.id] = o; });
    var order = orderIds(it.id, it.options.map(function (o) { return o.id; }));
    var cur = state[sec.key][it.id] && state[sec.key][it.id].pick;
    box.textContent = '';
    box.appendChild(h('h3', { class: 'wz__h', text: sec.data.title }));
    box.appendChild(h('p', { class: 'wz__ins', text: sec.data.intro }));
    box.appendChild(h('div', { class: 'sit' }, [
      h('p', { class: 'sit__n', text: sec.label + ' ' + (state.q + 1) + ' / ' + n }),
      h('p', { class: 'sit__text', id: 'item-text', tabindex: '-1', text: it.text })
    ]));
    var grp = h('div', { class: 'ropts', role: 'radiogroup', 'aria-labelledby': 'item-text' });
    order.forEach(function (oid) {
      var inp = h('input', { type: 'radio', name: 'pick_' + it.id, value: oid });
      if (cur === oid) inp.checked = true;
      grp.appendChild(h('label', { class: 'ropt' }, [inp, h('span', { text: byId[oid].text })]));
    });
    box.appendChild(grp);
  }
  [S.LOGIC, S.DAILY].forEach(function (st) {
    var sec = SEC[st];
    sec.box.addEventListener('change', function (e) {
      var i = e.target; if (!i || i.type !== 'radio') return;
      var id = curItem().id;
      state[sec.key][id] = { pick: i.value };
      save(); updateNav();
    });
  });
  function gotoItem(q, dir) {
    stopTimer();
    state.q = q;
    renderItem(); startTimer(curItem().id);
    animate(curSec().box); updateProgress(); updateNav(); save(); toTop();
    $('item-text').focus({ preventScroll: true });
  }

  /* ---------- 4-bosqich (a): qadriyatlar tartibi ---------- */
  var valBox = $('wz-values');
  var NV = T.values.items.length;
  var vById = {}; T.values.items.forEach(function (v) { vById[v.id] = v; });
  function cleanValues() {
    var seen = {};
    state.values = (state.values || []).filter(function (id) { if (!vById[id] || seen[id]) return false; seen[id] = 1; return true; });
  }
  cleanValues();
  function renderValues(focusVid) {
    valBox.textContent = '';
    var ranked = state.values;
    valBox.appendChild(h('h4', { class: 'vals__h', text: T.values.title }));
    valBox.appendChild(h('p', { class: 'wz__ins', text: T.values.intro }));
    valBox.appendChild(h('p', { class: 'vals__lbl', id: 'vals-lbl' }, [
      'Sizning tartibingiz ', h('span', { class: 'vals__cnt', 'aria-live': 'polite', text: '(' + ranked.length + ' / ' + NV + ')' })
    ]));
    var ol = h('ol', { class: 'vals__rank', 'aria-labelledby': 'vals-lbl' });
    if (!ranked.length) ol.appendChild(h('li', { class: 'vals__empty', text: "Pastdagilardan eng muhimini birinchi bosing" }));
    ranked.forEach(function (vid, i) {
      ol.appendChild(h('li', {}, [h('button', {
        type: 'button', class: 'vchip is-ranked', 'data-vid': vid, 'aria-pressed': 'true',
        'aria-label': (i + 1) + '-o\'rin: ' + vById[vid].text + '. Olib tashlash uchun bosing (undan keyingilar ham olib tashlanadi)'
      }, [h('span', { class: 'vchip__n', 'aria-hidden': 'true', text: String(i + 1) }), h('span', { text: vById[vid].text })])]));
    });
    valBox.appendChild(ol);
    var rest = orderIds('values', T.values.items.map(function (v) { return v.id; })).filter(function (id) { return ranked.indexOf(id) < 0; });
    if (rest.length) {
      valBox.appendChild(h('p', { class: 'vals__lbl', text: 'Tanlanmaganlar — keyingisini bosing' }));
      var ul = h('ul', { class: 'vals__pool' });
      rest.forEach(function (vid) {
        ul.appendChild(h('li', {}, [h('button', {
          type: 'button', class: 'vchip', 'data-vid': vid, 'aria-pressed': 'false',
          'aria-label': vById[vid].text + ". Tanlash — " + (ranked.length + 1) + "-o'rin bo'ladi"
        }, [h('span', { text: vById[vid].text })])]));
      });
      valBox.appendChild(ul);
    }
    if (ranked.length) valBox.appendChild(h('button', { type: 'button', class: 'linkbtn', id: 'vals-reset', text: 'Qaytadan' }));
    valBox.appendChild(h('small', { class: 'err', 'data-for': 'values', id: 'err-values' }));
    if (focusVid) { var b = valBox.querySelector('[data-vid="' + focusVid + '"]'); if (b) b.focus({ preventScroll: true }); }
  }
  valBox.addEventListener('click', function (e) {
    var rs = e.target.closest('#vals-reset');
    if (rs) { state.values = []; save(); setErr('values', ''); renderValues(); return; }
    var b = e.target.closest('.vchip'); if (!b) return;
    var vid = b.getAttribute('data-vid'), i = state.values.indexOf(vid);
    if (i < 0) state.values.push(vid); else state.values = state.values.slice(0, i);
    save(); setErr('values', '');
    renderValues(vid);
  });
  function validateValues() {
    var ok = state.values.length === NV;
    setErr('values', ok ? '' : "Hammasini tartibga qo'ying (hozir " + state.values.length + " / " + NV + ')');
    return ok ? null : 'values';
  }

  /* ---------- 4-bosqich (b): ha / yo'q ---------- */
  var stmtBox = $('wz-stmt');
  renderValues();
  T.statements.forEach(function (s) {
    var name = 'stmt_' + s.id;
    stmtBox.appendChild(h('fieldset', { class: 'field pills stmt' }, [
      h('legend', { text: s.text }),
      h('label', {}, [h('input', { type: 'radio', name: name, value: 'ha' }), h('span', { text: 'Ha, menga xos' })]),
      h('label', {}, [h('input', { type: 'radio', name: name, value: 'yoq' }), h('span', { text: "Yo'q" })]),
      h('small', { class: 'err', 'data-for': name })
    ]));
  });
  stmtBox.addEventListener('change', function (e) {
    var i = e.target; if (!i.name || i.name.indexOf('stmt_') !== 0) return;
    state.stmt[i.name.slice(5)] = i.value; save();
  });
  T.statements.forEach(function (s) {
    var v = state.stmt[s.id];
    if (v) { var r = stmtBox.querySelector('input[name="stmt_' + s.id + '"][value="' + v + '"]'); if (r) r.checked = true; }
  });
  function validateStmt() {
    var first = null;
    T.statements.forEach(function (s) {
      var ok = state.stmt[s.id] === 'ha' || state.stmt[s.id] === 'yoq';
      setErr('stmt_' + s.id, ok ? '' : 'Birini tanlang');
      if (!ok && !first) first = s.id;
    });
    return first;
  }

  /* ---------- 5-bosqich: ochiq savollar ---------- */
  var openBox = $('wz-open');
  function countText(n) { return n >= MIN_OPEN ? n + ' ta belgi' : n + ' / kamida ' + MIN_OPEN + ' ta belgi'; }
  T.open.forEach(function (q, i) {
    var name = 'open_' + q.id, tid = 'o-' + q.id;
    var ta = h('textarea', { id: tid, name: name, rows: '6', maxlength: '3000', 'aria-describedby': tid + '-hint ' + tid + '-cnt' });
    ta.value = state.open[q.id] || '';
    var cnt = h('small', { class: 'count', id: tid + '-cnt', text: countText(ta.value.trim().length) });
    ta.addEventListener('input', function () {
      state.open[q.id] = ta.value; save();
      var n = ta.value.trim().length;
      cnt.textContent = countText(n);
      cnt.classList.toggle('ok', n >= MIN_OPEN);
    });
    cnt.classList.toggle('ok', ta.value.trim().length >= MIN_OPEN);
    openBox.appendChild(h('div', { class: 'field' }, [
      h('label', { for: tid, text: (i + 1) + '. ' + q.text }),
      q.hint ? h('small', { class: 'hint', id: tid + '-hint', text: q.hint }) : h('small', { class: 'hint', id: tid + '-hint' }),
      ta, cnt,
      h('small', { class: 'err', 'data-for': name })
    ]));
  });
  var consent = $('a-consent');
  consent.checked = !!state.consent;
  consent.addEventListener('change', function () { state.consent = consent.checked; save(); });
  function validateOpen() {
    var first = null;
    T.open.forEach(function (q) {
      var n = (state.open[q.id] || '').trim().length;
      setErr('open_' + q.id, n >= MIN_OPEN ? '' : 'Kamida ' + MIN_OPEN + ' ta belgi yozing (hozir ' + n + ' ta)');
      if (n < MIN_OPEN && !first) first = q.id;
    });
    setErr('consent', consent.checked ? '' : 'Davom etish uchun rozilik bering');
    if (!consent.checked && !first) first = 'consent';
    return first;
  }

  /* ---------- navigatsiya ---------- */
  var secs = Array.prototype.slice.call(form.querySelectorAll('.wz__step'));
  var progress = $('wz-progress'), bar = $('wz-bar'), plabel = $('wz-label');
  var nav = $('wz-nav'), back = $('wz-back'), next = $('wz-next'), nextT = $('wz-next-t');
  var errBox = $('wz-error'), note = $('wz-restored');

  function partOf(n) { return n >= S.PROFILE && n <= S.OPEN ? n : 0; }
  function updateProgress() {
    var n = state.step, p = partOf(n);
    progress.hidden = !p;
    if (!p) return;
    var within = isItemStep(n) ? state.q / curItems().length : 0;
    var pct = Math.max(4, Math.round((p - 1 + within) / PARTS * 100));
    bar.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', String(pct));
    plabel.textContent = 'Qism ' + p + '/' + PARTS + ' — ' + PART_NAMES[p] + (isItemStep(n) ? ' · ' + (state.q + 1) + '/' + curItems().length : '');
  }
  function updateNav() {
    var n = state.step, show = n >= S.PROFILE && n <= S.OPEN;
    nav.hidden = !show;
    if (!show) return;
    nextT.textContent = n === S.OPEN ? 'Arizani yuborish' : 'Keyingi';
    next.disabled = (isItemStep(n) && !itemDone(curSec(), curItem().id)) || submitting;
  }
  function animate(el) {
    if (reduce || !el) return;
    el.classList.remove('wz-in'); void el.offsetWidth; el.classList.add('wz-in');
  }
  function toTop() { form.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); }

  function show(n, o) {
    o = o || {};
    stopTimer();
    state.step = n;
    errBox.hidden = true;
    if (o.manual) note.hidden = true;
    secs.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
    if (isItemStep(n)) {
      var nn = curItems().length;
      if (o.q === 'last') state.q = nn - 1; else if (typeof o.q === 'number') state.q = o.q;
      if (!(state.q >= 0 && state.q < nn)) state.q = 0;
      renderItem(); startTimer(curItem().id);
    }
    var sec = form.querySelector('.wz__step[data-step="' + n + '"]');
    animate(sec);
    updateProgress(); updateNav();
    save();
    if (!o.quiet) {
      toTop();
      var f = isItemStep(n) ? $('item-text') : sec.querySelector('[data-focus]');
      if (f) f.focus({ preventScroll: true });
    }
  }

  function goBack() {
    var n = state.step;
    if (isItemStep(n) && state.q > 0) { gotoItem(state.q - 1); return; }
    show(n - 1, { manual: true, q: 'last' });
  }

  var submitting = false;
  function goNext() {
    if (submitting) return;
    var n = state.step, first;
    if (n === S.PROFILE) {
      readProfile();
      if (validateProfile()) { focusFirstInvalid(); return; }
      show(S.LOGIC, { manual: true, q: 0 });
    } else if (isItemStep(n)) {
      if (!itemDone(curSec(), curItem().id)) return;
      stopTimer();
      if (state.q < curItems().length - 1) gotoItem(state.q + 1);
      else show(n === S.LOGIC ? S.DAILY : S.VAL, { manual: true, q: 0 });
    } else if (n === S.VAL) {
      var fv = validateValues(), fs = validateStmt();
      if (fv || fs) { focusFirstInvalid(); return; }
      show(S.OPEN, { manual: true });
    } else if (n === S.OPEN) {
      first = validateOpen();
      if (first) { focusFirstInvalid(); return; }
      submit();
    }
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); if (state.step >= S.PROFILE && state.step <= S.OPEN) goNext(); });
  back.addEventListener('click', goBack);
  $('wz-start').addEventListener('click', function () {
    if (!state.startedAt) state.startedAt = Date.now();
    show(S.PROFILE, { manual: true });
  });
  $('wz-reset').addEventListener('click', function () {
    if (!window.confirm("Barcha kiritilgan javoblar o'chiriladi va ariza boshidan boshlanadi. Davom etasizmi?")) return;
    clearSaved();
    location.reload();
  });

  /* ---------- yuborish ---------- */
  function tgLink() { return '<a href="' + TG + '" target="_blank" rel="noopener"><span data-noconv>@ali_zairov</span></a>'; }
  function showErr(kind) {
    submitting = false; next.classList.remove('is-loading'); updateNav();
    errBox.innerHTML = kind === 'config'
      ? "Ariza qabul qilish tizimi hozir sozlanmoqda. Iltimos, birozdan keyin qayta urinib ko'ring yoki Telegram orqali yozing: " + tgLink() + '. Javoblaringiz shu qurilmada saqlab qo\'yildi.'
      : "Arizani yuborib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring yoki Telegram orqali yozing: " + tgLink() + '. Javoblaringiz shu qurilmada saqlab qo\'yildi.';
    errBox.hidden = false;
    errBox.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }
  function finish() {
    finished = true; submitting = false; clearSaved();
    show(S.DONE);
  }
  function buildPayload() {
    function pack(sec) {
      var o = {};
      SEC[sec].data.items.forEach(function (it) {
        var a = state[SEC[sec].key][it.id] || {};
        o[it.id] = { pick: a.pick || '', ms: Math.round(state.ms[it.id] || 0) };
      });
      return o;
    }
    var open = {};
    T.open.forEach(function (q) { open[q.id] = (state.open[q.id] || '').trim(); });
    var p = new URLSearchParams();
    p.set('vacancy', VAC);
    p.set('vacancy_title', T.title || VAC);
    profNames.forEach(function (n) {
      if (n === 'website') return;
      var v = getVal(n);
      if (Array.isArray(v)) v = v.join(', ');
      v = String(v).trim();
      p.set(n, v);
    });
    if (cvData) { p.set('cv_name', cvData.name); p.set('cv_mime', cvData.mime); p.set('cv_b64', cvData.b64); }
    p.set('answers', JSON.stringify({ logic: pack(S.LOGIC), daily: pack(S.DAILY), values: state.values.slice(), statements: state.stmt, open: open }));
    p.set('total_ms', String(state.startedAt ? Math.max(0, Date.now() - state.startedAt) : 0));
    p.set('page', location.href);
    p.set('ua', String(navigator.userAgent || '').slice(0, 200));
    return p;
  }
  function submit() {
    // hamma bosqichlarni qayta tekshiramiz (masalan, savollar o'zgargan bo'lsa)
    stopTimer(); readProfile();
    if (validateProfile()) { show(S.PROFILE); focusFirstInvalid(); return; }
    var i = firstIncomplete(SEC[S.LOGIC]);
    if (i >= 0) { show(S.LOGIC, { q: i }); return; }
    i = firstIncomplete(SEC[S.DAILY]);
    if (i >= 0) { show(S.DAILY, { q: i }); return; }
    if (validateValues() || validateStmt()) { show(S.VAL); focusFirstInvalid(); return; }
    if (validateOpen()) { show(S.OPEN); focusFirstInvalid(); return; }

    var hp = form.elements.website;
    if (hp && hp.value) { finish(); return; } // bot: yubormaymiz

    var payload = buildPayload();
    if (DEMO) {
      var o = {}; payload.forEach(function (v, k) { o[k] = v; });
      console.log('[demo] cv:', o.cv_name, o.cv_mime, o.cv_b64 ? o.cv_b64.length : 0); console.log('[demo] ariza ma\'lumotlari:', o);
      if (o.cv_b64) o.cv_b64 = '(' + o.cv_b64.length + ' belgi)';
      try { console.log('[demo] answers:', JSON.parse(o.answers)); } catch (e) {}
      finish(); return;
    }
    if (!cfg.vacancyEndpoint) { showErr('config'); return; }
    submitting = true; next.disabled = true; next.classList.add('is-loading');
    fetch(cfg.vacancyEndpoint, { method: 'POST', mode: 'no-cors', body: payload })
      .then(finish)
      .catch(function () { showErr('net'); });
  }

  /* ---------- ishga tushirish ---------- */
  wireErrIds();
  if (isItemStep(state.step) && !(state.q >= 0 && state.q < curItems().length)) state.q = 0;
  if (restored) note.hidden = false;
  show(state.step, { quiet: true });
})();
