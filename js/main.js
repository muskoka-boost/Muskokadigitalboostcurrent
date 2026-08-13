/* ── Muskoka Digital Boost — shared behaviour ── */
(function () {
  'use strict';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mob-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('.ico-bars').style.display = open ? 'none' : 'block';
      toggle.querySelector('.ico-close').style.display = open ? 'block' : 'none';
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window && !reducedMotion) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* FAQ accordions */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Animated counters */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var runCounter = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      if (reducedMotion || !('IntersectionObserver' in window)) {
        el.textContent = prefix + target + suffix;
        return;
      }
      var dur = 1800, startTs;
      var step = function (ts) {
        if (!startTs) startTs = ts;
        var p = Math.min((ts - startTs) / dur, 1);
        el.textContent = prefix + Math.floor(p * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (reducedMotion || !('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runCounter(e.target); cObs.unobserve(e.target); }
        });
      }, { threshold: 0.3 });
      counters.forEach(function (el) { cObs.observe(el); });
    }
  }

  /* Typewriter (home hero) */
  var typeEl = document.querySelector('[data-typewriter]');
  if (typeEl) {
    var words = JSON.parse(typeEl.getAttribute('data-typewriter'));
    if (reducedMotion) {
      typeEl.textContent = words[0];
    } else {
      var wIdx = 0, cIdx = 0, deleting = false;
      var tick = function () {
        var word = words[wIdx], delay = deleting ? 40 : 80;
        if (!deleting) {
          cIdx++;
          typeEl.textContent = word.slice(0, cIdx);
          if (cIdx === word.length) { deleting = true; delay = 1600; }
        } else {
          cIdx--;
          typeEl.textContent = word.slice(0, cIdx);
          if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; delay = 300; }
        }
        setTimeout(tick, delay);
      };
      tick();
    }
  }

  /* Particles (home hero) */
  var canvas = document.getElementById('particle-canvas');
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext('2d');
    var host = canvas.parentElement;
    var W, H, pts = [];
    var resize = function () {
      W = canvas.width = host.offsetWidth;
      H = canvas.height = host.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    var count = Math.min(70, Math.floor(W / 18));
    for (var i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5, a: Math.random() * 0.5 + 0.1
      });
    }
    var draw = function () {
      ctx.clearRect(0, 0, W, H);
      var i, j, p;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(96,165,250,' + p.a + ')';
        ctx.fill();
      }
      for (i = 0; i < pts.length; i++) {
        for (j = i + 1; j < pts.length; j++) {
          var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = 'rgba(96,165,250,' + (0.12 * (1 - d / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* Contact form (Formspree) */
  var form = document.getElementById('contact-form');
  if (form) {
    var statusEl = document.getElementById('form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          submitBtn.style.display = 'none';
          statusEl.className = 'form-status ok';
          statusEl.textContent = "✓ Sent! We'll be in touch within 24 hours.";
        } else { throw new Error('bad response'); }
      }).catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message — Get a Free Quote →';
        statusEl.className = 'form-status err';
        statusEl.innerHTML = 'Something went wrong. Email us at <a href="mailto:asuter@muskokadigitalboost.ca">asuter@muskokadigitalboost.ca</a>';
      });
    });
  }
})();
