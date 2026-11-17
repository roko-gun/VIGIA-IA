// ============================================================
// VIGIA IA - Residentes con Captura de Rostro
// ============================================================

const API_URL = 'http://localhost:3000/api';
const MODEL_PATH = '../models';

let listaResidentes = [];
let residenteEditando = null;
let descriptorCapturado = null;
let idResidenteParaRostro = null;

// DOM
const tablaResidentes = document.getElementById('tablaResidentes');
const buscador = document.getElementById('buscador');
const contadorResidentes = document.getElementById('contadorResidentes');
const modalResidente = document.getElementById('modalResidente');
const modalTitle = document.getElementById('modalTitle');
const btnNuevoResidente = document.getElementById('btnNuevoResidente');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnCancelar = document.getElementById('btnCancelar');
const formResidente = document.getElementById('formResidente');
const btnGuardar = document.getElementById('btnGuardar');
const btnGuardarTexto = document.getElementById('btnGuardarTexto');
const toastVigia = document.getElementById('toastVigia');

const inputId = document.getElementById('residenteId');
const inputNombre = document.getElementById('inputNombre');
const inputDocumento = document.getElementById('inputDocumento');
const inputApartamento = document.getElementById('inputApartamento');
const inputTorre = document.getElementById('inputTorre');
const inputTelefono = document.getElementById('inputTelefono');
const inputCorreo = document.getElementById('inputCorreo');
const aceptoPolitica = document.getElementById('aceptoPolitica');

const estadoRostro = document.getElementById('estadoRostro');
const btnCapturarRostro = document.getElementById('btnCapturarRostro');
const modalCaptura = document.getElementById('modalCaptura');
const btnCerrarCaptura = document.getElementById('btnCerrarCaptura');
const btnCancelarCaptura = document.getElementById('btnCancelarCaptura');
const btnTomarFoto = document.getElementById('btnTomarFoto');
const videoCaptura = document.getElementById('videoCaptura');
const overlayCaptura = document.getElementById('overlayCaptura');
const statusCaptura = document.getElementById('statusCaptura');

const modalPolitica = document.getElementById('modalPolitica');
const linkPolitica = document.getElementById('linkPolitica');
const btnCerrarPolitica = document.getElementById('btnCerrarPolitica');
const btnCerrarPolitica2 = document.getElementById('btnCerrarPolitica2');

let streamCaptura = null;
let modelosCargados = false;
let detectando = false;

// TOAST
function mostrarToast(mensaje, tipo = 'success') {
    toastVigia.textContent = mensaje;
    toastVigia.className = `toast-vigia ${tipo} activo`;
    setTimeout(() => { toastVigia.classList.remove('activo'); }, 3500);
}

// CARGAR
async function cargarResidentes() {
    try {
        const response = await fetch(`${API_URL}/residentes`);
        const data = await response.json();
        if (!response.ok) {
            mostrarToast('Error al cargar residentes', 'error');
            return;
        }
        listaResidentes = data;
        renderizarTabla(data);
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
}

// TABLA
function renderizarTabla(datos) {
    contadorResidentes.textContent = `${datos.length} registro${datos.length === 1 ? '' : 's'}`;
    
    if (datos.length === 0) {
        tablaResidentes.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding:2rem;">No hay residentes registrados</td></tr>';
        return;
    }
    
    tablaResidentes.innerHTML = datos.map(r => {
        const rostroIcon = r.descriptor_facial
        ? '<i class="bi bi-check-circle-fill" style="color: var(--mint-neon); font-size: 1.2rem;" title="Rostro registrado"></i>'
        : '<i class="bi bi-x-circle" style="color: var(--silver-fog); font-size: 1.2rem;" title="Sin rostro registrado"></i>';
        
        return `
        <tr>
            <td><span style="color:var(--silver-fog);">#${r.id}</span></td>
            <td class="text-center">${rostroIcon}</td>
            <td><strong>${r.nombre}</strong></td>
            <td>${r.documento}</td>
            <td>${r.apartamento}</td>
            <td>${r.torre || '-'}</td>
            <td>${r.telefono || '-'}</td>
            <td>${r.correo || '-'}</td>
            <td class="text-end">
            <button class="btn-accion editar" onclick="abrirEditar(${r.id})" title="Editar"><i class="bi bi-pencil"></i></button>
            <button class="btn-accion eliminar" onclick="eliminarResidente(${r.id}, '${r.nombre}')" title="Eliminar"><i class="bi bi-trash"></i></button>
            </td>
        </tr>
        `;
    }).join('');
}

// BUSCADOR
buscador.addEventListener('input', (e) => {
    const t = e.target.value.toLowerCase().trim();
    if (!t) return renderizarTabla(listaResidentes);
    const f = listaResidentes.filter(r =>
        r.nombre.toLowerCase().includes(t) ||
        r.documento.toLowerCase().includes(t) ||
        (r.apartamento && r.apartamento.toLowerCase().includes(t))
    );
    renderizarTabla(f);
});

// MODAL
function abrirModal() { modalResidente.classList.add('activo'); }
function cerrarModal() { modalResidente.classList.remove('activo'); }

function abrirCrear() {
    residenteEditando = null;
    descriptorCapturado = null;
    idResidenteParaRostro = null;
    modalTitle.textContent = 'Nuevo Residente';
    btnGuardarTexto.textContent = 'Guardar';
    formResidente.reset();
    inputId.value = '';
    estadoRostro.textContent = 'Sin rostro registrado';
    estadoRostro.style.color = 'var(--silver-fog)';
    abrirModal();
}

window.abrirEditar = (id) => {
    const r = listaResidentes.find(x => x.id === id);
    if (!r) return;
    residenteEditando = r;
    descriptorCapturado = null;
    idResidenteParaRostro = r.id;
    modalTitle.textContent = 'Editar Residente';
    btnGuardarTexto.textContent = 'Actualizar';
    inputId.value = r.id;
    inputNombre.value = r.nombre;
    inputDocumento.value = r.documento;
    inputApartamento.value = r.apartamento;
    inputTorre.value = r.torre || '';
    inputTelefono.value = r.telefono || '';
    inputCorreo.value = r.correo || '';
    aceptoPolitica.checked = true;
    if (r.descriptor_facial) {
        estadoRostro.textContent = '✓ Rostro registrado';
        estadoRostro.style.color = 'var(--mint-neon)';
    } else {
        estadoRostro.textContent = 'Sin rostro registrado';
        estadoRostro.style.color = 'var(--silver-fog)';
    }
    abrirModal();
};

btnNuevoResidente.addEventListener('click', abrirCrear);
btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);
modalResidente.addEventListener('click', (e) => { if (e.target === modalResidente) cerrarModal(); });

// CAPTURA ROSTRO
btnCapturarRostro.addEventListener('click', () => {
    if (!residenteEditando && !inputId.value) {
        if (!inputNombre.value.trim() || !inputDocumento.value.trim() || !inputApartamento.value.trim()) {
            mostrarToast('Completa nombre, documento y apartamento antes de capturar', 'error');
            return;
        }
        if (!aceptoPolitica.checked) {
            mostrarToast('Acepta la política antes de capturar el rostro', 'error');
            return;
        }
        guardarResidenteYContinuar();
        return;
    }
    idResidenteParaRostro = residenteEditando ? residenteEditando.id : inputId.value;
    abrirModalCaptura();
});

async function guardarResidenteYContinuar() {
    const datos = {
        nombre: inputNombre.value.trim(),
        documento: inputDocumento.value.trim(),
        apartamento: inputApartamento.value.trim(),
        torre: inputTorre.value.trim(),
        telefono: inputTelefono.value.trim(),
        correo: inputCorreo.value.trim()
    };
    try {
        const response = await fetch(`${API_URL}/residentes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const result = await response.json();
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al guardar', 'error');
            return;
        }
        
        residenteEditando = { id: result.id };
        inputId.value = result.id;
        idResidenteParaRostro = result.id;
        mostrarToast('Residente guardado. Captura el rostro', 'success');
        abrirModalCaptura();
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
}

// MODAL CÁMARA
async function abrirModalCaptura() {
    modalCaptura.classList.add('activo');
    statusCaptura.textContent = 'Cargando modelos...';
    if (!modelosCargados) {
        try {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_PATH),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH)
            ]);
            modelosCargados = true;
        } catch (error) {
            console.error(error);
            statusCaptura.textContent = 'Error al cargar modelos';
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
        console.error(err);
        statusCaptura.textContent = 'No se pudo acceder a la cámara';
        statusCaptura.style.color = 'var(--red-alert)';
    }
}

async function detectarRostro() {
    if (!detectando) return;
    const detections = await faceapi.detectSingleFace(
        videoCaptura,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 })
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
        statusCaptura.textContent = '✓ Rostro detectado. Captura la foto';
        statusCaptura.style.color = 'var(--mint-neon)';
        btnTomarFoto.disabled = false;
    } else {
        statusCaptura.textContent = 'Buscando rostro...';
        statusCaptura.style.color = 'var(--silver-fog)';
        btnTomarFoto.disabled = true;
    }
    requestAnimationFrame(detectarRostro);
}

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
        descriptorCapturado = JSON.stringify(Array.from(detection.descriptor));
        detenerCamara();
        cerrarModalCaptura();
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

// GUARDAR FORMULARIO
formResidente.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        nombre: inputNombre.value.trim(),
        documento: inputDocumento.value.trim(),
        apartamento: inputApartamento.value.trim(),
        torre: inputTorre.value.trim(),
        telefono: inputTelefono.value.trim(),
        correo: inputCorreo.value.trim()
    };
    if (!datos.nombre || !datos.documento || !datos.apartamento) {
        mostrarToast('Nombre, documento y apartamento son obligatorios', 'error');
        return;
    }
    if (!aceptoPolitica.checked) {
        mostrarToast('Debes aceptar la política de tratamiento de datos', 'error');
        return;
    }
    btnGuardar.disabled = true;
    btnGuardarTexto.textContent = residenteEditando ? 'Actualizando...' : 'Guardando...';
    try {
        const url = residenteEditando ? `${API_URL}/residentes/${residenteEditando.id}` : `${API_URL}/residentes`;
        const method = residenteEditando ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        const result = await response.json();
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al guardar', 'error');
            btnGuardar.disabled = false;
            btnGuardarTexto.textContent = residenteEditando ? 'Actualizar' : 'Guardar';
            return;
        }
        const idFinal = residenteEditando ? residenteEditando.id : result.id;
        if (descriptorCapturado && idFinal) {
            await fetch(`${API_URL}/residentes/${idFinal}/rostro`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descriptor: descriptorCapturado })
            });
        }
        mostrarToast(residenteEditando ? 'Residente actualizado' : 'Residente creado');
        descriptorCapturado = null;
        cerrarModal();
        cargarResidentes();
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    } finally {
        btnGuardar.disabled = false;
        btnGuardarTexto.textContent = residenteEditando ? 'Actualizar' : 'Guardar';
    }
});

// ELIMINAR
window.eliminarResidente = async (id, nombre) => {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return;
    try {
        const response = await fetch(`${API_URL}/residentes/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al eliminar', 'error');
            return;
        }
        mostrarToast('Residente eliminado');
        cargarResidentes();
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
};

// MODAL POLÍTICA
linkPolitica.addEventListener('click', (e) => { e.preventDefault(); modalPolitica.classList.add('activo'); });
btnCerrarPolitica.addEventListener('click', () => modalPolitica.classList.remove('activo'));
btnCerrarPolitica2.addEventListener('click', () => modalPolitica.classList.remove('activo'));
modalPolitica.addEventListener('click', (e) => { if (e.target === modalPolitica) modalPolitica.classList.remove('activo'); });

// INICIAR
document.addEventListener('DOMContentLoaded', cargarResidentes);

