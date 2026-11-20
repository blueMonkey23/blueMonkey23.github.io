/**
 * TRAN TRONG CHIEN — SOFTWARE PORTFOLIO 2026
 * Interactive Client Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PROJECT CATEGORY FILTERING
  const filterButtons = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      // Update active state on buttons
      filterButtons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });

      // Filter cards with smooth fade
      projectCards.forEach((card) => {
        const categories = (card.dataset.category || '').split(' ');
        const matches = filter === 'all' || categories.includes(filter);

        if (matches) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            if (btnNotMatching(card, filter)) {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });

  function btnNotMatching(card, filter) {
    const categories = (card.dataset.category || '').split(' ');
    return filter !== 'all' && !categories.includes(filter);
  }

  // 2. HERO CODE CONSOLE TAB SWITCHER
  const consoleTabs = document.querySelectorAll('.console-tab');
  const codeBlocks = document.querySelectorAll('.code-block');

  consoleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = `code-${tab.dataset.code}`;

      consoleTabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });

      codeBlocks.forEach((block) => {
        block.classList.toggle('code-active', block.id === targetId);
      });
    });
  });

  // 3. INTERACTIVE BEFORE/AFTER SLIDER (AI Photo Restoration)
  const compareSliders = document.querySelectorAll('[data-compare-slider]');
  compareSliders.forEach((slider) => {
    const beforeLayer = slider.querySelector('[data-compare-before]');
    const handle = slider.querySelector('[data-compare-handle]');
    let isDragging = false;

    const setPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      beforeLayer.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support for mobile
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  });

  // 4. SPOTLIGHT MOUSE HOVER EFFECT ON PROJECT CARDS
  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 5. COPY EMAIL & TOAST NOTIFICATION
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  const toast = document.getElementById('copy-toast');
  let toastTimer = null;

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email || 'trantrongchien05@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Đã sao chép email: ${email}`);
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Đã sao chép email: ${email}`);
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    const msgSpan = toast.querySelector('.toast-message');
    if (msgSpan) msgSpan.textContent = message;

    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  // 6. MOBILE NAVIGATION MENU
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.getElementById('site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', !isOpen ? 'Đóng menu' : 'Mở menu');
      siteNav.classList.toggle('is-open', !isOpen);
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Mở menu');
        siteNav.classList.remove('is-open');
      });
    });
  }

  // 7. ACTIVE NAVIGATION ON SCROLL
  const navLinks = document.querySelectorAll('.site-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach((section) => observer.observe(section));
});
