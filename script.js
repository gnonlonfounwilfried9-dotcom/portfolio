/* Portfolio Wilfried GNONLONFOUN · animations continues et interactions (v2) */
(() => {
  const root = document.documentElement;
  const reduce = root.classList.contains('reduce-motion');
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasGSAP) root.classList.add('no-anim');
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  let postersST = null;

  /* ---------- Défilement fluide ---------- */
  let lenis = null;
  if (hasGSAP && window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = (y) => (lenis ? lenis.scrollTo(y, { duration: 1.4 }) : window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }));
  const scrollToEl = (el) => scrollToY(el.getBoundingClientRect().top + window.scrollY - 70);

  /* ---------- Bandeaux : duplication pour une boucle sans couture ---------- */
  $$('.marquee, .stack-marquee, .chips-marquee, .certs-marquee, .contact-marquee, .creator-marquee').forEach((m) => {
    const t = $('.marquee-track', m);
    if (!t) return;
    const c = t.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.removeAttribute('id');
    $$('[id]', c).forEach((n) => n.removeAttribute('id'));
    $$('button, a', c).forEach((n) => n.setAttribute('tabindex', '-1'));
    m.appendChild(c);
  });

  /* ---------- Écran d'ouverture ---------- */
  const loader = $('#loader');
  const startIntro = () => {
    root.classList.remove('is-loading');
    if (loader) loader.classList.add('is-done');
    if (lenis) lenis.start();
    heroIntro();
    setTimeout(() => root.classList.add('is-ready'), 600);
  };
  if (loader && !reduce) {
    if (lenis) lenis.stop();
    const count = $('#loaderCount'), bar = $('#loaderBar');
    let n = 0, loaded = document.readyState === 'complete', done = false;
    window.addEventListener('load', () => { loaded = true; });
    const finish = () => { if (done) return; done = true; setTimeout(startIntro, 150); };
    const tick = () => {
      n = Math.min(100, n + (loaded ? 4 : (n < 80 ? 2 : 0.3)));
      count.textContent = Math.round(n);
      bar.style.width = n + '%';
      if (n >= 100) finish(); else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(finish, 3500);
  } else {
    startIntro();
  }

  /* ---------- En-tête, menu, progression ---------- */
  const header = $('#siteHeader'), navToggle = $('#navToggle'), mainNav = $('#mainNav'), sbar = $('#scrollBar');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('is-hidden', y > 500 && y > lastY && !mainNav.classList.contains('open'));
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (sbar) sbar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 ? document.querySelector(id) : null;
      if (!target) return;
      e.preventDefault();
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      scrollToEl(target);
    });
  });
  const navLinks = $$('.main-nav a[href^="#"]');
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean).forEach((s) => navObs.observe(s));

  /* ---------- Curseur et boutons magnétiques ---------- */
  const cursor = $('#cursor'), cursorLabel = $('#cursorLabel');
  if (fine && cursor && !reduce) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; cursor.classList.add('is-on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));
    (function loop() { cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2; cursor.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); })();
    document.addEventListener('pointerover', (e) => {
      const lab = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, .wall-col img');
      cursor.classList.toggle('is-label', !!lab);
      cursorLabel.textContent = lab ? lab.getAttribute('data-cursor') : '';
      cursor.classList.toggle('is-link', !lab && !!link);
    });
  }
  if (fine && hasGSAP && !reduce) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3.out' });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, .4)' }));
    });
  }

  /* ---------- Hero : rôles tapés en boucle ---------- */
  const roles = ['Social Media Manager', 'Créateur de contenu', 'Automatisation IA', 'Motion design', 'Ambassadeur Web3'];
  const rolesWord = $('#rolesWord');
  if (rolesWord && !reduce) {
    let ri = 0, ci = roles[0].length, del = true;
    const type = () => {
      const w = roles[ri];
      if (del) { ci--; if (ci <= 0) { del = false; ri = (ri + 1) % roles.length; } }
      else { ci++; if (ci >= roles[ri].length) { del = true; rolesWord.textContent = roles[ri]; return setTimeout(type, 1800); } }
      rolesWord.textContent = roles[ri].slice(0, Math.max(0, ci)) || ' ';
      setTimeout(type, del ? 40 : 70);
      void w;
    };
    setTimeout(type, 2600);
  }
  // Badge en direct
  const ticker = $('#liveTicker');
  const tickerMsgs = ['publication programmée', 'mail de validation envoyé', 'post publié sur Facebook', 'radar d’actu en veille', 'affiche générée', 'journal mis à jour'];
  if (ticker && !reduce) {
    let k = 0;
    setInterval(() => { k = (k + 1) % tickerMsgs.length; ticker.style.opacity = 0; setTimeout(() => { ticker.textContent = tickerMsgs[k]; ticker.style.opacity = 1; }, 250); }, 2400);
    ticker.style.transition = 'opacity .25s';
  }

  /* ---------- Hero : particules connectées ---------- */
  const cv = $('#heroParticles');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    let W, H, pts = [], dpr = Math.min(2, window.devicePixelRatio || 1), mouse = { x: -999, y: -999 };
    const size = () => {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.round(W * H / 22000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .6 }));
    };
    size(); window.addEventListener('resize', size);
    cv.parentElement.addEventListener('pointermove', (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    let visible = true;
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(cv);
    (function draw() {
      if (visible) {
        ctx.clearRect(0, 0, W, H);
        pts.forEach((p) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dm < 120) { p.x += (p.x - mouse.x) / dm; p.y += (p.y - mouse.y) / dm; }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = 'rgba(246,194,27,.7)'; ctx.fill();
        });
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) { ctx.strokeStyle = `rgba(120,180,255,${(1 - d / 120) * .25})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  function heroIntro() {
    if (!hasGSAP || reduce) return;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.hero-blob', { scale: 0, duration: 1.3 }, 0)
      .from('.hero-ring', { opacity: 0, duration: 1.2, stagger: .2 }, 0.2)
      .from('.hero-person', { yPercent: 20, opacity: 0, duration: 1.3 }, 0.15)
      .from('.hero-title .line > span', { yPercent: 115, duration: 1.1, stagger: 0.12 }, 0.25)
      .from('.hero-kicker, .hero-roles, .hero-lead, .hero-actions, .hero-meta', { y: 30, opacity: 0, duration: 1, stagger: 0.08 }, 0.5)
      .from('.orbit, .hero-badge', { scale: 0, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'back.out(1.7)' }, 0.7);
    $$('[data-float]').forEach((el, i) => {
      gsap.to(el, { y: (i % 2 ? 14 : -14), rotation: (i % 2 ? 4 : -4), duration: 2.6 + (i % 3) * 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.4 });
    });
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to('.hero-type', { yPercent: 40, opacity: 0.2 }, 0)
      .to('.hero-person', { y: -50, scale: 1.04 }, 0)
      .to('.hero-copy', { y: -80, opacity: 0 }, 0);
    if (fine) {
      window.addEventListener('pointermove', (e) => {
        const dx = e.clientX / window.innerWidth - 0.5, dy = e.clientY / window.innerHeight - 0.5;
        gsap.to('.orbit', { x: dx * 40, y: dy * 30, duration: 1, ease: 'power3.out', overwrite: 'auto' });
        gsap.to('.hero-person', { x: dx * 12, duration: 1.2, ease: 'power3.out', overwrite: 'auto' });
        gsap.to('.hero-type', { x: dx * -30, duration: 1.4, ease: 'power3.out', overwrite: 'auto' });
      }, { passive: true });
    }
  }

  /* ---------- Carte profil inclinable ---------- */
  const card = $('[data-tilt]');
  if (card && fine && !reduce) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  }

  /* ---------- Titres découpés et manifeste ---------- */
  $$('[data-split]').forEach((title) => {
    const out = [];
    title.childNodes.forEach((node) => {
      const isEm = node.nodeType === 1 && node.tagName === 'EM';
      node.textContent.split(/\s+/).filter(Boolean).forEach((word) => out.push(`<span class="w"><span>${isEm ? '<em>' + word + '</em>' : word}</span></span>`));
    });
    title.innerHTML = out.join(' ');
    if (hasGSAP && !reduce) gsap.from(title.querySelectorAll('.w > span'), { yPercent: 110, duration: 1, stagger: 0.07, ease: 'power4.out', scrollTrigger: { trigger: title, start: 'top 85%' } });
  });
  $$('[data-words]').forEach((p) => {
    p.innerHTML = p.textContent.trim().split(/\s+/).map((w) => `<span class="mw">${w}</span>`).join(' ');
    const spans = $$('.mw', p);
    if (hasGSAP && !reduce) {
      ScrollTrigger.create({ trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: (st) => { const n = Math.round(st.progress * spans.length); spans.forEach((s, i) => s.classList.toggle('on', i < n)); } });
    } else spans.forEach((s) => s.classList.add('on'));
  });

  /* ---------- Compteurs et barres ---------- */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, to = parseInt(el.getAttribute('data-to'), 10);
      countObs.unobserve(el);
      if (reduce) { el.textContent = to.toLocaleString('fr-FR'); return; }
      const t0 = performance.now(), dur = 1600;
      const step = (now) => { const p = Math.min((now - t0) / dur, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('fr-FR'); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$('.count').forEach((el) => countObs.observe(el));
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const max = parseFloat(en.target.getAttribute('data-max'));
      $$('.bar', en.target).forEach((b) => { $('.bar-fill', b).style.width = (parseFloat(b.getAttribute('data-value')) / max * 100) + '%'; });
      barObs.unobserve(en.target);
    });
  }, { threshold: 0.4 });
  $$('.bars').forEach((b) => barObs.observe(b));

  /* ---------- Ikigaï : boucle continue, particules, liens, attraction du curseur ---------- */
  const ikStage = $('#ikigaiStage');
  if (ikStage) {
    const NS = 'http://www.w3.org/2000/svg';
    const circles = $$('#ikCircles circle'), labels = $$('#ikLabels text'), core = $('#ikCore'), coreText = $('#ikCoreText');
    const items = $$('#ikigaiList li');
    const linesG = $('#ikLines'), partG = $('#ikParticles');
    const pairs = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]];
    const lines = pairs.map(() => { const l = document.createElementNS(NS, 'line'); linesG.appendChild(l); return l; });
    const COLORS = ['#5cc2ff', '#ffd84d', '#9a8cff', '#4fe3bf'];
    const parts = Array.from({ length: 34 }, (_, i) => {
      const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', (1.6 + Math.random() * 2.4).toFixed(1)); c.setAttribute('fill', COLORS[i % 4]); partG.appendChild(c);
      return { el: c, from: i % 4, to: (i + 1 + Math.floor(Math.random() * 3)) % 4, t: Math.random(), sp: 0.12 + Math.random() * 0.28, off: (Math.random() - .5) * 26 };
    });
    let visible = true, mx = 0, my = 0, mIn = false;
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(ikStage);
    ikStage.addEventListener('pointermove', (e) => {
      const r = ikStage.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width * 600; my = (e.clientY - r.top) / r.height * 600; mIn = true;
    });
    ikStage.addEventListener('pointerleave', () => { mIn = false; });
    const CX = 300, CY = 300, CYCLE = 11000;
    const ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const spreadAt = (p) => {
      if (p < .18) return 1;
      if (p < .38) return 1 - ease((p - .18) / .2) * .64;
      if (p < .5) return .36 - ease((p - .38) / .12) * .36;
      if (p < .62) return 0;
      if (p < .78) return ease((p - .62) / .16) * .5;
      if (p < .9) return .5 + Math.sin((p - .78) / .12 * Math.PI) * .12;
      return .5 + ease((p - .9) / .1) * .5;
    };
    let last = 0;
    const pos = [[0, 0], [0, 0], [0, 0], [0, 0]];
    const frame = (now) => {
      if (visible) {
        const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
        const p = reduce ? .4 : (now % CYCLE) / CYCLE;
        const s = reduce ? .36 : spreadAt(p);
        const rot = reduce ? 0 : now / 5200;
        const R = 10 + s * 170, r = 112 + (1 - s) * 26 + (reduce ? 0 : Math.sin(now / 700) * 5);
        circles.forEach((c, k) => {
          const a = rot + k * Math.PI / 2 - Math.PI / 4 + (reduce ? 0 : Math.sin(now / 1500 + k * 2) * .25);
          const wob = reduce ? 0 : Math.sin(now / 520 + k * 1.7) * 14 * (.35 + s);
          let x = CX + Math.cos(a) * (R + wob), y = CY + Math.sin(a) * (R + wob);
          if (mIn && !reduce) { x += (mx - x) * .18; y += (my - y) * .18; }
          pos[k] = [x, y];
          c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', r.toFixed(1));
          const LR = R + r * .62;
          labels[k].setAttribute('x', (CX + Math.cos(a) * LR + (x - CX - Math.cos(a) * R)).toFixed(1));
          labels[k].setAttribute('y', (CY + Math.sin(a) * LR + (y - CY - Math.sin(a) * R) + 7).toFixed(1));
          labels[k].style.opacity = s < .2 ? s * 5 : 1;
        });
        lines.forEach((l, i) => {
          const [a, b] = pairs[i];
          l.setAttribute('x1', pos[a][0].toFixed(1)); l.setAttribute('y1', pos[a][1].toFixed(1)); l.setAttribute('x2', pos[b][0].toFixed(1)); l.setAttribute('y2', pos[b][1].toFixed(1));
          l.style.opacity = Math.min(1, s * 1.6) * .8;
        });
        parts.forEach((q) => {
          q.t += dt * q.sp * (1 + (1 - s) * 2.2);
          if (q.t >= 1) { q.t = 0; q.from = q.to; q.to = (q.from + 1 + Math.floor(Math.random() * 3)) % 4; }
          const e = ease(q.t), A = pos[q.from], B = pos[q.to];
          const x = A[0] + (B[0] - A[0]) * e + Math.sin(q.t * 6.283 + q.off) * q.off * .6;
          const y = A[1] + (B[1] - A[1]) * e + Math.cos(q.t * 6.283 + q.off) * q.off * .6;
          q.el.setAttribute('cx', x.toFixed(1)); q.el.setAttribute('cy', y.toFixed(1));
          q.el.style.opacity = (.35 + Math.sin(q.t * Math.PI) * .65).toFixed(2);
        });
        const merged = 1 - Math.min(1, s / .3);
        core.setAttribute('r', (40 + merged * 34 + (reduce ? 0 : Math.sin(now / 300) * 4 * (.3 + merged))).toFixed(1));
        coreText.style.fontSize = (18 + merged * 12) + 'px';
        const active = Math.floor(p * 12) % 4;
        items.forEach((li, k) => li.classList.toggle('is-on', merged > .5 ? true : k === active));
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ---------- Contact : mots qui changent, lueur qui suit le curseur ---------- */
  const swapWord = $('#swapWord');
  if (swapWord && !reduce) {
    const words = ['un projet', 'une marque', 'un poste', 'une idée', 'une campagne'];
    let wi = 0;
    setInterval(() => {
      wi = (wi + 1) % words.length;
      if (hasGSAP) {
        gsap.to(swapWord, { yPercent: -60, opacity: 0, duration: .25, ease: 'power2.in', onComplete: () => { swapWord.textContent = words[wi]; gsap.fromTo(swapWord, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: 'power3.out' }); } });
      } else swapWord.textContent = words[wi];
    }, 2200);
  }
  const cGlow = $('#contactGlow'), cSec = $('#contact');
  if (cGlow && cSec && fine && !reduce) {
    let gx = 400, gy = 300, tx = 400, ty = 300;
    cSec.addEventListener('pointermove', (e) => { const r = cSec.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; });
    (function loop() { gx += (tx - gx) * .08; gy += (ty - gy) * .08; cGlow.style.transform = `translate(${gx}px, ${gy}px)`; requestAnimationFrame(loop); })();
  } else if (cGlow && !reduce) {
    gsap && gsap.to(cGlow, { x: '70vw', y: 300, duration: 7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

  /* ---------- Mouvement global : bandeaux accélérés par le défilement, cartes inclinables ---------- */
  if (!reduce) {
    const tracks = $$('.marquee-track');
    let boost = 0, lastSY = window.scrollY;
    window.addEventListener('scroll', () => { const d = Math.abs(window.scrollY - lastSY); lastSY = window.scrollY; boost = Math.min(5, boost + d / 120); }, { passive: true });
    (function loop() {
      boost *= 0.94;
      const rate = 1 + boost;
      tracks.forEach((t) => { (t.getAnimations ? t.getAnimations() : []).forEach((a) => { a.playbackRate = rate; }); });
      requestAnimationFrame(loop);
    })();
    if (fine) {
      $$('.doc, .cert').forEach((el) => {
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
        });
        el.addEventListener('pointerleave', () => { el.style.transform = ''; });
      });
    }
  }

  /* ---------- Agent : circuit qui tourne seul + journal en direct ---------- */
  const pipe = $('#pipeline');
  if (pipe) {
    const steps = $$('.pipe-step', pipe);
    const packet = document.createElement('span');
    packet.className = 'pipe-packet';
    pipe.appendChild(packet);
    let i = -1;
    const go = () => {
      i = (i + 1) % steps.length;
      steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
      const icon = $('.pipe-icon', steps[i]);
      const top = steps[i].offsetTop + icon.offsetTop + icon.offsetHeight / 2 - 6;
      packet.style.transition = i === 0 ? 'none' : 'top 1s cubic-bezier(.22,1,.36,1)';
      packet.style.top = top + 'px';
    };
    go();
    if (!reduce) setInterval(go, 1700);
  }
  const term = $('#terminal');
  if (term) {
    const lines = [
      ['08:00', 'Lecture du calendrier : <b>4 posts</b> prévus aujourd’hui'],
      ['08:01', 'Affiche générée : <b>WL quiz CAN</b>'],
      ['08:30', 'Mail de validation envoyé, publication à 09:00'],
      ['08:42', '<i>Validé</i> en un clic'],
      ['09:00', '<i>Publié</i> sur Facebook WILACTU'],
      ['09:05', 'Notification de confirmation envoyée'],
      ['10:15', 'Radar : info chaude détectée, <b>sport</b>'],
      ['10:16', 'Vérification de la source, breaking news préparée'],
      ['12:00', 'Mail de validation, publication à 12:30'],
      ['12:30', '<i>Publié</i> sur Facebook WILACTU'],
      ['13:00', '<i>Publié</i> sur LinkedIn, profil Wilfried'],
      ['18:30', '<i>Publié</i> sur Facebook Roots Technologies'],
      ['19:00', 'Journal mis à jour, <b>0 erreur</b>'],
    ];
    let li = 0;
    const push = () => {
      const [t, m] = lines[li % lines.length];
      const el = document.createElement('li');
      el.innerHTML = `<span style="color:#5e7397">${t}</span>  ${m}`;
      term.appendChild(el);
      while (term.children.length > 8) term.removeChild(term.firstChild);
      li++;
    };
    for (let k = 0; k < 5; k++) push();
    if (!reduce) setInterval(push, 1500);
  }

  /* ---------- Murs d'affiches en défilement continu ---------- */
  const seq = (dir, n) => Array.from({ length: n }, (_, i) => `assets/work/${dir}/${dir}-${String(i + 1).padStart(2, '0')}.webp`);
  $$('.poster-wall').forEach((wall) => {
    const brand = wall.getAttribute('data-wall'), n = parseInt(wall.getAttribute('data-count'), 10);
    const imgs = seq(brand, n);
    const cols = [[], [], []];
    imgs.forEach((src, k) => cols[k % 3].push({ src, k }));
    cols.forEach((col, c) => {
      const el = document.createElement('div');
      el.className = 'wall-col' + (c === 1 ? ' down' : '');
      el.style.setProperty('--dur', (34 + c * 9 + n) + 's');
      const html = col.map(({ src, k }) => `<img src="${src}" alt="Affiche ${brand} ${k + 1}" loading="lazy" data-brand-gallery="${brand}" data-index="${k}">`).join('');
      el.innerHTML = html + html.replace(/<img /g, '<img aria-hidden="true" ');
      wall.appendChild(el);
    });
  });

  /* ---------- Services qui s'allument en boucle ---------- */
  const services = $$('.service');
  if (services.length && !reduce) {
    let si = 0, hovering = false;
    const list = $('.services');
    list.addEventListener('pointerenter', () => { hovering = true; services.forEach((s) => s.classList.remove('auto')); });
    list.addEventListener('pointerleave', () => { hovering = false; });
    setInterval(() => {
      if (hovering) return;
      services.forEach((s, k) => s.classList.toggle('auto', k === si));
      si = (si + 1) % services.length;
    }, 2200);
  }

  if (hasGSAP && !reduce) {
    /* ---------- Apparitions ---------- */
    const rise = '.stat, .profil-card, .ikigai-list li, .agent-stats > div, .connected, .doc, .service, .testimonial, .bars, .docs-title, .section-lead, .terminal, .creator-steps li, .all-projects, .sub';
    gsap.set(rise, { opacity: 0, y: 50 });
    ScrollTrigger.batch(rise, { start: 'top 88%', onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true, clearProps: 'transform' }) });
    const wipe = '.reel, .wide, .flow';
    gsap.set(wipe, { clipPath: 'inset(100% 0% 0% 0% round 20px)' });
    ScrollTrigger.batch(wipe, { start: 'top 92%', onEnter: (els) => gsap.to(els, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.2, stagger: 0.1, ease: 'power4.inOut' }) });
    gsap.from('.pipe-step', { x: -40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '#pipeline', start: 'top 80%' } });
    gsap.from('.cut', { y: 120, opacity: 0, duration: 1.2, stagger: .15, ease: 'power3.out', scrollTrigger: { trigger: '.creator-stage', start: 'top 80%' } });

    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const cards = $$('.stack-card');
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (next) gsap.to(c, { scale: 0.9, filter: 'brightness(.45)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 90px', scrub: true } });
      });
    });
    mm.add('(min-width: 901px) and (min-height: 561px)', () => {
      const track = $('#postersTrack');
      const dist = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '#postersPin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1, onUpdate: (st) => gsap.set('#postersProgress', { scaleX: st.progress }) },
      });
      postersST = tween.scrollTrigger;
      return () => { postersST = null; };
    });

    const pathFill = $('#pathFill');
    if (pathFill) {
      gsap.to(pathFill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.path', start: 'top 70%', end: 'bottom 60%', scrub: true } });
      $$('.path-item').forEach((item) => {
        ScrollTrigger.create({ trigger: item, start: 'top 65%', onEnter: () => item.classList.add('is-on'), onLeaveBack: () => item.classList.remove('is-on') });
        gsap.from(item, { x: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 88%' } });
      });
    }
    gsap.fromTo('.section-contact', { clipPath: 'inset(6% 5% 0% 5% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 40px)', ease: 'none', scrollTrigger: { trigger: '.section-contact', start: 'top bottom', end: 'top 35%', scrub: true } });
    window.addEventListener('load', () => ScrollTrigger.refresh());
  } else {
    $$('.path-item').forEach((i) => i.classList.add('is-on'));
    const f = $('#pathFill'); if (f) f.style.transform = 'scaleY(1)';
  }
  void postersST;

  /* ---------- Vidéos ---------- */
  if (!reduce) {
    const vObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) { if (v.preload !== 'auto') v.preload = 'auto'; const p = v.play(); if (p) p.catch(() => {}); }
        else v.pause();
      });
    }, { threshold: 0.25 });
    $$('video[data-autoplay]').forEach((v) => vObs.observe(v));
  }
  const vbox = $('#videobox'), vbVideo = $('#vbVideo');
  const openVideo = (src) => { vbVideo.src = src; vbox.classList.add('open'); if (lenis) lenis.stop(); const p = vbVideo.play(); if (p) p.catch(() => {}); };
  const closeVideo = () => { vbVideo.pause(); vbVideo.removeAttribute('src'); vbVideo.load(); vbox.classList.remove('open'); if (lenis) lenis.start(); };
  $$('[data-video-open]').forEach((el) => el.addEventListener('click', () => openVideo(el.getAttribute('data-video-open'))));
  $('#vbClose').addEventListener('click', closeVideo);
  vbox.addEventListener('click', (e) => { if (e.target === vbox) closeVideo(); });

  /* ---------- Visionneuse d'images ---------- */
  const P = 'assets/img/proofs/';
  const galleries = {
    wilactu: seq('wilactu', 24), panda: seq('panda', 24), roots: seq('roots', 12),
    'komarts-proof': [P + 'kom-arts/cover.jpg', P + 'kom-arts/chiffres-cles.jpg', P + 'kom-arts/objectifs.jpg', P + 'kom-arts/calendrier-editorial.jpg'],
    'bbd-proof': [P + 'bbd2027/cover.jpg', P + 'bbd2027/objectifs.jpg', P + 'bbd2027/calendrier.jpg'],
    'uac-proof': [P + 'uac/cover.jpg', P + 'uac/etat-des-lieux-facebook.jpg', P + 'uac/objectifs.jpg', 'assets/img/uac/bus-universitaires.jpg', 'assets/img/uac/sondage-campus.jpg'],
    'panda-proof': [P + 'panda-ticket/cover.jpg', P + 'panda-ticket/objectifs.jpg', P + 'panda-ticket/calendrier.jpg'],
    'pulse-proof': [P + 'football-pulse/cover.jpg', P + 'football-pulse/chiffres-cles.jpg', P + 'football-pulse/objectifs.jpg', P + 'football-pulse/calendrier-aout.jpg'],
    'guide-proof': [P + 'guide-12-points/cover.jpg', P + 'guide-12-points/point-05-cadrage.jpg', P + 'guide-12-points/conclusion.jpg'],
    web3: ['bitget-beyond-2025', 'binance-angels', 'hope-with-bitcoin-meetup'].map((n) => `assets/img/web3/${n}.jpg`),
    certs: ['msa-ia-generative.png', 'binance-ia-agents.png', 'msa-fondamentaux-internet.png', 'msa-recherche-internet.png', 'coursera-powerpoint.png', 'binance-regulatory-risks.png', 'binance-academie-crypto.png', 'openclassrooms-marketing-digital.png', 'learnio-wordpress.png'].map((n) => 'assets/img/certifications/' + n),
    temoignage: ['assets/img/testimonials/kpogbeme.jpg'],
  };
  ['panda-strategie-6-mois','panda-plan-v5','roots-plan-imprimantes','roots-plan-3','komarts-plan-devweb','wura-strategie','wura-plan-6-semaines','filinfos-roots','possa-strategie'].forEach((k) => { galleries['d-' + k] = [1, 2, 3, 4].map((i) => `assets/img/docs/${k}/${i}.webp`); });
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCount = $('#lbCount');
  let cur = [], idx = 0;
  const show = () => { lbImg.src = cur[idx]; lbImg.alt = 'Visuel ' + (idx + 1) + ' sur ' + cur.length; lbCount.textContent = cur.length > 1 ? (idx + 1) + ' / ' + cur.length : ''; };
  const openGallery = (name, i) => {
    cur = galleries[name] || []; if (!cur.length) return;
    idx = Math.min(Math.max(0, i || 0), cur.length - 1);
    lb.classList.toggle('single', cur.length < 2); show(); lb.classList.add('open'); if (lenis) lenis.stop();
  };
  const closeGallery = () => { lb.classList.remove('open'); lbImg.src = ''; if (lenis) lenis.start(); };
  const go = (d) => { idx = (idx + d + cur.length) % cur.length; show(); };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-gallery-open], [data-brand-gallery]');
    if (!t) return;
    openGallery(t.getAttribute('data-gallery-open') || t.getAttribute('data-brand-gallery'), parseInt(t.getAttribute('data-index') || '0', 10));
  });
  $('#lbClose').addEventListener('click', closeGallery);
  $('#lbPrev').addEventListener('click', () => go(-1));
  $('#lbNext').addEventListener('click', () => go(1));
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.tagName === 'FIGURE') closeGallery(); });
  document.addEventListener('keydown', (e) => {
    if (vbox.classList.contains('open') && e.key === 'Escape') closeVideo();
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });

  /* ---------- Aperçu flottant des services ---------- */
  const preview = $('#servicePreview');
  if (fine && preview) {
    const pImg = $('img', preview);
    let px = 0, py = 0, tx = 0, ty = 0;
    services.forEach((s) => {
      s.addEventListener('pointerenter', () => { pImg.src = s.getAttribute('data-preview'); preview.classList.add('is-on'); });
      s.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
    });
    window.addEventListener('pointermove', (e) => { tx = e.clientX + 30; ty = e.clientY - 140; }, { passive: true });
    (function loop() { if (preview.classList.contains('is-on')) { px += (tx - px) * 0.15; py += (ty - py) * 0.15; preview.style.left = px + 'px'; preview.style.top = py + 'px'; } requestAnimationFrame(loop); })();
  }

  /* ---------- Bulles physiques, relancées en continu ---------- */
  const box = $('#toolsBox');
  if (box) {
    if (!window.Matter || reduce) box.classList.add('is-static');
    else {
      let started = false;
      new IntersectionObserver((en) => { if (en[0].isIntersecting && !started) { started = true; startPhysics(); } }, { threshold: 0.3 }).observe(box);
    }
  }
  function startPhysics() {
    const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter;
    const engine = Engine.create();
    const els = $$('.tool', box);
    let W = box.clientWidth, H = box.clientHeight;
    const floor = Bodies.rectangle(W / 2, H + 50, W * 3, 100, { isStatic: true });
    const left = Bodies.rectangle(-50, H / 2, 100, H * 4, { isStatic: true });
    const right = Bodies.rectangle(W + 50, H / 2, 100, H * 4, { isStatic: true });
    Composite.add(engine.world, [floor, left, right]);
    const bodies = els.map((el, i) => {
      const r = el.offsetWidth / 2;
      const b = Bodies.circle(r + Math.random() * (W - 2 * r), -r - i * 70, r, { restitution: 0.7, friction: 0.05, frictionAir: 0.01 });
      Composite.add(engine.world, b);
      return { el, b, r };
    });
    if (fine) {
      const mouse = Mouse.create(box);
      ['mousewheel', 'DOMMouseScroll', 'wheel'].forEach((ev) => mouse.element.removeEventListener(ev, mouse.mousewheel));
      Composite.add(engine.world, MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } }));
    } else {
      box.addEventListener('click', (e) => {
        const r = box.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        bodies.forEach(({ b }) => { const dx = b.position.x - x, dy = b.position.y - y, d = Math.hypot(dx, dy) || 1; if (d < 200) Body.applyForce(b, b.position, { x: dx / d * 0.08, y: -0.12 }); });
      });
    }
    const runner = Runner.create();
    Runner.run(runner, engine);
    let running = true;
    // Petites impulsions régulières : les bulles ne s'arrêtent jamais
    setInterval(() => {
      if (!running) return;
      const pick = bodies[Math.floor(Math.random() * bodies.length)];
      Body.applyForce(pick.b, pick.b.position, { x: (Math.random() - .5) * 0.12, y: -0.18 - Math.random() * 0.1 });
    }, 1400);
    (function draw() { bodies.forEach(({ el, b, r }) => { el.style.transform = `translate(${b.position.x - r}px, ${b.position.y - r}px) rotate(${b.angle}rad)`; }); requestAnimationFrame(draw); })();
    window.addEventListener('resize', () => { W = box.clientWidth; H = box.clientHeight; Body.setPosition(floor, { x: W / 2, y: H + 50 }); Body.setPosition(right, { x: W + 50, y: H / 2 }); });
    new IntersectionObserver((en) => {
      const vis = en[0].isIntersecting;
      if (vis && !running) { Runner.run(runner, engine); running = true; }
      else if (!vis && running) { Runner.stop(runner); running = false; }
    }).observe(box);
  }
})();
