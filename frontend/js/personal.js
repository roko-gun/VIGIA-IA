// ============================================================
// VIGIA IA - Módulo Personal con Captura de Rostro
// ============================================================

const API_URL = 'http://localhost:3000/api';
const MODEL_PATH = '../models';

let listaPersonal = [];
let personalEditando = null;
let descriptorCapturado = null;
let idPersonalParaRostro = null;

// Elementos del DOM
const tablaPersonal = document.getElementById('tablaPersonal');
const buscador = document.getElementById('buscador');
const contadorPersonal = document.getElementById('contadorPersonal');
const modalPersonal = document.getElementById('modalPersonal');
const modalTitle = document.getElementById('modalTitle');
const btnNuevoPersonal = document.getElementById('btnNuevoPersonal');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnCancelar = document.getElementById('btnCancelar');
const formPersonal = document.getElementById('formPersonal');
const btnGuardar = document.getElementById('btnGuardar');
const btnGuardarTexto = document.getElementById('btnGuardarTexto');
const toastVigia = document.getElementById('toastVigia');

// Inputs del formulario
const inputId = document.getElementById('personalId');
const inputNombre = document.getElementById('inputNombre');
const inputCedula = document.getElementById('inputCedula');
const inputCargo = document.getElementById('inputCargo');
const inputArea = document.getElementById('inputArea');
const inputTelefono = document.getElementById('inputTelefono');
const aceptoPolitica = document.getElementById('aceptoPolitica');

// Captura de rostro
const estadoRostro = document.getElementById('estadoRostro');
const btnCapturarRostro = document.getElementById('btnCapturarRostro');
const modalCaptura = document.getElementById('modalCaptura');
const btnCerrarCaptura = document.getElementById('btnCerrarCaptura');
const btnCancelarCaptura = document.getElementById('btnCancelarCaptura');
const btnTomarFoto = document.getElementById('btnTomarFoto');
const videoCaptura = document.getElementById('videoCaptura');
const overlayCaptura = document.getElementById('overlayCaptura');
const statusCaptura = document.getElementById('statusCaptura');

// Modal política
const modalPolitica = document.getElementById('modalPolitica');
const linkPolitica = document.getElementById('linkPolitica');
const btnCerrarPolitica = document.getElementById('btnCerrarPolitica');
const btnCerrarPolitica2 = document.getElementById('btnCerrarPolitica2');

// Variables globales de captura
let streamCaptura = null;
let modelosCargados = false;
let detectando = false;

// ============ TOAST ============
function mostrarToast(mensaje, tipo = 'success') {
    toastVigia.textContent = mensaje;
    toastVigia.className = `toast-vigia ${tipo} activo`;
    setTimeout(() => { toastVigia.classList.remove('activo'); }, 3500);
}

// ============ CARGAR PERSONAL ============
async function cargarPersonal() {
    try {
        const response = await fetch(`${API_URL}/personal`);
        const data = await response.json();
        if (!response.ok) {
            mostrarToast('Error al cargar personal', 'error');
            return;
        }
        listaPersonal = data;
        renderizarTabla(data);
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
}

// ============ RENDERIZAR TABLA ============
function renderizarTabla(datos) {
    contadorPersonal.textContent = `${datos.length} registro${datos.length === 1 ? '' : 's'}`;
    
    if (datos.length === 0) {
        tablaPersonal.innerHTML = '<tr><td colspan="8" class="text-center text-muted" style="padding:2rem;">No hay personal registrado</td></tr>';
        return;
    }
    
    tablaPersonal.innerHTML = datos.map(p => {
        const tieneRostro = p.descriptor_facial ? true : false;
        const rostroIcon = tieneRostro
        ? '<i class="bi bi-check-circle-fill" style="color: var(--mint-neon); font-size: 1.2rem;" title="Rostro registrado"></i>'
        : '<i class="bi bi-x-circle" style="color: var(--silver-fog); font-size: 1.2rem;" title="Sin rostro registrado"></i>';
        
        return `
            <tr>
                <td><span style="color:var(--silver-fog);">#${p.id}</span></td>
                <td class="text-center">${rostroIcon}</td>
                <td><strong>${p.nombre}</strong></td>
                <td>${p.cedula}</td>
                <td>${p.cargo}</td>
                <td>${p.area || '-'}</td>
                <td>${p.telefono || '-'}</td>
                <td class="text-end">
            <button class="btn-accion editar" onclick="abrirEditar(${p.id})" title="Editar">
            <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-accion eliminar" onclick="eliminarPersonal(${p.id}, '${p.nombre}')" title="Eliminar">
            <i class="bi bi-trash"></i>
            </button>
                </td>
            </tr>
            `;
        }).join('');
    }

// ============ BUSCADOR ============
buscador.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase().trim();
    if (!termino) {
        renderizarTabla(listaPersonal);
        return;
    }
    const filtrados = listaPersonal.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.cedula.toLowerCase().includes(termino) ||
        p.cargo.toLowerCase().includes(termino)
    );
    renderizarTabla(filtrados);
});

// ============ MODAL PERSONAL ============
function abrirModal() { modalPersonal.classList.add('activo'); }
function cerrarModal() { modalPersonal.classList.remove('activo'); }

function abrirCrear() {
    personalEditando = null;
    descriptorCapturado = null;
    idPersonalParaRostro = null;
    modalTitle.textContent = 'Nuevo Personal';
    btnGuardarTexto.textContent = 'Guardar';
    formPersonal.reset();
    inputId.value = '';
    estadoRostro.textContent = 'Sin rostro registrado';
    estadoRostro.style.color = 'var(--silver-fog)';
    abrirModal();
}

window.abrirEditar = (id) => {
    const p = listaPersonal.find(x => x.id === id);
    if (!p) return;
    
    personalEditando = p;
    descriptorCapturado = null;
    idPersonalParaRostro = p.id;
    modalTitle.textContent = 'Editar Personal';
    btnGuardarTexto.textContent = 'Actualizar';
    
    inputId.value = p.id;
    inputNombre.value = p.nombre;
    inputCedula.value = p.cedula;
    inputCargo.value = p.cargo;
    inputArea.value = p.area || '';
    inputTelefono.value = p.telefono || '';
    aceptoPolitica.checked = true;
    
    if (p.descriptor_facial) {
        estadoRostro.textContent = '✓ Rostro registrado';
        estadoRostro.style.color = 'var(--mint-neon)';
    } else {
        estadoRostro.textContent = 'Sin rostro registrado';
        estadoRostro.style.color = 'var(--silver-fog)';
    }
    
    abrirModal();
};

btnNuevoPersonal.addEventListener('click', abrirCrear);
btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);

modalPersonal.addEventListener('click', (e) => {
    if (e.target === modalPersonal) cerrarModal();
});

// ============ CAPTURA DE ROSTRO ============
btnCapturarRostro.addEventListener('click', () => {
  // Si es nuevo, primero hay que guardarlo para tener su ID
if (!personalEditando && !inputId.value) {
    if (!inputNombre.value.trim() || !inputCedula.value.trim() || !inputCargo.value.trim()) {
        mostrarToast('Completa nombre, cédula y cargo antes de capturar el rostro', 'error');
        return;
    }
    if (!aceptoPolitica.checked) {
        mostrarToast('Acepta la política de datos antes de capturar el rostro', 'error');
        return;
    }

    // Guardar primero
    guardarPersonalYContinuar();
    return;
}

  // Si ya existe, abrir modal de captura
    idPersonalParaRostro = personalEditando ? personalEditando.id : inputId.value;
    abrirModalCaptura();
});

async function guardarPersonalYContinuar() {
    const datos = {
        nombre: inputNombre.value.trim(),
        cedula: inputCedula.value.trim(),
        cargo: inputCargo.value.trim(),
        area: inputArea.value.trim(),
        telefono: inputTelefono.value.trim()
    };
    
    try {
        const response = await fetch(`${API_URL}/personal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const result = await response.json();
        
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al guardar', 'error');
            return;
        }
        
        personalEditando = { id: result.id };
        inputId.value = result.id;
        idPersonalParaRostro = result.id;
        mostrarToast('Personal guardado. Ahora captura el rostro', 'success');
        abrirModalCaptura();
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
}

// ============ MODAL DE CÁMARA ============
async function abrirModalCaptura() {
    modalCaptura.classList.add('activo');
    statusCaptura.textContent = 'Cargando modelos de IA...';
    
    if (!modelosCargados) {
        try {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_PATH),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH)
            ]);
            modelosCargados = true;
        } catch (error) {
            console.error('Error cargando modelos:', error);
            statusCaptura.textContent = 'Error al cargar los modelos. Verifica la carpeta /models';
            return;
        }
    }
    iniciarCamara();
}

async function iniciarCamara() {
    try {
        streamCaptura = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: 'user' }
        });
        videoCaptura.srcObject = streamCaptura;
        videoCaptura.addEventListener('play', () => {
            detectando = true;
            detectarRostro();
        });
        statusCaptura.textContent = 'Coloca tu rostro en el centro';
        statusCaptura.style.color = 'var(--cyan-electric)';
    } catch (err) {
        console.error('Error cámara:', err);
        statusCaptura.textContent = 'No se pudo acceder a la cámara';
        statusCaptura.style.color = 'var(--red-alert)';
    }
}

async function detectarRostro() {
    if (!detectando) return;
    
    const detections = await faceapi.detectSingleFace(
        videoCaptura,
        new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks();
    
    const displaySize = { width: videoCaptura.videoWidth, height: videoCaptura.videoHeight };
    faceapi.matchDimensions(overlayCaptura, displaySize);

    const ctx = overlayCaptura.getContext('2d');
    ctx.clearRect(0, 0, overlayCaptura.width, overlayCaptura.height);
    
    if (detections) {
        const resized = faceapi.resizeResults(detections, displaySize);
        const box = resized.detection.box;
        
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 15;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.shadowBlur = 0;
        
        statusCaptura.textContent = '✓ Rostro detectado. Presiona "Capturar rostro"';
        statusCaptura.style.color = 'var(--mint-neon)';
        btnTomarFoto.disabled = false;
    } else {
        statusCaptura.textContent = 'Buscando rostro...';
        statusCaptura.style.color = 'var(--silver-fog)';
        btnTomarFoto.disabled = true;
    }
    
    requestAnimationFrame(detectarRostro);
}

// ============ TOMAR FOTO Y GENERAR DESCRIPTOR ============
btnTomarFoto.addEventListener('click', async () => {
    btnTomarFoto.disabled = true;
    statusCaptura.textContent = 'Analizando rostro...';
    statusCaptura.style.color = 'var(--cyan-electric)';
    
    try {
        const detection = await faceapi
        .detectSingleFace(videoCaptura, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
        
        if (!detection) {
            statusCaptura.textContent = 'No se detectó rostro. Intenta de nuevo.';
            statusCaptura.style.color = 'var(--red-alert)';
            btnTomarFoto.disabled = false;
            return;
        }
        
        const descriptor = Array.from(detection.descriptor);
        descriptorCapturado = JSON.stringify(descriptor);

        // Detener cámara
    
        detenerCamara();
        cerrarModalCaptura();

        // Actualizar estado
    
        estadoRostro.textContent = '✓ Rostro capturado (pendiente guardar)';
        estadoRostro.style.color = 'var(--mint-neon)';
        mostrarToast('Rostro capturado correctamente', 'success');

    } catch (error) {
        console.error(error);
        statusCaptura.textContent = 'Error al procesar el rostro';
        statusCaptura.style.color = 'var(--red-alert)';
        btnTomarFoto.disabled = false;
    }
});

function detenerCamara() {
    detectando = false;
    if (streamCaptura) {
        streamCaptura.getTracks().forEach(t => t.stop());
        streamCaptura = null;
    }
}

function cerrarModalCaptura() {
    detenerCamara();
    modalCaptura.classList.remove('activo');
}

btnCerrarCaptura.addEventListener('click', cerrarModalCaptura);
btnCancelarCaptura.addEventListener('click', cerrarModalCaptura);

// ============ GUARDAR FORMULARIO ============
formPersonal.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datos = {
        nombre: inputNombre.value.trim(),
        cedula: inputCedula.value.trim(),
        cargo: inputCargo.value.trim(),
        area: inputArea.value.trim(),
        telefono: inputTelefono.value.trim()
    };
    
    if (!datos.nombre || !datos.cedula || !datos.cargo) {
        mostrarToast('Nombre, cédula y cargo son obligatorios', 'error');
        return;
    }
    
    if (!aceptoPolitica.checked) {
        mostrarToast('Debes aceptar la política de tratamiento de datos', 'error');
        return;
    }
    
    btnGuardar.disabled = true;
    btnGuardarTexto.textContent = personalEditando ? 'Actualizando...' : 'Guardando...';
    
    try {
        const url = personalEditando
        ? `${API_URL}/personal/${personalEditando.id}`
        : `${API_URL}/personal`;
        const method = personalEditando ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al guardar', 'error');
            btnGuardar.disabled = false;
            btnGuardarTexto.textContent = personalEditando ? 'Actualizar' : 'Guardar';
            return;
        }

    // Si capturó rostro, guardarlo
    const idFinal = personalEditando ? personalEditando.id : result.id;
    if (descriptorCapturado && idFinal) {
        await fetch(`${API_URL}/personal/${idFinal}/rostro`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descriptor: descriptorCapturado })
        });
    }

        mostrarToast(personalEditando ? 'Personal actualizado correctamente' : 'Personal creado correctamente');
        descriptorCapturado = null;
        cerrarModal();
        cargarPersonal();

    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión con el servidor', 'error');
    } finally {
        btnGuardar.disabled = false;
        btnGuardarTexto.textContent = personalEditando ? 'Actualizar' : 'Guardar';
    }
});

// ============ ELIMINAR ============
window.eliminarPersonal = async (id, nombre) => {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;
    
    try {
        const response = await fetch(`${API_URL}/personal/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al eliminar', 'error');
            return;
        }
        mostrarToast('Personal eliminado correctamente');
        cargarPersonal();
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
};

// ============ MODAL POLÍTICA ============
linkPolitica.addEventListener('click', (e) => {
    e.preventDefault();
    modalPolitica.classList.add('activo');
});
btnCerrarPolitica.addEventListener('click', () => modalPolitica.classList.remove('activo'));
btnCerrarPolitica2.addEventListener('click', () => modalPolitica.classList.remove('activo'));
modalPolitica.addEventListener('click', (e) => {
    if (e.target === modalPolitica) modalPolitica.classList.remove('activo');
});

// ============ INICIAR ============
document.addEventListener('DOMContentLoaded', cargarPersonal);
