/* ─────────────────────────────────────────────
   MYSTICAL PORTFOLIO — script.js
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Custom Cursor ────────────────────────
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with lerp
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverables = document.querySelectorAll('a, button, .skill-pill, .glass-card, .btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });


  // ── 2. Starfield Canvas ─────────────────────
  const canvas = document.getElementById('starfield');
  const ctx    = canvas.getContext('2d');

  let stars = [];
  const STAR_COUNT = 200;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStar() {
    return {
      x:        Math.random() * canvas.width,
      y:        Math.random() * canvas.height,
      radius:   Math.random() * 1.2 + 0.2,
      opacity:  Math.random(),
      speed:    Math.random() * 0.004 + 0.001,
      phase:    Math.random() * Math.PI * 2,
    };
  }

  function initStars() {
    stars = Array.from({ length: STAR_COUNT }, createStar);
  }

  function drawStars(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.phase += star.speed;
      const twinkle = (Math.sin(star.phase) + 1) / 2;
      const alpha   = 0.3 + twinkle * 0.6;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 210, 255, ${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  resizeCanvas();
  initStars();
  drawStars();
  window.addEventListener('resize', () => { resizeCanvas(); initStars(); });


  // ── 3. Typewriter Effect ────────────────────
  const phrases = [
  'learning how systems think.',
  'building things while I learn.',
  'exploring AI through small projects.',
  'turning curiosity into code.',
  'making sense of complexity.',
  'figuring things out, one build at a time.',
  ];

  const el     = document.getElementById('typewriter');
  let   pi     = 0; // phrase index
  let   ci     = 0; // char index
  let   typing = true;
  let   delay  = 110;

  function type() {
    const current = phrases[pi];
    if (typing) {
      el.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) {
        typing = false;
        delay  = 1800; // pause before erasing
      } else {
        delay = 110;
      }
    } else {
      el.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        typing = true;
        pi     = (pi + 1) % phrases.length;
        delay  = 300;
      } else {
        delay = 55;
      }
    }
    setTimeout(type, delay);
  }

  type();


  // ── 4. Scroll Reveal (Intersection Observer) ─
  const revealEls = document.querySelectorAll('.reveal');
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if parent has multiple reveals nearby
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));


  // ── 5. Header — scroll behavior ─────────────
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });


  // ── 6. Active nav highlight on scroll ───────
  const sections  = document.querySelectorAll('section[id], div[id="top"]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));


  // ── 7. Skill pill tooltip ───────────────────
  const tooltip = document.getElementById('skill-tooltip');

  document.querySelectorAll('.skill-pill').forEach(pill => {
    pill.addEventListener('mouseenter', e => {
      tooltip.textContent = pill.dataset.level;
      tooltip.style.opacity = '1';
    });

    pill.addEventListener('mousemove', e => {
      tooltip.style.left = (e.clientX + 14) + 'px';
      tooltip.style.top  = (e.clientY - 28) + 'px';
    });

    pill.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });


  // ── 8. Mobile menu toggle ───────────────────
  const menuBtn = document.querySelector('.menu-toggle');
  const nav     = document.querySelector('nav');

  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Close menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });


  // ── 9. Subtle parallax on hero name ─────────
  const heroName = document.querySelector('.hero-name');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroName && scrollY < window.innerHeight) {
      heroName.style.transform = `translateY(${scrollY * 0.15}px)`;
      heroName.style.opacity   = 1 - scrollY / (window.innerHeight * 0.7);
    }
  }, { passive: true });


  // ── 10. Project cards — tilt on hover ───────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -5;
      const rotateY = ((e.clientX - centerX) / (rect.width  / 2)) *  5;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
