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
  var KEY = 'nmzd-apply-' + VAC;
  var cfg = window.NOMZOD_CONFIG || {};
  var DEMO = /(?:^|[?&])demo=1(?:&|$)/.test(location.search);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var S = { INTRO: 0, PROFILE: 1, SJT: 2, PAIRS: 3, STMT: 4, OPEN: 5, DONE: 6 };
  var PARTS = 5;
  var PART_NAMES = ['', "Ma'lumotlar", 'Vaziyatlar', 'Juftliklar', 'Qisqa savollar', 'Ochiq savollar'];
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
    return { v: 1, step: S.INTRO, sit: 0, seed: (Math.random() * 4294967296) >>> 0, startedAt: 0,
      profile: {}, sjt: {}, ms: {}, order: {}, pairs: {}, stmt: {}, open: {}, consent: false };
  }
  var restored = false;
  var state = (function () {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.v === 1 && typeof s.step === 'number' && s.step >= 0 && s.step < S.DONE) {
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
  function orderFor(sit) {
    var ids = sit.options.map(function (o) { return o.id; });
    var cur = state.order[sit.id];
    var ok = Array.isArray(cur) && cur.length === ids.length && ids.every(function (id) { return cur.indexOf(id) >= 0; });
    if (!ok) {
      var r = rng(state.seed ^ hashStr(sit.id)), a = ids.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      state.order[sit.id] = a;
    }
    return state.order[sit.id];
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
    else if (state.step === S.SJT && !finished) startTimer(T.situations[state.sit].id);
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

  var salary = $('a-salary');
  salary.addEventListener('input', function () {
    salary.value = salary.value.replace(/\D/g, '').slice(0, 12).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
  phone.value = formatPhone(phone.value || '');

  function validateProfile() {
    var first = null;
    function bad(name, msg) { setErr(name, msg); if (msg && !first) first = name; }
    Array.prototype.forEach.call(profSec.querySelectorAll('.field'), function (f) {
      var er = f.querySelector('.err[data-for]'); if (!er) return;
      var name = er.getAttribute('data-for'), v = getVal(name);
      var req = f.hasAttribute('data-req');
      var empty = Array.isArray(v) ? !v.length : !String(v).trim();
      var msg = '';
      if (req && empty) msg = (f.tagName === 'FIELDSET') ? 'Variantlardan birini tanlang' : "Maydonni to'ldiring";
      if (!msg && !empty) {
        v = String(v).trim();
        if (name === 'fullname' && v.length < 3) msg = 'Ism va familiyangizni kiriting';
        else if (name === 'phone') {
          var d = v.replace(/\D/g, '');
          if (!(d.length === 12 && d.indexOf('998') === 0)) msg = "Telefon raqamni to'liq kiriting";
        } else if (name === 'birth_year') {
          var y = parseInt(v, 10);
          if (!/^\d{4}$/.test(v) || y < 1960 || y > 2008) msg = "Tug'ilgan yilni 1960 dan 2008 gacha oraliqda kiriting";
        } else if (name === 'salary') {
          if (v.replace(/\D/g, '').length < 4) msg = "Maoshni raqamda kiriting (so'mda)";
        } else if (name === 'cv_link') {
          if (!/^(https?:\/\/)?[^\s\/.]+\.[^\s]{2,}$/i.test(v)) msg = "Havolani to'g'ri kiriting";
        }
      }
      bad(name, msg);
    });
    return first;
  }

  /* ---------- 2-bosqich: vaziyatlar ---------- */
  var sjtBox = $('wz-sjt');
  var NS = T.situations.length;
  function sjtDone(sid) { var a = state.sjt[sid]; return !!(a && a.most && a.least && a.most !== a.least); }
  function sjtFirstIncomplete() {
    for (var i = 0; i < NS; i++) if (!sjtDone(T.situations[i].id)) return i;
    return -1;
  }
  function renderSjt() {
    var sit = T.situations[state.sit];
    sjtBox.textContent = '';
    var order = orderFor(sit);
    var byId = {}; sit.options.forEach(function (o) { byId[o.id] = o; });
    var title = h('p', { class: 'sit__text', id: 'sit-text', tabindex: '-1', text: sit.text });
    var list = h('ul', { class: 'opts', 'aria-labelledby': 'sit-text' });
    order.forEach(function (oid) {
      var tid = 'ot-' + sit.id + '-' + oid;
      var li = h('li', { class: 'opt', 'data-oid': oid }, [
        h('p', { class: 'opt__t', id: tid, text: byId[oid].text }),
        h('div', { class: 'opt__btns' }, [
          h('button', { type: 'button', class: 'opt__b opt__b--most', 'data-kind': 'most', 'aria-pressed': 'false', 'aria-describedby': tid, text: 'Eng ehtimolli' }),
          h('button', { type: 'button', class: 'opt__b opt__b--least', 'data-kind': 'least', 'aria-pressed': 'false', 'aria-describedby': tid, text: 'Eng kam ehtimolli' })
        ])
      ]);
      list.appendChild(li);
    });
    sjtBox.appendChild(h('div', { class: 'sit' }, [
      h('p', { class: 'sit__n', text: 'Vaziyat ' + (state.sit + 1) + ' / ' + NS }),
      title
    ]));
    sjtBox.appendChild(h('p', { class: 'wz__ins', text: 'Shu vaziyatda eng ehtimolli qiladigan va eng kam ehtimolli qiladigan harakatingizni tanlang.' }));
    sjtBox.appendChild(list);
    sjtBox.appendChild(h('p', { class: 'wz__hint', id: 'sjt-hint', 'aria-live': 'polite' }));
    paintSjt();
  }
  function paintSjt() {
    var sit = T.situations[state.sit], a = state.sjt[sit.id] || {};
    Array.prototype.forEach.call(sjtBox.querySelectorAll('.opt'), function (li) {
      var oid = li.getAttribute('data-oid');
      var m = a.most === oid, l = a.least === oid;
      li.classList.toggle('is-most', m); li.classList.toggle('is-least', l);
      li.querySelector('.opt__b--most').setAttribute('aria-pressed', String(m));
      li.querySelector('.opt__b--least').setAttribute('aria-pressed', String(l));
    });
    var hint = $('sjt-hint');
    if (hint) hint.textContent = !a.most && !a.least ? '' : !a.most ? 'Eng ehtimolli harakatni ham tanlang.' : !a.least ? 'Eng kam ehtimolli harakatni ham tanlang.' : 'Ikkala tanlov belgilandi. Keyingisiga o\'tishingiz mumkin.';
    updateNav();
  }
  sjtBox.addEventListener('click', function (e) {
    var b = e.target.closest('.opt__b'); if (!b) return;
    var oid = b.closest('.opt').getAttribute('data-oid'), kind = b.getAttribute('data-kind');
    var sid = T.situations[state.sit].id;
    var a = state.sjt[sid] || {};
    if (a[kind] === oid) delete a[kind];
    else {
      a[kind] = oid;
      var other = kind === 'most' ? 'least' : 'most';
      if (a[other] === oid) delete a[other];
    }
    state.sjt[sid] = a;
    save(); paintSjt();
  });

  /* ---------- 3-bosqich: juftliklar ---------- */
  var pairsBox = $('wz-pairs');
  T.pairs.forEach(function (p, i) {
    var name = 'pair_' + p.id;
    var fs = h('fieldset', { class: 'field pair', 'data-pid': p.id }, [
      h('legend', {}, [h('span', { class: 'pair__n', text: (i + 1) + ' / ' + T.pairs.length }), " Qaysi biri sizga ko'proq xos?"]),
      h('div', { class: 'pair__opts' }, ['a', 'b'].map(function (k) {
        return h('label', { class: 'pair__opt' }, [
          h('input', { type: 'radio', name: name, value: k }),
          h('span', { text: p[k] })
        ]);
      })),
      h('small', { class: 'err', 'data-for': name })
    ]);
    pairsBox.appendChild(fs);
  });
  pairsBox.addEventListener('change', function (e) {
    var i = e.target; if (!i.name || i.name.indexOf('pair_') !== 0) return;
    state.pairs[i.name.slice(5)] = i.value; save();
  });
  T.pairs.forEach(function (p) {
    var v = state.pairs[p.id];
    if (v) { var r = pairsBox.querySelector('input[name="pair_' + p.id + '"][value="' + v + '"]'); if (r) r.checked = true; }
  });
  function validatePairs() {
    var first = null;
    T.pairs.forEach(function (p) {
      var ok = state.pairs[p.id] === 'a' || state.pairs[p.id] === 'b';
      setErr('pair_' + p.id, ok ? '' : 'Birini tanlang');
      if (!ok && !first) first = p.id;
    });
    return first;
  }

  /* ---------- 4-bosqich: ha / yo'q ---------- */
  var stmtBox = $('wz-stmt');
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
    var within = n === S.SJT ? state.sit / NS : 0;
    var pct = Math.max(4, Math.round((p - 1 + within) / PARTS * 100));
    bar.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', String(pct));
    plabel.textContent = 'Qism ' + p + '/' + PARTS + ' — ' + PART_NAMES[p] + (n === S.SJT ? ' · ' + (state.sit + 1) + '/' + NS : '');
  }
  function updateNav() {
    var n = state.step, show = n >= S.PROFILE && n <= S.OPEN;
    nav.hidden = !show;
    if (!show) return;
    nextT.textContent = n === S.OPEN ? 'Arizani yuborish' : 'Keyingi';
    next.disabled = (n === S.SJT && !sjtDone(T.situations[state.sit].id)) || submitting;
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
    if (n === S.SJT) { renderSjt(); startTimer(T.situations[state.sit].id); }
    var sec = form.querySelector('.wz__step[data-step="' + n + '"]');
    animate(sec);
    updateProgress(); updateNav();
    save();
    if (!o.quiet) {
      toTop();
      var f = n === S.SJT ? $('sit-text') : sec.querySelector('[data-focus]');
      if (f) f.focus({ preventScroll: true });
    }
  }

  function goBack() {
    var n = state.step;
    if (n === S.SJT && state.sit > 0) { stopTimer(); state.sit--; renderSjt(); startTimer(T.situations[state.sit].id); animate(sjtBox); updateProgress(); save(); toTop(); $('sit-text').focus({ preventScroll: true }); return; }
    show(n - 1, { manual: true });
  }

  var submitting = false;
  function goNext() {
    if (submitting) return;
    var n = state.step, first;
    if (n === S.PROFILE) {
      readProfile();
      if (validateProfile()) { focusFirstInvalid(); return; }
      show(S.SJT, { manual: true });
    } else if (n === S.SJT) {
      if (!sjtDone(T.situations[state.sit].id)) return;
      stopTimer();
      if (state.sit < NS - 1) {
        state.sit++; renderSjt(); startTimer(T.situations[state.sit].id);
        animate(sjtBox); updateProgress(); save(); toTop(); $('sit-text').focus({ preventScroll: true });
      } else show(S.PAIRS, { manual: true });
    } else if (n === S.PAIRS) {
      if (validatePairs()) { focusFirstInvalid(); return; }
      show(S.STMT, { manual: true });
    } else if (n === S.STMT) {
      if (validateStmt()) { focusFirstInvalid(); return; }
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
    var sjt = {};
    T.situations.forEach(function (s) {
      var a = state.sjt[s.id] || {};
      sjt[s.id] = { most: a.most || '', least: a.least || '', ms: Math.round(state.ms[s.id] || 0) };
    });
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
      if (n === 'cv_link' && v && !/^https?:\/\//i.test(v)) v = 'https://' + v;
      if (n === 'salary') v = v.replace(/\s/g, '');
      p.set(n, v);
    });
    p.set('answers', JSON.stringify({ sjt: sjt, pairs: state.pairs, statements: state.stmt, open: open }));
    p.set('total_ms', String(state.startedAt ? Math.max(0, Date.now() - state.startedAt) : 0));
    p.set('page', location.href);
    p.set('ua', String(navigator.userAgent || '').slice(0, 200));
    return p;
  }
  function submit() {
    // hamma bosqichlarni qayta tekshiramiz (masalan, savollar o'zgargan bo'lsa)
    stopTimer(); readProfile();
    if (validateProfile()) { show(S.PROFILE); focusFirstInvalid(); return; }
    var i = sjtFirstIncomplete();
    if (i >= 0) { state.sit = i; show(S.SJT); return; }
    if (validatePairs()) { show(S.PAIRS); focusFirstInvalid(); return; }
    if (validateStmt()) { show(S.STMT); focusFirstInvalid(); return; }
    if (validateOpen()) { show(S.OPEN); focusFirstInvalid(); return; }

    var hp = form.elements.website;
    if (hp && hp.value) { finish(); return; } // bot: yubormaymiz

    var payload = buildPayload();
    if (DEMO) {
      var o = {}; payload.forEach(function (v, k) { o[k] = v; });
      console.log('[demo] ariza ma\'lumotlari:', o);
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
  if (state.step === S.SJT && state.sit >= NS) state.sit = NS - 1;
  if (restored) note.hidden = false;
  show(state.step, { quiet: true });
})();
