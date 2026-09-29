/* =========================================================
   PORTFÓLIO — THEODOR FAGUNDES
   1) Universo de partículas (Canvas puro, otimizado)
   2) Animações de scroll (Intersection Observer — Fade + Slide-up)
   3) Scroll-spy simples do menu (marca o link ativo)
   ========================================================= */

/* ---------- 1) UNIVERSO DE PARTÍCULAS ---------- */
(function particles(){
  const canvas = document.getElementById('universe');
  const ctx = canvas.getContext('2d');
  let W, H, DPR;

  function resize(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // densidade calculada pela área da viewport, mantém leve em qualquer tela
  const STAR_COUNT = Math.floor((window.innerWidth * window.innerHeight) / 9000);

  const stars = [];
  for(let i=0;i<STAR_COUNT;i++){
    stars.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.3 + 0.3,
      baseAlpha: Math.random()*0.5 + 0.25,
      twSpeed: Math.random()*0.02 + 0.005,
      twPhase: Math.random()*Math.PI*2,
      vx: (Math.random()-0.5)*0.03,
      vy: (Math.random()-0.5)*0.03
    });
  }

  // trilha de cometa que segue o cursor e some gradualmente
  const trail = [];
  const MAX_TRAIL = 60;

  const mouse = { x: W/2, y: H/2, active:false };

  window.addEventListener('mousemove', (e)=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    trail.push({ x:e.clientX, y:e.clientY, life:1 });
    if(trail.length > MAX_TRAIL) trail.shift();
  });

  window.addEventListener('mouseleave', ()=>{ mouse.active = false; });

  let t = 0;
  let rafId;

  function draw(){
    t += 1;
    ctx.clearRect(0,0,W,H);

    // estrelas de fundo
    for(const s of stars){
      s.x += s.vx;
      s.y += s.vy;
      if(s.x < 0) s.x = W; if(s.x > W) s.x = 0;
      if(s.y < 0) s.y = H; if(s.y > H) s.y = 0;

      const tw = reduceMotion ? 0 : Math.sin(t*s.twSpeed + s.twPhase)*0.25;
      const alpha = Math.max(0, s.baseAlpha + tw);

      // leve atração em direção ao cursor para estrelas próximas
      if(mouse.active){
        const dx = mouse.x - s.x;
        const dy = mouse.y - s.y;
        const dist2 = dx*dx + dy*dy;
        if(dist2 < 26000){
          s.x += dx * 0.0009;
          s.y += dy * 0.0009;
        }
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(245,245,242,${alpha})`;
      ctx.fill();
    }

    // constelações: linhas finas entre estrelas próximas ao cursor
    if(mouse.active){
      const near = [];
      for(const s of stars){
        const dx = mouse.x - s.x;
        const dy = mouse.y - s.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if(d < 170) near.push({s, d});
      }
      near.sort((a,b)=>a.d-b.d);
      const chosen = near.slice(0, 7);
      for(const {s,d} of chosen){
        const alpha = (1 - d/170) * 0.35;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(s.x, s.y);
        const grad = ctx.createLinearGradient(mouse.x, mouse.y, s.x, s.y);
        grad.addColorStop(0, `rgba(124,108,246,${alpha})`);
        grad.addColorStop(1, `rgba(51,214,192,${alpha*0.4})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // trilha do cursor que some gradualmente
    for(let i = trail.length - 1; i >= 0; i--){
      const p = trail[i];
      p.life -= 0.028;
      if(p.life <= 0){ trail.splice(i,1); continue; }
      const size = p.life * 2.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI*2);
      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,size*4);
      grad.addColorStop(0, `rgba(124,108,246,${p.life*0.5})`);
      grad.addColorStop(1, `rgba(124,108,246,0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  }

  draw();

  // pausa a animação quando a aba não está visível, economizando CPU/bateria
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(draw);
    }
  });
})();

/* ---------- 2) ANIMAÇÕES DE SCROLL (Fade-in + Slide-up) ---------- */
(function scrollReveal(){
  const items = document.querySelectorAll('.reveal');

  // pequeno atraso escalonado para elementos dentro da mesma seção (cards, timeline)
  const groups = ['.cards-materias', '.cards-projetos', '.timeline'];
  groups.forEach(sel=>{
    const group = document.querySelector(sel);
    if(!group) return;
    const children = group.querySelectorAll(':scope > .reveal, :scope .card.reveal, :scope .container.reveal');
    children.forEach((el, i)=>{
      el.style.setProperty('--delay', `${i * 0.12}s`);
    });
  });

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // anima uma única vez
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  items.forEach(el => observer.observe(el));
})();

/* ---------- 3) SCROLL-SPY DO MENU ---------- */
(function scrollSpy(){
  const sections = ['home','materias','codigos','projetos'].map(id => document.getElementById(id));
  const links = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        links.forEach(link=>{
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => { if(sec) spyObserver.observe(sec); });
})();

/* ---------- 4) MODAIS (Matérias e "Meu papel" dos Projetos) ----------
   Qualquer elemento com [data-modal="algum-id"] abre o modal com esse
   mesmo id. Fecha ao clicar no X, no fundo escuro ou ao pressionar Esc.
   Guarda o último elemento focado para devolver o foco a ele ao fechar
   (bom para quem navega pelo teclado). */
(function modals(){
  const openers = document.querySelectorAll('[data-modal]');
  const modalsList = document.querySelectorAll('.modal');
  if(!openers.length || !modalsList.length) return;

  let lastFocused = null;

  function openModal(modal){
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    const closeBtn = modal.querySelector('.modal-close');
    if(closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal(modal){
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onKeydown);
    if(lastFocused && typeof lastFocused.focus === 'function'){
      lastFocused.focus();
    }
  }

  function onKeydown(e){
    if(e.key === 'Escape'){
      const open = document.querySelector('.modal.is-open');
      if(open) closeModal(open);
    }
  }

  openers.forEach(opener=>{
    opener.addEventListener('click', ()=>{
      const id = opener.getAttribute('data-modal');
      const modal = document.getElementById(id);
      if(modal) openModal(modal);
    });
  });

  modalsList.forEach(modal=>{
    modal.querySelectorAll('[data-close]').forEach(el=>{
      el.addEventListener('click', ()=> closeModal(modal));
    });
  });
})();

/* ---------- 5) ABA "CÓDIGOS" (vídeo incorporado + bloco de código) ----------
   - Vídeo: aceita link do YouTube ou Vimeo e monta o embed automaticamente.
   - Código: textarea com auto-salvamento no navegador (localStorage), então
     o conteúdo continua lá mesmo se a página for recarregada ou fechada. */
(function abaCodigos(){
  const videoInput   = document.getElementById('videoLinkInput');
  const loadVideoBtn = document.getElementById('loadVideoBtn');
  const clearVideoBtn = document.getElementById('clearVideoBtn');
  const videoFrame   = document.getElementById('videoFrame');
  const codeArea     = document.getElementById('codeArea');
  const copyCodeBtn  = document.getElementById('copyCodeBtn');
  const clearCodeBtn = document.getElementById('clearCodeBtn');

  if(!videoFrame && !codeArea) return; // seção não existe nesta página

  const LS_VIDEO = 'portfolio_video_link';
  const LS_CODE  = 'portfolio_code_content';

  /* --- converte um link comum em URL de embed --- */
  function toEmbedUrl(rawUrl){
    try{
      const url = new URL(rawUrl.trim());
      const host = url.hostname.replace('www.', '');

      // YouTube: youtube.com/watch?v=ID  |  youtu.be/ID  |  youtube.com/shorts/ID
      if(host.includes('youtube.com') || host === 'youtu.be'){
        let videoId = '';
        if(host === 'youtu.be'){
          videoId = url.pathname.slice(1);
        } else if(url.pathname.startsWith('/shorts/')){
          videoId = url.pathname.split('/shorts/')[1];
        } else {
          videoId = url.searchParams.get('v');
        }
        if(videoId) return `https://www.youtube.com/embed/${videoId}`;
      }

      // Vimeo: vimeo.com/ID
      if(host.includes('vimeo.com')){
        const parts = url.pathname.split('/').filter(Boolean);
        const videoId = parts[parts.length - 1];
        if(videoId) return `https://player.vimeo.com/video/${videoId}`;
      }

      return null; // formato não reconhecido
    } catch(e){
      return null; // link inválido
    }
  }

  function renderVideo(rawUrl){
    const embedUrl = toEmbedUrl(rawUrl);
    if(embedUrl){
      videoFrame.innerHTML = `<iframe src="${embedUrl}" title="Vídeo incorporado" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      // link não reconhecido (ex: Drive, outro site) — mostra como link clicável
      videoFrame.innerHTML = `<p class="video-placeholder">Não foi possível incorporar automaticamente. <a href="${rawUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--cyan)">Abrir link em nova aba</a></p>`;
    }
  }

  if(loadVideoBtn){
    loadVideoBtn.addEventListener('click', ()=>{
      const val = videoInput.value.trim();
      if(!val) return;
      renderVideo(val);
      localStorage.setItem(LS_VIDEO, val);
    });

    videoInput.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter') loadVideoBtn.click();
    });

    // restaura o último vídeo carregado, se houver
    const savedVideo = localStorage.getItem(LS_VIDEO);
    if(savedVideo){
      videoInput.value = savedVideo;
      renderVideo(savedVideo);
    }
  }

  if(clearVideoBtn){
    clearVideoBtn.addEventListener('click', ()=>{
      videoInput.value = '';
      localStorage.removeItem(LS_VIDEO);
      videoFrame.innerHTML = '<p class="video-placeholder"><i class="fa-solid fa-video"></i> Nenhum vídeo carregado</p>';
    });
  }

  if(codeArea){
    // restaura o código salvo
    const savedCode = localStorage.getItem(LS_CODE);
    if(savedCode) codeArea.value = savedCode;

    // salva automaticamente enquanto o usuário digita
    codeArea.addEventListener('input', ()=>{
      localStorage.setItem(LS_CODE, codeArea.value);
    });
  }

  if(copyCodeBtn){
    copyCodeBtn.addEventListener('click', async ()=>{
      try{
        await navigator.clipboard.writeText(codeArea.value);
        const original = copyCodeBtn.innerHTML;
        copyCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        setTimeout(()=>{ copyCodeBtn.innerHTML = original; }, 1500);
      } catch(e){
        codeArea.select();
        document.execCommand('copy');
      }
    });
  }

  if(clearCodeBtn){
    clearCodeBtn.addEventListener('click', ()=>{
      codeArea.value = '';
      localStorage.removeItem(LS_CODE);
      codeArea.focus();
    });
  }
})();

/* ---------- 6) FILTRO DE BIMESTRE (Matérias) ----------
   Os botões 1º–4º escolhem o bimestre ativo. Isso:
   - atualiza o texto dos cards ("Ver 2º bimestre") e o cabeçalho dos modais;
   - mostra nos modais apenas o painel [data-bimestre] correspondente.
   A escolha fica salva no navegador (localStorage). */
(function filtroBimestre(){
  const buttons = document.querySelectorAll('.bimestre-btn');
  if(!buttons.length) return;

  const panels = document.querySelectorAll('.bimestre-panel');
  const labels = document.querySelectorAll('.js-bim-label');
  const cardsWrap = document.querySelector('.cards-materias');
  const LS_BIM = 'portfolio_bimestre_ativo';

  function apply(bim, animate){
    buttons.forEach(btn=>{
      const active = btn.dataset.bimestre === bim;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    panels.forEach(panel=>{
      panel.hidden = panel.dataset.bimestre !== bim;
    });

    labels.forEach(el=>{ el.textContent = bim + 'º'; });

    if(animate && cardsWrap){
      cardsWrap.classList.remove('is-switching');
      void cardsWrap.offsetWidth; // reinicia a animação
      cardsWrap.classList.add('is-switching');
    }
  }

  buttons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const bim = btn.dataset.bimestre;
      apply(bim, true);
      try{ localStorage.setItem(LS_BIM, bim); }catch(e){}
    });
  });

  let saved = '1';
  try{ saved = localStorage.getItem(LS_BIM) || '1'; }catch(e){}
  if(!['1','2','3','4'].includes(saved)) saved = '1';
  apply(saved, false);
})();
