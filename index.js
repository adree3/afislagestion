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
          updateActiveLink(fileName);
          initForms();
          initHorarios();
          initSlider();
        })
        .catch(error => console.error(error));
    }

    function updateActiveLink(fileName) {
      const navLinks = document.querySelectorAll('.tapbar a');
      navLinks.forEach(link => link.classList.remove('active'));

      const serviciosSub = [
        'servicios/apartados/servicio_fiscal.html',
        'servicios/apartados/servicio_laboral.html',
        'servicios/apartados/servicio_contable.html',
        'servicios/apartados/servicio_herencias.html'
      ];

      if (serviciosSub.includes(fileName)) {
        const serviciosBtn = document.querySelector('.tapbar-dropbtn');
        if (serviciosBtn) serviciosBtn.classList.add('active');
      } else {
        navLinks.forEach(link => {
          if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(fileName)) {
            link.classList.add('active');
          }
        });
      }
    }

    function initForms() {
      const btn = document.getElementById('button');
      const form = document.getElementById('form');
      const confirmacion = document.getElementById('confirmacionMsg');

      if (!btn || !form) return;

      btn.addEventListener('click', function() { form.requestSubmit(); });

      form.addEventListener('submit', function(event) {
        event.preventDefault();
        document.getElementById('time').value = new Date().toLocaleString();
        btn.innerText = 'Enviando...';
        const serviceID = 'default_service';
        const templateID = 'template_f4kinzt';

        emailjs.sendForm(serviceID, templateID, this)
          .then(() => {
            btn.innerText = 'Enviar solicitud';
            confirmacion.style.display = 'block';
            form.reset();
          }, (err) => {
            btn.innerText = 'Enviar solicitud';
            alert("Error al enviar el mensaje: " + JSON.stringify(err));
          });
      });
    }

    function initHorarios() {
      const selector = document.getElementById('selectorHorario');
      const tabla = document.getElementById('tablaHorario')?.getElementsByTagName('tbody')[0];
      if (!tabla || !selector) return;

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

      selector.addEventListener('change', () => {
          actualizarTabla(selector.value);
      });
    }


    window.addEventListener('DOMContentLoaded', () => {
      const lastSection = localStorage.getItem('lastSection') || 'inicio/inicio.html';
      loadSection(lastSection);
    });

    function toggleMenu() {
      const sideMenu = document.getElementById('side-menu');
      const overlay = document.getElementById('menu-overlay');
      
      sideMenu.classList.toggle('open');
      overlay.style.display = sideMenu.classList.contains('open') ? 'block' : 'none';
    }

    function toggleSubmenu(event) {
      event.preventDefault();
      const submenu = event.target.nextElementSibling;
      submenu.classList.toggle('open');
    }
    /* ===== Slider: una imagen, flechas + autoplay (inicializar tras cargar sección) ===== */
    function initSlider() {
      const slider = document.querySelector('.slider');
      if (!slider) return; // nada que hacer si la página no tiene slider

      const imgEl = slider.querySelector('#slider-img');
      const leftBtn = slider.querySelector('.arrow.left');
      const rightBtn = slider.querySelector('.arrow.right');

      // leer lista de imágenes desde data-images si existe, sino usar fallback
      let images = [];
      try {
        images = slider.dataset.images ? JSON.parse(slider.dataset.images) : [
          "imagenes/afisla_cartel.jpg",
          "imagenes/afisla_puertaconlogoGrande.jpg",
          "imagenes/afisla_despacho_grande.jpg",
          "imagenes/afisla_puertaconlogo.jpg",
          "imagenes/afisla_despacho_pequeño.jpg"
        ];
      } catch (e) {
        images = [
          "imagenes/afisla_cartel.jpg",
          "imagenes/afisla_puertaconlogoGrande.jpg",
          "imagenes/afisla_despacho_grande.jpg",
          "imagenes/afisla_puertaconlogo.jpg",
          "imagenes/afisla_despacho_pequeño.jpg"
        ];
      }

      // índice inicial (si el src del img coincide con alguno)
      let idx = images.indexOf(imgEl.getAttribute('src'));
      if (idx === -1) idx = 0;

      // limpiar intervalos previos si los hubiera (evita duplicados al navegar)
      if (slider._intervalId) {
        clearInterval(slider._intervalId);
        slider._intervalId = null;
      }

      function showIndex(newIndex) {
        newIndex = ((newIndex % images.length) + images.length) % images.length; // normaliza
        if (newIndex === idx) return;
        // fade out -> cambiar src -> fade in
        imgEl.style.transition = "opacity 0.5s ease";
        imgEl.style.opacity = 0;
        setTimeout(() => {
          imgEl.src = images[newIndex];
          idx = newIndex;
          imgEl.style.opacity = 1;
        }, 300);
      }

      function next() { showIndex(idx + 1); }
      function prev() { showIndex(idx - 1); }

      // listeners de flechas
      if (leftBtn) leftBtn.addEventListener('click', () => { prev(); resetAuto(); });
      if (rightBtn) rightBtn.addEventListener('click', () => { next(); resetAuto(); });

      // autoplay
      function resetAuto() {
        if (slider._intervalId) clearInterval(slider._intervalId);
        slider._intervalId = setInterval(next, 7000);
      }
      slider._intervalId = setInterval(next, 7000);

      // pausa al pasar el ratón (útil en desktop)
      slider.addEventListener('mouseenter', () => {
        if (slider._intervalId) {
          clearInterval(slider._intervalId);
          slider._intervalId = null;
        }
      });
      slider.addEventListener('mouseleave', () => {
        resetAuto();
      });

      // opcional: detectar cambio de visibilidad (pestaña) y detener autoplay
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (slider._intervalId) { clearInterval(slider._intervalId); slider._intervalId = null; }
        } else {
          resetAuto();
        }
      });
    }
    