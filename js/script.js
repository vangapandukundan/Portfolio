// ═══════════════════════════════════════════════════════════════
//  KUNDAN PORTFOLIO — JS (Figma Reference Match)
//  Custom Cursor · Marquee · Skill Bars · Filter · Nav
// ═══════════════════════════════════════════════════════════════

'use strict';

// ─── Custom Cursor ────────────────────────────────────────────
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const dot    = document.getElementById('cursor-dot');
  if (!cursor || !dot) return;

  let mx = -100, my = -100;
  let cx = -100, cy = -100;

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth cursor follow
  function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover grow effect
  const interactives = 'a, button, .ftab, .proj-card, .project-featured, .stat-chip, .comp-card, .fact-item, .skill-bar-item, .marquee-item, .social-btn';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      cursor.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      cursor.classList.remove('hover');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    dot.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    dot.style.opacity = '1';
  });
})();

// ─── Navbar scroll effect ─────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ─── Mobile Navigation ────────────────────────────────────────
(function initMobileNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const backdrop   = document.getElementById('navBackdrop');
  const closeBtn   = document.getElementById('mobileClose');
  if (!hamburger || !mobileNav) return;

  function open() {
    mobileNav.classList.add('open');
    backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    mobileNav.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    mobileNav.classList.contains('open') ? close() : open()
  );
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

// ─── Smooth Scroll + Active Nav ──────────────────────────────
(function initSmoothScroll() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a, .mobile-nav a');
  const navHeight = 70;

  // Click smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - navHeight,
        behavior: 'smooth'
      });
    });
  });

  // Active state on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ─── Hero Role Typewriter ─────────────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('hero-role');
  if (!el) return;

  const roles = [
    'Data Scientist',
    'ML Developer',
    'Python Engineer',
    'AI Enthusiast',
    'Data Analyst',
  ];

  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = roles[wi];
    el.textContent = deleting
      ? word.substring(0, ci - 1)
      : word.substring(0, ci + 1);

    deleting ? ci-- : ci++;

    let delay = deleting ? 55 : 95;

    if (!deleting && ci === word.length) {
      delay = 1800; deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % roles.length;
      delay = 350;
    }

    setTimeout(type, delay);
  }

  // Blinking cursor effect via CSS border
  el.style.borderRight = '3px solid var(--purple)';
  el.style.paddingRight = '4px';
  el.style.animation = 'blink-caret 1s step-end infinite';

  const style = document.createElement('style');
  style.textContent = `@keyframes blink-caret { 0%,100%{border-right-color:var(--purple)} 50%{border-right-color:transparent} }`;
  document.head.appendChild(style);

  type();
})();

// ─── Scroll Reveal ────────────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();

// ─── Skill Bar Animation ──────────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.w;
        setTimeout(() => {
          e.target.style.width = w + '%';
        }, 200);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => obs.observe(b));
})();

// ─── Project Filter ───────────────────────────────────────────
(function initFilter() {
  const tabs     = document.querySelectorAll('.ftab');
  const featured = document.getElementById('proj-featured');
  const cards    = document.querySelectorAll('#projGrid .proj-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const f = tab.dataset.f;

      // Featured card
      if (featured) {
        const cat = featured.dataset.cat;
        const show = f === 'all' || cat === f;
        featured.style.display = show ? 'grid' : 'none';
        featured.style.opacity = show ? '1' : '0';
      }

      // Small cards
      cards.forEach(card => {
        const cat = card.dataset.cat;
        const show = f === 'all' || cat === f;
        card.style.display = show ? 'flex' : 'none';

        if (show) {
          requestAnimationFrame(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        }
      });
    });
  });
})();

// ─── Stats Counter Animation ──────────────────────────────────
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el   = e.target;
        const text = el.textContent;
        const num  = parseFloat(text);
        if (isNaN(num)) return;

        const suffix = text.replace(/[\d.]/g, '');
        let start = 0;
        const dur = 1200;
        const step = 16;
        const total = Math.ceil(dur / step);
        let cur = 0;

        const tick = () => {
          cur++;
          const val = Math.round(num * (cur / total));
          el.textContent = val + suffix;
          if (cur < total) setTimeout(tick, step);
          else el.textContent = text;
        };

        tick();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
})();

// ─── Contact Form ─────────────────────────────────────────────
(function initForm() {
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('submit-btn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const name    = document.getElementById('name')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      showToast('Please fill all required fields.', 'error');
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      e.preventDefault();
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (btn) {
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
    }
  });
})();

// ─── Toast Notifications ──────────────────────────────────────
function showToast(msg, type = 'success') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    const style = document.createElement('style');
    style.textContent = `
      .toast-wrap { position:fixed; top:80px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px; }
      .toast { padding:13px 20px; border-radius:10px; font-size:0.875rem; font-weight:500; display:flex; align-items:center; gap:10px; animation:toastIn 0.35s ease; max-width:340px; }
      @keyframes toastIn { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
      .toast-error { background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); color:#f87171; }
      .toast-success { background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.25); color:#22c55e; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(wrap);
  }

  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `${type === 'error' ? '<i class="fas fa-circle-exclamation"></i>' : '<i class="fas fa-circle-check"></i>'} ${msg}`;
  wrap.appendChild(t);

  setTimeout(() => {
    t.style.transition = 'all 0.3s';
    t.style.opacity = '0';
    t.style.transform = 'translateX(120%)';
    setTimeout(() => t.remove(), 300);
  }, 3800);
}

// ─── Theme Toggle ─────────────────────────────────────────────
(function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const icon = btn.querySelector('i');

  const updateIcon = (isLight) => {
    if (isLight) {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    } else {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  };

  // Check storage on load
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    updateIcon(true);
  }

  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      updateIcon(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      updateIcon(true);
    }
  });
})();

// ─── Parallax on hero orbs ────────────────────────────────────
(function initParallax() {
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) {
      statsEl.style.transform = `translateY(calc(-50% + ${dy * -8}px))`;
    }
  });
})();

console.log('✨ Portfolio loaded — Kundan V.');