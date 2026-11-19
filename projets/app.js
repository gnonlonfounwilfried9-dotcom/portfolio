(() => {
  const items = Array.from(document.querySelectorAll('.g'));
  const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -40px 0px' });
  items.forEach((g, i) => { g.style.transitionDelay = (i % 6) * 60 + 'ms'; io.observe(g); });
  const lb = document.getElementById('lb'), img = document.getElementById('lbi'), cap = document.getElementById('lbn');
  let list = [], k = 0;
  const show = () => { img.src = list[k]; cap.textContent = (k + 1) + ' / ' + list.length; };
  items.forEach((g) => g.addEventListener('click', () => {
    list = Array.from((g.closest('.grid') || g.parentElement).querySelectorAll('.g')).map((x) => x.dataset.src);
    k = list.indexOf(g.dataset.src); show(); lb.classList.add('open');
  }));
  const close = () => { lb.classList.remove('open'); img.src = ''; };
  document.getElementById('lbc').onclick = close;
  document.getElementById('lbp').onclick = () => { k = (k - 1 + list.length) % list.length; show(); };
  document.getElementById('lbx').onclick = () => { k = (k + 1) % list.length; show(); };
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') document.getElementById('lbx').click();
    if (e.key === 'ArrowLeft') document.getElementById('lbp').click();
  });
  document.querySelectorAll('video').forEach((v) => v.addEventListener('play', () => document.querySelectorAll('video').forEach((o) => { if (o !== v) o.pause(); })));
})();
