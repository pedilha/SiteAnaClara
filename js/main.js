/* =============================================================================
   main.js — Ana Clara Tomaz | Psicóloga
   Versão: 3.1 (dois carrosseis + driven by content.json)

   Índice de módulos:
     01. AOS (Animate on Scroll) — inicialização
     02. Navbar — efeito de scroll
     03. Barra de progresso de scroll
     04. Menu mobile — hamburguer
     05. Smooth scroll — âncoras
     06. Pills — toggle de seleção interativo
     07. Carrossel — função genérica criarCarrossel()
     08. Injeção de conteúdo — aplicar* functions
     09. Bootstrap — fetch content.json e acionar tudo
============================================================================= */

'use strict';

/* =============================================================================
   01. AOS — Animate On Scroll
============================================================================= */
AOS.init({
  duration: 450,
  easing:   'ease-out-cubic',
  once:     true,
  offset:   60,
  mirror:   false,
});


/* =============================================================================
   02. NAVBAR — adiciona/remove classe "scrolled" ao rolar
============================================================================= */
const navbar = document.getElementById('navbar');
const navCta = document.getElementById('navCta');

function handleNavbarScroll() {
  const passou60px = window.scrollY > 60;
  navbar.classList.toggle('scrolled', passou60px);
  if (navCta) navCta.style.display = passou60px ? 'inline-flex' : 'none';
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });


/* =============================================================================
   03. BARRA DE PROGRESSO DE SCROLL
============================================================================= */
const progressBar = document.getElementById('progressBar');

function handleProgressBar() {
  const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
  const fração = alturaTotal > 0 ? window.scrollY / alturaTotal : 0;
  progressBar.style.transform = 'scaleX(' + fração + ')';
}

window.addEventListener('scroll', handleProgressBar, { passive: true });


/* =============================================================================
   04. MENU MOBILE — hamburguer
============================================================================= */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function abrirMenu() {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function fecharMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? fecharMenu() : abrirMenu();
});

mobileLinks.forEach(link => link.addEventListener('click', fecharMenu));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    fecharMenu();
    hamburger.focus();
  }
});


/* =============================================================================
   05. SMOOTH SCROLL — âncoras internas
============================================================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const alvo = document.querySelector(this.getAttribute('href'));
    if (alvo) {
      e.preventDefault();
      alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* =============================================================================
   06. PILLS — toggle de seleção interativo
============================================================================= */
document.querySelectorAll('.pill').forEach(pill => {
  pill.setAttribute('role', 'button');
  pill.setAttribute('tabindex', '0');

  function toggle() {
    pill.dataset.selected = pill.dataset.selected === 'true' ? 'false' : 'true';
  }

  pill.addEventListener('click', toggle);
  pill.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});


/* =============================================================================
   07. CARROSSEL — função genérica
   Recebe referências dos elementos e inicializa toda a lógica de um carrossel.
   Reutilizada para Trajetória (#carouselTrack) e Certificados (#certTrack).
============================================================================= */
function criarCarrossel({ track, dotsEl, btnPrev, btnNext }) {
  if (!track) return;

  const slides       = Array.from(track.querySelectorAll('.carousel-slide'));
  const total        = slides.length;
  let current        = 0;
  const INTERVALO_MS = 4000;
  const PAUSA_MS     = 8000;
  let autoplayTimer  = null;

  if (total === 0) return;

  // Limpa dots antigos (seguro para chamadas repetidas)
  dotsEl.innerHTML = '';

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Ir para foto ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    dotsEl.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => goTo(current + 1), INTERVALO_MS);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setTimeout(() => { clearInterval(autoplayTimer); startAutoplay(); }, PAUSA_MS);
  }

  const carouselEl = track.closest('.carousel');
  if (carouselEl) {
    carouselEl.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carouselEl.addEventListener('mouseleave', () => { clearInterval(autoplayTimer); startAutoplay(); });
  }

  if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetAutoplay(); }
  });

  startAutoplay();
}

/** Inicializa o carrossel de Trajetória */
function iniciarCarrossel() {
  criarCarrossel({
    track:  document.getElementById('carouselTrack'),
    dotsEl: document.getElementById('carouselDots'),
    btnPrev: document.getElementById('carouselPrev'),
    btnNext: document.getElementById('carouselNext'),
  });
}

/** Inicializa o carrossel de Certificados */
function iniciarCertCarrossel() {
  criarCarrossel({
    track:  document.getElementById('certTrack'),
    dotsEl: document.getElementById('certDots'),
    btnPrev: document.getElementById('certPrev'),
    btnNext: document.getElementById('certNext'),
  });
}


/* =============================================================================
   08. INJEÇÃO DE CONTEÚDO
   Cada função recebe o trecho correspondente do content.json e atualiza o DOM.
============================================================================= */

function aplicarHero(hero) {
  const qs = sel => document.querySelector(sel);

  const nome = qs('.hero-name');
  if (nome) nome.innerHTML = hero.nome;

  const tag = qs('#hero .tag');
  if (tag) tag.innerHTML = hero.tag;

  const sub = qs('.hero-sub');
  if (sub) sub.innerHTML = hero.subtitulo;

  const destaque = qs('.hero-destaque');
  if (destaque) destaque.innerHTML = hero.destaque;

  const foto = qs('#heroBgPhoto');
  if (foto && hero.foto) {
    foto.src = hero.foto;
    foto.alt = 'Foto de ' + hero.nome;
  }
}

function aplicarSobre(sobre) {
  const qs = sel => document.querySelector(sel);

  const tag = qs('#sobre .tag');
  if (tag) tag.innerHTML = sobre.tag;

  const titulo = qs('#sobre-title');
  if (titulo) titulo.innerHTML = sobre.titulo;

  const wrapper = qs('.sobre-paragrafos');
  if (wrapper && Array.isArray(sobre.paragrafos)) {
    wrapper.innerHTML = sobre.paragrafos.map(p => `<p>${p}</p>`).join('');
  }

  const cardsEl = qs('.formacao-cards');
  if (cardsEl && Array.isArray(sobre.formacao)) {
    cardsEl.innerHTML = sobre.formacao.map(item => `
      <div class="formacao-item">
        <div class="formacao-icon" aria-hidden="true">${item.icone}</div>
        <div>
          <strong>${item.titulo}</strong>
          <span>${item.descricao}</span>
        </div>
      </div>
    `).join('');
  }
}

/** Injeta slides da Trajetória e inicializa seu carrossel */
function aplicarCarrossel(slides) {
  const track = document.getElementById('carouselTrack');
  if (!track || !Array.isArray(slides) || slides.length === 0) {
    iniciarCarrossel();
    return;
  }

  track.innerHTML = slides.map(slide => `
    <figure class="carousel-slide">
      <div class="carousel-img-wrap">
        <img src="${slide.foto}" alt="${slide.legenda}" loading="lazy" width="800" height="450" />
      </div>
      <figcaption>${slide.legenda}</figcaption>
    </figure>
  `).join('');

  iniciarCarrossel();
}

/** Injeta fotos de Certificados e inicializa seu carrossel (oculta a seção se vazia) */
function aplicarCertificados(certs) {
  const secao = document.getElementById('certificados');
  const track = document.getElementById('certTrack');

  if (!Array.isArray(certs) || certs.length === 0) {
    if (secao) secao.style.display = 'none';
    return;
  }

  if (secao) secao.style.display = '';

  if (track) {
    track.innerHTML = certs.map(cert => `
      <figure class="carousel-slide">
        <div class="carousel-img-wrap">
          <img src="${cert.foto}" alt="${cert.legenda}" loading="lazy" width="800" height="450" />
        </div>
        <figcaption>${cert.legenda}</figcaption>
      </figure>
    `).join('');
  }

  iniciarCertCarrossel();
}

function aplicarFaq(faqItems) {
  const lista = document.getElementById('faq-lista');
  if (!lista || !Array.isArray(faqItems)) return;

  lista.innerHTML = faqItems.map((item, i) => `
    <details class="faq-item" data-aos="fade-up" data-aos-delay="${i * 80}">
      <summary class="faq-question">${item.pergunta}</summary>
      <div class="faq-answer-wrap">
        <p class="faq-answer">${item.resposta}</p>
      </div>
    </details>
  `).join('');

  lista.querySelectorAll('.faq-item').forEach(details => {
    const summary = details.querySelector('.faq-question');
    const wrap    = details.querySelector('.faq-answer-wrap');

    summary.addEventListener('click', e => {
      e.preventDefault();

      if (details.open) {
        wrap.classList.remove('open');
        wrap.addEventListener('transitionend', () => {
          details.removeAttribute('open');
        }, { once: true });
      } else {
        details.setAttribute('open', '');
        requestAnimationFrame(() => wrap.classList.add('open'));
      }
    });
  });
}


/* =============================================================================
   09. BOOTSTRAP — carrega content.json e aciona tudo
============================================================================= */
fetch('content.json?v=' + Date.now())
  .then(r => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(data => {
    if (data.hero)  aplicarHero(data.hero);
    if (data.sobre) aplicarSobre(data.sobre);
    aplicarCarrossel(data.carrossel    || []);
    aplicarCertificados(data.certificados || []);
    if (data.faq)   aplicarFaq(data.faq);
    AOS.refresh();
  })
  .catch(err => {
    console.warn('[content.json] Falha ao carregar:', err);
    iniciarCarrossel();
  });
