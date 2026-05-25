(function(){
  'use strict';
  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function(el){ io.observe(el); });
  } else { reveals.forEach(function(el){ el.classList.add('in'); }); }

  // Header shadow
  var header = document.querySelector('.header');
  window.addEventListener('scroll', function(){
    if(header){ header.style.boxShadow = window.scrollY > 24 ? '0 2px 18px -8px rgba(0,0,0,.08)' : 'none'; }
  }, { passive: true });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if(!href || href === '#') return;
      var target = document.querySelector(href);
      if(!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // Pre-register form -> WhatsApp
  var form = document.getElementById('preForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var nameEl = document.getElementById('f_name');
      var mobEl = document.getElementById('f_mob');
      var name = (nameEl.value||'').trim();
      var mob = (mobEl.value||'').trim().replace(/\D/g,'');
      var ok = true;
      if(!name){ nameEl.style.borderBottomColor = '#ff8a80'; nameEl.focus(); ok = false; } else { nameEl.style.borderBottomColor = ''; }
      if(mob.length < 10){ mobEl.style.borderBottomColor = '#ff8a80'; if(ok) mobEl.focus(); ok = false; } else { mobEl.style.borderBottomColor = ''; }
      if(!ok) return;
      var msg = 'Hi%2C+I+want+Priority+Allocation+Access+for+Mahindra+Citadel+Sanctum+and+the+launch-phase+pricing.%0A%0A'
        + 'Name%3A+' + encodeURIComponent(name) + '%0A' + 'Mobile%3A+%2B91+' + encodeURIComponent(mob);
      window.open('https://wa.me/918857090799?text=' + msg, '_blank');
      var btn = form.querySelector('button[type="submit"]');
      if(btn){ var orig = btn.innerHTML; btn.innerHTML = 'Redirecting to WhatsApp...'; btn.disabled = true;
        setTimeout(function(){ btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 2400); }
    });
  }

  // Gallery autoslide
  var galleries = document.querySelectorAll('[data-autoslide="true"]');
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    galleries.forEach(function(gallery){
      var track = gallery.querySelector('[data-track]');
      if(!track) return;
      var paused = false, resumeTimer = null, inView = false;
      var pause = function(d){ paused = true; clearTimeout(resumeTimer); resumeTimer = setTimeout(function(){ paused = false; }, d||7000); };
      track.addEventListener('touchstart', function(){ pause(8000); }, { passive: true });
      track.addEventListener('mousedown', function(){ pause(8000); });
      gallery.addEventListener('mouseenter', function(){ paused = true; });
      gallery.addEventListener('mouseleave', function(){ clearTimeout(resumeTimer); resumeTimer = setTimeout(function(){ paused = false; }, 600); });
      if('IntersectionObserver' in window){
        var io2 = new IntersectionObserver(function(es){ es.forEach(function(e){ inView = e.isIntersecting; }); }, { threshold: 0.3 });
        io2.observe(gallery);
      } else { inView = true; }
      setInterval(function(){
        if(inView && !paused && document.visibilityState === 'visible'){
          var slide = track.querySelector('.ag-slide');
          if(!slide) return;
          var w = slide.getBoundingClientRect().width + 16;
          var max = track.scrollWidth - track.clientWidth;
          if(track.scrollLeft + w > max - 4){ track.scrollTo({ left: 0, behavior: 'smooth' }); }
          else { track.scrollBy({ left: w, behavior: 'smooth' }); }
        }
      }, 4500);
    });
  }

  // Privacy modal
  var modal = document.getElementById('privacyModal');
  var link = document.getElementById('privacyLink');
  var close = document.getElementById('modalClose');
  if(link && modal){
    link.addEventListener('click', function(e){ e.preventDefault(); modal.classList.add('open'); document.body.style.overflow = 'hidden'; });
    var closeModal = function(){ modal.classList.remove('open'); document.body.style.overflow = ''; };
    if(close) close.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){ if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });
  }
})();
