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

    if (!consentimiento.checked) {
      alert('Debes aceptar la Política de Privacidad antes de enviar la solicitud.');
      btn.innerText = 'Enviar solicitud';
      return;
    }

    emailjs.sendForm('default_service', 'template_f4kinzt', this)
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

    if (!consentimiento.checked) {
      alert('Debes aceptar la Política de Privacidad antes de enviar el formulario.');
      btn.innerText = 'Enviar mensaje';
      return;
    }

    emailjs.sendForm('default_service', 'template_g31kgga', this)
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

// ==================== HORARIOS ====================
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

// ==================== SLIDER ====================
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

  const next = () => showIndex(idx + 1);
  const prev = () => showIndex(idx - 1);
  leftBtn?.addEventListener('click', () => { prev(); resetAuto(); });
  rightBtn?.addEventListener('click', () => { next(); resetAuto(); });

  function resetAuto() {
    clearInterval(slider._intervalId);
    slider._intervalId = setInterval(next, 7000);
  }
  resetAuto();

  slider.addEventListener('mouseenter', () => clearInterval(slider._intervalId));
  slider.addEventListener('mouseleave', resetAuto);
}
function initModalImagen() {
  const sliderImg = document.getElementById("slider-img");
  const modal = document.getElementById("modalImagen");
  const modalImg = document.getElementById("imagenAmpliada");
  const cerrarModal = document.querySelector(".cerrar-modal");
  const fondoNegro = document.querySelector(".modal-fondo-negro");
  const slider = document.querySelector(".slider");

  if (!slider || !sliderImg || !modal || !modalImg) return;

  const imagenes = JSON.parse(slider.dataset.imagenes || "[]");
  let indiceActual = 0;

  // Botones del modal
  let botonPrev = document.createElement("button");
  let botonNext = document.createElement("button");
  botonPrev.className = "modal-arrow left";
  botonNext.className = "modal-arrow right";
  botonPrev.textContent = "❮";
  botonNext.textContent = "❯";
  modal.appendChild(botonPrev);
  modal.appendChild(botonNext);

  // Abrir modal al hacer clic en imagen
  sliderImg.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = sliderImg.src;
    indiceActual = imagenes.indexOf(sliderImg.src.replace(window.location.origin + "/", "")) || 0;
  });

  // Cambiar imagen dentro del modal
  const mostrarImagen = (indice) => {
    if (indice < 0) indice = imagenes.length - 1;
    if (indice >= imagenes.length) indice = 0;
    indiceActual = indice;
    modalImg.src = imagenes[indiceActual];
  };

  botonPrev.addEventListener("click", () => mostrarImagen(indiceActual - 1));
  botonNext.addEventListener("click", () => mostrarImagen(indiceActual + 1));

  // Cerrar modal
  const cerrar = () => (modal.style.display = "none");
  cerrarModal?.addEventListener("click", cerrar);
  fondoNegro?.addEventListener("click", cerrar);

  // Flechas del teclado
  document.addEventListener("keydown", (e) => {
    if (modal.style.display !== "flex") return;
    if (e.key === "ArrowLeft") mostrarImagen(indiceActual - 1);
    if (e.key === "ArrowRight") mostrarImagen(indiceActual + 1);
    if (e.key === "Escape") cerrar();
  });
}

// Ejecutar todo cuando cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  if (typeof initMenu === "function") initMenu();
  if (typeof initSlider === "function") initSlider();
  if (typeof initHorarios === "function") initHorarios();
  initModalImagen();
});
