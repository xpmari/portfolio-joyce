/**
 * PORTFÓLIO UGC - JOYCE BARCELOS
 * Interações, Animações e Comportamentos Mobile-First
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Atualizar ano corrente no rodapé
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Filtro do Portfólio (Categorias)
  initPortfolioFilters();

  // 3. Accordion do FAQ
  initFaqAccordion();

  // 4. Controle do Botão Flutuante do WhatsApp
  initFloatingCta();

  // 5. Animação suave das barras de faixa etária
  initAgeBarsAnimation();
});

/* ==========================================================================
   PORTFOLIO CATEGORY FILTER
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const videoCards = document.querySelectorAll('.video-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove classe ativa de todos e adiciona no selecionado
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      videoCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Pequena animação de fade-in
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha outros itens abertos para manter a tela limpa no mobile
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          otherAnswer.style.maxHeight = null;
        }
      });

      // Alterna o item clicado
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   FLOATING CTA SCROLL LISTENER
   ========================================================================== */
function initFloatingCta() {
  const floatingCta = document.getElementById('floating-cta');
  const heroCta = document.getElementById('hero-cta');

  if (!floatingCta || !heroCta) return;

  const handleScroll = () => {
    const heroBottom = heroCta.getBoundingClientRect().bottom;

    // Mostra o botão flutuante apenas após passar do botão principal da Hero
    if (heroBottom < 0) {
      floatingCta.style.opacity = '1';
      floatingCta.style.pointerEvents = 'auto';
      floatingCta.style.transform = 'translateY(0)';
    } else {
      floatingCta.style.opacity = '0';
      floatingCta.style.pointerEvents = 'none';
      floatingCta.style.transform = 'translateY(20px)';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Checagem inicial
}

/* ==========================================================================
   VIDEO MODAL FUNCTIONS (Globais para chamar via onclick)
   ========================================================================== */
const videoModal = document.getElementById('videoModal');
const modalVideoPlayer = document.getElementById('modalVideoPlayer');
const videoModalTitle = document.getElementById('videoModalTitle');

function openVideoModal(videoSrc, title) {
  if (!videoModal || !modalVideoPlayer) return;

  if (videoModalTitle && title) {
    videoModalTitle.textContent = title;
  }

  modalVideoPlayer.src = videoSrc;
  videoModal.classList.add('active');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Impede scroll do body

  modalVideoPlayer.play().catch(() => {
    // Caso autoplay com áudio seja bloqueado pelo navegador
    modalVideoPlayer.muted = true;
    modalVideoPlayer.play();
  });
}

function closeVideoModal() {
  if (!videoModal || !modalVideoPlayer) return;

  modalVideoPlayer.pause();
  modalVideoPlayer.removeAttribute('src'); // Limpa buffer
  modalVideoPlayer.load();

  videoModal.classList.remove('active');
  videoModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Restaura scroll
}

// Fechar modais ao pressionar ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (videoModal && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
    if (photoModal && photoModal.classList.contains('active')) {
      closePhotoModal();
    }
  }
});

/* ==========================================================================
   PHOTO MODAL / LIGHTBOX FUNCTIONS (Globais para chamar via onclick)
   ========================================================================== */
const photoModal = document.getElementById('photoModal');
const photoModalImg = document.getElementById('photoModalImg');
const photoModalTitle = document.getElementById('photoModalTitle');
const photoModalTag = document.getElementById('photoModalTag');
const photoModalDesc = document.getElementById('photoModalDesc');
const photoModalCta = document.getElementById('photoModalCta');

function openPhotoModal(imgSrc, title, tag, desc) {
  if (!photoModal || !photoModalImg) return;

  photoModalImg.src = imgSrc;
  if (photoModalTitle) photoModalTitle.textContent = title || 'Visualização da Foto';
  if (photoModalTag) photoModalTag.textContent = tag || 'Fotografia UGC';
  if (photoModalDesc) photoModalDesc.textContent = desc || '';

  if (photoModalCta) {
    const plainTitle = title ? title.replace(/&amp;/g, '&') : 'da galeria';
    const encodedText = encodeURIComponent(`Olá, Joyce! Conheci seu portfólio UGC, adorei a foto/produção "${plainTitle}" e gostaria de conversar sobre uma possível parceria.`);
    photoModalCta.href = `https://wa.me/5519998802981?text=${encodedText}`;
  }

  photoModal.classList.add('active');
  photoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Evita rolagem da página ao fundo
}

function closePhotoModal() {
  if (!photoModal) return;

  photoModal.classList.remove('active');
  photoModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = ''; // Restaura rolagem normal
}

/* ==========================================================================
   AGE DEMOGRAPHICS BARS ANIMATION
   ========================================================================== */
function initAgeBarsAnimation() {
  const ageBars = document.querySelectorAll('.bar-fill');
  if (!ageBars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        ageBars.forEach(bar => {
          const pct = bar.getAttribute('data-percent');
          if (pct) {
            bar.style.width = pct + '%';
          }
        });
        obs.disconnect(); // Dispara apenas uma vez para efeito suave
      }
    });
  }, { threshold: 0.2 });

  const container = document.querySelector('.age-bars-container');
  if (container) {
    observer.observe(container);
  }
}

