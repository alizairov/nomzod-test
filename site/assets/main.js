(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');

  /* sticky header shadow */
  var header = doc.getElementById('header');
  function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* burger */
  var burger = doc.getElementById('burger'), nav = doc.getElementById('nav');
  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Menyuni yopish' : 'Menyuni ochish');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* reveal on scroll */
  var items = doc.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
