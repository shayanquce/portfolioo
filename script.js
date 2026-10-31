document.documentElement.classList.add('js');

// ---- Tachometer: build ticks, numbers and redline ----
const svg = document.querySelector('.gauge');
if (svg) {
  const NS = 'http://www.w3.org/2000/svg';
  const cx = 150, cy = 150;
  const START = -135, SWEEP = 270, MAX = 8; // 0–8k RPM over 270°
  const ticks = svg.querySelector('.g-ticks');

  const point = (deg, r) => {
    const rad = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };

  for (let i = 0; i <= MAX * 4; i++) {
    const deg = START + (SWEEP * i) / (MAX * 4);
    const major = i % 4 === 0;
    const [x1, y1] = point(deg, major ? 104 : 112);
    const [x2, y2] = point(deg, 122);
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke-width', major ? 3 : 1.5);
    ticks.appendChild(line);

    if (major) {
      const [tx, ty] = point(deg, 86);
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('x', tx); text.setAttribute('y', ty);
      text.textContent = i / 4;
      ticks.appendChild(text);
    }
  }

  // Redline arc from 6.5k to 8k
  const r = 126;
  const a1 = START + SWEEP * (6.5 / MAX);
  const a2 = START + SWEEP;
  const [sx, sy] = point(a1, r);
  const [ex, ey] = point(a2, r);
  svg.querySelector('.g-redline').setAttribute('d', `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`);

  // Sweep the needle once fonts and layout are ready
  window.addEventListener('load', () => {
    requestAnimationFrame(() => document.body.classList.add('loaded'));
  });
}

// ---- Reveal on scroll ----
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.role, .build, .interest, .lede, .profile-body').forEach((el) => {
  el.classList.add('reveal');
});

document.querySelectorAll('.reveal').forEach((el, i) => {
  if (el.closest('.hero')) el.style.transitionDelay = `${i * 0.12}s`;
  revealer.observe(el);
});

// ---- Active nav link ----
const links = document.querySelectorAll('.nav nav a');
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('section[id]').forEach((s) => spy.observe(s));
