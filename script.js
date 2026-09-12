// RAMI Decoration portfolio — filters, scroll state, reveals, counters, tilt.

const header = document.querySelector('.site-header');
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
const emptyNote = document.getElementById('grid-empty');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header hairline once scrolled past the top
addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', scrollY > 8);
}, { passive: true });

// Discipline filters
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => {
      c.classList.toggle('is-active', c === chip);
      c.setAttribute('aria-pressed', c === chip);
    });
    const filter = chip.dataset.filter;
    let visible = 0;
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat.split(' ').includes(filter);
      card.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    emptyNote.hidden = visible > 0;
  });
});

// Stagger-reveal the work grid the first time it enters the viewport
if (!reduceMotion && 'IntersectionObserver' in window) {
  cards.forEach(card => card.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const inRow = [...cards].filter(c => !c.classList.contains('is-hidden'));
      entry.target.style.setProperty('--i', inRow.indexOf(entry.target) % 4);
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  cards.forEach(card => io.observe(card));
}

// Section reveals: heads draw their gold rule, content rises in
const revealTargets = [
  ...document.querySelectorAll('.section-head'),
  ...document.querySelectorAll('.index li'),
  document.querySelector('.about-figure'),
  document.querySelector('.about-text'),
  document.querySelector('.contact-title'),
  document.querySelector('.contact-lede'),
  document.querySelector('.contact-actions'),
].filter(Boolean);

if ('IntersectionObserver' in window) {
  if (!reduceMotion) revealTargets.forEach(el => el.classList.add('reveal-up'));
  const sio = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      sio.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  revealTargets.forEach(el => sio.observe(el));
}

// Count-up stats when the hero settles
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const start = performance.now();
  const dur = 1800;
  (function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  })(performance.now());
}
document.querySelectorAll('.counter').forEach(el => {
  setTimeout(() => animateCounter(el), 700);
});

// 3D tilt on project cards (pointer devices only)
if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  cards.forEach(card => {
    const fig = card.querySelector('figure');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      fig.classList.add('is-tilting');
      fig.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      fig.classList.remove('is-tilting');
      fig.style.transform = '';
    });
  });
}

// Gentle parallax on the hero background
const heroBg = document.querySelector('.hero-bg img');
if (heroBg && !reduceMotion) {
  addEventListener('scroll', () => {
    const y = Math.min(scrollY, innerHeight);
    heroBg.style.translate = `0 ${(y * 0.18).toFixed(1)}px`;
  }, { passive: true });
}

// Title block date
document.getElementById('tb-year').textContent = new Date().getFullYear();
