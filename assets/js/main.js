// MyPascoConnect Guide â€” main.js v2.0

(function(){
  'use strict';

  /* â”€â”€ Mobile hamburger â”€â”€ */
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

  /* â”€â”€ Smooth scroll â”€â”€ */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });

  /* â”€â”€ IntersectionObserver card animations â”€â”€ */
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

  /* â”€â”€ Active nav highlight on scroll â”€â”€ */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll',()=>{
    let current='';
    sections.forEach(s=>{ if(window.scrollY>=s.offsetTop-120) current=s.id; });
    navAnchors.forEach(a=>{
      a.classList.toggle('active', a.getAttribute('href')==='#'+current);
    });
  },{passive:true});

  /* â”€â”€ Back to top button â”€â”€ */
  const btt = document.querySelector('.back-to-top');
  if(btt){
    window.addEventListener('scroll',()=>{
      btt.classList.toggle('visible', window.scrollY>400);
    },{passive:true});
    btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  /* â”€â”€ FAQ keyboard support â”€â”€ */
  document.querySelectorAll('.acc-item summary').forEach(s=>{
    s.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        s.parentElement.toggleAttribute('open');
      }
    });
  });

  /* â”€â”€ Current page nav active state â”€â”€ */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href').split('/').pop();
    if(href === path || (path==='' && href==='index.html')){
      a.classList.add('active');
    }
  });


  /* ── UX Enhancements: Progress Bar, Read Time, TOC, Feedback ── */
  
  // Progress Bar
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  }, {passive: true});

  // Inner page enhancements
  const pageContent = document.querySelector('.page-content');
  if (pageContent) {
    // 1. Read Time Meta
    const text = pageContent.innerText;
    const wordCount = text.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    
    const metaBar = document.createElement('div');
    metaBar.style.cssText = 'color:var(--gray-500); font-size:0.9rem; margin-bottom: 24px; display:flex; gap:16px; align-items:center; border-bottom:1px solid var(--gray-200); padding-bottom:12px;';
    metaBar.innerHTML = `<span>&#9201;&#65039; ${readTime} min read</span><span>&#128197; Updated: 2026</span>`;
    pageContent.insertBefore(metaBar, pageContent.firstChild);

    // 2. Auto Table of Contents
    const h2s = Array.from(pageContent.querySelectorAll('h2')).filter(h2 => !h2.classList.contains('section-title'));
    if (h2s.length >= 3) {
      const toc = document.createElement('div');
      toc.className = 'auto-toc';
      toc.innerHTML = '<strong style="display:block;margin-bottom:12px;color:var(--navy);font-size:1.05rem;">On this page:</strong>';
      const ul = document.createElement('ul');
      ul.style.cssText = 'list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px;';
      
      h2s.forEach((h2, i) => {
        if (!h2.id) h2.id = 'content-sec-' + i;
        const li = document.createElement('li');
        li.innerHTML = `<a href="#${h2.id}" style="color:var(--teal); font-size:0.95rem; text-decoration:none; display:inline-block; transition:transform 0.2s;">&rarr; ${h2.innerText.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '').trim()}</a>`; // Remove emojis for cleaner TOC
        ul.appendChild(li);
        
        // Add smooth hover to TOC links via event listener to avoid inline !important issues
        const a = li.querySelector('a');
        a.addEventListener('mouseenter', () => a.style.transform = 'translateX(4px)');
        a.addEventListener('mouseleave', () => a.style.transform = 'translateX(0)');
      });
      toc.appendChild(ul);
      pageContent.insertBefore(toc, metaBar.nextSibling);
    }

    // 3. Feedback Widget
    const feedback = document.createElement('div');
    feedback.className = 'feedback-widget';
    feedback.innerHTML = `
      <h4>Was this guide helpful?</h4>
      <button class="feedback-btn" data-val="yes">&#128077; Yes</button>
      <button class="feedback-btn" data-val="no">&#128078; No</button>
      <div class="feedback-thanks">Thank you! Your feedback helps us improve our guides.</div>
    `;
    pageContent.appendChild(feedback);

    const btns = feedback.querySelectorAll('.feedback-btn');
    const thanks = feedback.querySelector('.feedback-thanks');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.style.display = 'none');
        feedback.querySelector('h4').style.display = 'none';
        thanks.style.display = 'block';
      });
    });
  }

})();

