/**
 * PORTFÓLIO UGC - JOYCE BARCEL
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

  // 4. Contador de Métricas com IntersectionObserver
  initMetricsCounter();

  // 5. Controle do Botão Flutuante do WhatsApp
  initFloatingCta();
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
   METRICS COUNTER ANIMATION
   ========================================================================== */
function initMetricsCounter() {
  const metricCards = document.querySelectorAll('.metric-num');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-strip');
  if (metricsSection) {
    observer.observe(metricsSection);
  }

  function animateCounters() {
    metricCards.forEach(counter => {
      const targetStr = counter.getAttribute('data-target');
      if (!targetStr) return;

      const isDecimal = targetStr.includes('.');
      const targetVal = parseFloat(targetStr);
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = ease * targetVal;

        if (isDecimal) {
          counter.textContent = currentVal.toFixed(1) + 'M+';
        } else if (targetVal >= 90 && targetVal <= 100) {
          counter.textContent = Math.round(currentVal) + '%';
        } else {
          counter.textContent = '+' + Math.round(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }
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

// Fechar modal ao pressionar ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
    closeVideoModal();
  }
});

