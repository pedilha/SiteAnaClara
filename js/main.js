/* =============================================================================
   main.js — Ana Clara Tomaz | Psicóloga
   Versão: 2.0 (separado do HTML)

   Índice de módulos:
     01. AOS (Animate on Scroll) — inicialização
     02. Navbar — efeito de scroll
     03. Barra de progresso de scroll
     04. Menu mobile — hamburguer
     05. Smooth scroll — âncoras
     06. Pills — toggle de seleção interativo
============================================================================= */

'use strict';

/* =============================================================================
   01. AOS — Animate On Scroll
   Biblioteca externa carregada via CDN no HTML.
   Documentação: https://michalsnik.github.io/aos/
============================================================================= */
AOS.init({
  duration: 750,        // duração da animação em ms
  easing:   'ease-out-cubic',
  once:     true,       // anima apenas uma vez (não repete ao rolar de volta)
  offset:   60,         // distância (px) antes do elemento para iniciar
  mirror:   false,
});


/* =============================================================================
   02. NAVBAR — adiciona/remove classe "scrolled" ao rolar
   Efeito: fundo fosco + sombra aparecem após 60px de scroll.
   O botão "Agendar" no navbar também é exibido/ocultado aqui.
============================================================================= */
const navbar = document.getElementById('navbar');
const navCta = document.getElementById('navCta');

function handleNavbarScroll() {
  const passou60px = window.scrollY > 60;
  navbar.classList.toggle('scrolled', passou60px);

  if (navCta) {
    navCta.style.display = passou60px ? 'inline-flex' : 'none';
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });


/* =============================================================================
   03. BARRA DE PROGRESSO DE SCROLL
   Largura da barra = porcentagem da página que já foi rolada.
============================================================================= */
const progressBar = document.getElementById('progressBar');

function handleProgressBar() {
  const alturaTotal   = document.documentElement.scrollHeight - window.innerHeight;
  const scrollAtual   = window.scrollY;
  const porcentagem   = alturaTotal > 0 ? (scrollAtual / alturaTotal) * 100 : 0;

  progressBar.style.width = porcentagem + '%';
}

window.addEventListener('scroll', handleProgressBar, { passive: true });


/* =============================================================================
   04. MENU MOBILE — hamburguer
   Abre/fecha o overlay de navegação no mobile.
   Bloqueia o scroll do body enquanto o menu está aberto.
============================================================================= */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function abrirMenu() {
  mobileMenu.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // impede scroll do fundo
}

function fecharMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function toggleMenu() {
  const estaAberto = mobileMenu.classList.contains('open');
  estaAberto ? fecharMenu() : abrirMenu();
}

// Clique no hamburguer
hamburger.addEventListener('click', toggleMenu);

// Clique em qualquer link do menu fecha o overlay
mobileLinks.forEach(link => {
  link.addEventListener('click', fecharMenu);
});

// Tecla ESC também fecha o menu (acessibilidade)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    fecharMenu();
    hamburger.focus(); // devolve o foco ao botão (acessibilidade)
  }
});


/* =============================================================================
   05. SMOOTH SCROLL — âncoras internas
   Fallback para navegadores que não suportam scroll-behavior: smooth no CSS.
   Funciona em todos os links do tipo href="#secao".
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
   Ao clicar em uma pill, ela alterna entre selecionada (terracota) e normal.
   Clicar novamente desfaz a seleção.
============================================================================= */
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const estaSelecionada = pill.dataset.selected === 'true';

    if (estaSelecionada) {
      // Desfaz seleção
      pill.style.background = '';
      pill.style.color      = '';
      pill.dataset.selected = 'false';
    } else {
      // Seleciona
      pill.style.background = 'var(--terracota)';
      pill.style.color      = 'white';
      pill.dataset.selected = 'true';
    }
  });
});
