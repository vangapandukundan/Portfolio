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

// ─── Kundan-AI Chatbot Assistant ──────────────────────────────
(function initAiAssistant() {
  // Inject HTML if not present (allows global floating chatbot on all pages)
  if (!document.getElementById('ai-assistant')) {
    const aiHTML = `
      <div id="ai-assistant">
        <div id="ai-btn" role="button" tabindex="0" aria-label="Open AI Assistant">
          <div class="robot-speech-bubble">Ask Me! 💬</div>
          <div class="robot-inner">
            <div class="robot-antenna"><div class="antenna-ball"></div></div>
            <div class="robot-head">
              <div class="robot-eye left"><div class="robot-pupil"></div></div>
              <div class="robot-eye right"><div class="robot-pupil"></div></div>
              <div class="robot-mouth"></div>
            </div>
            <div class="robot-body"><div class="robot-screen">VK</div></div>
            <div class="robot-arm left"></div>
            <div class="robot-arm right"></div>
            <div class="robot-legs">
              <div class="robot-leg left"></div>
              <div class="robot-leg right"></div>
            </div>
          </div>
          <div class="robot-shadow"></div>
        </div>
        <div id="ai-chat-window" class="hidden">
          <div class="ai-header">
            <div class="ai-header-profile">
              <div class="ai-avatar"><i class="fas fa-robot"></i></div>
              <div>
                <div class="ai-name">Kundan AI</div>
                <div class="ai-status"><span class="status-dot"></span> Online &amp; Ready</div>
              </div>
            </div>
            <button id="ai-close-btn" aria-label="Close Chat"><i class="fas fa-times"></i></button>
          </div>
          <div class="ai-body">
            <div class="ai-msg bot">
              <div class="ai-msg-content">
                Hi! I'm Kundan AI, an assistant trained on Kundan's resume and portfolio.<br><br>
                I can help you:
                <ul>
                  <li>💻 Explore his projects (like <strong>DevPulse</strong>)</li>
                  <li>⚡ Detail his skills & tech stack</li>
                  <li>🎓 Check out his certifications</li>
                  <li>✉️ Find out how to get in touch</li>
                </ul>
                How can I assist you today?
              </div>
            </div>
          </div>
          <div class="ai-options">
            <button class="ai-opt" data-query="about">About Kundan</button>
            <button class="ai-opt" data-query="projects">Show Projects</button>
            <button class="ai-opt" data-query="skills">Technical Skills</button>
            <button class="ai-opt" data-query="contact">Get in Touch</button>
          </div>
          <form id="ai-form">
            <input type="text" id="ai-input" placeholder="Type a message..." required autocomplete="off">
            <button type="submit" id="ai-send-btn" aria-label="Send Message" disabled><i class="fas fa-paper-plane"></i></button>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', aiHTML);
  }

  const aiBtn = document.getElementById('ai-btn');
  const chatWindow = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-close-btn');
  const chatForm = document.getElementById('ai-form');
  const chatInput = document.getElementById('ai-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const chatBody = document.querySelector('.ai-body');

  if (!aiBtn || !chatWindow || !closeBtn || !chatForm || !chatInput || !sendBtn || !chatBody) return;

  // Initialize button state
  sendBtn.disabled = true;

  // Robot Animation State Functions
  function sitDown() {
    aiBtn.classList.add('sitting');
  }

  function standUp() {
    aiBtn.classList.remove('sitting');
  }

  // Toggle chat window
  aiBtn.addEventListener('click', (e) => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      chatInput.focus();
      scrollToBottom();
      sitDown();
    } else {
      standUp();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
    standUp();
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

    addUserMessage(query);
    chatInput.value = '';
    sendBtn.disabled = true;

    // Simulate bot response
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      const reply = getBotReply(query);
      addBotMessage(reply);
    }, 1000 + Math.random() * 800);
  });

  // Handle quick option clicks
  document.addEventListener('click', (e) => {
    const opt = e.target.closest('.ai-opt');
    if (!opt) return;
    const query = opt.dataset.query;
    addUserMessage(opt.textContent);
    
    // Smooth scrolling to section if it is on current page
    if (query === 'projects' || query === 'skills' || query === 'contact') {
      const sectionId = query === 'projects' ? 'work' : query;
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    }

    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      const reply = getBotReply(query);
      addBotMessage(reply);
    }, 800);
  });

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'ai-msg user';
    msg.innerHTML = `<div class="ai-msg-content">${escapeHTML(text)}</div>`;
    chatBody.appendChild(msg);
    scrollToBottom();
  }

  function addBotMessage(html) {
    const msg = document.createElement('div');
    msg.className = 'ai-msg bot';
    msg.innerHTML = `<div class="ai-msg-content">${html}</div>`;
    chatBody.appendChild(msg);
    scrollToBottom();
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
    const indicators = chatBody.querySelectorAll('.typing-indicator');
    indicators.forEach(ind => ind.remove());
  }

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function getBotReply(query) {
    const q = query.toLowerCase();

    // 1. GREETINGS
    if (q.match(/\b(hello|hi|hey|yo|greetings|morning|afternoon|evening)\b/)) {
      return `Hello there! 👋 I'm Kundan AI, an assistant trained on Kundan's resume and portfolio. How can I help you explore his profile today?`;
    }

    // 2. SPECIFIC PROJECTS
    if (q.includes('devpulse') || q.includes('dev-pulse') || q.includes('dev pulse')) {
      return `<strong>DevPulse (AI Developer Advocacy & Burnout Analytics Agent)</strong>:<br>
      - <strong>What it does</strong>: Tracks developer velocity, captures unrecorded "Invisible Work" (mentoring, peer reviews, issue comments), measures focus & burnout risk, and takes actions like calendar blocking.<br>
      - <strong>Tech Stack</strong>: React.js, FastAPI, Python, Google Calendar API, AI Agents.<br>
      - <a href="https://github.com/vangapandukundan/DevPulse" target="_blank">GitHub Repo</a> | <a href="https://dev-pulse-sigma-taupe.vercel.app/" target="_blank">Live Demo</a>`;
    }
    if (q.includes('quantum') || q.includes('green quantum') || q.includes('data center') || q.includes('energy') || q.includes('green_dc_project')) {
      return `<strong>Green Quantum Data Center Optimization</strong>:<br>
      - <strong>What it does</strong>: Optimizes energy consumption and temperature settings, minimizes emissions, and detects anomalies in data centers using ML models.<br>
      - <strong>Tech Stack</strong>: Python, Pandas, Matplotlib, Scikit-learn.<br>
      - <a href="https://github.com/vangapandukundan/green_dc_project" target="_blank">GitHub Repo</a> | <a href="https://drive.google.com/file/d/1uCF0VY8LsP0wmKbDTpkY_0W8fSxreqNN/view?usp=sharing" target="_blank">Video Demo</a>`;
    }
    if (q.includes('emotional') || q.includes('feedback') || q.includes('sentiment') || q.includes('tracker')) {
      return `<strong>Emotional Feedback Tracker</strong>:<br>
      - <strong>What it does</strong>: A deep learning sentiment dashboard providing real-time text analysis, sentiment distributions, and wellness insights.<br>
      - <strong>Tech Stack</strong>: Python, TensorFlow, Flask, Chart.js.<br>
      - <a href="https://github.com/vangapandukundan/EmotionalFeedbackTracker" target="_blank">GitHub Repo</a> | <a href="https://vangapandukundan.github.io/EmotionalFeedbackTracker/" target="_blank">Live Demo</a>`;
    }
    if (q.includes('campus') || q.includes('auth') || q.includes('biometric') || q.includes('webauthn')) {
      return `<strong>Campus Auth</strong>:<br>
      - <strong>What it does</strong>: A secure campus authentication dashboard with facial and biometric recognition mechanisms.<br>
      - <strong>Tech Stack</strong>: React, Node.js, WebAuthn, Tailwind CSS.<br>
      - <a href="https://github.com/vangapandukundan/campus-auth" target="_blank">GitHub Repo</a> | <a href="https://drive.google.com/file/d/18F4Ruanr3IfFe77EiiX7thIK6s9OVSrX/view?usp=sharing" target="_blank">Video Demo</a>`;
    }
    if (q.includes('reviewer') || q.includes('flake8') || q.includes('code reviewer')) {
      return `<strong>AI Code Reviewer</strong>:<br>
      - <strong>What it does</strong>: Built during the Elevate Labs internship. Automates code checks using static Flake8 guidelines and surfaces AI tips for structural fixes.<br>
      - <strong>Tech Stack</strong>: Python, Streamlit, Flake8, Generative AI APIs.<br>
      - <a href="https://github.com/vangapandukundan/ai-code-reviewer" target="_blank">GitHub Repo</a> | <a href="https://jgmqxoaptndlsravfmjpxg.streamlit.app/" target="_blank">Live Demo</a>`;
    }
    if (q.includes('threat') || q.includes('detection') || q.includes('cyber') || q.includes('network')) {
      return `<strong>Threat Detection AI</strong>:<br>
      - <strong>What it does</strong>: A machine learning classification engine identifying malicious cyber activity and intrusions in server access logs.<br>
      - <strong>Tech Stack</strong>: Python, Scikit-learn, Pandas, Streamlit, Matplotlib.<br>
      - <a href="https://github.com/vangapandukundan/Threat-Detection-AI" target="_blank">GitHub Repo</a> | <a href="https://threat-detection-ai-sfmyghe6azj9pr29x8yaon.streamlit.app/" target="_blank">Live Demo</a>`;
    }
    if (q.includes('resizer') || q.includes('image') || q.includes('canvas')) {
      return `<strong>Browser Image Resizer</strong>:<br>
      - <strong>What it does</strong>: Clean, client-side utility implementing HTML5 Canvas elements to resize image dimensions with zero dependencies.<br>
      - <strong>Tech Stack</strong>: Canvas API, Vanilla JavaScript, CSS3.<br>
      - <a href="https://github.com/vangapandukundan/Image_Resizer/blob/main/index.html" target="_blank">GitHub Repo</a> | <a href="https://vangapandukundan.github.io/Image_Resizer/" target="_blank">Live Demo</a>`;
    }

    // GENERAL PROJECTS QUERY
    if (q.includes('project') || q.includes('work') || q.includes('portfolio') || q.includes('code') || q.includes('github') || q.includes('build')) {
      return `Here are Kundan's main projects:<br>
      <ul>
        <li>📊 <strong>DevPulse</strong>: AI Developer Advocacy & Burnout tracker</li>
        <li>🌤️ <strong>Green Quantum DC Optimization</strong>: Energy optimizer for data centers</li>
        <li>🧠 <strong>Threat Detection AI</strong>: Cybersecurity log classifier</li>
        <li>💬 <strong>Emotional Feedback Tracker</strong>: Real-time sentiment monitor</li>
        <li>🔒 <strong>Campus Auth</strong>: Biometric student logging tool</li>
        <li>🛠️ <strong>AI Code Reviewer</strong>: Auto code check assistant</li>
        <li>🖼️ <strong>Browser Image Resizer</strong>: Client-side Canvas resizer</li>
      </ul>
      Ask me about any specific project (e.g., <em>"Tell me about DevPulse"</em>) or click on **Work** to explore!`;
    }

    // 3. SPECIFIC CERTIFICATES
    if (q.includes('weather') || q.includes('forecasting')) {
      return `<strong>Harnessing AI to Weather Forecasting Workshop Certificate</strong>:<br>
      - <strong>Institution</strong>: GITAM University (2025).<br>
      - <strong>Focus</strong>: Practical workshop exploring weather models and neural networks.<br>
      - <a href="https://drive.google.com/file/d/1Kjc8iJ3PhNnvKCoBE99qNkr5UQDOizk-/view?usp=sharing" target="_blank">View Certificate</a>`;
    }
    if (q.includes('google data') || q.includes('google analytics') || q.includes('data analytics certificate')) {
      return `<strong>Google Data Analytics Certificate</strong>:<br>
      - <strong>Institution</strong>: Google via Coursera (2025).<br>
      - <strong>Focus</strong>: Exploratory data analysis, SQL database queries, R programming, spreadsheets, and Tableau visualizations.<br>
      - <a href="https://drive.google.com/file/d/14QE3PVWPu8PL6GlwsMmwWtS_7yHHeRk-/view?usp=sharing" target="_blank">View Certificate</a>`;
    }
    if (q.includes('google cloud') || q.includes('credly') || q.includes('ai agent badge') || q.includes('agent with development')) {
      return `<strong>Engineer AI Agent with Development Kit</strong>:<br>
      - <strong>Institution</strong>: Google Cloud (2026).<br>
      - <strong>Focus</strong>: Designing multi-modal agents, GenAI orchestrations, and cloud deployment paradigms.<br>
      - <a href="https://www.credly.com/badges/6739cc4a-7136-4fb3-8d9a-9626e827798c/public_url" target="_blank">Verify Badge on Credly</a>`;
    }
    if (q.includes('deloitte') || q.includes('forage') || q.includes('simulation')) {
      return `<strong>Deloitte Data Analytics Job Simulation</strong>:<br>
      - <strong>Institution</strong>: Deloitte via Forage (2025).<br>
      - <strong>Focus</strong>: Preparing telemetry data, compiling descriptive tables, and formulating analytical recommendations.<br>
      - <a href="https://drive.google.com/file/d/1irQkvL0rqNXB9kUWPRGwH6m6DORXcWvZ/view?usp=sharing" target="_blank">View Certificate</a>`;
    }
    if (q.includes('naresh') || q.includes('naresh i')) {
      return `<strong>Python Course Certificate</strong>:<br>
      - <strong>Institution</strong>: Naresh i Technologies (2025).<br>
      - <strong>Focus</strong>: Core algorithms, basic scripting, control structures, and object-oriented syntax in Python.<br>
      - <a href="https://drive.google.com/file/d/1eZ3j85PAicDU8UP25I_w2NIdBDDTiY0W/view?usp=sharing" target="_blank">View Certificate</a>`;
    }
    if (q.includes('ui/ux') || q.includes('ui ux') || q.includes('ux design') || q.includes('google ui')) {
      return `<strong>Google UI/UX Design Certificate</strong>:<br>
      - <strong>Institution</strong>: Google via Coursera (2025).<br>
      - <strong>Focus</strong>: Empathizing with users, building wireframes, testing design concepts, and creating functional high-fidelity prototypes in Figma.<br>
      - <a href="https://drive.google.com/file/d/1qdOD5XtbqDVZhEKaXCDKO2ws9F8GXkeL/view?usp=sharing" target="_blank">View Certificate</a>`;
    }
    if (q.includes('intrainz') || q.includes('data science internship')) {
      return `<strong>Data Science Internship</strong>:<br>
      - <strong>Company</strong>: Intrainz (2025).<br>
      - <strong>Focus</strong>: Implemented feature preparation loops, cleaned dataset tables, and optimized predictive model classifications.<br>
      - <a href="certificates/Internship Certificate.pdf" target="_blank">View Certificate</a>`;
    }
    if (q.includes('elevate') || q.includes('elevate labs') || q.includes('python developer internship')) {
      return `<strong>Python Developer Internship</strong>:<br>
      - <strong>Company</strong>: Elevate Labs (2025).<br>
      - <strong>Focus</strong>: Script automation, static analysis checks, custom Streamlit tools, and backend validation code.<br>
      - <a href="certificates/Elevate labs Internship Certificate.pdf" target="_blank">View Certificate</a>`;
    }

    // GENERAL CERTIFICATES QUERY
    if (q.includes('cert') || q.includes('credential') || q.includes('achieve') || q.includes('course') || q.includes('simulation') || q.includes('badge')) {
      return `Kundan holds 8 key professional certifications:<br>
      1. 🌐 <strong>Google Cloud</strong>: Engineer AI Agent (2026)
      2. 📊 <strong>Google</strong>: Data Analytics (2025)
      3. 🎨 <strong>Google</strong>: UI/UX Design (2025)
      4. 🏢 <strong>Deloitte</strong>: Data Analytics Simulation (2025)
      5. ☁️ <strong>Gitam</strong>: Weather Forecasting AI Workshop (2025)
      6. 🐍 <strong>Naresh i Tech</strong>: Python Course Certificate (2025)
      7. 💼 <strong>Intrainz</strong>: Data Science Internship (2025)
      8. 💻 <strong>Elevate Labs</strong>: Python Developer Internship (2025)
      Ask me about any specific certification or click on **Certifications** in the menu!`;
    }

    // 4. ABOUT ME, RESUME, LOCATION, EDUCATION
    if (q.includes('school') || q.includes('college') || q.includes('university') || q.includes('gitam') || q.includes('education') || q.includes('study')) {
      return `Kundan is currently a 4th-year B.Tech Student in Computer Science (Data Science) at GITAM University, Hyderabad, graduating in 2027. 🎓<br><br>
      Before that, he completed his Intermediate at Sri Chaitanya Bhaskar Bhavan and high school at Nalanda Vidya Nikethan.`;
    }
    if (q.includes('intern') || q.includes('experience') || q.includes('job') || q.includes('work experience')) {
      return `Kundan just wrapped up three great internships in 2025:<br>
      - 💼 <strong>Data Science Intern @ Intrainz</strong>: He built feature pipelines and optimized predictive models.<br>
      - 💼 <strong>Python Developer Intern @ Elevate Labs</strong>: He created automated code review tools and backend validation scripts.<br>
      - 💼 <strong>Web Developer Intern @ VBLP Tech Solutions</strong>: He focused on front-end development and building responsive UIs.`;
    }
    if (q.includes('about') || q.includes('kundan') || q.includes('who is') || q.includes('resume') || q.includes('bio') || q.includes('background')) {
      return `<strong>Vangapandu Kundan</strong> is a data science enthusiast and developer who loves turning complex data into real-world impact.<br><br>
      He specializes in Machine Learning and Python, building everything from prediction dashboards to AI tools like DevPulse. When he isn't coding, he's probably out taking photos or editing videos. 📸`;
    }
    if (q.includes('location') || q.includes('live') || q.includes('hyderabad') || q.includes('where is')) {
      return `Kundan is based in <strong>KPHB, Hyderabad, Telangana, India</strong> and is open to remote opportunities worldwide.`;
    }
    if (q.includes('language') || q.includes('speak') || q.includes('telugu') || q.includes('english')) {
      return `Kundan is fluent in <strong>English</strong> and <strong>Telugu</strong>.`;
    }

    // 5. SKILLS & TECH STACK
    if (q.includes('python') || q.includes('sql') || q.includes('javascript') || q.includes('html') || q.includes('css') || q.includes('react')) {
      return `Kundan's programming languages proficiency:<br>
      - 🐍 <strong>Python</strong> (92% - Primary): Pandas, NumPy, Scikit-Learn, TensorFlow, PyTorch.
      - 🗄️ <strong>SQL</strong> (79%): Database queries, schema structures.
      - 🌐 <strong>Web</strong>: HTML5, CSS3, JavaScript (React, Node.js).`;
    }
    if (q.includes('ml') || q.includes('machine learning') || q.includes('deep learning') || q.includes('nlp') || q.includes('ai') || q.includes('data science') || q.includes('pandas') || q.includes('numpy') || q.includes('scikit')) {
      return `Kundan's Machine Learning and Data Science expertise:<br>
      - 🧠 <strong>Libraries</strong>: Scikit-learn, Pandas, NumPy, XGBoost, TensorFlow, PyTorch.
      - ⚡ <strong>Competencies</strong>: Feature Engineering, Exploratory Data Analysis (EDA), Neural Networks, REST APIs, Model Evaluation & deployment.`;
    }
    if (q.includes('skill') || q.includes('stack') || q.includes('tool') || q.includes('git') || q.includes('figma')) {
      return `Kundan's technical stack is categorized into:<br>
      - 💻 <strong>Languages</strong>: Python, SQL, JavaScript, HTML, CSS.
      - 🧠 <strong>ML Stack</strong>: Scikit-learn, Pandas, NumPy, TensorFlow, PyTorch, XGBoost.
      - 🛠️ <strong>Tools & Platforms</strong>: Git/GitHub, VS Code, Figma, Firebase, Streamlit, REST APIs.<br>
      Try clicking the nodes in the interactive <strong>Skills Widget</strong> on the homepage!`;
    }

    // 6. CONTACT & HIRE
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach') || q.includes('social') || q.includes('linkedin')) {
      return `You can get in touch with Kundan through:<br>
      <ul>
        <li>✉️ <strong>Email</strong>: <a href="mailto:vangapandukundan@gmail.com">vangapandukundan@gmail.com</a></li>
        <li>📞 <strong>Phone</strong>: <a href="tel:+919492250166">+91 9492250166</a></li>
        <li>🔗 <strong>LinkedIn</strong>: <a href="https://www.linkedin.com/in/kundan-student" target="_blank">linkedin.com/in/kundan-student</a></li>
        <li>🖥️ <strong>GitHub</strong>: <a href="https://github.com/vangapandukundan" target="_blank">github.com/vangapandukundan</a></li>
      </ul>
      You can also use the contact form at the bottom of the homepage to message him directly!`;
    }

    // HELP & GENERAL SUPPORT
    if (q.includes('help') || q.includes('helpful') || q.includes('can you do') || q.includes('what can you')) {
      return `I can help you explore Kundan's professional background:<br>
      - 💻 Ask about his **projects** (e.g. <em>"Tell me about DevPulse"</em> or <em>"Do you have ML projects?"</em>).<br>
      - 🎓 Ask about his **certifications** (e.g. <em>"What Google certificates do you have?"</em> or <em>"Tell me about Google Cloud AI agent certificate"</em>).<br>
      - ⚡ Ask about his **skills** (e.g. <em>"What tools do you know?"</em> or <em>"Are you fluent in Python?"</em>).<br>
      - 💼 Ask about his **experience** or **education**.<br>
      - ✉️ Ask for his **contact** details.`;
    }

    // FALLBACK
    return `I can help you learn more about Kundan's background. Try asking about his **projects** (like DevPulse), **certifications** (like the Google Cloud AI Agent badge), **skills**, or **contact info**!`;
  }
})();

// ─── Dynamic Particle Canvas & Accent Sync ────────────────────
(function initParticles() {
  // Dynamically inject canvas if not present
  let canvas = document.getElementById('particle-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
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