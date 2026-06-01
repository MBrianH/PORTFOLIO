// ── Custom Cursor ──
const dot = document.createElement('div');
dot.className = 'cursor-dot';
const ring = document.createElement('div');
ring.className = 'cursor-ring';
document.body.append(dot, ring);

let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a, button, .project-card, .skill-card, .journey-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ── Scroll Progress ──
const bar = document.createElement('div');
bar.id = 'scroll-progress';
document.body.prepend(bar);
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  bar.style.width = pct + '%';
});

// ── Navbar Scroll ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile Nav ──
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});
document.querySelectorAll('.nav-menu a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { hamburger.classList.remove('active'); navMenu.classList.remove('active'); }
});

// ── Active Nav Link ──
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(a => {
  a.classList.toggle('active', a.getAttribute('href') === currentPage);
});

// ── Reveal on Scroll ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// ── Skill Bars ──
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-progress').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-grid').forEach(g => skillObserver.observe(g));

// ── Typewriter on Hero ──
const roleEl = document.querySelector('.hero-content .role');
if (roleEl) {
  const roles = ['Web Developer', 'UI/UX Designer', 'Creative Coder'];
  let ri = 0, ci = 0, deleting = false;
  function type() {
    const word = roles[ri];
    roleEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length) { deleting = true; setTimeout(type, 1400); return; }
    if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; }
    setTimeout(type, deleting ? 55 : 90);
  }
  type();
}

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Contact Form ──
const form = document.getElementById('contactForm');
const msg = document.getElementById('formMessage');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { msg.textContent = 'Message sent! I\'ll get back to you soon.'; msg.className = 'form-message success'; form.reset(); }
      else { msg.textContent = 'Something went wrong. Please try again.'; msg.className = 'form-message error'; }
    } catch { msg.textContent = 'Network error. Check your connection.'; msg.className = 'form-message error'; }
    finally { btn.disabled = false; btn.textContent = 'Send Message'; }
  });
}
