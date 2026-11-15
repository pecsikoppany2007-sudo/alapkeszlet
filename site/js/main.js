/* Az oldal saját szkriptje. Az alapkészletből CSAK azt kapcsold be, ami ehhez a helyhez illik.
   Alapból csak a stílustól független részek futnak (nyelv, nyitvatartás, étlap, menü, térkép).
   Hangulati elemek (puha görgetés, kurzor, címek beúszása, lámpák, film-intro) mind kikapcsolva: minden oldal más, egyedi legyen.
   Bekapcsolás: vedd ki a // jelet a sor elől (a lámpához a címekre .lampas osztály, az introhoz oldal.json "intro.be": true kell). */
(function () {
  'use strict';
  var K = window.KIT;
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    K.onResize(function () { ScrollTrigger.refresh(); });
  }
  K.setLang(K.lang, false);
  if (K.renderHours) K.renderHours();

  // K.startSmooth();      // puha, lassabb görgetés egérrel (Cafe Flow v2)
  // K.startCursor();      // egyedi kurzor + lomha fény (Cafe Flow)
  // K.splitLines();       // .bl címek soronként úsznak be (Darling)
  // K.hangLamps();        // függőlámpa a .lampas címek fölött (Darling v2, csak ha a hely története indokolja)

  if (K.lenis && K.html.classList.contains('intro-on')) K.lenis.stop();
  K.runIntro(function () {  // film-intro: csak ha oldal.json "intro.be": true, különben azonnal továbblép
    if (K.lenis) K.lenis.start();
    var h = K.$('.hero__cim'); if (h) h.classList.add('is-in');
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    window.__kitReady = true;
  });
})();
