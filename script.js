// Rami portfolio — filters, scroll state, reveals.

const header = document.querySelector('.site-header');
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
const emptyNote = document.getElementById('grid-empty');

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
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
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

// Title block date
document.getElementById('tb-year').textContent = new Date().getFullYear();
