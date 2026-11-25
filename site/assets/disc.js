/* DISC testi — ommaviy sahifa (/disc/). Savollar window.DISC_TEST dan (assets/tests/disc.js).
   Baholash bu yerda YO'Q: javoblar (harflar) serverga xom holda yuboriladi, natija nomzodga ko'rsatilmaydi.
   Uzbekcha matnlar eski lotin alifbosida yoziladi; yangi alifboga brauzerda alphabet.js o'giradi. */
(function () {
  'use strict';
  var doc = document;
  var host = doc.getElementById('disc-app');
  var T = window.DISC_TEST;
  if (!host || !T) return;

  var cfg = window.NOMZOD_CONFIG || {};
  var KEY = 'nmzd-disc-v1', LKEY = 'nmzd-disc-lang';
  var N = T.questions.length;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IDLE_CAP = 120000; // bitta qadamda hisoblanadigan eng ko'p vaqt (ms): tanaffus total_ms ni buzmasin

  /* ---------- matnlar (UZ / RU) ---------- */
  var I18N = {
    uz: {
      eyebrow: 'Shaxsiyat testi', chips: ['15 ta savol', 'Taxminan 10 daqiqa', "To'g'ri yoki noto'g'ri javob yo'q"],
      instr: "Yo'riqnoma", about: "Ma'lumotlaringiz", aboutHint: 'Yulduzcha bilan belgilanganlari majburiy.',
      fullname: 'F.I.Sh', fullnamePh: 'Familiya Ism Sharifingiz', phone: 'Telefon', telegram: 'Telegram', telegramPh: '@username',
      position: 'Lavozim', positionPh: 'Masalan: HR menejer', company: 'Kompaniya', companyPh: 'Ishlayotgan kompaniya nomi', opt: 'ixtiyoriy',
      start: 'Boshlash', resume: 'Davom etish',
      errName: 'Ism va familiyangizni kiriting', errPhone: "Telefon raqamni to'liq kiriting",
      qOf: 'Savol', pick: 'Variantni tanlang — keyingi savolga o\'tiladi', back: 'Orqaga', next: 'Keyingi',
      readyH: 'Hammasi tayyor', readyP: 'Barcha {n} ta savolga javob berdingiz. Javoblaringizni yuborish uchun tugmani bosing.',
      send: 'Yuborish', sending: 'Yuborilmoqda…', retry: 'Qayta urinish',
      errSend: "Yuborib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring. Javoblaringiz saqlab qo'yildi.",
      errCfg: "Test qabul qilish tizimi hozir sozlanmoqda. Birozdan keyin qayta urinib ko'ring. Javoblaringiz saqlab qo'yildi.",
      errMissing: 'Barcha savollarga javob bering.',
      doneH: 'Rahmat!', doneP: 'Javoblaringiz qabul qilindi. Rahmat!',
      restored: 'Oldingi javoblaringiz tiklandi — davom etishingiz mumkin.', reset: 'Boshidan boshlash', resetAsk: "Barcha javoblar o'chiriladi. Davom etasizmi?", yes: 'Ha', no: "Yo'q",
      bar: "Jarayon"
    },
    ru: {
      eyebrow: 'Тест личности', chips: ['15 вопросов', 'Около 10 минут', 'Нет правильных и неправильных ответов'],
      instr: 'Инструкция', about: 'Ваши данные', aboutHint: 'Поля со звёздочкой обязательны.',
      fullname: 'Ф.И.О.', fullnamePh: 'Фамилия Имя Отчество', phone: 'Телефон', telegram: 'Telegram', telegramPh: '@username',
      position: 'Должность', positionPh: 'Например: HR-менеджер', company: 'Компания', companyPh: 'Название компании, где вы работаете', opt: 'необязательно',
      start: 'Начать', resume: 'Продолжить',
      errName: 'Введите фамилию и имя', errPhone: 'Введите номер телефона полностью',
      qOf: 'Вопрос', pick: 'Выберите вариант — откроется следующий вопрос', back: 'Назад', next: 'Далее',
      readyH: 'Всё готово', readyP: 'Вы ответили на все {n} вопросов. Нажмите кнопку, чтобы отправить ответы.',
      send: 'Отправить', sending: 'Отправка…', retry: 'Повторить',
      errSend: 'Не удалось отправить. Проверьте интернет и попробуйте ещё раз. Ваши ответы сохранены.',
      errCfg: 'Система приёма ответов сейчас настраивается. Попробуйте чуть позже. Ваши ответы сохранены.',
      errMissing: 'Ответьте на все вопросы.',
      doneH: 'Спасибо!', doneP: 'Ваши ответы приняты. Спасибо!',
      restored: 'Ваши предыдущие ответы восстановлены — можно продолжить.', reset: 'Начать сначала', resetAsk: 'Все ответы будут удалены. Продолжить?', yes: 'Да', no: 'Нет',
      bar: 'Прогресс'
    }
  };

  /* ---------- yordamchilar ---------- */
  function $(id) { return doc.getElementById(id); }
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
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  /* ---------- holat ---------- */
  function newState() {
    return { v: 1, lang: 'uz', step: 'intro', idx: 0, profile: { fullname: '', phone: '+998 ', telegram: '', position: '', company: '' }, answers: {}, ms: 0, last: 0 };
  }
  var restored = false;
  var S = (function () {
    var st = newState();
    try {
      var raw = lsGet(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.v === 1 && (s.step === 'intro' || s.step === 'q' || s.step === 'send')) {
          st.lang = s.lang === 'ru' ? 'ru' : 'uz';
          st.step = s.step;
          st.idx = Math.max(0, Math.min(N - 1, Number(s.idx) || 0));
          if (s.profile && typeof s.profile === 'object') Object.keys(st.profile).forEach(function (k) { if (typeof s.profile[k] === 'string') st.profile[k] = s.profile[k].slice(0, 200); });
          if (s.answers && typeof s.answers === 'object') {
            for (var q = 1; q <= N; q++) {
              var a = s.answers[q];
              if (typeof a === 'string' && validLetter(q - 1, a)) st.answers[q] = a;
            }
          }
          st.ms = Math.max(0, Number(s.ms) || 0); st.last = Number(s.last) || 0;
          if (st.step === 'send' && answeredCount(st) < N) st.step = 'q';
          restored = st.step !== 'intro' || answeredCount(st) > 0;
        }
      }
    } catch (e) {}
    if (st.last) st.last = Date.now(); // sahifa qayta ochilgandagi tanaffus vaqtga qo'shilmasin
    var pl = lsGet(LKEY); if (!restored && (pl === 'uz' || pl === 'ru')) st.lang = pl;
    return st;
  })();
  function validLetter(i, a) { var o = T.questions[i].o; for (var j = 0; j < o.length; j++) if (o[j][0] === a) return true; return false; }
  function answeredCount(s) { var n = 0; for (var q = 1; q <= N; q++) if ((s || S).answers[q]) n++; return n; }
  var finished = false;
  function save() { if (!finished) lsSet(KEY, JSON.stringify(S)); }
  function L() { return I18N[S.lang]; }
  function pick2(arr) { return arr[S.lang === 'ru' ? 1 : 0]; }

  /* vaqt: faqat faol vaqt (har qadamda cheklangan) */
  function tick() {
    var now = Date.now();
    if (S.last) S.ms += Math.min(IDLE_CAP, Math.max(0, now - S.last));
    S.last = now;
  }

  /* ---------- telefon niqobi (apply.js bilan bir xil) ---------- */
  function formatPhone(raw) {
    var d = String(raw || '').replace(/\D/g, '');
    if (d.indexOf('998') === 0) d = d.slice(3);
    d = d.slice(0, 9);
    var out = '+998 ';
    if (d.length) out += d.slice(0, 2);
    if (d.length > 2) out += ' ' + d.slice(2, 5);
    if (d.length > 5) out += ' ' + d.slice(5, 7);
    if (d.length > 7) out += ' ' + d.slice(7, 9);
    return out;
  }

  /* ---------- umumiy bo'laklar ---------- */
  function setLangUi() {
    doc.documentElement.setAttribute('lang', S.lang === 'ru' ? 'ru' : 'uz');
    Array.prototype.forEach.call(doc.querySelectorAll('#dlang button'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === S.lang)); });
    // alifbo almashtirgich faqat o'zbekcha matn uchun
    var al = $('alph'); if (al) al.style.display = S.lang === 'ru' ? 'none' : '';
  }
  Array.prototype.forEach.call(doc.querySelectorAll('#dlang button'), function (b) {
    b.addEventListener('click', function () {
      var lg = b.getAttribute('data-lang'); if (lg === S.lang) return;
      captureProfile(); S.lang = lg; lsSet(LKEY, lg); save(); render({ keepNote: true, noFocus: true });
    });
  });

  var toastBox = $('dtoasts');
  function toast(msg, err) {
    var t = h('div', { class: 'dtoast' + (err ? ' dtoast--err' : ''), text: msg });
    toastBox.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, err ? 6000 : 3000);
  }

  function dots() {
    return h('div', { class: 'dquad', 'aria-hidden': 'true' }, ['D', 'I', 'S', 'C'].map(function (x) { return h('i', { class: 'dq-' + x.toLowerCase() }); }));
  }
  function restoredBar() {
    if (!restoredNote) return null;
    var btn = h('button', { type: 'button', class: 'linkbtn', text: L().reset });
    btn.addEventListener('click', function () {
      var ask = btn.parentNode;
      ask.textContent = '';
      var yes = h('button', { type: 'button', class: 'linkbtn', text: L().yes }), no = h('button', { type: 'button', class: 'linkbtn', text: L().no });
      yes.addEventListener('click', function () { finished = true; lsDel(KEY); location.reload(); });
      no.addEventListener('click', function () { render({ keepNote: true, noFocus: true }); });
      ask.appendChild(h('span', { text: L().resetAsk })); ask.appendChild(yes); ask.appendChild(no);
    });
    return h('div', { class: 'wz__note dnote' }, [h('span', { text: L().restored }), btn]);
  }

  /* ---------- progress ---------- */
  function progress(done) {
    var pct = Math.round(done / N * 100);
    var segs = [0, 1, 2, 3].map(function (i) {
      var from = i * 25, v = Math.max(0, Math.min(1, (pct - from) / 25));
      var f = h('i', { class: 'dp__f dp__f--' + 'disc'.charAt(i) }); f.style.width = (v * 100) + '%';
      return h('span', { class: 'dp__s' }, [f]);
    });
    return h('div', { class: 'dp', role: 'progressbar', 'aria-label': L().bar, 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct) }, segs);
  }

  /* ---------- ekranlar ---------- */
  var restoredNote = restored;
  var busy = false;
  var errBox = null;

  function render(o) {
    o = o || {};
    if (!o.keepNote) restoredNote = false;
    setLangUi();
    host.textContent = '';
    if (S.step !== 'intro') fields = { website: fields.website }; // eski (olib tashlangan) inputlarga havola qolmasin
    var screen;
    if (S.step === 'intro') screen = introScreen();
    else if (S.step === 'q') screen = questionScreen();
    else if (S.step === 'send') screen = sendScreen();
    else screen = doneScreen();
    screen.classList.add('d-screen');
    if (!reduce && !o.noAnim) screen.classList.add('d-in');
    host.appendChild(screen);
    if (!o.noFocus) {
      var f = screen.querySelector('[data-focus]'); if (f) f.focus({ preventScroll: true });
      if (!o.noScroll) { try { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, 0); } }
    }
  }

  var fields = {};
  function field(id, label, input, opt, req) {
    var lab = h('label', { for: id }, [label + ' ', req ? h('span', { class: 'req', 'aria-hidden': 'true', text: '*' }) : null, opt ? h('small', { class: 'hint', text: '(' + L().opt + ')' }) : null]);
    return h('div', { class: 'field' + (req ? '' : ''), 'data-f': id }, [lab, input, h('small', { class: 'err', id: id + '-err' })]);
  }
  function captureProfile() {
    var P = S.profile;
    ['fullname', 'phone', 'telegram', 'position', 'company'].forEach(function (k) { if (fields[k]) P[k] = fields[k].value; });
  }
  function setErr(k, msg) {
    var inp = fields[k]; if (!inp) return;
    var f = inp.closest('.field'); f.classList.toggle('invalid', !!msg);
    f.querySelector('.err').textContent = msg || '';
    inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) inp.setAttribute('aria-describedby', inp.id + '-err'); else inp.removeAttribute('aria-describedby');
  }

  function introScreen() {
    var P = S.profile, t = L();
    fields = {};
    function inp(k, id, attrs) {
      var el = h('input', Object.assign({ id: id, name: k, type: 'text', value: P[k] || '', maxlength: '120' }, attrs || {}));
      fields[k] = el;
      el.addEventListener('input', function () { P[k] = el.value; if (k === 'phone') { el.value = formatPhone(el.value); P[k] = el.value; } setErr(k, ''); save(); });
      return el;
    }
    var fullname = inp('fullname', 'd-fullname', { autocomplete: 'name', placeholder: t.fullnamePh });
    var phone = inp('phone', 'd-phone', { type: 'tel', inputmode: 'tel', autocomplete: 'tel', maxlength: '20' });
    phone.value = formatPhone(P.phone);
    phone.addEventListener('focus', function () { if (!phone.value) phone.value = '+998 '; });
    phone.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && phone.value.length <= 5) e.preventDefault(); });
    var tg = inp('telegram', 'd-telegram', { placeholder: t.telegramPh, autocomplete: 'off', autocapitalize: 'none', spellcheck: 'false', maxlength: '64' });
    var pos = inp('position', 'd-position', { placeholder: t.positionPh, autocomplete: 'organization-title', maxlength: '100' });
    var com = inp('company', 'd-company', { placeholder: t.companyPh, autocomplete: 'organization', maxlength: '150' });
    var hp = h('input', { type: 'text', name: 'website', tabindex: '-1', autocomplete: 'off', id: 'd-hp' });
    fields.website = hp;

    var form = h('form', { novalidate: true, class: 'dform' }, [
      h('div', { class: 'wz__grid' }, [
        field('d-fullname', t.fullname, fullname, false, true),
        field('d-phone', t.phone, phone, false, true),
        field('d-telegram', t.telegram, tg, true),
        field('d-position', t.position, pos, true),
        h('div', { class: 'field--wide' }, [field('d-company', t.company, com, true)])
      ]),
      h('div', { class: 'hp', 'aria-hidden': 'true' }, [h('label', {}, ['Website ', hp])]),
      h('div', { class: 'dact' }, [
        h('button', { type: 'submit', class: 'btn btn--red btn--lg dstart' }, [h('span', { class: 'btn__t', text: answeredCount() ? t.resume : t.start }), arrowIcon()])
      ])
    ]);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      captureProfile();
      var P2 = S.profile, bad = false, first = null;
      var nameOk = P2.fullname.trim().length >= 3 && /\S+\s+\S+/.test(P2.fullname.trim());
      if (!nameOk) { setErr('fullname', t.errName); bad = true; first = first || fullname; } else setErr('fullname', '');
      var d = P2.phone.replace(/\D/g, '');
      if (!(d.length === 12 && d.indexOf('998') === 0)) { setErr('phone', t.errPhone); bad = true; first = first || phone; } else setErr('phone', '');
      if (bad) { first.focus(); return; }
      var nxt = 0; for (var q = 1; q <= N; q++) { if (!S.answers[q]) { nxt = q - 1; break; } nxt = N - 1; }
      S.last = Date.now();
      if (answeredCount() >= N) { S.step = 'send'; } else { S.step = 'q'; S.idx = nxt; }
      save(); render();
    });

    return h('div', { class: 'dintro' }, [
      restoredBar(),
      h('div', { class: 'dhead' }, [dots(), h('div', {}, [
        h('p', { class: 'eyebrow', text: t.eyebrow }),
        h('h1', { class: 'dh1', text: pick2(T.title), 'data-focus': '', tabindex: '-1' })
      ])]),
      h('ul', { class: 'chips chips--dark dchips' }, t.chips.map(function (c) { return h('li', { class: 'chip', text: c }); })),
      h('section', { class: 'dinstr', 'aria-label': t.instr }, [h('h3', { text: t.instr }), h('p', { text: pick2(T.instruction) })]),
      h('h3', { class: 'dsub', text: t.about }),
      h('p', { class: 'wz__ins', text: t.aboutHint }),
      form
    ]);
  }
  function arrowIcon() {
    var s = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', '20'); s.setAttribute('height', '20'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2.4'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<path d="M5 12h14M13 6l6 6-6 6"/>';
    return s;
  }

  var advTimer = 0;
  function questionScreen() {
    var i = S.idx, q = T.questions[i], num = i + 1, t = L();
    var cur = S.answers[num] || '';
    var opts = q.o.map(function (o) {
      var b = h('button', { type: 'button', class: 'dopt' + (cur === o[0] ? ' is-on' : ''), role: 'radio', 'aria-checked': String(cur === o[0]), 'data-k': o[0] }, [
        h('span', { class: 'dopt__k', text: o[0], 'data-noconv': '' }),
        h('span', { class: 'dopt__t', text: S.lang === 'ru' ? o[2] : o[1] }),
        h('span', { class: 'dopt__c', 'aria-hidden': 'true' })
      ]);
      b.addEventListener('click', function () { choose(num, o[0]); });
      return b;
    });
    var back = h('button', { type: 'button', class: 'btn btn--outline dback' }, [h('span', { text: t.back })]);
    back.addEventListener('click', goBack);
    var nav = h('div', { class: 'dnav' }, [back]);
    if (cur) {
      var nx = h('button', { type: 'button', class: 'btn btn--red dnext' }, [h('span', { text: num === N ? t.send : t.next }), arrowIcon()]);
      nx.addEventListener('click', function () { goForward(); });
      nav.appendChild(nx);
    }
    return h('div', { class: 'dq' }, [
      restoredBar(),
      progress(answeredCount()),
      h('p', { class: 'dq__n' }, [h('b', { text: String(num) }), ' / ' + N + ' · ' + t.qOf]),
      h('h2', { class: 'dq__q', id: 'dq-q', text: q.q[S.lang === 'ru' ? 1 : 0], 'data-focus': '', tabindex: '-1' }),
      h('div', { class: 'dopts', role: 'radiogroup', 'aria-labelledby': 'dq-q' }, opts),
      h('p', { class: 'dq__h', text: t.pick }),
      nav
    ]);
  }

  function choose(num, letter) {
    if (S.step !== 'q' || num !== S.idx + 1) return;
    tick();
    S.answers[num] = letter; save();
    Array.prototype.forEach.call(host.querySelectorAll('.dopt'), function (b) {
      var on = b.getAttribute('data-k') === letter;
      b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on));
    });
    clearTimeout(advTimer);
    advTimer = setTimeout(function () { if (S.step === 'q' && S.idx + 1 === num) goForward(); }, reduce ? 80 : 320);
  }
  function goForward() {
    clearTimeout(advTimer);
    if (S.step !== 'q') return;
    tick();
    restoredNote = false;
    if (S.idx < N - 1) { S.idx++; } else { S.step = 'send'; }
    save(); render();
  }
  function goBack() {
    clearTimeout(advTimer);
    tick();
    if (S.step === 'send') { S.step = 'q'; S.idx = N - 1; }
    else if (S.step === 'q' && S.idx > 0) S.idx--;
    else if (S.step === 'q') { S.step = 'intro'; }
    save(); render();
  }

  function sendScreen() {
    var t = L();
    var btn = h('button', { type: 'button', class: 'btn btn--red btn--lg dsend', id: 'd-send' }, [h('span', { class: 'btn__t', text: t.send }), h('span', { class: 'spinner', 'aria-hidden': 'true' })]);
    btn.addEventListener('click', submit);
    var back = h('button', { type: 'button', class: 'btn btn--outline dback' }, [h('span', { text: t.back })]);
    back.addEventListener('click', goBack);
    errBox = h('p', { class: 'wz__error', role: 'alert', hidden: true });
    return h('div', { class: 'dready' }, [
      restoredBar(),
      progress(N),
      h('div', { class: 'success__ico dready__ico', 'aria-hidden': 'true' }, [checkIcon()]),
      h('h2', { class: 'dq__q dready__h', text: t.readyH, 'data-focus': '', tabindex: '-1' }),
      h('p', { class: 'dready__p', text: t.readyP.replace('{n}', String(N)) }),
      errBox,
      h('div', { class: 'dnav dnav--send' }, [back, btn])
    ]);
  }
  function checkIcon() {
    var s = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', '28'); s.setAttribute('height', '28'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '3'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<path d="M5 12.5l4.5 4.5L19 7.5"/>';
    return s;
  }

  function doneScreen() {
    var t = L();
    return h('div', { class: 'success ddone' }, [
      h('div', { class: 'success__ico', 'aria-hidden': 'true' }, [checkIcon()]),
      h('h2', { class: 'ddone__h', text: t.doneH, 'data-focus': '', tabindex: '-1' }),
      h('p', { text: t.doneP }),
      dots()
    ]);
  }

  /* ---------- yuborish ---------- */
  function showErr(msg) {
    busy = false;
    var b = $('d-send');
    if (b) { b.disabled = false; b.classList.remove('is-loading'); var tx = b.querySelector('.btn__t'); if (tx) tx.textContent = L().retry; }
    if (errBox) { errBox.textContent = msg; errBox.hidden = false; }
    toast(msg, true);
  }
  function submit() {
    if (busy) return;
    var t = L();
    if (answeredCount() < N) { S.step = 'q'; for (var q = 1; q <= N; q++) if (!S.answers[q]) { S.idx = q - 1; break; } save(); render(); toast(t.errMissing, true); return; }
    if (!cfg.apiBase) { showErr(t.errCfg); return; }
    busy = true;
    var b = $('d-send'); b.disabled = true; b.classList.add('is-loading'); b.querySelector('.btn__t').textContent = t.sending;
    if (errBox) errBox.hidden = true;
    tick();
    var P = S.profile, ans = {};
    for (var i = 1; i <= N; i++) ans[String(i)] = S.answers[i];
    var body = {
      fullname: P.fullname.trim(), phone: P.phone.trim(), telegram: P.telegram.trim(), position: P.position.trim(), company: P.company.trim(),
      lang: S.lang, answers: ans, total_ms: Math.round(S.ms), page: location.href
    };
    var hpv = fields.website && fields.website.value; if (hpv) body.website = hpv;
    var ctrl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, 25000);
    fetch(String(cfg.apiBase).replace(/\/+$/, '') + '/api/disc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (r.ok && j && j.ok) return j;
          var e = new Error((j && j.error) || ''); e.status = r.status; throw e;
        });
      })
      .then(function () {
        clearTimeout(to);
        finished = true; busy = false; lsDel(KEY);
        S.step = 'done'; render();
      }, function (e) {
        clearTimeout(to);
        // 4xx — server xabari (masalan, limit); aks holda umumiy xato
        showErr(e && e.status === 429 && e.message ? e.message : t.errSend);
      });
  }

  /* klaviatura: A–D yoki 1–4 */
  doc.addEventListener('keydown', function (e) {
    if (S.step !== 'q' || e.ctrlKey || e.metaKey || e.altKey) return;
    var tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
    var k = String(e.key || '').toUpperCase(), q = T.questions[S.idx], map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
    if (map[k]) k = map[k];
    if (/^[A-D]$/.test(k) && validLetter(S.idx, k)) { e.preventDefault(); choose(S.idx + 1, k); }
  });
  window.addEventListener('pagehide', function () { if (!finished && S.step !== 'done') { captureProfile(); tick(); save(); } });

  render({ noFocus: true, noAnim: true, keepNote: true });
})();
