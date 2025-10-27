document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cookie-banner")) return; // evitar duplicado

  // ======== HTML del banner + modal ========
  const html = `
  <div id="cookie-banner" class="cookie-banner">
    <p>
      🍪 Utilizamos cookies propias y de terceros con fines técnicos, analíticos y de personalización.
      Puedes aceptar todas, rechazarlas o configurar tus preferencias.<br>
      Más información en nuestra 
      <a href="/apartados/apartado_legal/politica_cookies.html" target="_blank">Política de Cookies</a>.
    </p>
    <div class="cookie-buttons">
      <button id="accept-all" class="cookie-btn primary">Aceptar todas</button>
      <button id="reject-all" class="cookie-btn secondary">Rechazar</button>
      <button id="customize" class="cookie-btn outline">Configurar</button>
    </div>
  </div>

  <div id="cookie-modal" class="cookie-modal">
    <div class="cookie-modal-content">
      <h2>Configuración de cookies</h2>
      <p>Selecciona qué tipos de cookies quieres permitir. Puedes cambiarlo en cualquier momento.</p>
      <form id="cookie-preferences">
        <label>
          <input type="checkbox" checked disabled>
          <strong>Cookies técnicas necesarias</strong> (obligatorias)
        </label>
        <label>
          <input type="checkbox" id="analytics-cookies">
          <strong>Cookies analíticas</strong> (mejoran el rendimiento del sitio)
        </label>
        <label>
          <input type="checkbox" id="marketing-cookies">
          <strong>Cookies de marketing</strong> (personalizan la publicidad)
        </label>
        <div class="cookie-modal-actions">
          <button type="button" id="save-preferences" class="cookie-btn primary">Guardar preferencias</button>
          <button type="button" id="cancel-preferences" class="cookie-btn secondary">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  // ======== CSS ========
  const style = document.createElement("style");
  style.textContent = `
    /* ======== BANNER ======== */
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #2e7d32;
      color: #fff;
      padding: 1.4rem 1rem;
      text-align: center;
      font-size: 1rem;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.25);
      display: none;
      z-index: 9999;
      animation: fadeInUp 0.6s ease;
    }
    @keyframes fadeInUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .cookie-banner a {
      color: #c8f7c5;
      text-decoration: underline;
      transition: color 0.2s;
    }
    .cookie-banner a:hover { color: #fff; }
    .cookie-buttons {
      margin-top: 0.8rem;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .cookie-btn {
      border: none;
      border-radius: 6px;
      padding: 0.55rem 1.2rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.25s ease;
    }
    .cookie-btn.primary {
      background: #fff;
      color: #2e7d32;
    }
    .cookie-btn.primary:hover {
      background: #e8f5e9;
      transform: translateY(-2px);
    }
    .cookie-btn.secondary {
      background: rgba(255,255,255,0.15);
      color: #fff;
    }
    .cookie-btn.secondary:hover {
      background: rgba(255,255,255,0.25);
      transform: translateY(-2px);
    }
    .cookie-btn.outline {
      background: transparent;
      color: #fff;
      border: 1.5px solid #fff;
    }
    .cookie-btn.outline:hover {
      background: rgba(255,255,255,0.1);
      transform: translateY(-2px);
    }

    /* ======== MODAL ======== */
    .cookie-modal {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.65);
      justify-content: center;
      align-items: center;
      z-index: 10000;
      animation: fadeIn 0.4s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    .cookie-modal-content {
      background: #fff;
      color: #333;
      padding: 2rem;
      border-radius: 12px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      text-align: left;
      animation: popIn 0.3s ease;
    }
    @keyframes popIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .cookie-modal-content h2 {
      color: #2e7d32;
      margin-bottom: 1rem;
      text-align: center;
    }
    .cookie-modal-content label {
      display: block;
      margin: 0.75rem 0;
      font-size: 0.95rem;
    }
    .cookie-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.6rem;
      margin-top: 1.5rem;
    }
  `;
  document.head.appendChild(style);

  // ======== Lógica ========
  const banner = document.getElementById("cookie-banner");
  const modal = document.getElementById("cookie-modal");

  if (!localStorage.getItem("cookieConsent")) {
    banner.style.display = "block";
  }

  const saveConsent = (consent) => {
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    banner.style.display = "none";
    modal.style.display = "none";
  };

  document.getElementById("accept-all").onclick = () =>
    saveConsent({ necessary: true, analytics: true, marketing: true });

  document.getElementById("reject-all").onclick = () =>
    saveConsent({ necessary: true, analytics: false, marketing: false });

  document.getElementById("customize").onclick = () =>
    (modal.style.display = "flex");

  document.getElementById("save-preferences").onclick = () => {
    const consent = {
      necessary: true,
      analytics: document.getElementById("analytics-cookies").checked,
      marketing: document.getElementById("marketing-cookies").checked,
    };
    saveConsent(consent);
  };

  document.getElementById("cancel-preferences").onclick = () =>
    (modal.style.display = "none");
});
