(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header: shaffof -> xira/qattiq */
  var header = doc.getElementById('header');
  function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* burger / to'liq ekranli menyu */
  var burger = doc.getElementById('burger'), nav = doc.getElementById('nav');
  var desk = window.matchMedia('(min-width: 1000px)');
  function setMenu(open, noFocus) {
    var was = nav.classList.contains('open');
    header.classList.toggle('menu-open', open);
    nav.classList.toggle('open', open);
    doc.body.classList.toggle('nav-lock', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Menyuni yopish' : 'Menyuni ochish');
    if (open && !was) { var first = nav.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
    if (!open && was && !noFocus) burger.focus({ preventScroll: true });
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false, true); });
  doc.addEventListener('keydown', function (e) {
    var open = nav.classList.contains('open');
    if (e.key === 'Escape' && open) { setMenu(false); return; }
    if (e.key === 'Tab' && open) {
      var f = Array.prototype.filter.call(header.querySelectorAll('a[href],button'), function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var i = f.indexOf(doc.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
    }
  });
  (desk.addEventListener ? desk.addEventListener.bind(desk, 'change') : desk.addListener.bind(desk))(function (e) { if (e.matches) setMenu(false, true); });

  /* mobil pastki CTA: hero o'tgach chiqadi, aloqa bo'limida yashirinadi */
  var mcta = doc.getElementById('mcta'), hero = doc.querySelector('.hero'), contact = doc.getElementById('ariza');
  if (mcta && hero && 'IntersectionObserver' in window) {
    var heroOut = false, contactIn = false;
    var upd = function () { mcta.classList.toggle('is-on', heroOut && !contactIn); };
    new IntersectionObserver(function (en) { heroOut = !en[0].isIntersecting; upd(); }).observe(hero);
    if (contact) new IntersectionObserver(function (en) { contactIn = en[0].isIntersecting; upd(); }, { threshold: 0.25 }).observe(contact);
  }

  /* jarayon: skroll bilan to'ladigan chiziq */
  var steps = doc.querySelector('.steps');
  if (steps && !reduce) {
    var lis = steps.querySelectorAll('li'), ticking = false;
    steps.classList.add('tl-js');
    var tl = function () {
      ticking = false;
      var r = steps.getBoundingClientRect(), vh = window.innerHeight;
      var horiz = window.matchMedia('(min-width: 1080px)').matches;
      var p = horiz ? (vh * 0.9 - r.top) / (vh * 0.45) : (vh * 0.65 - r.top) / r.height;
      p = Math.max(0, Math.min(1, p));
      steps.style.setProperty('--p', p.toFixed(3));
      lis.forEach(function (li, i) { li.classList.toggle('is-on', p >= (i + 0.2) / lis.length || (i === 0 && p > 0)); });
    };
    var req = function () { if (!ticking) { ticking = true; requestAnimationFrame(tl); } };
    window.addEventListener('scroll', req, { passive: true }); window.addEventListener('resize', req); tl();
  }

  /* reveal on scroll */
  var items = doc.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 5) * 60 + 'ms';
      io.observe(el);
    });
  }

  /* marquee: duplicate content for seamless loop */
  var rowsEl = doc.querySelectorAll('.marquee__row');
  if (!reduce) {
    rowsEl.forEach(function (ul) {
      Array.prototype.slice.call(ul.children).forEach(function (li) {
        var c = li.cloneNode(true); c.setAttribute('aria-hidden', 'true'); ul.appendChild(c);
      });
    });
  }

  /* card cursor glow */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    doc.querySelectorAll('.card').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* service preselect */
  doc.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = doc.querySelector('input[name=service][value="' + a.getAttribute('data-service') + '"]');
      if (r) r.checked = true;
    });
  });

  /* bosh sahifa formasi (vakansiya sahifalarida #form va #f-phone yo'q) */
  var form = doc.getElementById('form');
  var phone = doc.getElementById('f-phone');
  if (form && phone) {
    /* phone mask: +998 90 123 45 67 */
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
    phone.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && phone.value.length <= 5) e.preventDefault();
    });

    function setErr(name, msg) {
      var el = form.querySelector('.err[data-for=' + name + ']');
      el.textContent = msg;
      var f = el.closest('.field'); f.classList.toggle('invalid', !!msg);
      var inp = form.elements[name]; if (inp) inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }

    var btn = doc.getElementById('submit'), errBox = doc.getElementById('form-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errBox.hidden = true;
      var name = form.elements.name.value.trim();
      var digits = phone.value.replace(/\D/g, '');
      var ok = true;
      setErr('name', name ? '' : 'Ismingizni kiriting');
      if (!name) ok = false;
      var phoneOk = digits.length === 12 && digits.indexOf('998') === 0;
      setErr('phone', phoneOk ? '' : "Telefon raqamni to'liq kiriting");
      if (!phoneOk) ok = false;
      if (!ok) { (form.querySelector('.invalid input') || {}).focus && form.querySelector('.invalid input').focus(); return; }

      // honeypot: botlarga muvaffaqiyat ko'rsatamiz, lekin yubormaymiz
      if (form.elements.website.value) { showSuccess(); return; }

      var cfg = window.NOMZOD_CONFIG || {};
      var data = new URLSearchParams({
        name: name,
        phone: phone.value.trim(),
        company: form.elements.company.value.trim(),
        service: form.elements.service.value,
        comment: form.elements.comment.value.trim(),
        page: location.href,
        date: new Date().toISOString()
      });

      btn.disabled = true; btn.classList.add('is-loading');

      if (!cfg.formEndpoint) {
        // Forma hali ulanmagan: arizani yo'qotmaslik uchun Telegram'ga yo'naltiramiz
        btn.disabled = false; btn.classList.remove('is-loading');
        errBox.innerHTML = "Forma hozircha ishga tushirilmoqda. Iltimos, arizangizni <a href=\"https://t.me/ali_zairov\" target=\"_blank\" rel=\"noopener\">Telegram orqali</a> yuboring.";
        errBox.hidden = false;
        return;
      }

      fetch(cfg.formEndpoint, { method: 'POST', mode: 'no-cors', body: data })
        .then(showSuccess)
        .catch(function () {
          btn.disabled = false; btn.classList.remove('is-loading');
          errBox.hidden = false;
        });
    });

    function showSuccess() {
      var s = doc.getElementById('success');
      form.hidden = true; s.hidden = false; s.focus();
    }
  }
})();
