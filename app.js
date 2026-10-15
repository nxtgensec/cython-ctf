// CYTHON CTF — homepage interactions
document.addEventListener('DOMContentLoaded', () => {
  const t = document.getElementById('navToggle');
  const m = document.getElementById('mobileNav');
  if (t && m) t.addEventListener('click', () => {
    const open = m.classList.toggle('open');
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  if (m) m.querySelectorAll('a').forEach(a => a.addEventListener('click', () => m.classList.remove('open')));
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  document.getElementById('year').textContent = new Date().getFullYear();
  const h1 = document.querySelector('.hx-h1');
  const fitHx = () => {
    const l2 = h1 && h1.querySelector('.hx-l2');
    if (!h1 || !l2) return;
    l2.style.fontSize = '';
    const base = parseFloat(getComputedStyle(l2).fontSize);
    const avail = h1.clientWidth;
    const need = l2.scrollWidth;
    if (need > avail + 1) {
      l2.style.fontSize = Math.max(20, base * avail / need).toFixed(1) + 'px';
    }
  };
  fitHx();
  window.addEventListener('resize', fitHx);
  const w = document.getElementById('hxWord');
  if (w) {
    const words = ['Hunt', 'Exploration', 'Challenge', 'Discovery', 'Innovation', 'Experimentation', 'Domination', 'Strategy', 'Precision', 'Intelligence', 'Exploitation', 'Investigation', 'Mastery', 'Breakthrough', 'Victory'];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0;
    setInterval(() => {
      const swap = () => {
        i = (i + 1) % words.length;
        w.textContent = words[i];
        w.classList.remove('is-out');
        fitHx();
      };
      if (reduceMotion) { swap(); }
      else { w.classList.add('is-out'); setTimeout(swap, 300); }
    }, 3000);
  }
});
