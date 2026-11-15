/* Nyitvatartás: táblázat + "most nyitva" sor budapesti idő szerint. OLDAL.nyitvatartas: 7 pár, vasárnappal kezdve; 25:30 = éjjel fél kettő. */
(function () {
  'use strict';
  var K = window.KIT, H = K.cfg.nyitvatartas;
  if (!H) return;
  var DAYS = [['vasárnap', 'Sonntag', 'Sunday'], ['hétfő', 'Montag', 'Monday'], ['kedd', 'Dienstag', 'Tuesday'], ['szerda', 'Mittwoch', 'Wednesday'], ['csütörtök', 'Donnerstag', 'Thursday'], ['péntek', 'Freitag', 'Friday'], ['szombat', 'Samstag', 'Saturday']];
  K.DAYS = DAYS;
  function mins(s) { if (!s) return -1; var p = s.split(':'); return +p[0] * 60 + +p[1]; }
  function hm(s) { var m = mins(s) % 1440; return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); }
  K.openStatus = function () {
    var b = K.bud(), h = H[b.d], hy = H[(b.d + 6) % 7];
    if (hy[1] && mins(hy[1]) > 1440 && b.m < mins(hy[1]) - 1440) return { open: true, till: hy[1] };
    if (h[0] && b.m >= mins(h[0]) && b.m < mins(h[1])) return { open: true, till: h[1] };
    if (h[0] && b.m < mins(h[0])) return { open: false, when: 0, at: h[0] };
    for (var i = 1; i < 8; i++) { var n = H[(b.d + i) % 7]; if (n[0]) return { open: false, when: i, at: n[0], day: (b.d + i) % 7 }; }
    return { open: false, when: -1 };
  };
  function render() {
    var tb = K.$('[data-nyitvatartas] tbody');
    if (tb) {
      var b = K.bud();
      tb.innerHTML = [1, 2, 3, 4, 5, 6, 0].map(function (d) {
        var h = H[d], v = h[0] ? hm(h[0]) + '–' + hm(h[1]) : K.L(['zárva', 'geschlossen', 'closed']);
        return '<tr' + (d === b.d ? ' class="is-ma"' : '') + '><th scope="row">' + K.esc(K.L(DAYS[d])) + '</th><td>' + v + '</td></tr>';
      }).join('');
    }
    var el = K.$('[data-most]'); if (!el) return;
    var s = K.openStatus(), txt;
    if (s.open) txt = K.L(['Most nyitva, ' + hm(s.till) + '-ig', 'Jetzt geöffnet, bis ' + hm(s.till), 'Open now, until ' + hm(s.till)]);
    else if (s.when === 0) txt = K.L(['Ma ' + hm(s.at) + '-kor nyitunk', 'Heute ab ' + hm(s.at), 'Opens today at ' + hm(s.at)]);
    else if (s.when === 1) txt = K.L(['Holnap ' + hm(s.at) + '-kor nyitunk', 'Morgen ab ' + hm(s.at), 'Opens tomorrow at ' + hm(s.at)]);
    else if (s.when > 1) txt = K.L([DAYS[s.day][0].replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + hm(s.at) + '-kor nyitunk', DAYS[s.day][1] + ' ab ' + hm(s.at), 'Opens ' + DAYS[s.day][2] + ' at ' + hm(s.at)]);
    else txt = '';
    el.textContent = txt; el.classList.toggle('is-open', !!s.open);
  }
  K.renderHours = render;
  K.onLang(render);
  setInterval(render, 60000);
})();
