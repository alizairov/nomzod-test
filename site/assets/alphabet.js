/* Alifbo almashtirgich: yangi (Ö, Ğ, Ş, Ç) va eski (O', G', Sh, Ch) lotin alifbosi.
   Sahifa matni eski alifboda yozilgan; yangi alifbo tanlansa, matn brauzerda o'giriladi.
   [data-noconv] ichidagi matn (logo, brend va kompaniya nomlari) o'zgartirilmaydi. */
(function () {
  'use strict';
  var KEY = 'nmzd-alifbo';
  var APOS = "['ʻ‘’`]";
  var rules = [
    [new RegExp('O' + APOS, 'g'), 'Ö'], [new RegExp('o' + APOS, 'g'), 'ö'],
    [new RegExp('G' + APOS, 'g'), 'Ğ'], [new RegExp('g' + APOS, 'g'), 'ğ'],
    [/S[hH]/g, 'Ş'], [/sh/g, 'ş'],
    [/C[hH]/g, 'Ç'], [/ch/g, 'ç']
  ];
  function toNew(s) { for (var i = 0; i < rules.length; i++) s = s.replace(rules[i][0], rules[i][1]); return s; }
  window.nmzdText = function (s) { return mode === 'new' ? toNew(s) : s; };

  var SKIP = { SCRIPT: 1, STYLE: 1, SVG: 1, svg: 1, NOSCRIPT: 1, TEXTAREA: 1 };
  var originals = new Map();   // text node -> asl matn
  var attrOrig = new Map();    // element -> {attr: asl qiymat}
  var ATTRS = ['placeholder', 'aria-label', 'title'];
  var mode = 'new';
  try { var saved = localStorage.getItem(KEY); if (saved === 'old' || saved === 'new') mode = saved; } catch (e) {}

  function skipped(el) {
    for (; el && el !== document.body; el = el.parentNode) {
      if (el.nodeType === 1 && (SKIP[el.nodeName] || el.hasAttribute('data-noconv'))) return true;
    }
    return false;
  }
  function apply() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      if (!n.nodeValue.trim() || skipped(n.parentNode)) continue;
      if (!originals.has(n)) originals.set(n, n.nodeValue);
      var o = originals.get(n);
      var v = mode === 'new' ? toNew(o) : o;
      if (n.nodeValue !== v) n.nodeValue = v;
    }
    document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(function (el) {
      if (skipped(el)) return;
      var rec = attrOrig.get(el) || {};
      ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        if (!(a in rec)) rec[a] = el.getAttribute(a);
        el.setAttribute(a, mode === 'new' ? toNew(rec[a]) : rec[a]);
      });
      attrOrig.set(el, rec);
    });
    document.title = mode === 'new' ? toNew(titleOrig) : titleOrig;
    var sw = document.getElementById('alph');
    if (sw) sw.setAttribute('aria-checked', String(mode === 'new'));
    document.documentElement.setAttribute('data-alifbo', mode);
  }
  var titleOrig = document.title;

  // JS orqali qo'shilgan yoki o'zgargan matnlar (xato/xabarlar) ham o'girilsin
  var OPTS = { childList: true, subtree: true, characterData: true };
  var mo = new MutationObserver(function (list) {
    list.forEach(function (m) {
      if (m.type === 'characterData') originals.set(m.target, m.target.nodeValue);
    });
    run();
  });
  function run() { mo.disconnect(); apply(); mo.observe(document.body, OPTS); }

  var sw = document.getElementById('alph');
  if (sw) sw.addEventListener('click', function () {
    mode = mode === 'new' ? 'old' : 'new';
    try { localStorage.setItem(KEY, mode); } catch (e) {}
    run();
  });

  run();
})();
