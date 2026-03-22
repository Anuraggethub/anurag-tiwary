/* ═══════════════════════════════════════════════════
   ONE PIECE PORTFOLIO — script.js
   All animations, interactions, observers
═══════════════════════════════════════════════════ */

'use strict';

// ── CUSTOM CURSOR ──────────────────────────────────
const cursor = document.getElementById('cursor');
const trailContainer = document.getElementById('cursor-trail-container');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  spawnTrail(e.clientX, e.clientY);
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

let trailThrottle = 0;
function spawnTrail(x, y) {
  trailThrottle++;
  if (trailThrottle % 3 !== 0) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-trail-dot';
  dot.style.left = x + 'px';
  dot.style.top = y + 'px';
  dot.style.animationDuration = (Math.random() * 0.3 + 0.4) + 's';
  const hue = Math.floor(Math.random() * 30) + 40; // gold range
  dot.style.background = `hsl(${hue}, 100%, 60%)`;
  trailContainer.appendChild(dot);
  dot.addEventListener('animationend', () => dot.remove());
}

// ── INTRO SPLASH ───────────────────────────────────
const splashScreen = document.getElementById('intro-splash');
const mainSite = document.getElementById('main-site');
const setSailBtn = document.getElementById('set-sail-btn');
const skipIntroBtn = document.getElementById('skip-intro-btn');
const typewriterEl = document.getElementById('typewriter-tagline');
const bountyCounter = document.getElementById('bounty-counter');

const taglineText = 'A NEW PIRATE HAS ENTERED THE GRAND LINE';
let typeIndex = 0;

function typeTagline() {
  if (typeIndex <= taglineText.length) {
    typewriterEl.textContent = taglineText.substring(0, typeIndex);
    typeIndex++;
    setTimeout(typeTagline, 60);
  }
}
setTimeout(typeTagline, 1500);

// Bounty counter animation
let bountyVal = 0;
const bountyTarget = 999999999;
function animateBounty() {
  if (bountyVal < bountyTarget) {
    bountyVal = Math.min(bountyVal + Math.floor(bountyTarget / 80), bountyTarget);
    bountyCounter.textContent = '∞';
    requestAnimationFrame(animateBounty);
  } else {
    bountyCounter.textContent = '∞';
  }
}
setTimeout(animateBounty, 1600);

function launchSite() {
  splashScreen.style.transition = 'opacity 0.8s ease';
  splashScreen.style.opacity = '0';
  setTimeout(() => {
    splashScreen.style.display = 'none';
    mainSite.classList.remove('hidden');
    document.body.style.overflowY = 'auto';
    initMainSite();
  }, 800);
}

setSailBtn.addEventListener('click', launchSite);
skipIntroBtn.addEventListener('click', launchSite);

// Auto-launch after 5s
setTimeout(() => {
  if (!mainSite.classList.contains('hidden') === false) {
    // still on splash
  } else {
    launchSite();
  }
}, 5500);

// ── MIST PARTICLES ─────────────────────────────────
function createMistParticles() {
  const container = document.getElementById('mist-container');
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'mist-particle';
    const size = Math.random() * 200 + 80;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 40}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}

// ── SCROLL ANIMATIONS (Intersection Observer) ──────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = el.parentElement?.querySelectorAll('.fade-in-section');
        let delay = 0;
        if (siblings) {
          siblings.forEach((s, idx) => { if (s === el) delay = idx * 100; });
        }
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
}

// ── HAKI BARS ANIMATION ────────────────────────────
function initHakiBars() {
  const hakiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const bar = card.querySelector('.haki-bar-fill');
        const counter = card.querySelector('.haki-level-number');
        const target = parseInt(card.dataset.level);

        // Animate bar
        setTimeout(() => {
          if (bar) bar.style.width = target + '%';
        }, 200);

        // Animate counter
        if (counter) {
          let count = 0;
          const duration = 1200;
          const steps = 60;
          const increment = target / steps;
          const interval = duration / steps;
          const timer = setInterval(() => {
            count = Math.min(count + increment, target);
            counter.textContent = Math.floor(count);
            if (count >= target) clearInterval(timer);
          }, interval);
        }

        hakiObserver.unobserve(card);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.haki-card').forEach(card => hakiObserver.observe(card));
}

// ── NAVBAR ─────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.style.display === 'block';
    mobileMenu.style.display = open ? 'none' : 'block';
  });

  // Close mobile menu on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
    });
  });
}

// ── CONTACT TYPEWRITER ─────────────────────────────
function initContactTypewriter() {
  const el = document.getElementById('contact-typewriter');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  let idx = 0;

  const ctObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        function type() {
          if (idx <= text.length) {
            el.textContent = text.substring(0, idx);
            idx++;
            setTimeout(type, 50);
          }
        }
        type();
        ctObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  ctObserver.observe(el);
}

// ── SMOOTH SCROLL ──────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── ACTIVE NAV LINKS ───────────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => navObserver.observe(s));
}

// ── VOYAGE ARC STAGGER ─────────────────────────────
function initVoyageTimeline() {
  const arcs = document.querySelectorAll('.voyage-arc');
  const arcObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(arcs).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 150);
        arcObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  arcs.forEach(arc => arcObserver.observe(arc));
}

// ── BOUNTY CARD HOVER PARTICLES ────────────────────
function initBountyCards() {
  document.querySelectorAll('.bounty-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.bounty-paper')?.classList.add('hovered');
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.bounty-paper')?.classList.remove('hovered');
    });
  });
}

// ── PARALLAX SHIP ──────────────────────────────────
function initParallax() {
  const ship = document.getElementById('ship');
  if (!ship) return;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroSection = document.getElementById('hero');
    const heroHeight = heroSection?.offsetHeight || 800;
    if (scrollY < heroHeight) {
      ship.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  });
}

// ── GRAIN OVERLAY ──────────────────────────────────
function addGrainOverlay() {
  const grain = document.createElement('div');
  grain.style.cssText = `
    position: fixed; inset: 0; pointer-events: none; z-index: 9990;
    opacity: 0.02;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: grainAnim 0.5s steps(2) infinite;
  `;
  const style = document.createElement('style');
  style.textContent = `@keyframes grainAnim { 0% { background-position: 0 0; } 100% { background-position: 100px 100px; } }`;
  document.head.appendChild(style);
  document.body.appendChild(grain);
}

// ── DEVIL FRUIT CARD GLOW ON HOVER ─────────────────
function initDevilFruits() {
  document.querySelectorAll('.devil-fruit-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const glow = card.querySelector('.fruit-glow');
      if (glow) glow.style.animationDuration = '0.8s';
    });
    card.addEventListener('mouseleave', () => {
      const glow = card.querySelector('.fruit-glow');
      if (glow) glow.style.animationDuration = '2s';
    });
  });
}

// ── CURSOR SCALING ON INTERACTIVE ELEMENTS ─────────
function initCursorInteractions() {
  const interactives = document.querySelectorAll('a, button, .bounty-card, .haki-card, .devil-fruit-card, .stat-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

// ── MAIN INIT ──────────────────────────────────────
function initMainSite() {
  createMistParticles();
  initScrollAnimations();
  initHakiBars();
  initNavbar();
  initContactTypewriter();
  initSmoothScroll();
  initActiveNav();
  initVoyageTimeline();
  initBountyCards();
  initParallax();
  addGrainOverlay();
  initDevilFruits();
  initCursorInteractions();
}

// ── TOUCH: DISABLE CUSTOM CURSOR ON TOUCH DEVICES ──
if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  document.body.style.cursor = 'auto';
}
