'use strict';

/* ===== 01. HELPERS ===== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const lerp = (a, b, n) => a + (b - a) * n;
const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* Lucide icons (loads deferred → ready on DOMContentLoaded) */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});

/* ===== 02. PRELOADER ===== */
const Preloader = (() => {
  const loader = $('#loader');
  const bar = $('#loaderBar');
  const percent = $('#loaderPercent');
  let pageReady = false;

  window.addEventListener('load', () => (pageReady = true));
  setTimeout(() => (pageReady = true), 3400);            // safety fallback

  const start = performance.now();
  const DURATION = 1500;

  function finish() {
    document.body.classList.add('loaded');                // triggers hero entrance
    setTimeout(() => loader.remove(), 900);
  }

  (function tick(now) {
    const t = Math.min((now - start) / DURATION, 1);
    const eased = 1 - Math.pow(1 - t, 3);                 // easeOutCubic
    const val = Math.round(eased * 100);
    bar.style.width = val + '%';
    percent.textContent = val + '%';

    if (t < 1) requestAnimationFrame(tick);
    else {
      const wait = setInterval(() => {                    // wait for window.load
        if (pageReady) { clearInterval(wait); finish(); }
      }, 90);
    }
  })(start);
})();

/* ===== 03. CUSTOM CURSOR ===== */
const Cursor = (() => {
  if (!hasPointer || isReduced) return { update() { } };

  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my, active = false;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!active) { active = true; dot.style.opacity = ring.style.opacity = 1; }
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    active = false;
    dot.style.opacity = ring.style.opacity = 0;
  });

  window.addEventListener('mousedown', () => document.body.classList.add('cursor-down'));
  window.addEventListener('mouseup', () => document.body.classList.remove('cursor-down'));

  /* grow the ring over interactive elements */
  $$('a, button, input, textarea, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* buttery ring follow — driven by the master rAF loop */
  return {
    update() {
      rx = lerp(rx, mx, .16);
      ry = lerp(ry, my, .16);
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
    }
  };
})();

/* ===== 04. NAVBAR · SCROLLSPY · PROGRESS · BACK-TO-TOP ===== */
const ScrollUI = (() => {
  const header = $('#header');
  const progress = $('#scrollProgress');
  const backTop = $('#backTop');
  const sections = $$('main section[id]');
  const links = $$('.nav-link');

  function update() {
    const y = window.scrollY;

    header.classList.toggle('scrolled', y > 30);
    backTop.classList.toggle('show', y > 620);

    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    /* scrollspy */
    const pos = y + 140;
    let current = sections[0];
    for (const sec of sections) if (sec.offsetTop <= pos) current = sec;
    if (y + innerHeight >= document.documentElement.scrollHeight - 60)
      current = sections[sections.length - 1];            // bottom of page → contact
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current.id));
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: isReduced ? 'auto' : 'smooth' }));
  update();
})();

/* ===== 05. MOBILE MENU ===== */
const MobileMenu = (() => {
  const btn = $('#menuBtn');
  const menu = $('#navMenu');

  const close = () => {
    menu.classList.remove('open');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  menu.addEventListener('click', e => { if (e.target.closest('.nav-link')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (innerWidth > 940) close(); });
})();

/* ===== 06. TYPING ANIMATION ===== */
const Typing = (() => {
  const el = $('#typed');
  const words = ['Web Designer', 'Front-end Developer', 'UI/UX Designer', 'Creative Thinker'];

  if (isReduced) { el.textContent = words[0]; return; }

  let word = 0, char = 0, deleting = false;

  function step() {
    const current = words[word];

    char += deleting ? -1 : 1;
    el.textContent = current.slice(0, char);

    let delay = deleting ? 42 : 78;
    if (!deleting && char === current.length) { delay = 1700; deleting = true; }
    else if (deleting && char === 0) {
      deleting = false;
      word = (word + 1) % words.length;
      delay = 380;
    }
    setTimeout(step, delay);
  }
  setTimeout(step, 1400);     // begin after hero entrance
})();

/* ===== 07. SCROLL REVEAL ===== */
(() => {
  const els = $$('[data-reveal]');
  els.forEach(el => { if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay; });

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

  els.forEach(el => io.observe(el));
})();

/* ===== 09. 3D TILT & MAGNETIC BUTTONS ===== */
(() => {
  if (!hasPointer || isReduced) return;

  /* tilt */
  $$('[data-tilt]').forEach(el => {
    el.style.transition = 'transform .55s cubic-bezier(.22,.9,.28,1)';

    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - .5;
      const ny = (e.clientY - r.top) / r.height - .5;
      el.style.transform =
        `perspective(1000px) rotateX(${(-ny * 6.5).toFixed(2)}deg) rotateY(${(nx * 8).toFixed(2)}deg) translateZ(0)`;
    });

    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  /* magnetic pull */
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - .5;
      const ny = (e.clientY - r.top) / r.height - .5;
      el.style.transition = 'transform .18s ease-out';
      el.style.transform = `translate(${nx * 13}px, ${ny * 11}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .5s cubic-bezier(.22,.9,.28,1)';
      el.style.transform = '';
    });
  });
})();

/* ===== 10. CONTACT FORM & TOAST ===== */
const Toast = (() => {
  const toast = $('#toast');
  const msg = $('#toastMsg');
  let timer;

  return {
    show(text, isError = false) {
      msg.textContent = text;
      toast.classList.toggle('error', isError);
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('show'), 4200);
    }
  };
})();

(() => {
  const form = $('#contactForm');
  const send = $('#sendBtn');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* clear error state while typing */
  form.addEventListener('input', e => e.target.closest('.field')?.classList.remove('error'));

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = $('#cName');
    const email = $('#cEmail');
    const subject = $('#cSubject');
    const message = $('#cMessage');
    let valid = true;

    const check = (field, ok) => {
      field.closest('.field').classList.toggle('error', !ok);
      if (!ok) valid = false;
    };

    check(name, name.value.trim().length >= 2);
    check(email, emailRe.test(email.value.trim()));
    check(subject, subject.value.trim().length >= 3);
    check(message, message.value.trim().length >= 10);

    if (!valid) { Toast.show('Please fix the highlighted fields and try again.', true); return; }

    /* email delivery target + reply-to so replies land in the visitor's inbox */
    $('#cReplyto').value = email.value.trim();
    const ENDPOINT = 'https://formsubmit.co/ajax/ahsanimran972@gmail.com';

    send.classList.add('loading');

    const reset = () => {
      send.classList.remove('loading');
      form.reset();
    };

    (async () => {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });
        const data = await res.json();
        if (!res.ok || data.success === 'false') throw new Error('send failed');
        reset();
        Toast.show("Message sent successfully! I'll get back to you within 24 hours.");
      } catch (err) {
        /* graceful fallback — open the visitor's mail app pre-filled */
        const q = `subject=${encodeURIComponent(subject.value.trim())}` +
          `&body=${encodeURIComponent(message.value.trim() + `\n\n— ${name.value.trim()} (${email.value.trim()})`)}`;
        window.open(`mailto:ahsanimran972@gmail.com?${q}`, '_self');
        reset();
        Toast.show('Opening your email app to complete sending…');
      }
    })();
  });
})();

/* ===== 11. MASTER ANIMATION LOOP (cursor ring) ===== */
(() => {
  if (!hasPointer || isReduced) return;
  (function loop() {
    Cursor.update();
    requestAnimationFrame(loop);
  })();
})();
