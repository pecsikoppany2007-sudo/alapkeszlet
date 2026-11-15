/* Kurzor (csak egérrel): kis pont, linkek fölött nagyobb gyűrű, fotón pötty; mögötte lomhán követő halvány fény ("lámpa").
   Szín: --kurzor és --kurzor-feny a CSS-ben. Egyedi állapot: data-cur="light|photo|szoveg" bármelyik elemen. */
(function () {
  'use strict';
  var K = window.KIT;
  K.startCursor = function (opt) {
    opt = opt || {};
    if (!K.canHover || K.cursor) return;
    var cur = document.createElement('div'); cur.className = 'kurzor'; cur.setAttribute('aria-hidden', 'true');
    var lamp = opt.lamp === false ? null : document.createElement('div');
    document.body.appendChild(cur);
    if (lamp) { lamp.className = 'kurzor-feny'; lamp.setAttribute('aria-hidden', 'true'); document.body.appendChild(lamp); }
    K.cursor = cur;
    var tx = -100, ty = -100, cx = -100, cy = -100, gx = -400, gy = -400, raf = 0, seen = false;
    var k = K.reduced ? 1 : 0.2, kg = K.reduced ? 1 : 0.085;
    function loop() {
      cx += (tx - cx) * k; cy += (ty - cy) * k;
      cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      if (lamp) { gx += (tx - gx) * kg; gy += (ty - gy) * kg; lamp.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)'; }
      var d = Math.abs(tx - cx) + Math.abs(ty - cy) + (lamp ? Math.abs(tx - gx) + Math.abs(ty - gy) : 0);
      raf = d > 0.15 ? requestAnimationFrame(loop) : 0;
    }
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; cx = gx = tx; cy = gy = ty; K.html.classList.add('van-kurzor'); cur.classList.add('is-on'); if (lamp) lamp.classList.add('is-on'); }
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    var photoSel = opt.photo || 'img, picture, [data-cur="photo"]';
    document.addEventListener('mouseover', function (e) {
      var el = e.target; if (!el.closest) return;
      var link = !!el.closest('a, button, [role="tab"], [role="radio"], label, summary');
      var tag = el.closest('[data-cur]'), st = tag ? tag.getAttribute('data-cur') : '';
      cur.classList.toggle('is-link', link);
      cur.classList.toggle('is-photo', !link && (st === 'photo' || !!el.closest(photoSel)));
      cur.classList.toggle('is-light', st === 'light'); if (lamp) lamp.classList.toggle('is-light', st === 'light');
      cur.classList.toggle('is-text', !link && !!el.closest('input, textarea, [contenteditable]'));
    });
    K.html.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); if (lamp) lamp.classList.remove('is-on'); });
    K.html.addEventListener('mouseenter', function () { if (seen) { cur.classList.add('is-on'); if (lamp) lamp.classList.add('is-on'); } });
  };
})();
