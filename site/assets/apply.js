/* Vakansiya arizasi — 3 qadamli anketa (umumiy mexanizm). Turon Montessori anketasi formatida.
   Savollar window.VACANCY_TEST dan olinadi, vakansiya turi formadagi data-vacancy atributidan.
   Baholash bu yerda YO'Q: javoblar serverga xom holda yuboriladi. Matnlar eski lotin alifbosida. */
(function () {
  'use strict';
  var doc = document;
  var form = doc.getElementById('apply-form');
  var T = window.VACANCY_TEST;
  if (!form || !T) return;

  var VAC = form.getAttribute('data-vacancy') || T.id || 'hr';
  var KEY = 'nmzd-apply-' + VAC + '-v3';
  var cfg = window.NOMZOD_CONFIG || {};
  var DEMO = /(?:^|[?&])demo=1(?:&|$)/.test(location.search);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var S = { INTRO: 0, PROFILE: 1, TEST: 2, SAVOL: 3, DONE: 4 };
  var PARTS = 3;
  var PART_NAMES = ['', 'Tanishuv', 'Xarakter testi', 'Bitta savol'];
  var MIN_SENT = 3, MIN_CHARS = 80;
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
    return { v: 3, step: S.INTRO, startedAt: 0, profile: {}, test: {}, savol: '', consent: false };
  }
  var restored = false;
  var state = (function () {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.v === 3 && typeof s.step === 'number' && s.step >= 0 && s.step < S.DONE) {
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

  /* ---------- 2-bosqich: xarakter testi (1–5 shkala) ---------- */
  var testBox = $('wz-test');
  var TI = T.test.items, SC = T.test.scale;
  function testDone(id) { return /^[1-5]$/.test(String(state.test[id] || '')); }
  function firstUnanswered() {
    for (var i = 0; i < TI.length; i++) if (!testDone(TI[i][0])) return TI[i][0];
    return null;
  }
  function renderTest() {
    testBox.textContent = '';
    testBox.appendChild(h('h3', { class: 'wz__h', 'data-focus': '', tabindex: '-1', text: T.test.title }));
    testBox.appendChild(h('p', { class: 'wz__ins', text: T.test.note }));
    var ol = h('ol', { class: 'tst' });
    TI.forEach(function (it, i) {
      var id = it[0], qid = 'tq-' + id;
      var scale = h('div', { class: 'tst__scale' });
      SC.forEach(function (s) {
        var inp = h('input', { type: 'radio', name: 'test_' + id, value: s[0], 'aria-label': s[1] });
        if (String(state.test[id]) === s[0]) inp.checked = true;
        scale.appendChild(h('label', { class: 'tst__sc', title: s[1] }, [inp, h('span')]));
      });
      ol.appendChild(h('li', { class: 'tst__i', id: 'ti-' + id, role: 'radiogroup', 'aria-labelledby': qid }, [
        h('p', { class: 'tst__q', id: qid }, [h('span', { class: 'tst__n', text: String(i + 1) }), it[1]]),
        scale,
        h('div', { class: 'tst__lg', 'aria-hidden': 'true' }, [h('span', { text: T.test.lo }), h('span', { text: T.test.hi })])
      ]));
    });
    testBox.appendChild(ol);
  }
  testBox.addEventListener('change', function (e) {
    var i = e.target; if (!i || i.type !== 'radio') return;
    var id = i.name.slice(5);
    state.test[id] = i.value;
    var li = $('ti-' + id); if (li) li.classList.remove('is-bad');
    if (!firstUnanswered()) errBox.hidden = true;
    save();
  });
  function validateTest() {
    var first = null;
    TI.forEach(function (it) {
      var li = $('ti-' + it[0]), ok = testDone(it[0]);
      if (li) li.classList.toggle('is-bad', !ok);
      if (!ok && !first) first = it[0];
    });
    return first;
  }

  /* ---------- 3-bosqich: bitta savol ---------- */
  var savolBox = $('wz-savol');
  var ta = h('textarea', { id: 'a-savol', name: 'savol', rows: '7', maxlength: '3000', 'aria-describedby': 'a-savol-hint a-savol-cnt' });
  var cnt = h('small', { class: 'count', id: 'a-savol-cnt', 'aria-live': 'polite' });
  var savolField = h('div', { class: 'field', 'data-req': '' }, [
    h('label', { for: 'a-savol', text: T.question.text }),
    h('small', { class: 'hint', id: 'a-savol-hint', text: T.question.hint }),
    ta, cnt,
    h('small', { class: 'err', 'data-for': 'savol' })
  ]);
  savolBox.insertBefore(h('h3', { class: 'wz__h', 'data-focus': '', tabindex: '-1', text: T.question.title }), savolBox.firstChild);
  savolBox.insertBefore(savolField, savolBox.querySelector('.field--consent'));
  function sentences(t) {
    return String(t || '').split(/[.!?]+/).filter(function (s) { return s.replace(/\s/g, '').length >= 3; }).length;
  }
  function paintCount() {
    var n = sentences(ta.value);
    cnt.textContent = n + ' ta jumla' + (n >= MIN_SENT ? ' · yaxshi' : '');
    cnt.classList.toggle('ok', n >= MIN_SENT);
  }
  ta.value = state.savol || '';
  paintCount();
  ta.addEventListener('input', function () { state.savol = ta.value; paintCount(); save(); });
  var consent = $('a-consent');
  consent.checked = !!state.consent;
  consent.addEventListener('change', function () { state.consent = consent.checked; save(); });
  function validateSavol() {
    var v = ta.value.trim(), first = null;
    var short = sentences(v) < MIN_SENT || v.length < MIN_CHARS;
    setErr('savol', short ? 'Javobingizni biroz kengroq yozing (kamida 3 jumla).' : '');
    if (short) first = 'savol';
    setErr('consent', consent.checked ? '' : 'Davom etish uchun rozilik bering');
    if (!consent.checked && !first) first = 'consent';
    return first;
  }

  /* ---------- navigatsiya ---------- */
  var secs = Array.prototype.slice.call(form.querySelectorAll('.wz__step'));
  var progress = $('wz-progress'), bar = $('wz-bar'), plabel = $('wz-label');
  var nav = $('wz-nav'), back = $('wz-back'), next = $('wz-next'), nextT = $('wz-next-t');
  var errBox = $('wz-error'), note = $('wz-restored');

  function partOf(n) { return n >= S.PROFILE && n <= S.SAVOL ? n : 0; }
  function updateProgress() {
    var p = partOf(state.step);
    progress.hidden = !p;
    if (!p) return;
    var pct = Math.round(p / PARTS * 100);
    bar.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', String(pct));
    plabel.textContent = 'Qadam ' + p + '/' + PARTS + ' — ' + PART_NAMES[p];
  }
  function updateNav() {
    var n = state.step, show = n >= S.PROFILE && n <= S.SAVOL;
    nav.hidden = !show;
    if (!show) return;
    nextT.textContent = n === S.SAVOL ? 'Anketani yuborish' : 'Keyingi';
    next.disabled = submitting;
  }
  function animate(el) {
    if (reduce || !el) return;
    el.classList.remove('wz-in'); void el.offsetWidth; el.classList.add('wz-in');
  }
  function toTop() { form.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); }

  function show(n, o) {
    o = o || {};
    state.step = n;
    errBox.hidden = true;
    if (o.manual) note.hidden = true;
    secs.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== n; });
    var sec = form.querySelector('.wz__step[data-step="' + n + '"]');
    animate(sec);
    updateProgress(); updateNav();
    save();
    if (!o.quiet) {
      toTop();
      var f = sec.querySelector('[data-focus]');
      if (f) f.focus({ preventScroll: true });
    }
  }

  function goBack() { show(state.step - 1, { manual: true }); }

  var submitting = false;
  function goNext() {
    if (submitting) return;
    var n = state.step;
    if (n === S.PROFILE) {
      readProfile();
      if (validateProfile()) { focusFirstInvalid(); return; }
      show(S.TEST, { manual: true });
    } else if (n === S.TEST) {
      var id = validateTest();
      if (id) { showTestErr(id); return; }
      show(S.SAVOL, { manual: true });
    } else if (n === S.SAVOL) {
      if (validateSavol()) { focusFirstInvalid(); return; }
      submit();
    }
  }
  function showTestErr(id) {
    errBox.textContent = 'Iltimos, belgilangan savollarga javob bering.';
    errBox.hidden = false;
    var li = $('ti-' + id);
    if (li) {
      li.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      var r = li.querySelector('input'); if (r) r.focus({ preventScroll: true });
    }
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); if (state.step >= S.PROFILE && state.step <= S.SAVOL) goNext(); });
  back.addEventListener('click', goBack);
  $('wz-start').addEventListener('click', function () {
    if (!state.startedAt) state.startedAt = Date.now();
    show(S.PROFILE, { manual: true });
  });
  $('wz-reset').addEventListener('click', function () {
    if (!window.confirm("Barcha kiritilgan javoblar o'chiriladi va anketa boshidan boshlanadi. Davom etasizmi?")) return;
    clearSaved();
    location.reload();
  });

  /* ---------- yuborish ---------- */
  function tgLink() { return '<a href="' + TG + '" target="_blank" rel="noopener"><span data-noconv>@ali_zairov</span></a>'; }
  function showErr(kind) {
    submitting = false; next.classList.remove('is-loading'); updateNav();
    errBox.innerHTML = kind === 'config'
      ? "Anketa qabul qilish tizimi hozir sozlanmoqda. Iltimos, birozdan keyin qayta urinib ko'ring yoki Telegram orqali yozing: " + tgLink() + '. Javoblaringiz shu qurilmada saqlab qo\'yildi.'
      : "Anketani yuborib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring yoki Telegram orqali yozing: " + tgLink() + '. Javoblaringiz shu qurilmada saqlab qo\'yildi.';
    errBox.hidden = false;
    errBox.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }
  function finish() {
    finished = true; submitting = false; clearSaved();
    show(S.DONE);
  }
  function buildPayload() {
    var test = {};
    TI.forEach(function (it) { test[it[0]] = String(state.test[it[0]] || ''); });
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
    p.set('answers', JSON.stringify({ test: test, savol: ta.value.trim() }));
    p.set('total_ms', String(state.startedAt ? Math.max(0, Date.now() - state.startedAt) : 0));
    p.set('page', location.href);
    p.set('ua', String(navigator.userAgent || '').slice(0, 200));
    return p;
  }
  function submit() {
    // hamma qadamlarni qayta tekshiramiz
    readProfile();
    if (validateProfile()) { show(S.PROFILE); focusFirstInvalid(); return; }
    var id = validateTest();
    if (id) { show(S.TEST); showTestErr(id); return; }
    if (validateSavol()) { show(S.SAVOL); focusFirstInvalid(); return; }

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
  renderTest();
  wireErrIds();
  if (restored) note.hidden = false;
  show(state.step, { quiet: true });
})();
