function loadSection(fileName) {
  localStorage.setItem('lastSection', fileName);
  const mainContent = document.getElementById('main-content');
  mainContent.classList.remove('visible');

  fetch(fileName)
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el archivo ' + fileName);
      return response.text();
    })
    .then(data => {
      mainContent.innerHTML = data;
      setTimeout(() => mainContent.classList.add('visible'), 50);

      try { updateActiveLink(fileName); } catch (e) { console.debug('updateActiveLink()', e); }

      if (typeof initHorarios === 'function') {
        try { initHorarios(); } catch (e) { console.debug('initHorarios()', e); }
      }

      if (typeof initSlider === 'function') {
        try { initSlider(); } catch (e) { console.debug('initSlider()', e); }
      }

      if (fileName.includes('presupuestos') && typeof inicializarFormularioPresupuesto === 'function') {
        try { inicializarFormularioPresupuesto(); } catch (e) { console.debug('inicializarFormularioPresupuesto()', e); }
      } else if (fileName.includes('contacto') && typeof inicializarFormularioContacto === 'function') {
        try { inicializarFormularioContacto(); } catch (e) { console.debug('inicializarFormularioContacto()', e); }
      }
    })
    .catch(error => console.error(error));
}

function updateActiveLink(fileName) {
  const navLinks = document.querySelectorAll('.tapbar a, .tapbar button, .tapbar-dropbtn');
  navLinks.forEach(link => link.classList.remove('active'));
  const normalizedFile = fileName.toLowerCase();

  const serviciosSub = [
    'apartados/servicios/subservicios/servicio_fiscal.html',
    'apartados/servicios/subservicios/servicio_laboral.html',
    'apartados/servicios/subservicios/servicio_contable.html',
    'apartados/servicios/subservicios/servicio_herencias.html'
  ];

  if (serviciosSub.some(path => normalizedFile.includes(path))) {
    const serviciosBtn = document.querySelector('.tapbar-dropbtn');
    if (serviciosBtn) serviciosBtn.classList.add('active');
    return;
  }

  navLinks.forEach(link => {
    const onClick = link.getAttribute('onclick');
    if (onClick && onClick.toLowerCase().includes(normalizedFile)) {
      link.classList.add('active');
    }
  });
}


// ==================== FORMULARIO PRESUPUESTOS ====================
function inicializarFormularioPresupuesto() {
  const btn = document.getElementById('button');
  const form = document.getElementById('form');
  const confirmacion = document.getElementById('confirmacionMsg');
  const consentimiento = document.getElementById('consent-presupuesto');

  if (!btn || !form) return;

  btn.addEventListener('click', () => form.requestSubmit());

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('time').value = new Date().toLocaleString();
    btn.innerText = 'Enviando...';

    const serviceID = 'default_service';
    const templateID = 'template_f4kinzt';

    if (!consentimiento.checked) {
      alert('Debes aceptar la Política de Privacidad antes de enviar la solicitud.');
      btn.innerText = 'Enviar solicitud';
      return;
    }

    emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        btn.innerText = 'Enviar solicitud';
        confirmacion.style.display = 'block';
        form.reset();
      })
      .catch(err => {
        btn.innerText = 'Enviar solicitud';
        alert("Error al enviar el mensaje: " + JSON.stringify(err));
      });
  });
}

// ==================== FORMULARIO CONTACTO ====================
function inicializarFormularioContacto() {
  const form = document.getElementById('form-mensaje');
  const btn = document.getElementById('button-contacto');
  const confirmacion = document.getElementById('confirmacionMsg');
  const consentimiento = document.getElementById('consent-contacto');

  if (!form || !btn) return;

  btn.addEventListener('click', () => form.requestSubmit());

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    document.getElementById('time').value = new Date().toLocaleString();
    btn.innerText = 'Enviando...';

    const serviceID = 'default_service';
    const templateID = 'template_g31kgga';

    if (!consentimiento.checked) {
      alert('Debes aceptar la Política de Privacidad antes de enviar el formulario.');
      btn.innerText = 'Enviar mensaje';
      return;
    }

    emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        btn.innerText = 'Enviar mensaje';
        confirmacion.style.display = 'block';
        form.reset();
      })
      .catch(err => {
        btn.innerText = 'Enviar mensaje';
        alert("Error al enviar el mensaje: " + JSON.stringify(err));
      });
  });
}
function initHorarios() {
  const selector = document.getElementById('selectorHorario');
  const tabla = document.getElementById('tablaHorario')?.querySelector('tbody');
  if (!selector || !tabla) return;

  const horarios = {
    invierno: ["9:00 - 14:00 / 17:00 - 19:00","9:00 - 14:00 / 17:00 - 19:00","9:00 - 14:00 / 17:00 - 19:00","9:00 - 14:00 / 17:00 - 19:00","9:00 - 14:00 / 17:00 - 19:00"],
    verano: ["8:00 - 15:00","8:00 - 15:00","8:00 - 15:00","8:00 - 15:00","8:00 - 15:00"]
  };
  const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes"];

  const mes = new Date().getMonth() + 1;
  const temporada = (mes === 7 || mes === 8) ? 'verano' : 'invierno';
  selector.value = temporada;

  function actualizarTabla(temp) {
    tabla.innerHTML = "";
    dias.forEach((dia, i) => {
      const row = tabla.insertRow();
      row.insertCell(0).textContent = dia;
      row.insertCell(1).textContent = horarios[temp][i];
    });
  }

  actualizarTabla(temporada);
  selector.addEventListener('change', () => actualizarTabla(selector.value));
}
// ==================== SLIDER + MODAL ====================
function initSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const imgEl = slider.querySelector('#slider-img');
  const leftBtn = slider.querySelector('.arrow.left');
  const rightBtn = slider.querySelector('.arrow.right');
  slider.style.backgroundColor = "black";
  let images = [];
  try {
    const dataAttr = slider.dataset.images || slider.dataset.imagenes;
    images = dataAttr ? JSON.parse(dataAttr) : [
      "imagenes/afisla_cartel.jpg",
      "imagenes/afisla_puertaconlogoGrande.jpg",
      "imagenes/afisla_despacho_grande.jpg",
      "imagenes/afisla_puertaconlogo.jpg",
      "imagenes/afisla_despacho_pequeño.jpg"
    ];
  } catch {
    images = [
      "imagenes/afisla_cartel.jpg",
      "imagenes/afisla_puertaconlogoGrande.jpg",
      "imagenes/afisla_despacho_grande.jpg",
      "imagenes/afisla_puertaconlogo.jpg",
      "imagenes/afisla_despacho_pequeño.jpg"
    ];
  }

  let idx = images.indexOf(imgEl.getAttribute('src'));
  if (idx === -1) idx = 0;

  if (slider._intervalId) {
    clearInterval(slider._intervalId);
    slider._intervalId = null;
  }
const crossImg = document.createElement("img");
crossImg.className = "crossfade-img";
Object.assign(crossImg.style, {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: "0",
  transition: "opacity 0.6s ease",
  pointerEvents: "none"
});
slider.appendChild(crossImg);

  function showIndex(newIndex) {
    newIndex = ((newIndex % images.length) + images.length) % images.length;
    if (newIndex === idx) return;
    imgEl.style.transition = "opacity 0.5s ease";
    imgEl.style.opacity = 0;
    setTimeout(() => {
      imgEl.src = images[newIndex];
      idx = newIndex;
      imgEl.style.opacity = 1;
    }, 100);
  }

  function next() { showIndex(idx + 1); }
  function prev() { showIndex(idx - 1); }

  if (leftBtn) leftBtn.addEventListener('click', () => { prev(); resetAuto(); });
  if (rightBtn) rightBtn.addEventListener('click', () => { next(); resetAuto(); });

  function resetAuto() {
    if (slider._intervalId) clearInterval(slider._intervalId);
    slider._intervalId = setInterval(next, 7000);
  }
  resetAuto();

  slider.addEventListener('mouseenter', () => {
    clearInterval(slider._intervalId);
    slider._intervalId = null;
  });
  slider.addEventListener('mouseleave', resetAuto);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(slider._intervalId);
    else resetAuto();
  });

  // ===== MODAL CON FLECHAS =====
  const modal = document.getElementById("modalImagen");
  const modalImg = document.getElementById("imagenAmpliada");
  const cerrar = document.querySelector(".cerrar-modal");

  if (modal && modalImg && cerrar) {
    let leftArrow = document.createElement("button");
    leftArrow.className = "modal-arrow left";
    leftArrow.innerHTML = "❮";

    let rightArrow = document.createElement("button");
    rightArrow.className = "modal-arrow right";
    rightArrow.innerHTML = "❯";

    modal.appendChild(leftArrow);
    modal.appendChild(rightArrow);

    imgEl.addEventListener("click", () => {
      const current = imgEl.getAttribute('src');
      const currentIdx = images.indexOf(current);
      if (currentIdx !== -1) idx = currentIdx;
      modalImg.src = current;
      modal.style.display = "flex";
      setTimeout(() => {
        const fondoNegro = modal.querySelector('.modal-fondo-negro');
        if (fondoNegro && modalImg.complete) {
          const rect = modalImg.getBoundingClientRect();
          fondoNegro.style.width = rect.width + "px";
          fondoNegro.style.height = rect.height + "px";
        }
      }, 50);
    });

    cerrar.addEventListener("click", () => modal.style.display = "none");
    modal.addEventListener("click", e => {
      if (e.target === modal) modal.style.display = "none";
    });

    function updateModal(newIndex) {
      newIndex = ((newIndex % images.length) + images.length) % images.length;
      idx = newIndex;

      modalImg.classList.remove('fade-in');
      modalImg.classList.add('fade-out');

      setTimeout(() => {
        modalImg.src = images[idx];
        modalImg.onload = () => {
          modalImg.classList.remove('fade-out');
          modalImg.classList.add('fade-in');

          const fondoNegro = modal.querySelector('.modal-fondo-negro');
          if (fondoNegro && modalImg.complete) {
            const rect = modalImg.getBoundingClientRect();
            fondoNegro.style.width = rect.width + "px";
            fondoNegro.style.height = rect.height + "px";
          }
        };
      }, 200);
    }


    leftArrow.addEventListener("click", e => {
      e.stopPropagation();
      updateModal(idx - 1);
    });

    rightArrow.addEventListener("click", e => {
      e.stopPropagation();
      updateModal(idx + 1);
    });

    document.addEventListener("keydown", e => {
      if (modal.style.display === "flex") {
        if (e.key === "ArrowRight") updateModal(idx + 1);
        if (e.key === "ArrowLeft") updateModal(idx - 1);
        if (e.key === "Escape") modal.style.display = "none";
      }
    });
  }
}

// ==================== ULTIMA ENTRADA ====================
window.addEventListener('DOMContentLoaded', () => {
  const lastSection = localStorage.getItem('lastSection') || 'apartados/inicio.html';
  loadSection(lastSection);
});
