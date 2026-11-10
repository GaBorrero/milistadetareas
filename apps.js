const formulario = document.getElementById('formulario');
const entrada = document.getElementById('nueva-tarea');
const mensajeError = document.getElementById('mensaje-error');
const lista = document.getElementById('lista');
const contador = document.getElementById('contador');
const vacio = document.getElementById('vacio');
const btnLimpiar = document.getElementById('limpiar');

let tareas = [
  { id: 1, texto: 'Entregar el taller de HTML', completada: false },
  { id: 2, texto: 'Repasar selectores de CSS', completada: false },
  { id: 3, texto: 'Leer la guía de JavaScript', completada: true }
];
let siguienteId = 4;

function cargar() {
  try {
    const guardado = JSON.parse(localStorage.getItem('tareas'));
    if (Array.isArray(guardado)) {
      tareas = guardado;
      siguienteId = tareas.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    }
  } catch (e) { /* sin almacenamiento: se usan las tareas de ejemplo */ }
}

function guardar() {
  try { localStorage.setItem('tareas', JSON.stringify(tareas)); } catch (e) {}
}

function mostrarError(texto) {
  mensajeError.textContent = texto;
  entrada.setAttribute('aria-invalid', texto ? 'true' : 'false');
}

function render() {
  lista.innerHTML = '';

  tareas.forEach(tarea => {
    const li = document.createElement('li');
    li.className = 'tarea' + (tarea.completada ? ' completada' : '');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.id = 'tarea-' + tarea.id;
    check.checked = tarea.completada;
    check.addEventListener('change', () => {
      tarea.completada = check.checked;
      guardar();
      render();
    });

    const etiqueta = document.createElement('label');
    etiqueta.htmlFor = check.id;
    etiqueta.textContent = tarea.texto;

    const borrar = document.createElement('button');
    borrar.type = 'button';
    borrar.className = 'btn-borrar';
    borrar.textContent = '✕';
    borrar.setAttribute('aria-label', 'Borrar tarea: ' + tarea.texto);
    borrar.addEventListener('click', () => {
      tareas = tareas.filter(t => t.id !== tarea.id);
      guardar();
      render();
      entrada.focus();
    });

    li.append(check, etiqueta, borrar);
    lista.appendChild(li);
  });

  const pendientes = tareas.filter(t => !t.completada).length;
  contador.innerHTML = '<strong>' + pendientes + '</strong> ' +
    (pendientes === 1 ? 'tarea pendiente' : 'tareas pendientes');
  vacio.hidden = tareas.length > 0;
  btnLimpiar.hidden = tareas.length === pendientes;
}

formulario.addEventListener('submit', evento => {
  evento.preventDefault();
  const texto = entrada.value.trim();

  if (texto === '') {
    mostrarError('Escribe una tarea antes de agregarla.');
    entrada.value = '';
    entrada.focus();
    return;
  }

  mostrarError('');
  tareas.push({ id: siguienteId++, texto: texto, completada: false });
  entrada.value = '';
  guardar();
  render();
  entrada.focus();
});

entrada.addEventListener('input', () => {
  if (entrada.value.trim() !== '') mostrarError('');
});

btnLimpiar.addEventListener('click', () => {
  tareas = tareas.filter(t => !t.completada);
  guardar();
  render();
});

cargar();
render();
