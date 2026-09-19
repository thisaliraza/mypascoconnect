// MyPascoConnect Guide — main.js v2.0

(function(){
  'use strict';

  /* ── Mobile hamburger ── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if(hamburger && navLinks){
    hamburger.addEventListener('click',()=>{
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      hamburger.innerHTML = open ? '&times;' : '&#9776;';
    });
    navLinks.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click',()=>{
        navLinks.classList.remove('open');
        hamburger.innerHTML='&#9776;';
      });
    });
    document.addEventListener('click',e=>{
      if(!e.target.closest('.nav-inner')){
        navLinks.classList.remove('open');
        hamburger.innerHTML='&#9776;';
      }
    });
  }

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });

  /* ── IntersectionObserver card animations ── */
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.style.opacity='1';
        en.target.style.transform='translateY(0)';
        io.unobserve(en.target);
      }
    });
  },{threshold:.1,rootMargin:'0px 0px -40px 0px'});

  document.querySelectorAll('.card,.feature-card,.role-card,.step,.explore-card,.il-card').forEach(el=>{
    el.style.opacity='0';
    el.style.transform='translateY(20px)';
    el.style.transition='opacity .45s ease, transform .45s ease';
    io.observe(el);
  });

  /* ── Active nav highlight on scroll ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll',()=>{
    let current='';
    sections.forEach(s=>{ if(window.scrollY>=s.offsetTop-120) current=s.id; });
    navAnchors.forEach(a=>{
      a.classList.toggle('active', a.getAttribute('href')==='#'+current);
    });
  },{passive:true});

  /* ── Back to top button ── */
  const btt = document.querySelector('.back-to-top');
  if(btt){
    window.addEventListener('scroll',()=>{
      btt.classList.toggle('visible', window.scrollY>400);
    },{passive:true});
    btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  /* ── FAQ keyboard support ── */
  document.querySelectorAll('.acc-item summary').forEach(s=>{
    s.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        s.parentElement.toggleAttribute('open');
      }
    });
  });

  /* ── Current page nav active state ── */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href').split('/').pop();
    if(href === path || (path==='' && href==='index.html')){
      a.classList.add('active');
    }
  });

})();
