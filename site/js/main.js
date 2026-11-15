/* Az oldal saját szkriptje: itt kapcsolod be, amit a készletből kérsz, és ide jön minden, ami csak erre az oldalra jellemző. */
(function () {
  'use strict';
  var K = window.KIT;
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    K.onResize(function () { ScrollTrigger.refresh(); });
  }
  K.setLang(K.lang, false);
  K.splitLines();
  K.hangLamps();
  if (K.renderHours) K.renderHours();
  K.startSmooth();
  K.startCursor();
  if (K.lenis && K.html.classList.contains('intro-on')) K.lenis.stop();
  K.runIntro(function () {
    if (K.lenis) K.lenis.start();
    var h = K.$('.hero__cim'); if (h) h.classList.add('is-in');
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    window.__kitReady = true;
  });
})();
