/* Apróságok, amik minden oldalon kellenek: mobil menü, térkép csak kattintásra (süti-mentes alap), lap címe, ha elnavigálsz. */
(function () {
  'use strict';
  var K = window.KIT;
  /* mobil menü: gomb + aria-expanded, Esc zár, linkre zár */
  var burger = K.$('[data-menu-gomb]'), nav = K.$('[data-menu]');
  if (burger && nav) {
    var set = function (o) { burger.setAttribute('aria-expanded', String(o)); K.html.classList.toggle('menu-nyitva', o); if (K.lenis) o ? K.lenis.stop() : K.lenis.start(); };
    burger.addEventListener('click', function () { set(burger.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { set(false); burger.focus(); } });
  }
  /* térkép: a Google csak a gombnyomás után töltődik be (a jogi oldal ezt írja le) */
  K.$$('[data-terkep]').forEach(function (box) {
    var b = box.querySelector('button'); if (!b) return;
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = box.getAttribute('data-terkep'); f.title = b.getAttribute('data-cim') || 'Térkép';
      f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.setAttribute('allowfullscreen', '');
      box.innerHTML = ''; box.appendChild(f); box.classList.add('is-betoltve');
    });
  });
  /* lap címe, ha másik fülre vált: a hely saját mondata (szovegek.js: _vissza) */
  var base = null;
  document.addEventListener('visibilitychange', function () {
    var away = K.t('_vissza'); if (!away) return;
    if (document.hidden) { base = document.title; document.title = away; } else if (base) document.title = base;
  });
})();
