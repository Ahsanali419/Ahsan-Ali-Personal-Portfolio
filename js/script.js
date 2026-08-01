/* ============================================
   AHSAN ALI - Premium Portfolio Website
   Script.js - Complete JavaScript
   Theme: Dark + Blue (#0F172A + #3B82F6)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Loading Screen ---- */
  const loader = document.querySelector('.loader-wrapper');
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('hidden'); document.body.style.overflow = 'auto'; }, 1000);
  });
  setTimeout(() => { loader.classList.add('hidden'); document.body.style.overflow = 'auto'; }, 3000);

  /* ---- Toast System ---- */
  function showToast(message, type = 'info', duration = 5000) {
    let container = document.querySelector('.toast-container');
    if (!container) { container = document.createElement('div'); container.className = 'toast-container'; document.body.appendChild(container); }

    const icons = {
      success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${icons[type]}<span class="toast-message">${message}</span><button class="toast-close" aria-label="Close"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
    container.appendChild(toast);

    const close = () => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 300); };
    toast.querySelector('.toast-close').addEventListener('click', close);
    setTimeout(close, duration);
  }

  /* ---- Custom Cursor ---- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  if (cursorDot && cursorRing && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    });
    (function loop() {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .btn, .service-card, .project-card, .social-icon, .skill-tag, .nav-link').forEach(el => {
      el.addEventListener('mouseenter', () => { cursorDot.classList.add('hover'); cursorRing.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hover'); cursorRing.classList.remove('hover'); });
    });
  }

  /* ---- Scroll Progress ---- */
  const progress = document.querySelector('.scroll-progress');
  window.addEventListener('scroll', () => {
    const s = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progress.style.width = (s / h) * 100 + '%';
  });

  /* ---- Sticky Navbar ---- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });

  /* ---- Active Nav Link ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function updateNav() {
    const pos = window.scrollY + 120;
    sections.forEach(sec => {
      const t = sec.offsetTop, h = sec.offsetHeight, id = sec.id;
      if (pos >= t && pos < t + h) {
        navLinks.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === '#' + id); });
      }
    });
  }
  window.addEventListener('scroll', updateNav);
  updateNav();

  /* ---- Mobile Menu ---- */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const menuOverlay = document.querySelector('.menu-overlay');
  function toggleMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : 'auto';
  }
  hamburger.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', toggleMenu);
  navLinks.forEach(l => l.addEventListener('click', () => { if (navMenu.classList.contains('open')) toggleMenu(); }));

  /* ---- Typing Animation ---- */
  const typingEl = document.querySelector('.typing-text');
  const roles = ['Web Designer', 'Front-End Developer', 'UI/UX Designer', 'Creative Thinker', 'Problem Solver'];
  let ri = 0, ci = 0, deleting = false, speed = 80;
  function typeLoop() {
    const role = roles[ri];
    typingEl.textContent = deleting ? role.substring(0, --ci) : role.substring(0, ++ci);
    speed = deleting ? 35 : 75;
    if (!deleting && ci === role.length) { speed = 2000; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; speed = 350; }
    setTimeout(typeLoop, speed);
  }
  setTimeout(typeLoop, 1200);

  /* ---- Particles ---- */
  const pContainer = document.querySelector('.particles-container');
  if (pContainer) {
    const colors = ['#3B82F6', '#60A5FA', '#2563EB', '#93C5FD'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (5 + Math.random() * 7) + 's';
      p.style.animationDelay = Math.random() * 7 + 's';
      const s = (1.5 + Math.random() * 2.5) + 'px';
      p.style.width = s; p.style.height = s;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      pContainer.appendChild(p);
    }
  }

  /* ---- Scroll Reveal ---- */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  function checkReveal() {
    const trigger = window.innerHeight * 0.85;
    reveals.forEach(el => { if (el.getBoundingClientRect().top < trigger) el.classList.add('active'); });
  }
  window.addEventListener('scroll', checkReveal);
  setTimeout(checkReveal, 200);

  /* ---- Contact Form + EmailJS ---- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fields = { name: form.querySelector('#name'), email: form.querySelector('#email'), subject: form.querySelector('#subject'), message: form.querySelector('#message') };
      const btn = form.querySelector('.form-submit');
      const origHTML = btn.innerHTML;

      // Clear errors
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      // Validate
      let valid = true;
      const v = {};
      Object.entries(fields).forEach(([k, el]) => {
        v[k] = el.value.trim();
        if (!v[k]) { el.closest('.form-group').classList.add('error'); valid = false; }
      });
      if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
        fields.email.closest('.form-group').classList.add('error');
        valid = false;
      }
      if (v.message && v.message.length < 10) {
        fields.message.closest('.form-group').classList.add('error');
        valid = false;
      }
      if (!valid) { showToast('Please fill in all fields correctly.', 'error'); return; }

      // Loading
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-spinner"></span> Sending...';

      try {
        const now = new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
        const params = { from_name: v.name, from_email: v.email, subject: v.subject, message: v.message, to_email: 'ahsanimran972@gmail.com', submission_date: now };

        if (typeof emailjs !== 'undefined') {
          const res = await emailjs.send('service_portfolio', 'template_contact', params);
          if (res.status === 200) { showToast('Message sent successfully! I\'ll get back to you soon.', 'success'); form.reset(); }
          else throw new Error('Send failed');
        } else {
          // Fallback: Web3Forms
          const fd = new FormData();
          fd.append('access_key', 'YOUR_WEB3FORMS_KEY');
          fd.append('name', v.name); fd.append('email', v.email);
          fd.append('subject', v.subject); fd.append('message', v.message);
          const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
          const data = await res.json();
          if (data.success) { showToast('Message sent successfully!', 'success'); form.reset(); }
          else throw new Error('Web3Forms failed');
        }
      } catch (err) {
        console.error(err);
        showToast('Could not send message. Please try again or email directly.', 'error');
        setTimeout(() => {
          if (confirm('Open email app to send instead?')) {
            window.location.href = `mailto:ahsanimran972@gmail.com?subject=${encodeURIComponent(v.subject)}&body=${encodeURIComponent(`Name: ${v.name}\nEmail: ${v.email}\n\n${v.message}`)}`;
          }
        }, 800);
      } finally {
        btn.disabled = false;
        btn.innerHTML = origHTML;
      }
    });
  }

  /* ---- Real-time field validation ---- */
  document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('input', () => input.closest('.form-group').classList.remove('error'));
    input.addEventListener('blur', () => {
      const val = input.value.trim();
      if (input.hasAttribute('required') && !val) input.closest('.form-group').classList.add('error');
      if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) input.closest('.form-group').classList.add('error');
    });
  });

  /* ---- Smooth Scroll ---- */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const el = document.querySelector(link.getAttribute('href'));
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    });
  });

  /* ---- Card Tilt Effect (desktop only, no touch) ---- */
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (window.innerWidth > 1024 && !isTouch) {
    document.querySelectorAll('.service-card, .project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / 20;
        const y = (e.clientY - r.top - r.height / 2) / 20;
        card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---- Back to Top ---- */
  const btt = document.querySelector('.back-to-top');
  if (btt) btt.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

});
