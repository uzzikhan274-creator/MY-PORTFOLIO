(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     NAV — scroll state, mobile menu, smooth scroll, active link
  ========================================================= */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  function setNavState() {
    if (window.scrollY > 24) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }
  setNavState();
  window.addEventListener('scroll', setNavState, { passive: true });

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Smooth scroll for in-page anchors (native CSS scroll-behavior already
  // handles most of this; JS closes the mobile menu and accounts for the
  // fixed nav height on click).
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      var navH = document.getElementById('nav').offsetHeight;
      var top = target.getBoundingClientRect().top + window.pageYOffset - (navH - 8);
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* =========================================================
     SCROLL REVEAL — one clean fade/slide per section, staggered
     within the section rather than globally.
  ========================================================= */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var counters = new WeakMap();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var section = entry.target.closest('section') || document.body;
          var count = counters.get(section) || 0;
          entry.target.style.transitionDelay = Math.min(count * 70, 280) + 'ms';
          counters.set(section, count + 1);
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* =========================================================
     ABOUT — animated count-up stats, once in view
  ========================================================= */
  var statEls = document.querySelectorAll('.about__stat-num');
  if ('IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        if (prefersReducedMotion) {
          el.textContent = target;
          statObserver.unobserve(el);
          return;
        }
        var start = null;
        var duration = 1100;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(step);
        statObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    statEls.forEach(function (el) { statObserver.observe(el); });
  }

  /* =========================================================
     HELP — accordion (single-open)
  ========================================================= */
  var helpItems = document.querySelectorAll('.help__item');
  helpItems.forEach(function (item) {
    var trigger = item.querySelector('.help__trigger');
    trigger.addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');
      helpItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.help__trigger').setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* =========================================================
     HERO CANVAS — subtle cursor-responsive node field.
     Lightweight, pauses off-screen, respects reduced motion.
  ========================================================= */
  var canvas = document.getElementById('heroCanvas');
  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext('2d');
    var heroSection = canvas.closest('.hero');
    var width, height, dpr;
    var points = [];
    var pointer = { x: null, y: null };
    var running = true;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = heroSection.offsetWidth;
      height = heroSection.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildPoints();
    }

    function buildPoints() {
      var count = Math.round((width * height) / 26000);
      count = Math.max(28, Math.min(count, 90));
      points = [];
      for (var i = 0; i < count; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      var linkDist = Math.min(width, height) * 0.16;

      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (pointer.x !== null) {
          var dx = pointer.x - p.x;
          var dy = pointer.y - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            var force = (160 - dist) / 160 * 0.02;
            p.x -= dx * force;
            p.y -= dy * force;
          }
        }

        for (var j = i + 1; j < points.length; j++) {
          var q = points[j];
          var ddx = p.x - q.x;
          var ddy = p.y - q.y;
          var d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < linkDist) {
            var alpha = (1 - d / linkDist) * 0.16;
            ctx.strokeStyle = 'rgba(111,195,255,' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      for (var k = 0; k < points.length; k++) {
        var pt = points[k];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244,242,237,0.35)';
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', function () {
      pointer.x = null;
      pointer.y = null;
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    if ('IntersectionObserver' in window) {
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          running = entry.isIntersecting;
          if (running) requestAnimationFrame(draw);
        });
      }, { threshold: 0 });
      heroObserver.observe(heroSection);
    }

    resize();
    requestAnimationFrame(draw);
  }

  /* =========================================================
     CONTACT FORM — client-side validation, no backend
  ========================================================= */
  var form = document.getElementById('contactForm');
  if (form) {
    var status = document.getElementById('formStatus');

    var validators = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
      email: function (v) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(v.trim()) ? '' : 'Please enter a valid email address.';
      },
      projectType: function (v) { return v ? '' : 'Please select a project type.'; },
      message: function (v) { return v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'; }
    };

    var fieldMap = {
      name: { input: form.elements.name, error: document.getElementById('err-name') },
      email: { input: form.elements.email, error: document.getElementById('err-email') },
      projectType: { input: form.elements.projectType, error: document.getElementById('err-type') },
      message: { input: form.elements.message, error: document.getElementById('err-message') }
    };

    function validateField(key) {
      var f = fieldMap[key];
      var msg = validators[key](f.input.value || '');
      f.error.textContent = msg;
      f.input.closest('.field').classList.toggle('has-error', !!msg);
      return !msg;
    }

    Object.keys(fieldMap).forEach(function (key) {
      var el = fieldMap[key].input;
      el.addEventListener('blur', function () { validateField(key); });
      el.addEventListener('input', function () {
        if (fieldMap[key].input.closest('.field').classList.contains('has-error')) {
          validateField(key);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = Object.keys(fieldMap).map(validateField).every(Boolean);

      if (!allValid) {
        status.textContent = '';
        var firstError = form.querySelector('.field.has-error input, .field.has-error select, .field.has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      var submitBtn = form.querySelector('.contact__submit');
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn__label').textContent = 'Sending…';

      // No backend is wired up — simulate a successful send.
      setTimeout(function () {
        status.textContent = "Thanks — your message is in. I'll reply within a day or two.";
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn__label').textContent = 'Send Message';
        form.reset();
        Object.keys(fieldMap).forEach(function (key) {
          fieldMap[key].error.textContent = '';
          fieldMap[key].input.closest('.field').classList.remove('has-error');
        });
      }, 700);
    });
  }

  /* =========================================================
     BACK TO TOP
  ========================================================= */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

})();
