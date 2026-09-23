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
   PROJECTS
   Change the "image" path to change the top image.
   Example:
   image: "images/project1.jpg"
   ========================================================= */

var PROJECTS_DATA = [
  {
    image: "images%20website/state%20agent.png",
    browser: true,
    category: "Business Website",
    title: "Northline Studio",
    desc: "A confident marketing site for a design-build studio, built for fast load times and easy content updates.",
    link: "#"
  },

  {
    image: "images%20website/car.png",
    browser: false,
    category: "Creative Portfolio",
    title: "Aveline Rey",
    desc: "A minimal editorial portfolio for a visual artist, built around large imagery and quiet motion.",
    link: "#"
  },

  {
    image: "images%20website/grapgic%20desiner.png",
    browser: false,
    category: "Landing Page",
    title: "Fieldnote",
    desc: "A conversion-focused landing page for a productivity app's public launch.",
    link: "#"
  },

  {
    image: "images%20website/smook.png",
    browser: false,
    category: "E-commerce",
    title: "Halo Goods",
    desc: "A streamlined storefront for a small-batch home goods brand, tuned for mobile checkout.",
    link: "#"
  },

  {
    image: "images%20website/brand.png",
    browser: true,
    category: "Brand Website",
    title: "Solace Coffee Co.",
    desc: "A full brand refresh and site build for a specialty coffee roaster, from identity to storefront.",
    link: "#"
  },

  {
    image: "images%20website/beauty.png",
    browser: false,
    category: "Digital Experience",
    title: "Meridian Labs",
    desc: "An interactive product showcase built to explain a technical platform in plain language.",
    link: "#"
  },

  {
    image: "images%20website/bad.png",
    browser: false,
    category: "Mobile App",
    title: "Driftwood Journal",
    desc: "A calm, distraction-free journaling app interface designed for daily habit-building.",
    link: "#"
  },

  {
    image: "images%20website/guns.png",
    browser: true,
    category: "Nonprofit Website",
    title: "Harbor Relief",
    desc: "A donation-focused nonprofit site built to earn trust quickly and convert first-time visitors.",
    link: "#"
  }
];


var pinWrap = document.getElementById("workPinWrap");
var pin = document.getElementById("workPin");
var marquee = document.getElementById("workMarquee");
var track = document.getElementById("workTrack");


if (pinWrap && pin && marquee && track) {

  var projects = PROJECTS_DATA;


  function slugify(str) {
    return String(str)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function cardHTML(p, i) {

    var browserBar = p.browser
      ? `
        <div class="mock-browser">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `
      : "";


    var mediaClass =
      "work-card__media" +
      (p.browser ? " work-card__media--browser" : "");


    var href = p.link || "#";

    var cardClass =
      "work-card work-card--" + i + " work-card--" + slugify(p.title);


    return `
      <article class="${cardClass}" data-reveal>

        <div class="${mediaClass}">

          <img
            src="${p.image}"
            alt="${p.title}"
            loading="lazy"
          />

          ${browserBar}

        </div>


        <div class="work-card__info">

          <div>

            <span class="work-card__cat">
              ${p.category}
            </span>

            <h3 class="work-card__title">
              ${p.title}
            </h3>

            <p class="work-card__desc">
              ${p.desc}
            </p>

          </div>


          <a
            href="${href}"
            class="work-card__link"
            aria-label="View ${p.title} project"
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 18L18 6M18 6H9M18 6v9"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

          </a>

        </div>

      </article>
    `;
  }


  /* Generate cards */
  track.innerHTML = projects
    .map(cardHTML)
    .join("");


  /* Show injected cards */
  track
    .querySelectorAll("[data-reveal]")
    .forEach(function (el) {
      el.classList.add("is-visible");
    });


  var maxScroll = 0;
  var pinTopOffset = 0;


  /* Measure carousel */
  function measurePin() {

    var navEl = document.getElementById("nav");

    pinTopOffset = navEl
      ? navEl.offsetHeight
      : 0;


    pin.style.top =
      pinTopOffset + "px";


    pin.style.height =
      (window.innerHeight - pinTopOffset) + "px";


    maxScroll = Math.max(
      0,
      track.scrollWidth - marquee.clientWidth
    );


    pinWrap.style.height =
      (pin.offsetHeight + maxScroll) + "px";
  }


  /* Horizontal movement */
  function updateTrack() {

    var rect =
      pinWrap.getBoundingClientRect();


    var scrolled =
      pinTopOffset - rect.top;


    var progress =
      maxScroll > 0
        ? Math.min(
            Math.max(scrolled / maxScroll, 0),
            1
          )
        : 0;


    track.style.transform =
      "translateX(" +
      (-progress * maxScroll) +
      "px)";
  }


  measurePin();
  updateTrack();


  window.addEventListener(
    "scroll",
    updateTrack,
    { passive: true }
  );


  window.addEventListener(
    "resize",
    function () {
      measurePin();
      updateTrack();
    }
  );

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

