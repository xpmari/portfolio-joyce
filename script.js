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

  // 3. Controle do Botão Flutuante do WhatsApp
  initFloatingCta();

  // 4. Menu de Navegação e Header Sticky
  initNavigation();

  // 5. Controle dos Vídeos nas Molduras de iPhone (#portfolio)
  initPhoneVideos();
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
          // Pausa o vídeo se estiver tocando ao esconder o card
          const video = card.querySelector('.phone-video');
          if (video && !video.paused) {
            video.pause();
          }
        }
      });
    });
  });
}

/* ==========================================================================
   FLOATING CTA SCROLL LISTENER
   ========================================================================== */
function initFloatingCta() {
  const floatingCta = document.getElementById('floating-cta');
  const heroCta = document.getElementById('hero-cta');
  const contatoSection = document.getElementById('contato');

  if (!floatingCta || !heroCta) return;

  let isContatoVisible = false;

  const updateVisibility = () => {
    const heroBottom = heroCta.getBoundingClientRect().bottom;

    // Mostra o botão flutuante apenas após passar da Hero e esconde se #contato estiver visível
    if (heroBottom < 0 && !isContatoVisible) {
      floatingCta.style.opacity = '1';
      floatingCta.style.pointerEvents = 'auto';
      floatingCta.style.transform = 'translateY(0)';
    } else {
      floatingCta.style.opacity = '0';
      floatingCta.style.pointerEvents = 'none';
      floatingCta.style.transform = 'translateY(20px)';
    }
  };

  if (contatoSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isContatoVisible = entry.isIntersecting;
        updateVisibility();
      });
    }, { threshold: 0.05 });
    observer.observe(contatoSection);
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility(); // Checagem inicial
}

/* ==========================================================================
   NAVIGATION & HEADER INTERACTIONS
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  // 1. Mobile Menu Toggle
  if (navToggle && mainNav) {
    const icon = navToggle.querySelector('i');

    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mainNav.classList.contains('open');
      mainNav.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    };

    navToggle.addEventListener('click', () => toggleMenu());

    // Fechar ao clicar em qualquer link do menu
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    // Fechar ao clicar fora do header/nav
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') && !header.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  // 2. Header scrolled state (scrollY > 10)
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Active link spy via IntersectionObserver
  const sections = document.querySelectorAll('#resultados, #portfolio, #galeria, #servicos, #contato');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));

    // Fallback: ao chegar ao final da página, destaca #contato
    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 50)) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === '#contato') {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   PHONE MOCKUP VIDEO CONTROLS (#portfolio)
   ========================================================================== */
function initPhoneVideos() {
  const phoneMocks = document.querySelectorAll('.phone-mock');
  if (!phoneMocks.length) return;

  const allVideos = [];

  phoneMocks.forEach(mock => {
    const video = mock.querySelector('.phone-video');
    const playBtn = mock.querySelector('.phone-play');
    if (!video) return;

    allVideos.push(video);

    // Eventos de estado do vídeo para atualizar classe .playing
    video.addEventListener('play', () => {
      mock.classList.add('playing');
    });

    video.addEventListener('pause', () => {
      mock.classList.remove('playing');
    });

    video.addEventListener('ended', () => {
      mock.classList.remove('playing');
    });

    // Se houver erro de carregamento, esconde o botão de play e preserva o poster
    video.addEventListener('error', () => {
      mock.classList.remove('playing');
      if (playBtn) {
        playBtn.style.display = 'none';
      }
    });

    // Função para alternar reprodução
    const togglePlay = () => {
      if (video.paused) {
        // Pausa todos os outros vídeos da página
        allVideos.forEach(otherVideo => {
          if (otherVideo !== video && !otherVideo.paused) {
            otherVideo.pause();
          }
        });

        // Inicia reprodução com áudio ativado
        video.muted = false;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Se o navegador bloquear unmuted play, faz fallback com muted
            video.muted = true;
            video.play().catch(err => {
              console.warn('Erro ao reproduzir vídeo:', err);
            });
          });
        }
      } else {
        video.pause();
      }
    };

    // Clique no botão central de play
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    // Clique direto no vídeo para pausar / despausar
    video.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  });

  // Pausa automática quando o vídeo sair da tela (< 30% visível)
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('.phone-video');
        if (!video) return;

        if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, {
      threshold: [0, 0.3]
    });

    phoneMocks.forEach(mock => videoObserver.observe(mock));
  }
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

  if (videoSrc) {
    modalVideoPlayer.src = videoSrc;
    modalVideoPlayer.style.display = 'block';
    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Impede scroll do body

    modalVideoPlayer.play().catch(() => {
      // Caso autoplay com áudio seja bloqueado pelo navegador
      modalVideoPlayer.muted = true;
      modalVideoPlayer.play().catch(() => {});
    });
  } else {
    modalVideoPlayer.removeAttribute('src');
    modalVideoPlayer.load();
    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
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
