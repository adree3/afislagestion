// ==============================
// MENÚ LATERAL + TAPBAR MÓVIL/ESCRITORIO
// ==============================
console.log("Cargando menu.js");
(function () {
  console.log("initMenu ejecutado");

  const menuToggle   = document.getElementById('menu-toggle');
  const sideMenu     = document.getElementById('side-menu');
  const overlayClass = 'menu-overlay';
  const topBar       = document.querySelector('.top-bar');
  const contactBlock = document.querySelector('.contact-block');
  const tapbarContainer = document.querySelector('.tapbar-container');
  let tapbarPlaceholder = document.createElement('div');
  tapbarPlaceholder.style.display = "none";
  tapbarPlaceholder.style.height = `${tapbarContainer?.offsetHeight || 0}px`;
  tapbarContainer?.parentNode?.insertBefore(tapbarPlaceholder, tapbarContainer.nextSibling);
  const mainContent  = document.querySelector('#main-content');

  let overlay = document.querySelector(`.${overlayClass}`);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = overlayClass;
    document.body.appendChild(overlay);
  }

  const openMenu = () => {
    if (!menuToggle || !sideMenu) return;
    document.body.classList.add('menu-open');
    sideMenu.classList.add('open');
    overlay.classList.add('open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    if (!menuToggle || !sideMenu) return;
    document.body.classList.remove('menu-open');
    sideMenu.classList.remove('open');
    overlay.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  if (menuToggle && sideMenu) {
    menuToggle.addEventListener('click', () => {
      sideMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    sideMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  const header = document.querySelector('.contact-block');
  let lastScroll = 0;
  const scrollThreshold = 10;

  if (header) {
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current <= 0) { header.classList.remove('hide-header'); return; }
      if (current > lastScroll && current - lastScroll > scrollThreshold) header.classList.add('hide-header');
      else if (current < lastScroll) header.classList.remove('hide-header');
      lastScroll = current;
    });
  }

  const updateTapbarPosition = () => {
    if (!tapbarContainer) return;
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      const topBarRect = topBar ? topBar.getBoundingClientRect() : { bottom: 0 };
      const contactRect = contactBlock ? contactBlock.getBoundingClientRect() : { bottom: 0 };
      tapbarContainer.style.position = "fixed";
      tapbarContainer.style.top = `${Math.max(topBarRect.bottom, contactRect.bottom)}px`;
      tapbarContainer.style.width = "100%";
      tapbarContainer.style.zIndex = "1900";
      tapbarContainer.style.boxShadow = "none";
      if (tapbarPlaceholder) tapbarPlaceholder.style.display = "none";
    } else {
      const headerBottom = contactBlock ? contactBlock.getBoundingClientRect().bottom : 0;

      if (headerBottom <= 0) {
        tapbarContainer.style.position = "fixed";
        tapbarContainer.style.top = "0";
        tapbarContainer.style.left = "0";
        tapbarContainer.style.width = "100%";
        tapbarContainer.style.zIndex = "3000";
        tapbarContainer.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
        if (tapbarPlaceholder) {
          tapbarPlaceholder.style.display = "block";
          tapbarPlaceholder.style.height = `${tapbarContainer.offsetHeight}px`;
        }
      } else {
        tapbarContainer.style.position = "relative";
        tapbarContainer.style.top = "";
        if (tapbarPlaceholder) tapbarPlaceholder.style.display = "none";
      }
    }
  };

  updateTapbarPosition();
  window.addEventListener("scroll", updateTapbarPosition);
  window.addEventListener("resize", updateTapbarPosition);

  // --- Ajuste del padding del contenido principal en móvil ---
  const updatePadding = () => {
    if (!mainContent || !header) return;
    if (window.innerWidth <= 768) {
      mainContent.style.paddingTop = `${header.offsetHeight + 0}px`;
    } else {
      mainContent.style.paddingTop = '';
    }
  };
  updatePadding();
  window.addEventListener('resize', updatePadding);

  // ==============================
  // MARCAR EN EL MENÚ LA PÁGINA ACTUAL
  // ==============================
  const navLinks = document.querySelectorAll(".tapbar a, .side-menu a");
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  navLinks.forEach(link => {
    const href = link.getAttribute("href")?.toLowerCase();
    if (!href) return;

    if (href.includes(currentPage) && currentPage !== "") {
      link.classList.add("active");
    }
    if (currentPage.startsWith("servicio_")) {
      if (href.includes("servicios/servicios.html")) {
        link.classList.add("active");
      }
    }
  });

  console.log("Menú inicializado correctamente");
})();
