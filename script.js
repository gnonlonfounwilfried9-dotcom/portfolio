// Menu mobile
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Barres de compétences : remplissage au moment où elles entrent dans l'écran
const skillFills = document.querySelectorAll('.skill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-fill');
      const percent = entry.target.getAttribute('data-percent');
      fill.style.width = percent + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

skillFills.forEach((skill) => skillObserver.observe(skill));

// Graphiques en barres (réalisations, ambassadeur) : remplissage au scroll
const barCharts = document.querySelectorAll('.bar-chart');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const chart = entry.target;
      const max = parseFloat(chart.getAttribute('data-max'));
      chart.querySelectorAll('.bar-chart-row').forEach((row) => {
        const value = parseFloat(row.getAttribute('data-value'));
        const fill = row.querySelector('.bar-chart-fill');
        fill.style.width = (value / max * 100) + '%';
      });
      barObserver.unobserve(chart);
    }
  });
}, { threshold: 0.3 });

barCharts.forEach((chart) => barObserver.observe(chart));

// Anneau de progression (défi 125 contenus)
const rings = document.querySelectorAll('.progress-ring');

const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const ring = entry.target;
      const percent = parseFloat(ring.getAttribute('data-percent'));
      const circle = ring.querySelector('.ring-fill');
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference * (1 - percent / 100);
      ringObserver.unobserve(ring);
    }
  });
}, { threshold: 0.4 });

rings.forEach((ring) => {
  const circle = ring.querySelector('.ring-fill');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;
  ringObserver.observe(ring);
});

// Chiffres clés de la bande d'accueil : compteur animé au scroll
const countUps = document.querySelectorAll('.count-up');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count-to'), 10);
      const duration = 1200;
      const start = performance.now();
      const format = (n) => Math.round(n).toLocaleString('fr-FR');
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(target * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });

countUps.forEach((el) => countObserver.observe(el));

// Mise en avant du lien de navigation actif selon la section visible
const navLinks = document.querySelectorAll('.main-nav a');
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = document.querySelector('.main-nav a[href="#' + entry.target.id + '"]');
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach((section) => navObserver.observe(section));

// Visionneuse plein écran pour les galeries d'images
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    const fullSrc = item.getAttribute('data-full');
    const caption = item.querySelector('.gallery-caption');
    lightboxImg.src = fullSrc;
    lightboxImg.alt = caption ? caption.textContent : '';
    lightbox.classList.add('open');
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Révélation subtile au scroll (cartes, galeries, graphiques, témoignages...)
const revealTargets = document.querySelectorAll(
  '.card, .ikigai-venn, .ikigai-caption, .chart-block, .gallery-item, .testimonial, .about-card, .stat-band-item, .fact-list, .cert-group, .process-step, .value-item'
);

revealTargets.forEach((el, index) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (index % 4) * 70 + 'ms';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((el) => revealObserver.observe(el));

// Bascule du menu en mode sombre pendant la section Ambassadeur Web3
const web3Section = document.getElementById('ambassadeur-web3');

if (web3Section) {
  const themeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      document.body.classList.toggle('on-dark', entry.isIntersecting);
    });
  }, { rootMargin: '-70px 0px 0px 0px', threshold: 0 });

  themeObserver.observe(web3Section);
}
