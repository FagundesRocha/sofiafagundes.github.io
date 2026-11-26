/* =========================================================
   PORTFÓLIO — THEODOR FAGUNDES  (front-end)
   1) Universo de partículas (Canvas puro, otimizado)
   2) Animações de scroll (Intersection Observer — Fade + Slide-up)
   3) Scroll-spy simples do menu (marca o link ativo)
   4) Modais (pop-ups de matérias e projetos)
   5) Aba "Códigos" (botão copiar)
   6) Filtro de bimestre
   7) CONTEÚDO VINDO DA API (back-end)  ← novo
   8) Inicialização (ordem em que tudo é ligado)  ← novo
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
function iniciarScrollReveal(){
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
}

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
   IMPORTANTE: só roda DEPOIS que os cards/modais foram criados (seção 7),
   por isso virou uma função chamada na seção 8.
   Qualquer elemento com [data-modal="algum-id"] abre o modal com esse
   mesmo id. Fecha ao clicar no X, no fundo escuro ou ao pressionar Esc.
   Guarda o último elemento focado para devolver o foco a ele ao fechar
   (bom para quem navega pelo teclado). */
function iniciarModais(){
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
}

/* ---------- 5) ABA "CÓDIGOS" ----------
   Vídeo e código ficam fixos no HTML (iguais para todos os visitantes).
   Aqui só existe o botão "Copiar". */
(function abaCodigos(){
  const codeArea = document.getElementById('codeArea');
  const copyCodeBtn = document.getElementById('copyCodeBtn');
  if(!codeArea || !copyCodeBtn) return;

  copyCodeBtn.addEventListener('click', async ()=>{
    const original = copyCodeBtn.innerHTML;
    try{
      await navigator.clipboard.writeText(codeArea.innerText);
      copyCodeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
      setTimeout(()=>{ copyCodeBtn.innerHTML = original; }, 1500);
    } catch(e){
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(codeArea);
      sel.removeAllRanges(); sel.addRange(range);
    }
  });
})();

/* ---------- 6) FILTRO DE BIMESTRE (Matérias) ----------
   Os botões 1º–4º escolhem o bimestre ativo. Isso:
   - atualiza o texto dos cards ("Ver 2º bimestre") e o cabeçalho dos modais;
   - mostra nos modais apenas o painel [data-bimestre] correspondente.
   A escolha fica salva no navegador (localStorage). */
function iniciarFiltroBimestre(){
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
}


/* ---------- 7) CONTEÚDO VINDO DA API (BACK-END) ----------
   Antes, os cards e textos eram escritos direto no HTML. Agora o navegador
   pede os dados ao servidor (fetch) e o script monta os cards e pop-ups.

   Fluxo:  navegador ──fetch──▶ GET /api/materias ──▶ servidor ──▶ banco SQL (SQLite)

   Para EDITAR o conteúdo, não mexa aqui: altere os arquivos da pasta /data e rode npm run seed
   (materias.json, projetos.json, reflexoes.json). Veja o README.md.

   Segurança: usamos textContent (e não innerHTML), então nenhum texto vindo
   da API consegue injetar HTML/JS na página. */

// Endereço da API: lido da <meta name="api-base"> do index.html
const metaApi = document.querySelector('meta[name="api-base"]');
const API = ((metaApi && metaApi.content) || '').replace(/\/+$/, '') + '/api';

// Faz um GET na API e devolve o JSON (lança erro se o servidor responder erro)
async function buscarNaApi(caminho){
  const resposta = await fetch(API + caminho);
  if(!resposta.ok) throw new Error('A API respondeu ' + resposta.status + ' em ' + caminho);
  return resposta.json();
}

/* --- pequenos ajudantes para criar elementos HTML --- */

// criarEl('p', 'classe-css', 'texto')  →  <p class="classe-css">texto</p>
function criarEl(tag, classe, texto){
  const el = document.createElement(tag);
  if(classe) el.className = classe;
  if(texto !== undefined && texto !== null) el.textContent = texto;
  return el;
}

// criarIcone('fa-solid fa-leaf')  →  <i class="fa-solid fa-leaf"></i>
function criarIcone(classes){
  const i = document.createElement('i');
  i.className = classes;
  return i;
}

/* --- estrutura base de um modal (pop-up) --- */
function criarModal({ id, icone, eyebrow, titulo, subtitulo, corpo }){
  const modal = criarEl('div', 'modal');
  modal.id = id;

  const overlay = criarEl('div', 'modal-overlay');
  overlay.setAttribute('data-close', '');

  const caixa = criarEl('div', 'modal-box');
  caixa.setAttribute('role', 'dialog');
  caixa.setAttribute('aria-modal', 'true');
  caixa.setAttribute('aria-labelledby', id + '-title');

  const fechar = criarEl('button', 'modal-close');
  fechar.type = 'button';
  fechar.setAttribute('data-close', '');
  fechar.setAttribute('aria-label', 'Fechar');
  fechar.appendChild(criarIcone('fa-solid fa-xmark'));

  const iconeBox = criarEl('div', 'modal-icon');
  iconeBox.appendChild(criarIcone(icone));

  const eyebrowEl = criarEl('p', 'modal-eyebrow');
  eyebrowEl.append(...eyebrow);

  const tituloEl = criarEl('h2', null, titulo);
  tituloEl.id = id + '-title';

  const subEl = criarEl('p', 'modal-sub');
  subEl.append(...subtitulo);

  const textos = criarEl('div');
  textos.append(eyebrowEl, tituloEl, subEl);

  const cabecalho = criarEl('div', 'modal-header');
  cabecalho.append(iconeBox, textos);

  const corpoEl = criarEl('div', 'modal-body');
  corpoEl.append(...corpo);

  caixa.append(fechar, cabecalho, corpoEl);
  modal.append(overlay, caixa);
  return modal;
}

/* --- MATÉRIAS --- */

function criarCardMateria(m){
  const card = criarEl('button', 'card ' + m.classe + ' reveal');
  card.type = 'button';
  card.setAttribute('data-modal', 'modal-materia-' + m.id);
  card.setAttribute('aria-haspopup', 'dialog');

  const icone = criarEl('div', 'icone');
  icone.appendChild(criarIcone(m.icone));

  const professores = criarEl('p');
  professores.append(criarIcone('fa-regular fa-user'), ' ' + m.professores);

  // o número do bimestre (js-bim-label) é atualizado pelo filtro (seção 6)
  const dica = criarEl('span', 'card-hint');
  dica.append('Ver ', criarEl('span', 'js-bim-label', '1º'), ' bimestre ', criarIcone('fa-solid fa-arrow-right'));

  card.append(icone, criarEl('h2', null, m.nome), document.createElement('hr'), professores, dica);
  return card;
}

// Um painel por bimestre; o filtro (seção 6) mostra só o escolhido
function criarPainelBimestre(bim, secoes){
  const painel = criarEl('div', 'bimestre-panel');
  painel.setAttribute('data-bimestre', bim);
  painel.hidden = true;

  if(!secoes || !secoes.length){
    painel.appendChild(criarEl('p', 'modal-answer', 'Ainda não há conteúdo para este bimestre.'));
    return painel;
  }

  secoes.forEach(sec => {
    const secao = criarEl('section', 'modal-section');
    const titulo = criarEl('h3');
    titulo.append(criarEl('span', 'tag', bim + 'º Bimestre'), sec.titulo);
    secao.appendChild(titulo);

    // Com uma única pergunta ela fica direto na seção; com várias, cada uma ganha seu bloco ".qa"
    const unica = sec.perguntas.length === 1;
    sec.perguntas.forEach(qa => {
      const bloco = unica ? secao : secao.appendChild(criarEl('div', 'qa'));
      bloco.append(criarEl('p', 'modal-question', qa.pergunta), criarEl('p', 'modal-answer', qa.resposta));
    });

    painel.appendChild(secao);
  });
  return painel;
}

function criarModalMateria(m){
  const paineis = ['1', '2', '3', '4'].map(bim => criarPainelBimestre(bim, (m.bimestres || {})[bim]));
  return criarModal({
    id: 'modal-materia-' + m.id,
    icone: m.icone,
    eyebrow: ['Matéria · ', criarEl('span', 'js-bim-label', '1º'), ' bimestre'],
    titulo: m.nome,
    subtitulo: [criarIcone('fa-regular fa-user'), ' ' + m.professores],
    corpo: paineis
  });
}

function renderizarMaterias(materias, alvo){
  alvo.replaceChildren(...materias.map(criarCardMateria));
  document.getElementById('modais').append(...materias.map(criarModalMateria));
}

/* --- PROJETOS --- */

function criarCardProjeto(p){
  const card = criarEl('div', 'card ' + p.classe + ' reveal');

  const icone = criarEl('div', 'icone');
  icone.appendChild(criarIcone(p.icone));

  const botao = criarEl('button', 'botao', 'Meu papel');
  botao.type = 'button';
  botao.setAttribute('data-modal', 'modal-projeto-' + p.id);
  botao.setAttribute('aria-haspopup', 'dialog');

  card.append(icone, criarEl('h2', null, p.nome), document.createElement('hr'), criarEl('p', null, p.descricao), botao);
  return card;
}

function criarModalProjeto(p){
  // Seção "Minha Atuação"
  const atuacao = criarEl('section', 'modal-section');
  atuacao.append(
    criarEl('h3', null, 'Minha Atuação'),
    criarEl('p', 'modal-question', p.pergunta || 'Descreva atividades práticas, trabalhos e pesquisas realizadas.'),
    criarEl('p', 'modal-answer', p.atuacao)
  );

  // Seção "Evidências Visuais": imagem real (se houver) ou quadro vazio
  const grade = criarEl('div', 'evidence-grid');
  (p.evidencias || []).forEach(ev => {
    const figura = criarEl('figure', 'evidence-item');
    if(ev.imagem){
      const img = document.createElement('img');
      img.src = ev.imagem;
      img.alt = ev.legenda;
      img.loading = 'lazy';
      figura.appendChild(img);
    } else {
      const vazio = criarEl('div', 'evidence-placeholder');
      vazio.appendChild(criarIcone('fa-regular fa-image'));
      figura.appendChild(vazio);
    }
    figura.appendChild(criarEl('figcaption', null, ev.legenda));
    grade.appendChild(figura);
  });

  const evidencias = criarEl('section', 'modal-section');
  evidencias.append(
    criarEl('h3', null, 'Evidências Visuais'),
    criarEl('p', 'modal-question', 'Insira materiais e imagens produzidos, com uma breve descrição de cada um.'),
    grade
  );

  return criarModal({
    id: 'modal-projeto-' + p.id,
    icone: p.icone,
    eyebrow: ['Projeto'],
    titulo: p.nome,
    subtitulo: ['Meu papel no projeto'],
    corpo: [atuacao, evidencias]
  });
}

function renderizarProjetos(projetos, alvo){
  alvo.replaceChildren(...projetos.map(criarCardProjeto));
  document.getElementById('modais').append(...projetos.map(criarModalProjeto));
}

/* --- REFLEXÕES (linha do tempo) --- */

function renderizarReflexoes(reflexoes, alvo){
  alvo.replaceChildren(...reflexoes.map((r, i) => {
    // alterna esquerda/direita na linha do tempo
    const container = criarEl('div', 'container ' + (i % 2 === 0 ? 'left' : 'right') + ' reveal');
    const conteudo = criarEl('div', 'content');
    const lista = criarEl('ul');

    r.itens.forEach(item => {
      const li = criarEl('li');
      if(item.rotulo){
        li.appendChild(criarEl('b', null, item.rotulo + ':'));
        li.append(' ');
      }
      li.append(item.texto);
      lista.appendChild(li);
    });

    conteudo.append(criarEl('h2', null, r.titulo), lista);
    container.appendChild(conteudo);
    return container;
  }));
}

/* --- junta tudo: busca os 3 recursos ao mesmo tempo --- */

// Mostra o resultado de UMA requisição na sua área da página.
// Se falhar (servidor desligado, por exemplo), mostra um aviso só naquela área.
function mostrarResultado(resultado, idDaLista, rotulo, renderizar){
  const alvo = document.getElementById(idDaLista);
  if(!alvo) return;

  if(resultado.status === 'rejected'){
    console.error(resultado.reason);
    alvo.replaceChildren(criarEl('p', 'estado-api erro',
      'Não foi possível carregar ' + rotulo + '. Verifique se o servidor está no ar e recarregue a página.'));
    return;
  }

  if(!resultado.value.length){
    alvo.replaceChildren(criarEl('p', 'estado-api', 'Nenhum conteúdo cadastrado ainda.'));
    return;
  }

  try{
    renderizar(resultado.value, alvo);
  } catch(erro){
    console.error(erro);
    alvo.replaceChildren(criarEl('p', 'estado-api erro', 'Erro ao exibir ' + rotulo + '.'));
  }
}

async function carregarConteudo(){
  // allSettled: se uma requisição falhar, as outras continuam funcionando
  const [materias, projetos, reflexoes] = await Promise.allSettled([
    buscarNaApi('/materias'),
    buscarNaApi('/projetos'),
    buscarNaApi('/reflexoes')
  ]);

  mostrarResultado(materias,  'lista-materias',  'as matérias',  renderizarMaterias);
  mostrarResultado(projetos,  'lista-projetos',  'os projetos',  renderizarProjetos);
  mostrarResultado(reflexoes, 'lista-reflexoes', 'as reflexões', renderizarReflexoes);
}

/* ---------- 8) INICIALIZAÇÃO ----------
   A ORDEM IMPORTA: primeiro desenhamos os cards/modais com os dados da API,
   e só depois ligamos as animações, os pop-ups e o filtro (eles precisam
   que os elementos já existam na página). O "finally" garante que o site
   continue funcionando mesmo se a API estiver fora do ar. */
(async function iniciar(){
  try{
    await carregarConteudo();
  } finally {
    iniciarScrollReveal();
    iniciarModais();
    iniciarFiltroBimestre();
  }
})();
