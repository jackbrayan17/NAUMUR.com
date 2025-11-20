document.addEventListener('DOMContentLoaded', function () {
  var burger = document.getElementById('hamburger');
  var menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  var OPEN_CLASS = 'open';

  function setOpen(open) {
    var willOpen = open != null ? open : !menu.classList.contains(OPEN_CLASS);
    menu.classList.toggle(OPEN_CLASS, willOpen);
    // Fallback: force display to ensure visibility even if CSS class is overridden
    menu.style.display = willOpen ? 'block' : 'none';
    burger.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('no-scroll', willOpen);
  }

  burger.setAttribute('aria-controls', 'mobile-menu');
  burger.setAttribute('aria-expanded', 'false');

  burger.addEventListener('click', function (e) {
    e.preventDefault();
    setOpen();
  });

  // Close when clicking a link inside the menu
  menu.querySelectorAll('a[href]').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!menu.classList.contains(OPEN_CLASS)) return;
    if (menu.contains(e.target) || burger.contains(e.target)) return;
    setOpen(false);
  });

  // --- Language switching ---
  function getLang() {
    var saved = localStorage.getItem('naumur_lang');
    return saved === 'en' ? 'en' : 'fr';
  }

  function setLang(lang) {
    localStorage.setItem('naumur_lang', lang);
    applyLanguage(lang);
  }

  function applyLanguage(lang) {
    // html lang attribute
    document.documentElement.setAttribute('lang', lang);

    // Elements with data-fr / data-en
    var nodes = document.querySelectorAll('[data-fr], [data-en]');
    nodes.forEach(function (el) {
      var text = el.dataset[lang];
      if (typeof text === 'string' && text.length >= 0) {
        // Preserve icons in anchors
        if (el.tagName === 'A' && el.querySelector('i')) {
          // Keep first <i>, replace trailing text
          var icon = el.querySelector('i');
          // Ensure a space between icon and text
          el.innerHTML = icon.outerHTML + (text ? (el.classList.contains('whatsapp') ? '' : '&nbsp;') + text : '');
        } else if (el.tagName === 'META') {
          el.setAttribute('content', text);
        } else if (el.tagName === 'TITLE') {
          el.textContent = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Meta tags with data-fr / data-en
    document.querySelectorAll('meta[data-fr], meta[data-en]').forEach(function (m) {
      var t = m.dataset[lang];
      if (t) m.setAttribute('content', t);
    });

    // Update the language toggle labels (they already have data-*)
    document.querySelectorAll('.lang-switch').forEach(function (btn) {
      var label = btn.dataset[lang];
      if (label) btn.textContent = label;
    });
  }

  // Wire up all language toggles
  document.querySelectorAll('.lang-switch').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var next = getLang() === 'fr' ? 'en' : 'fr';
      setLang(next);
    });
  });

  // Apply persisted language on load
  applyLanguage(getLang());
});
