// Gestor menú lateral + overlay
(function(){
  const menuToggle = document.getElementById('menu-toggle');
  const sideMenu = document.getElementById('side-menu');
  let overlay = document.querySelector('.side-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'side-menu-overlay';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    sideMenu.classList.add('show');
    overlay.classList.add('show');
    document.body.classList.add('menu-open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded','true');
  }

  function closeMenu() {
    sideMenu.classList.remove('show');
    overlay.classList.remove('show');
    document.body.classList.remove('menu-open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded','false');
  }

  if (menuToggle && sideMenu) {
    menuToggle.addEventListener('click', () => {
      sideMenu.classList.contains('show') ? closeMenu() : openMenu();
    });

    sideMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }
})();

document.querySelectorAll('.side-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.side-menu a.active').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
  });
});

/* =============================
   HEADER FIJO QUE SE ESCONDE/REAPARECE EN MÓVIL
   ============================= */

(function() {
  const header = document.querySelector('.contact-block');
  let lastScroll = 0;
  const scrollThreshold = 10;

  if (!header) return;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll <= 0) {
      header.classList.remove('hide-header');
      return;
    }

    if (currentScroll > lastScroll && currentScroll - lastScroll > scrollThreshold) {
      header.classList.add('hide-header');
    }
    else if (currentScroll < lastScroll) {
      header.classList.remove('hide-header');
    }

    lastScroll = currentScroll;
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const topBar = document.querySelector(".top-bar");
  const contactBlock = document.querySelector(".contact-block");
  const tapbar = document.querySelector(".tapbar-container");

  const updateTapbarPosition = () => {
    const topBarRect = topBar ? topBar.getBoundingClientRect() : { bottom: 0 };
    const contactRect = contactBlock ? contactBlock.getBoundingClientRect() : { bottom: 0 };

    if ((topBarRect.bottom > 0) || (contactRect.bottom > 0)) {
      tapbar.style.top = `${Math.max(topBarRect.bottom, contactRect.bottom)}px`;
    } else {
      tapbar.style.top = "0";
    }
  };

  updateTapbarPosition();
  window.addEventListener("scroll", updateTapbarPosition);
  window.addEventListener("resize", updateTapbarPosition);
});

// Calcular padding del contenido en movil
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".contact-block");
  const mainContent = document.querySelector("#main-content");

  const updatePadding = () => {
    if (window.innerWidth <= 768 && header && mainContent) {
      const headerHeight = header.offsetHeight;
      mainContent.style.paddingTop = `${headerHeight + 20}px`;
    } else {
      mainContent.style.paddingTop = ""; // restablece en escritorio
    }
  };

  updatePadding();
  window.addEventListener("resize", updatePadding);
});