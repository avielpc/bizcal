(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp: prefilled message ---------- */
  var WA_NUMBER = '972522780677';
  var WA_TEXT = 'היי אביאל, הגעתי מהאתר של BIZCLICK ואשמח לתאם הדגמה 🙂';
  var waHref = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT);
  document.querySelectorAll('.js-wa').forEach(function (a) { a.href = waHref; });

  /* ---------- Year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
    nav.classList.toggle('is-open', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Hero rotating question ---------- */
  var rotItems = document.querySelectorAll('.rot-item');
  if (rotItems.length > 1 && !reduceMotion) {
    var rotIndex = 0;
    setInterval(function () {
      if (document.hidden) return;
      var current = rotItems[rotIndex];
      rotIndex = (rotIndex + 1) % rotItems.length;
      var next = rotItems[rotIndex];
      current.classList.remove('is-active');
      current.classList.add('is-leaving');
      setTimeout(function () { current.classList.remove('is-leaving'); }, 460);
      next.classList.add('is-active');
    }, 3200);
  }

  /* ---------- Hero live demo ---------- */
  var msgs = document.querySelectorAll('#demo-chat .msg');
  var pill = document.getElementById('demo-pill');
  var slot = document.getElementById('demo-slot');
  var toast = document.getElementById('demo-toast');

  function setPaid(paid) {
    if (!pill || !slot) return;
    pill.textContent = paid ? 'שולם' : 'ממתין לתשלום';
    pill.classList.toggle('pill-paid', paid);
    pill.classList.toggle('pill-wait', !paid);
    slot.classList.toggle('is-paid', paid);
    if (paid) {
      pill.classList.remove('flip');
      void pill.offsetWidth; // restart animation
      pill.classList.add('flip');
    }
  }

  function showFinalState() {
    msgs.forEach(function (m) { m.classList.add('show'); });
    setPaid(true);
  }

  if (msgs.length) {
    if (reduceMotion) {
      showFinalState();
    } else {
      var timers = [];
      var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };

      var runDemo = function () {
        timers.forEach(clearTimeout);
        timers = [];
        msgs.forEach(function (m) { m.classList.remove('show'); });
        if (toast) toast.classList.remove('show');
        setPaid(false);

        at(700, function () { msgs[0].classList.add('show'); });
        at(2900, function () {
          if (toast) toast.classList.add('show');
          setPaid(true);
        });
        at(3500, function () { msgs[1].classList.add('show'); });
        at(5600, function () { if (toast) toast.classList.remove('show'); });
        at(6000, function () { if (msgs[2]) msgs[2].classList.add('show'); });
        at(11500, function () {
          if (document.hidden) { at(2000, runDemo); return; }
          runDemo();
        });
      };

      runDemo();
    }
  }
})();
