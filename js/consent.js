/* =============================================================================
   consent.js — banner de cookies (LGPD)
   Só carrega GA4/Clarity depois que a pessoa aceita o banner.
   Escolha fica salva em localStorage (siteana_cookie_consent).
============================================================================= */

'use strict';

(function () {
  var CONSENT_KEY = 'siteana_cookie_consent';
  var GA_ID = 'G-8SKCY341N2';
  var CLARITY_ID = 'x0bhpx7zdt';

  function carregarGA() {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  function carregarClarity() {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function ativarAnalytics() {
    carregarGA();
    carregarClarity();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var banner      = document.getElementById('cookieBanner');
    var btnAceitar  = document.getElementById('cookieAceitar');
    var btnRecusar  = document.getElementById('cookieRecusar');
    var escolha     = localStorage.getItem(CONSENT_KEY);

    if (escolha === 'aceito') {
      ativarAnalytics();
    } else if (escolha !== 'recusado' && banner) {
      banner.classList.add('show');
    }

    if (btnAceitar) {
      btnAceitar.addEventListener('click', function () {
        localStorage.setItem(CONSENT_KEY, 'aceito');
        if (banner) banner.classList.remove('show');
        ativarAnalytics();
      });
    }

    if (btnRecusar) {
      btnRecusar.addEventListener('click', function () {
        localStorage.setItem(CONSENT_KEY, 'recusado');
        if (banner) banner.classList.remove('show');
      });
    }
  });
})();
