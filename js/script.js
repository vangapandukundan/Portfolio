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
  let firstMove = true;
  let isTouchDevice = false;

  // Touch detection to instantly disable custom cursor on touch devices (phones/tablets)
  function disableCursorForTouch() {
    if (isTouchDevice) return;
    isTouchDevice = true;
    document.body.classList.add('touch-device');
    cursor.style.display = 'none';
    dot.style.display = 'none';
  }

  // Check if browser reports touch support initially
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
    disableCursorForTouch();
  }

  // Backup listener in case of dynamic touch interaction
  window.addEventListener('touchstart', disableCursorForTouch, { passive: true });

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    if (isTouchDevice) return;
    
    mx = e.clientX;
    my = e.clientY;
    
    // Position dot instantly
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    
    if (firstMove) {
      cx = mx;
      cy = my;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      firstMove = false;
    }
  });

  // Smooth cursor follow (outer circle lerping)
  // High lerp (0.85) = almost real-time → click position visually matches actual mouse
  function animateCursor() {
    if (isTouchDevice) return;
    
    if (!firstMove) {
      cx += (mx - cx) * 0.85;
      cy += (my - cy) * 0.85;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover grow effect (flicker-free interactive element detection)
  const interactives = 'a, button, .ftab, .proj-card, .project-featured, .stat-chip, .comp-card, .fact-item, .skill-bar-item, .marquee-item, .social-btn';

  document.addEventListener('mouseover', (e) => {
    if (isTouchDevice) return;
    if (e.target.closest(interactives)) {
      // Snap ring exactly to mouse when entering interactive — no lag on hover
      cx = mx;
      cy = my;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      cursor.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (isTouchDevice) return;
    const currentInteractive = e.target.closest(interactives);
    if (currentInteractive) {
      const nextInteractive = (e.relatedTarget && typeof e.relatedTarget.closest === 'function')
        ? e.relatedTarget.closest(interactives)
        : null;
      // Only remove the hover class if we're not moving to another interactive element (or nested child)
      if (!nextInteractive) {
        cursor.classList.remove('hover');
      }
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
  el.style.borderRight = '3px solid var(--accent)';
  el.style.paddingRight = '4px';
  el.style.animation = 'blink-caret 1s step-end infinite';

  const style = document.createElement('style');
  style.textContent = `@keyframes blink-caret { 0%,100%{border-right-color:var(--accent)} 50%{border-right-color:transparent} }`;
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
  const container = document.getElementById('filterTabs');
  if (!container) return;

  const tabs     = container.querySelectorAll('.ftab');
  const featured = document.getElementById('proj-featured');
  const cards    = document.querySelectorAll('#projGrid .proj-card');

  container.addEventListener('click', (e) => {
    const tab = e.target.closest('.ftab');
    if (!tab) return;

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

// ─── Interactive Pipeline Skills Flow ─────────────────────────
(function initPipelineSkills() {
  const container = document.querySelector('.pipeline-layout');
  if (!container) return;

  const stages = container.querySelectorAll('.pipeline-stage');
  const displayPane = document.getElementById('pipelineSkillsPane');
  const dot = document.getElementById('pipelineDot');
  if (!stages.length || !displayPane || !dot) return;

  const pipelineData = {
    ingestion: [
      { name: 'Python', use: 'Scripting feature transformations & pipelines', icon: '<i class="fab fa-python" style="color: #38bdf8;"></i>' },
      { name: 'Pandas', use: 'Structuring data tables, EDA & cleaning logs', icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="color: #818cf8;"><path d="M4 2h4v20H4V2zm6 4h4v16h-4V6zm6 6h4v10h-4V12z"/></svg>' },
      { name: 'NumPy', use: 'Matrix operations & multi-dimensional array math', icon: '<i class="fas fa-calculator" style="color: #6366f1;"></i>' },
      { name: 'SQL / Databases', use: 'Aggregating records & optimization queries', icon: '<i class="fas fa-database" style="color: #10b981;"></i>' }
    ],
    modeling: [
      { name: 'Scikit-learn', use: 'Evaluating classifier pipelines & regression models', icon: '<i class="fas fa-brain" style="color: #34d399;"></i>' },
      { name: 'XGBoost', use: 'Building tree ensemble models on structured datasets', icon: '<i class="fas fa-bolt" style="color: #fbbf24;"></i>' },
      { name: 'TensorFlow', use: 'Fitting sentiment classifier nets & sequence models', icon: '<i class="fas fa-network-wired" style="color: #f97316;"></i>' },
      { name: 'PyTorch', use: 'Deep neural research & model tuning loops', icon: '<i class="fas fa-fire" style="color: #ef4444;"></i>' }
    ],
    deployment: [
      { name: 'FastAPI', use: 'Developing async prediction APIs for DevPulse', icon: '<i class="fas fa-bolt" style="color: #0ea5e9;"></i>' },
      { name: 'Flask', use: 'Serving ML models via simple web endpoints', icon: '<i class="fas fa-flask" style="color: #f8fafc;"></i>' },
      { name: 'Git & GitHub', use: 'Managing repository versions & CI/CD workflow hooks', icon: '<i class="fab fa-github" style="color: #f8fafc;"></i>' }
    ],
    interface: [
      { name: 'React.js', use: 'Building the DevPulse interactive analytics dashboard', icon: '<i class="fab fa-react" style="color: #14b8a6;"></i>' },
      { name: 'Streamlit', use: 'Coding interactive AI reviewer & threat detection interfaces', icon: '<i class="fas fa-chart-line" style="color: #ff4b4b;"></i>' },
      { name: 'Tailwind CSS', use: 'Styling dashboard interfaces with fluid layouts', icon: '<i class="fab fa-css3" style="color: #38bdf8;"></i>' },
      { name: 'Figma', use: 'Mapping user flows & high-fidelity prototype layouts', icon: '<i class="fab fa-figma" style="color: #a259ff;"></i>' }
    ]
  };

  // Dynamically draw an animated canvas background inside cards on hover
  function drawCardSparkline(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = 140;
    let height = canvas.height = 45;
    let points = [];
    for (let i = 0; i <= 6; i++) {
      points.push({
        x: (width / 6) * i,
        y: height - (Math.random() * (height - 10) + 5)
      });
    }

    let offset = 0;
    let animId;

    function render() {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#C9A84C';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(points[0].x, points[0].y + Math.sin(offset) * 4);
      for (let i = 1; i < points.length; i++) {
        const py = points[i].y + Math.sin(offset + i) * 3;
        ctx.lineTo(points[i].x, py);
      }
      ctx.stroke();

      offset += 0.04;
      animId = requestAnimationFrame(render);
    }
    
    canvas.addEventListener('mouseenter', () => {
      render();
    });
    
    canvas.addEventListener('mouseleave', () => {
      cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, width, height);
    });
  }

  function renderPane(stageId) {
    displayPane.innerHTML = '';
    const skills = pipelineData[stageId];
    if (!skills) return;

    skills.forEach((skill, index) => {
      const card = document.createElement('div');
      card.className = 'skill-flow-card';
      
      // Canvas background element
      const hasGraph = stageId === 'modeling' || stageId === 'ingestion';
      const graphHtml = hasGraph ? `<canvas class="skill-card-bg-graph"></canvas>` : '';

      card.innerHTML = `
        <div class="skill-card-main">
          <div class="skill-card-icon">${skill.icon}</div>
          <div class="skill-card-info">
            <span class="skill-card-name">${skill.name}</span>
            <span class="skill-card-use">${skill.use}</span>
          </div>
        </div>
        ${graphHtml}
      `;
      
      displayPane.appendChild(card);

      if (hasGraph) {
        const cv = card.querySelector('.skill-card-bg-graph');
        drawCardSparkline(cv);
      }

      // Stagger fade-in transition
      setTimeout(() => {
        card.classList.add('show');
      }, index * 75);
    });
  }

  function updateActiveStage(selectedStage) {
    stages.forEach(stage => {
      stage.classList.toggle('active', stage === selectedStage);
    });

    // Move the glowing dot along the vertical track (approx positions)
    const stageIndex = Array.from(stages).indexOf(selectedStage);
    const totalStages = stages.length;
    
    // Only adjust dot position if track exists on desktop screens
    if (window.innerWidth > 900) {
      const percent = (stageIndex / (totalStages - 1)) * 90; // range 0 to 90%
      dot.style.top = `calc(${percent}% + 18px)`;
    }

    renderPane(selectedStage.dataset.id);
  }

  // Click events
  stages.forEach(stage => {
    stage.addEventListener('click', () => {
      updateActiveStage(stage);
    });
  });

  // Default load
  updateActiveStage(stages[0]);
})();

console.log('✨ Portfolio loaded — Kundan V.');

// ─── Theme Accent Color Switcher ──────────────────────────────
(function initThemeSwitcher() {
  const colorThemes = {
    gold: { accent: '#C9A84C', dim: 'rgba(201, 168, 76, 0.12)', glow: 'rgba(201, 168, 76, 0.28)' },
    purple: { accent: '#6366F1', dim: 'rgba(99, 102, 241, 0.12)', glow: 'rgba(99, 102, 241, 0.28)' },
    pink: { accent: '#EC4899', dim: 'rgba(236, 72, 153, 0.12)', glow: 'rgba(236, 72, 153, 0.28)' },
    green: { accent: '#10B981', dim: 'rgba(16, 185, 129, 0.12)', glow: 'rgba(16, 185, 129, 0.28)' },
    blue: { accent: '#3B82F6', dim: 'rgba(59, 130, 246, 0.12)', glow: 'rgba(59, 130, 246, 0.28)' }
  };

  function applyTheme(color) {
    const theme = colorThemes[color];
    if (!theme) return;
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--accent-dim', theme.dim);
    document.documentElement.style.setProperty('--accent-glow', theme.glow);
  }

  // Always load saved preference
  const savedColor = localStorage.getItem('kundan-accent-theme');
  if (savedColor && colorThemes[savedColor]) {
    applyTheme(savedColor);
  }

  const toggleBtn = document.getElementById('theme-toggle-btn');
  const dropdown = document.getElementById('theme-dropdown');
  if (!toggleBtn || !dropdown) return;

  // Sync dropdown active state if there is a saved color
  if (savedColor && colorThemes[savedColor]) {
    const options = dropdown.querySelectorAll('.theme-opt-color');
    options.forEach(o => {
      o.classList.toggle('active', o.dataset.color === savedColor);
    });
  }

  // Toggle Dropdown
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== toggleBtn) {
      dropdown.classList.remove('open');
    }
  });

  // Handle color option click
  const options = dropdown.querySelectorAll('.theme-opt-color');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const color = opt.dataset.color;
      applyTheme(color);

      // Update active class on dropdown buttons
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      // Save user preference
      localStorage.setItem('kundan-accent-theme', color);

      dropdown.classList.remove('open');
      showToast(`Accent theme set to ${opt.title}!`, 'success');
    });
  });
})();

// ─── Kundan-AI Chatbot Assistant (v2 — Full Upgrade) ─────────
(function initAiAssistant() {

  // ── Element Refs ─────────────────────────────────────────────
  const aiBtn        = document.getElementById('ai-btn');
  const chatWindow   = document.getElementById('ai-chat-window');
  const closeBtn     = document.getElementById('ai-close-btn');
  const clearBtn     = document.getElementById('ai-clear-btn');
  const minimizeBtn  = document.getElementById('ai-minimize-btn');
  const aiHeader     = document.getElementById('ai-header');
  const chatForm     = document.getElementById('ai-form');
  const chatInput    = document.getElementById('ai-input');
  const sendBtn      = document.getElementById('ai-send-btn');
  const chatBody     = document.getElementById('ai-body');
  const optionsEl    = document.getElementById('ai-options');
  const suggestionsEl= document.getElementById('ai-suggestions');
  const unreadBadge  = document.getElementById('robot-unread-badge');
  const welcomeTime  = document.getElementById('ai-welcome-time');

  if (!aiBtn || !chatWindow || !chatBody) return;

  // ── State ─────────────────────────────────────────────────────
  let isMinimized = false;
  let unreadCount = 0;
  let isOpen = false;

  // ── Set welcome message timestamp ────────────────────────────
  if (welcomeTime) welcomeTime.textContent = getTimeStr();

  // ── Web Audio: subtle send beep ──────────────────────────────
  function playBeep(type = 'send') {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'send' ? 880 : 660, ac.currentTime);
      gain.gain.setValueAtTime(0.06, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.18);
    } catch (e) { /* AudioContext not available */ }
  }

  // ── Helpers ───────────────────────────────────────────────────
  function getTimeStr() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // ── Badge ─────────────────────────────────────────────────────
  function showBadge(count) {
    if (!unreadBadge) return;
    if (count > 0 && !isOpen) {
      unreadBadge.textContent = count > 9 ? '9+' : count;
      unreadBadge.classList.add('visible');
    } else {
      unreadBadge.classList.remove('visible');
    }
  }

  function clearBadge() {
    unreadCount = 0;
    showBadge(0);
  }

  // ── Open / Close ──────────────────────────────────────────────
  function openChat() {
    chatWindow.classList.remove('hidden');
    isOpen = true;
    clearBadge();
    if (isMinimized) expandChat();
    chatInput.focus();
    scrollToBottom();
    sitDown();
    // Hide quick options once user has started chatting
    if (chatBody.querySelectorAll('.ai-msg.user').length > 0 && optionsEl) {
      optionsEl.style.display = 'none';
    }
  }

  function closeChat() {
    chatWindow.classList.add('hidden');
    isOpen = false;
    standUp();
  }

  function minimizeChat() {
    isMinimized = true;
    chatWindow.classList.add('minimized');
    minimizeBtn.querySelector('i').className = 'fas fa-expand-alt';
    minimizeBtn.title = 'Expand';
  }

  function expandChat() {
    isMinimized = false;
    chatWindow.classList.remove('minimized');
    minimizeBtn.querySelector('i').className = 'fas fa-minus';
    minimizeBtn.title = 'Minimize';
    scrollToBottom();
  }

  // ── Robot States ──────────────────────────────────────────────
  function sitDown()   { aiBtn.classList.add('sitting'); }
  function standUp()   { aiBtn.classList.remove('sitting'); }

  // ── Event Listeners ──────────────────────────────────────────
  aiBtn.addEventListener('click', () => isOpen ? closeChat() : openChat());
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeChat(); });

  minimizeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isMinimized ? expandChat() : minimizeChat();
  });

  // Clicking header minimizes/expands (but not on action buttons)
  aiHeader && aiHeader.addEventListener('click', (e) => {
    if (!e.target.closest('.ai-header-actions')) {
      isMinimized ? expandChat() : minimizeChat();
    }
  });

  // Clear chat
  clearBtn && clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Keep only the date divider and welcome message
    const msgs = chatBody.querySelectorAll('.ai-msg');
    msgs.forEach((m, i) => { if (i > 0) m.remove(); });
    // Reset suggestions
    if (suggestionsEl) suggestionsEl.innerHTML = '';
    // Show quick options again
    if (optionsEl) optionsEl.style.display = '';
    // Confirm with a bot message
    addBotMessage('Chat history cleared! Feel free to ask me anything. 🗑️✨');
  });

  // Keyboard shortcut: Alt+K to toggle chatbot
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      isOpen ? closeChat() : openChat();
    }
    if (e.key === 'Escape' && isOpen) closeChat();
  });

  // Enable/disable send button
  chatInput.addEventListener('input', () => {
    sendBtn.disabled = !chatInput.value.trim();
  });

  // Handle form submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;
    sendMessage(query);
  });

  // Handle quick option clicks + suggestion chips
  document.addEventListener('click', (e) => {
    const opt = e.target.closest('.ai-opt');
    const chip = e.target.closest('.ai-suggestion-chip');

    if (opt) {
      const query = opt.dataset.query;
      addUserMessage(opt.textContent.trim());
      // Scroll to section shortcut
      const sectionMap = { projects: 'work', skills: 'skills', contact: 'contact' };
      const secId = sectionMap[query];
      if (secId) {
        const section = document.getElementById(secId);
        if (section) window.scrollTo({ top: section.offsetTop - 70, behavior: 'smooth' });
      }
      // Hide quick options after first use
      if (optionsEl) optionsEl.style.display = 'none';
      respondToQuery(query);
    }

    if (chip) {
      const q = chip.dataset.query || chip.textContent.trim();
      sendMessage(q);
    }
  });

  function sendMessage(query) {
    addUserMessage(query);
    chatInput.value = '';
    sendBtn.disabled = true;
    playBeep('send');
    if (optionsEl) optionsEl.style.display = 'none';
    respondToQuery(query);
  }

  // ── Message Rendering ─────────────────────────────────────────
  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'ai-msg user';
    msg.innerHTML = `
      <div class="ai-msg-content">${escapeHTML(text)}</div>
      <div class="ai-msg-time">${getTimeStr()}</div>
    `;
    chatBody.appendChild(msg);
    scrollToBottom();
  }

  function addBotMessage(html, suggestions = []) {
    const msg = document.createElement('div');
    msg.className = 'ai-msg bot';
    msg.innerHTML = `
      <div class="ai-msg-content">${html}</div>
      <div class="ai-msg-time">${getTimeStr()}</div>
    `;
    chatBody.appendChild(msg);
    scrollToBottom();

    // Unread badge if chat is closed
    if (!isOpen) { unreadCount++; showBadge(unreadCount); }

    // Show follow-up suggestions
    if (suggestionsEl) {
      suggestionsEl.innerHTML = '';
      suggestions.forEach(s => {
        const chip = document.createElement('button');
        chip.className = 'ai-suggestion-chip';
        chip.dataset.query = s.query || s.label;
        chip.textContent = s.label;
        suggestionsEl.appendChild(chip);
      });
    }
    playBeep('recv');
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'ai-msg bot typing-indicator';
    indicator.innerHTML = `
      <div class="ai-msg-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatBody.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    chatBody.querySelectorAll('.typing-indicator').forEach(i => i.remove());
  }

  // ── Respond to a query ────────────────────────────────────────
  function respondToQuery(query) {
    showTypingIndicator();
    const delay = 700 + Math.random() * 600;
    setTimeout(() => {
      removeTypingIndicator();
      const { reply, suggestions } = getBotReply(query);
      addBotMessage(reply, suggestions);
    }, delay);
  }

  // ── Bot Brain ─────────────────────────────────────────────────
  function getBotReply(query) {
    const q = query.toLowerCase().trim();
    let reply = '';
    let suggestions = [];

    // ── GREETINGS
    if (/\b(hello|hi|hey|yo|greetings|good morning|good afternoon|good evening)\b/.test(q)) {
      reply = `Hello there! 👋 I'm Kundan AI. I can tell you all about Vangapandu Kundan's projects, skills, and experience. What would you like to explore?`;
      suggestions = [
        { label: '🚀 Show projects', query: 'projects' },
        { label: '⚡ View skills', query: 'skills' },
        { label: '📞 Contact info', query: 'contact' },
      ];
      return { reply, suggestions };
    }

    // ── ABOUT
    if (/about|kundan|who is|resume|bio|background/.test(q)) {
      reply = `<strong>Vangapandu Kundan</strong> is a 4th-year B.Tech student in Computer Data Science at <strong>GITAM University, Hyderabad</strong> (2023–27).<br><br>
      He's passionate about turning complex data into real-world impact — building everything from prediction dashboards to AI agents like <strong>DevPulse</strong>. He has completed 3 internships and holds 8+ certifications.<br><br>
      Outside coding: Badminton 🏸, Trekking 🏔️, Online games 🎮.`;
      suggestions = [
        { label: '💼 Internships', query: 'experience' },
        { label: '🎓 Education', query: 'education' },
        { label: '🏆 Certifications', query: 'certifications' },
      ];
      return { reply, suggestions };
    }

    // ── SPECIFIC PROJECTS ────────────────────────────────────────

    if (/devpulse|dev.pulse/.test(q)) {
      reply = `<strong>DevPulse</strong> — AI Developer Advocacy & Burnout Agent 🤖<br>
      ▸ Tracks code velocity & captures unrecorded "Invisible Work" (mentoring, reviews)<br>
      ▸ Analyzes burnout risk factors with ML models<br>
      ▸ Auto-blocks focus time on Google Calendar via API<br>
      ▸ <strong>Stack:</strong> React.js · FastAPI · Python · Google Calendar API · AI Agents<br><br>
      <a href="https://github.com/vangapandukundan/DevPulse" target="_blank">GitHub Repo ↗</a> &nbsp;|&nbsp; <a href="https://dev-pulse-sigma-taupe.vercel.app/" target="_blank">Live Demo ↗</a>`;
      suggestions = [
        { label: '🌿 Green DC Project', query: 'green data center' },
        { label: '🔒 Campus Auth', query: 'campus auth' },
        { label: '🛡️ Threat Detection', query: 'threat detection' },
      ];
      return { reply, suggestions };
    }

    if (/green|quantum|data.center|energy|pue/.test(q)) {
      reply = `<strong>Green Quantum Data Center Optimization</strong> 🌿<br>
      ▸ Optimizes data center PUE (Power Usage Effectiveness) with ensemble ML<br>
      ▸ Uses Isolation Forests to flag infrastructure anomalies in real-time<br>
      ▸ <strong>Stack:</strong> Python · Pandas · Scikit-learn · Matplotlib<br><br>
      <a href="https://github.com/vangapandukundan/green_dc_project" target="_blank">GitHub Repo ↗</a> &nbsp;|&nbsp; <a href="https://green-dc-predictor.streamlit.app/" target="_blank">Live Demo ↗</a>`;
      suggestions = [
        { label: '🤖 DevPulse', query: 'devpulse' },
        { label: '💬 Emotion Tracker', query: 'emotional feedback' },
        { label: '🛡️ Threat Detection', query: 'threat detection' },
      ];
      return { reply, suggestions };
    }

    if (/emotional|feedback|sentiment|emotion tracker/.test(q)) {
      reply = `<strong>Emotional Feedback Tracker</strong> 💬<br>
      ▸ Real-time sentiment dashboard powered by deep learning<br>
      ▸ Tracks sentiment distributions and user wellbeing trends<br>
      ▸ <strong>Stack:</strong> Python · TensorFlow · Flask · Chart.js<br><br>
      <a href="https://github.com/vangapandukundan/EmotionalFeedbackTracker" target="_blank">GitHub Repo ↗</a> &nbsp;|&nbsp; <a href="https://lumina-emotion-tracker.vercel.app/" target="_blank">Live Demo ↗</a>`;
      suggestions = [
        { label: '🤖 DevPulse', query: 'devpulse' },
        { label: '🔒 Campus Auth', query: 'campus auth' },
        { label: '🛡️ Threat Detection', query: 'threat detection' },
      ];
      return { reply, suggestions };
    }

    if (/campus|auth|biometric|webauthn/.test(q)) {
      reply = `<strong>Campus Auth</strong> 🔒<br>
      ▸ Secure campus authentication with facial & biometric recognition<br>
      ▸ Built on WebAuthn standards for passwordless login<br>
      ▸ <strong>Stack:</strong> React · Node.js · WebAuthn · CSS<br><br>
      <a href="https://github.com/vangapandukundan/campus-auth" target="_blank">GitHub Repo ↗</a> &nbsp;|&nbsp; <a href="https://campus-auth.vercel.app/login" target="_blank">Live Demo ↗</a>`;
      suggestions = [
        { label: '🤖 DevPulse', query: 'devpulse' },
        { label: '🖼️ Image Resizer', query: 'image resizer' },
        { label: 'See all projects', query: 'all projects' },
      ];
      return { reply, suggestions };
    }

    if (/code.review|flake8|reviewer/.test(q)) {
      reply = `<strong>AI Code Reviewer</strong> 🛠️<br>
      ▸ Built during Elevate Labs internship<br>
      ▸ Combines Flake8 static analysis with AI suggestions for code improvements<br>
      ▸ <strong>Stack:</strong> Python · Streamlit · Flake8 · Generative AI APIs<br><br>
      <a href="https://github.com/vangapandukundan/ai-code-reviewer" target="_blank">GitHub Repo ↗</a> &nbsp;|&nbsp; <a href="https://jgmqxoaptndlsravfmjpxg.streamlit.app/" target="_blank">Live Demo ↗</a>`;
      suggestions = [
        { label: '🛡️ Threat Detection', query: 'threat detection' },
        { label: '💼 Elevate Labs', query: 'elevate labs internship' },
      ];
      return { reply, suggestions };
    }

    if (/threat|detection|cybersecurity|network.log/.test(q)) {
      reply = `<strong>Threat Detection AI</strong> 🛡️<br>
      ▸ ML classification pipeline detecting malicious activity in server logs<br>
      ▸ Combines feature engineering, model evaluation & live Streamlit dashboard<br>
      ▸ <strong>Stack:</strong> Python · Scikit-learn · Pandas · Streamlit · Matplotlib<br><br>
      <a href="https://github.com/vangapandukundan/Threat-Detection-AI" target="_blank">GitHub Repo ↗</a> &nbsp;|&nbsp; <a href="https://threat-detection-ai-sfmyghe6azj9pr29x8yaon.streamlit.app/" target="_blank">Live Demo ↗</a>`;
      suggestions = [
        { label: '🤖 DevPulse', query: 'devpulse' },
        { label: '🌿 Green DC', query: 'green data center' },
        { label: 'See all projects', query: 'all projects' },
      ];
      return { reply, suggestions };
    }

    if (/image.resi|canvas|resizer/.test(q)) {
      reply = `<strong>Browser Image Resizer</strong> 🖼️<br>
      ▸ Fully client-side — no server processing needed<br>
      ▸ Uses HTML5 Canvas API for instant image resizing<br>
      ▸ <strong>Stack:</strong> HTML5 Canvas · Vanilla JavaScript · CSS3<br><br>
      <a href="https://github.com/vangapandukundan/Image_Resizer" target="_blank">GitHub Repo ↗</a> &nbsp;|&nbsp; <a href="https://vangapandukundan.github.io/Image_Resizer/" target="_blank">Live Demo ↗</a>`;
      suggestions = [
        { label: '🔒 Campus Auth', query: 'campus auth' },
        { label: 'See all projects', query: 'all projects' },
      ];
      return { reply, suggestions };
    }

    // ── ALL PROJECTS
    if (/project|work|portfolio|all project|github|build/.test(q)) {
      reply = `Here are all of Kundan's projects:<br>
      <ul>
        <li>🤖 <strong>DevPulse</strong> — AI Developer Advocacy & Burnout Agent</li>
        <li>🌿 <strong>Green Quantum DC</strong> — Energy optimizer for data centers</li>
        <li>💬 <strong>Emotional Feedback Tracker</strong> — Sentiment AI dashboard</li>
        <li>🔒 <strong>Campus Auth</strong> — Biometric authentication system</li>
        <li>🛠️ <strong>AI Code Reviewer</strong> — Automated static analysis tool</li>
        <li>🛡️ <strong>Threat Detection AI</strong> — Cybersecurity log classifier</li>
        <li>🖼️ <strong>Browser Image Resizer</strong> — Client-side Canvas resizer</li>
      </ul>
      Ask me about any specific one, or <a href="projects.html" target="_blank">view full Projects page ↗</a>`;
      suggestions = [
        { label: '🤖 DevPulse details', query: 'devpulse' },
        { label: '🛡️ Threat Detection', query: 'threat detection' },
        { label: '⚡ His skills', query: 'skills' },
      ];
      return { reply, suggestions };
    }

    // ── SKILLS & TECH
    if (/python|pandas|numpy|sql|scikit|tensorflow|pytorch|ml|machine.learning|ai|deep.learning|skill|stack|tool/.test(q)) {
      reply = `Kundan's technical stack:<br>
      <strong>Languages:</strong> Python (primary) · SQL · JavaScript · HTML · CSS<br>
      <strong>ML & Data:</strong> Scikit-learn · Pandas · NumPy · XGBoost · TensorFlow · PyTorch<br>
      <strong>Web / APIs:</strong> React.js · FastAPI · Flask · Streamlit · Node.js<br>
      <strong>Tools:</strong> Git/GitHub · Figma · Firebase · Jupyter · VS Code<br><br>
      Explore the interactive <a href="index.html#skills">Skills Pipeline ↗</a> on the homepage!`;
      suggestions = [
        { label: '🚀 See projects', query: 'all projects' },
        { label: '💼 Internships', query: 'experience' },
        { label: '🏆 Certifications', query: 'certifications' },
      ];
      return { reply, suggestions };
    }

    // ── INTERNSHIPS / EXPERIENCE
    if (/intern|experience|job|work experience/.test(q)) {
      reply = `Kundan has completed <strong>3 internships</strong>:<br>
      <ul>
        <li>💼 <strong>Data Science Intern @ Intrainz</strong> (2025) — Feature pipelines & predictive models</li>
        <li>💼 <strong>Python Developer @ Elevate Labs</strong> (2025) — Built AI Code Reviewer & automation tools</li>
        <li>💼 <strong>Web Developer @ VBLP Tech Solutions</strong> (2025) — Responsive UI development</li>
      </ul>`;
      suggestions = [
        { label: '🎓 Education', query: 'education' },
        { label: '🏆 Certifications', query: 'certifications' },
        { label: '🚀 Projects', query: 'all projects' },
      ];
      return { reply, suggestions };
    }

    // ── EDUCATION
    if (/school|college|university|gitam|education|study|degree/.test(q)) {
      reply = `🎓 <strong>Education:</strong><br>
      ▸ <strong>B.Tech Computer Data Science</strong> — GITAM University, Hyderabad (2023–27)<br>
      ▸ Intermediate — Sri Chaitanya Bhaskar Bhavan<br>
      ▸ High School — Nalanda Vidya Nikethan`;
      suggestions = [
        { label: '💼 Internships', query: 'experience' },
        { label: '🏆 Certifications', query: 'certifications' },
      ];
      return { reply, suggestions };
    }

    // ── CERTIFICATIONS
    if (/cert|credential|achieve|badge|course|coursera|google|ibm|deloitte/.test(q)) {
      reply = `Kundan holds <strong>8+ professional certifications</strong>:<br>
      <ol>
        <li>☁️ <strong>Google Cloud</strong> — Engineer AI Agent with Dev Kit (2026)</li>
        <li>📊 <strong>Google</strong> — Data Analytics Certificate (2025)</li>
        <li>🎨 <strong>Google</strong> — UI/UX Design Certificate (2025)</li>
        <li>🏢 <strong>Deloitte</strong> — Data Analytics Job Simulation (2025)</li>
        <li>🌤️ <strong>GITAM</strong> — AI Weather Forecasting Workshop (2025)</li>
        <li>🐍 <strong>Naresh i Tech</strong> — Python Course Certificate (2025)</li>
        <li>💼 <strong>Intrainz</strong> — Data Science Internship (2025)</li>
        <li>💻 <strong>Elevate Labs</strong> — Python Developer Internship (2025)</li>
      </ol>
      <a href="certificates.html" target="_blank">View all certificates ↗</a>`;
      suggestions = [
        { label: '⚡ Skills', query: 'skills' },
        { label: '💼 Internships', query: 'experience' },
      ];
      return { reply, suggestions };
    }

    // ── CONTACT
    if (/contact|email|phone|hire|reach|linkedin|social/.test(q)) {
      reply = `You can reach Kundan through:<br>
      <ul>
        <li>✉️ <a href="mailto:vangapandukundan@gmail.com">vangapandukundan@gmail.com</a></li>
        <li>🔗 <a href="https://www.linkedin.com/in/kundan-student" target="_blank">LinkedIn ↗</a></li>
        <li>🖥️ <a href="https://github.com/vangapandukundan" target="_blank">GitHub ↗</a></li>
      </ul>
      Or use the <a href="index.html#contact">Contact Form ↗</a> on the homepage!`;
      suggestions = [
        { label: '📄 Download CV', query: 'resume' },
        { label: '🚀 See projects', query: 'all projects' },
      ];
      return { reply, suggestions };
    }

    // ── RESUME / CV
    if (/resume|cv|download/.test(q)) {
      reply = `You can download Kundan's latest CV here:<br><br>
      <a href="files/Vangapandu_Kundan_Resume.pdf" download>📄 Download CV (PDF) ↗</a>`;
      suggestions = [
        { label: '📞 Contact', query: 'contact' },
        { label: '🚀 Projects', query: 'all projects' },
      ];
      return { reply, suggestions };
    }

    // ── LOCATION
    if (/location|live|hyderabad|where/.test(q)) {
      reply = `📍 Kundan is based in <strong>KPHB, Hyderabad, Telangana, India</strong> and is open to remote opportunities worldwide.`;
      suggestions = [
        { label: '📞 Get in touch', query: 'contact' },
        { label: '💼 Hire him', query: 'hire' },
      ];
      return { reply, suggestions };
    }

    // ── HIRE
    if (/hire|available|opportunit|open to work|freelance/.test(q)) {
      reply = `✅ Yes! Kundan is currently <strong>open to opportunities</strong> — internships, full-time roles, and freelance data science/ML projects.<br><br>
      Best way to reach him: <a href="mailto:vangapandukundan@gmail.com">vangapandukundan@gmail.com</a> or <a href="https://www.linkedin.com/in/kundan-student" target="_blank">LinkedIn ↗</a>`;
      suggestions = [
        { label: '📄 Download CV', query: 'resume' },
        { label: '🚀 See his work', query: 'all projects' },
      ];
      return { reply, suggestions };
    }

    // ── THANKS
    if (/thank|thanks|appreciate|great|awesome|nice/.test(q)) {
      const replies = [
        `You're welcome! 😊 Is there anything else you'd like to know about Kundan?`,
        `Happy to help! Feel free to ask about projects, skills, or anything else! 🚀`,
        `Glad I could help! Don't forget to check out the <a href="projects.html">projects page ↗</a>! 🎉`,
      ];
      reply = replies[Math.floor(Math.random() * replies.length)];
      suggestions = [
        { label: '🚀 Projects', query: 'all projects' },
        { label: '📞 Contact', query: 'contact' },
      ];
      return { reply, suggestions };
    }

    // ── HELP
    if (/help|what can you|can you do/.test(q)) {
      reply = `I can help you explore Kundan's profile! Try asking:<br>
      <ul>
        <li>"Tell me about DevPulse"</li>
        <li>"What are his skills?"</li>
        <li>"Show me his certifications"</li>
        <li>"How can I contact him?"</li>
        <li>"Is he available for hire?"</li>
      </ul>`;
      return { reply, suggestions: [] };
    }

    // ── FALLBACK
    const fallbacks = [
      `Hmm, I'm not sure about that one! Try asking about his <strong>projects</strong>, <strong>skills</strong>, <strong>certifications</strong>, or <strong>contact info</strong>. 🤔`,
      `I didn't quite get that. You can ask me things like <em>"What is DevPulse?"</em> or <em>"What tech stack does he use?"</em>`,
      `That's beyond my training data 😄 — but ask me about Kundan's <strong>ML projects</strong>, <strong>internships</strong>, or how to <strong>hire him</strong>!`,
    ];
    reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    suggestions = [
      { label: '🚀 Show projects', query: 'all projects' },
      { label: '⚡ View skills', query: 'skills' },
      { label: '📞 Contact', query: 'contact' },
    ];
    return { reply, suggestions };
  }

})();



// ─── Dynamic Particle Canvas & Accent Sync ────────────────────

// Dynamic Particle Canvas
(function initParticles() {
  // Dynamically inject canvas if not present
  let canvas = document.getElementById('particle-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    // Critical: fixed positioning + no pointer events so canvas never intercepts clicks
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    document.body.insertBefore(canvas, document.body.firstChild);
  } else {
    // Ensure existing canvas also has the correct styles
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  }

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let particles = [];
  const particleCount = Math.min(65, Math.floor((window.innerWidth * window.innerHeight) / 18000));
  let mouse = { x: null, y: null, radius: 150 };

  // Sync mouse position
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Helper to fetch current accent color
  function getAccentColor() {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue('--accent').trim() || '#C9A84C';
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 2.5 + 1.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off bounds
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Mouse repulsion (butter smooth movement)
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = getAccentColor();
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    // Draw connections
    const accentColor = getAccentColor();
    // Parse Hex to RGB to use alpha opacity safely
    let r = 201, g = 168, b = 76;
    if (accentColor.startsWith('#')) {
      const hex = accentColor.substring(1);
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (130 - dist) / 130 * 0.35;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  init();
  animate();
})();

// Add global CSS class jitter-hover to project tags or menu items
document.querySelectorAll('.proj-badge, .logo-avatar, .stat-chip').forEach(el => {
  el.classList.add('jitter-hover');
});

// ─── Preloader Welcome Screen Controller ────────────────────────
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const pctEl     = document.getElementById('preloader-pct');
  const barEl     = document.getElementById('preloader-progress');
  const statusEl  = document.getElementById('preloader-status');
  if (!preloader || !pctEl || !barEl || !statusEl) return;

  // Prevent scrollbar on page load
  document.body.style.overflow = 'hidden';

  const statuses = [
    { limit: 20,  text: 'Importing intelligence...' },
    { limit: 45,  text: 'Preparing datasets...' },
    { limit: 70,  text: 'Fine-tuning models...' },
    { limit: 90,  text: 'Formatting dashboard...' },
    { limit: 100, text: 'Almost ready...' }
  ];

  let count = 0;
  const duration = 1800; // total preloader count time in ms
  const interval = 16;   // update tick rate
  const step = 100 / (duration / interval);

  const timer = setInterval(() => {
    count += step;
    if (count >= 100) {
      count = 100;
      clearInterval(timer);
      
      // Update UI to completed state
      pctEl.textContent = '100%';
      barEl.style.width = '100%';
      statusEl.textContent = 'Welcome!';
      
      // Smooth fade-out transition
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.style.overflow = ''; // unlock scrollbars
      }, 350);
    } else {
      const rounded = Math.floor(count);
      pctEl.textContent = (rounded < 10 ? '0' : '') + rounded + '%';
      barEl.style.width = rounded + '%';

      // Update current text status dynamically
      const current = statuses.find(s => rounded <= s.limit);
      if (current) {
        statusEl.textContent = current.text;
      }
    }
  }, interval);
})();