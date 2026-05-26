/* ============================================
   MAHINDRA CITADEL SANCTUM — Production JS
   Performance-optimized · No framework dependencies
   ============================================ */

(function () {
  'use strict';

  /* ---------- Reveal on Scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Header elevation + Hero Parallax ---------- */
  const header = document.querySelector('.header');
  const heroBg = document.querySelector('.hero-bg');
  let ticking = false;

  if (header || heroBg) {
    if (heroBg) requestAnimationFrame(() => heroBg.classList.add('parallax-on'));

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (header) {
            header.style.boxShadow = y > 24
              ? '0 2px 18px -8px rgba(141,45,23,0.10)'
              : 'none';
          }
          if (heroBg && y < window.innerHeight) {
            const translateY = -y * 0.35;
            const scale = 1 + (y / window.innerHeight) * 0.06;
            heroBg.style.transform = `translate3d(0,${translateY}px,0) scale(${scale})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Smooth Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 116;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Pre-Register Form ---------- */
  const form = document.getElementById('preForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameEl = document.getElementById('f_name');
      const mobEl  = document.getElementById('f_mob');
      const name = (nameEl.value || '').trim();
      const mob  = (mobEl.value || '').trim().replace(/\D/g, '');
      let ok = true;
      if (!name) { nameEl.style.borderBottomColor = '#8d2d17'; nameEl.focus(); ok = false; }
      else { nameEl.style.borderBottomColor = ''; }
      if (mob.length < 10) { mobEl.style.borderBottomColor = '#8d2d17'; if (ok) mobEl.focus(); ok = false; }
      else { mobEl.style.borderBottomColor = ''; }
      if (!ok) return;
      const message =
        'Hi%2C+I+want+Priority+EOI+Access+for+MAHINDRA+CITADEL+SANCTUM+and+the+launch-phase+pricing.%0A%0A' +
        'Name%3A+' + encodeURIComponent(name) + '%0A' +
        'Mobile%3A+%2B91+' + encodeURIComponent(mob);
      window.open('https://wa.me/918857090799?text=' + message, '_blank');
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = 'Redirecting to WhatsApp…';
        btn.disabled = true;
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 2400);
      }
    });
  }

  /* ---------- Lazy image fallback ---------- */
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imgIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) img.src = img.dataset.src;
            imgIO.unobserve(img);
          }
        });
      });
      lazyImgs.forEach((img) => imgIO.observe(img));
    }
  }

})();

/* ============================================
   Auto-sliding galleries
   ============================================ */
(function () {
  'use strict';
  const galleries = document.querySelectorAll('[data-autoslide="true"]');
  if (!galleries.length) return;
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  galleries.forEach((gallery) => {
    const track = gallery.querySelector('[data-track]');
    if (!track) return;
    let paused = false, resumeTimer = null;
    const INTERVAL = 4500;

    const advance = () => {
      if (paused) return;
      const slide = track.querySelector('.ag-slide');
      if (!slide) return;
      const slideWidth = slide.getBoundingClientRect().width + 16;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft + slideWidth > maxScroll - 4) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: slideWidth, behavior: 'smooth' });
      }
    };

    const pause = (ms = 7000) => {
      paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, ms);
    };

    track.addEventListener('touchstart', () => pause(8000), { passive: true });
    track.addEventListener('mousedown',  () => pause(8000));
    track.addEventListener('wheel',      () => pause(4000), { passive: true });
    gallery.addEventListener('mouseenter', () => { paused = true; });
    gallery.addEventListener('mouseleave', () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, 600);
    });

    let inView = false;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { inView = e.isIntersecting; });
      }, { threshold: 0.3 });
      io.observe(gallery);
    } else { inView = true; }

    setInterval(() => {
      if (inView && !paused && document.visibilityState === 'visible') advance();
    }, INTERVAL);
  });
})();

/* ============================================
   Lazy image fade-in
   ============================================ */
(function () {
  'use strict';
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if (!imgs.length) return;
  const mark = (img) => img.classList.add('img-loaded');
  imgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) mark(img);
    else {
      img.addEventListener('load',  () => mark(img), { once: true });
      img.addEventListener('error', () => mark(img), { once: true });
    }
  });
})();

/* ============================================
   Synced gallery captions
   ============================================ */
(function () {
  'use strict';
  const galleries = document.querySelectorAll('.auto-gallery');
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const track = gallery.querySelector('[data-track]');
    const rail  = gallery.querySelector('[data-caption-rail]');
    if (!track || !rail) return;

    const slides   = Array.from(track.querySelectorAll('.ag-slide'));
    const captions = slides.map((s) => s.getAttribute('data-caption') || '');
    if (!captions.some(Boolean)) return;

    captions.forEach((text, idx) => {
      const el = document.createElement('span');
      el.className = 'ag-caption';
      el.textContent = text;
      if (idx === 0) el.classList.add('is-active');
      rail.appendChild(el);
    });
    const captionEls = rail.querySelectorAll('.ag-caption');

    let activeIdx = 0, frame = 0;
    const setActive = (idx) => {
      if (idx === activeIdx) return;
      captionEls[activeIdx]?.classList.remove('is-active');
      captionEls[idx]?.classList.add('is-active');
      activeIdx = idx;
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect   = track.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        let best = 0, bestDist = Infinity;
        slides.forEach((slide, i) => {
          const r = slide.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - center);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        setActive(best);
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  });
})();

/* ============================================
   Privacy Modal
   ============================================ */
(function () {
  'use strict';
  const pm = document.getElementById('privacyModal');
  if (!pm) return;
  const openLinks = document.querySelectorAll('[data-open-privacy]');
  const closeBtn  = pm.querySelector('[data-close-privacy]');
  const open  = () => { pm.classList.add('open'); pm.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; };
  const close = () => { pm.classList.remove('open'); pm.setAttribute('aria-hidden','true');  document.body.style.overflow = ''; };
  openLinks.forEach((l) => l.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  if (closeBtn) closeBtn.addEventListener('click', close);
  pm.addEventListener('click', (e) => { if (e.target === pm) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
