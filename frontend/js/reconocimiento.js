// ============================================================
// VIGIA IA - Reconocimiento Facial Unificado
// ============================================================

const API_URL = 'https://vigia-ia-1.onrender.com/api';
const MODEL_PATH = '../models';

const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const statusDiv = document.getElementById('status');
const resultadoDiv = document.getElementById('resultado');
const btnText = document.getElementById('btnText');
const btnToggleCamara = document.getElementById('btnToggleCamara');
const totalRostrosEl = document.getElementById('totalRostros');
const toastVigia = document.getElementById('toastVigia');

let stream = null;
let isDetecting = false;
let faceMatcher = null;
let rostrosRegistrados = 0;

// Control de estado por persona
let estadoPersonas = {}; // { "PERSONAL_11": { accion, timestamp } }
let procesando = {};     // { "PERSONAL_11": true }
let tiempoSinRostro = null;
let ultimaKeyDetectada = null;

// ============ TOAST ============
function mostrarToast(mensaje, tipo = 'success') {
    toastVigia.textContent = mensaje;
    toastVigia.className = `toast-vigia ${tipo} activo`;
    setTimeout(() => { toastVigia.classList.remove('activo'); }, 3500);
}

// ============ 1. INICIALIZAR ============
async function inicializar() {
    try {
        statusDiv.textContent = 'Cargando modelos de IA...';
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_PATH),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_PATH),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_PATH)
        ]);
        
        statusDiv.textContent = 'Cargando rostros registrados...';
        await cargarRostros();
        
        statusDiv.textContent = 'Iniciando cámara...';
        startVideo();
    } catch (error) {
        console.error('Error inicializando:', error);
        statusDiv.textContent = 'Error al cargar los modelos de IA';
        statusDiv.style.color = 'var(--red-alert)';
    }
}

// ============ 2. CARGAR ROSTROS ============
async function cargarRostros() {
    try {
        const response = await fetch(`${API_URL}/rostros/todos`);
        const rostros = await response.json();
        if (!response.ok) throw new Error('Error al cargar rostros');
        
        const validos = rostros.filter(r => {
            if (!r.descriptor_facial) return false;
            try {
                const d = JSON.parse(r.descriptor_facial);
                return Array.isArray(d) && d.length === 128;
            } catch (e) { return false; }
        });
        
        if (validos.length === 0) {
            statusDiv.textContent = 'No hay rostros registrados en el sistema';
            statusDiv.style.color = 'var(--amber-warm)';
            totalRostrosEl.innerHTML = '<i class="bi bi-people-fill"></i> 0 rostros registrados';
            return;
        }
        
        const labeledDescriptors = validos.map(r => {
            const descriptor = JSON.parse(r.descriptor_facial);
            const label = `${r.tipo}|${r.id}|${r.nombre}`;
            return new faceapi.LabeledFaceDescriptors(label, [new Float32Array(descriptor)]);
        });
        
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
        rostrosRegistrados = validos.length;
        
        totalRostrosEl.innerHTML = `<i class="bi bi-people-fill"></i> ${rostrosRegistrados} rostro${rostrosRegistrados === 1 ? '' : 's'} registrado${rostrosRegistrados === 1 ? '' : 's'}`;
        mostrarToast(`${rostrosRegistrados} rostros cargados correctamente`, 'success');

    } catch (error) {
        console.error('Error cargando rostros:', error);
        mostrarToast('Error al cargar los rostros', 'error');
    }
}

// ============ 3. INICIAR CÁMARA ============
async function startVideo() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: 'user' }
        });
        video.srcObject = stream;
        video.addEventListener('play', () => {
            isDetecting = true;
            detectLoop();
        });
        statusDiv.textContent = 'Buscando rostro...';
        statusDiv.style.color = 'var(--silver-fog)';
        btnText.textContent = 'Detener Cámara';
    } catch (err) {
        console.error('Error cámara:', err);
        statusDiv.textContent = 'No se pudo acceder a la cámara';
        statusDiv.style.color = 'var(--red-alert)';
    }
}

// ============ 4. LOOP DE DETECCIÓN ============
async function detectLoop() {
    if (!isDetecting) return;
    
    const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptors();
    
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
    
    const resized = faceapi.resizeResults(detections, displaySize);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (resized.length > 0) {
        if (tiempoSinRostro) {
            clearTimeout(tiempoSinRostro);
            tiempoSinRostro = null;
        }
        
        const det = resized[0];
        const box = det.detection.box;
        
        if (faceMatcher) {
            const match = faceMatcher.findBestMatch(det.descriptor);
            const umbral = 0.6;
            
            if (match.label !== 'unknown' && match.distance < umbral) {
                const [tipo, id, nombre] = match.label.split('|');
                const key = `${tipo}_${id}`;
                const color = tipo === 'PERSONAL' ? '#00E5FF' : '#00FFB2';

                // Dibujar el box siempre
                dibujarBox(ctx, box, color);

                // Si ya tenemos una acción registrada para esta persona, mostrarla
                if (estadoPersonas[key]) {
                    const accion = estadoPersonas[key].accion;
                    const colorAccion = accion === 'INGRESO' ? '#00FFB2' : '#FF3B5C';

                    dibujarBox(ctx, box, colorAccion);
                    dibujarEtiqueta(ctx, box, nombre, tipo, accion, colorAccion);
                    
                    statusDiv.textContent = `✅ ${tipo} identificado`;
                    statusDiv.style.color = 'var(--mint-neon)';
                    resultadoDiv.textContent = `${nombre} — ${accion}`;
                    resultadoDiv.style.color = colorAccion;
                } else if (!procesando[key]) {
                    // Primera vez: procesar
                    procesando[key] = true;
                    dibujarEtiqueta(ctx, box, nombre, tipo, 'PROCESANDO...', color);
                    statusDiv.textContent = '⏳ Procesando...';
                    statusDiv.style.color = 'var(--cyan-electric)';
                    resultadoDiv.textContent = nombre;
                    resultadoDiv.style.color = 'var(--silver-fog)';
                    
                    registrarAcceso(key, id, nombre, tipo);
                } else {
                    // Aún procesando
                    dibujarEtiqueta(ctx, box, nombre, tipo, 'PROCESANDO...', color);
                    statusDiv.textContent = '⏳ Procesando...';
                    statusDiv.style.color = 'var(--cyan-electric)';
                    resultadoDiv.textContent = nombre;
                    resultadoDiv.style.color = 'var(--silver-fog)';
                }
            } else {
                // Desconocido
                dibujarBox(ctx, box, '#FF3B5C');
                dibujarEtiqueta(ctx, box, 'Desconocido', '', 'ACCESO DENEGADO', '#FF3B5C');
                statusDiv.textContent = '❌ Persona no registrada';
                statusDiv.style.color = 'var(--red-alert)';
                resultadoDiv.textContent = '';
            }
        }
    } else {
        // Sin rostro: limpiar después de 2 segundos
        if (!tiempoSinRostro) {
            tiempoSinRostro = setTimeout(() => {
                statusDiv.textContent = '🔍 Buscando rostro...';
                statusDiv.style.color = 'var(--silver-fog)';
                resultadoDiv.textContent = '';
                tiempoSinRostro = null;
                // Resetear estados para permitir nueva detección
                estadoPersonas = {};
                procesando = {};
            }, 2000);
        }
    }
    
    requestAnimationFrame(detectLoop);
}

// ============ 5. REGISTRAR ACCESO ============
async function registrarAcceso(key, id, nombre, tipo) {
    try {
        // 1. Consultar último acceso
        const respUltimo = await fetch(`${API_URL}/accesos/ultimo/${tipo}/${id}`);
        const ultimo = await respUltimo.json();

        // 2. Determinar acción
        const accion = (ultimo.accion === 'INGRESO') ? 'SALIDA' : 'INGRESO';

        // 3. Registrar en el backend
        const response = await fetch(`${API_URL}/accesos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo_usuario: tipo,
                usuario_id: parseInt(id),
                accion: accion
            })
        
        });
        
        if (response.ok) {
            // 4. Guardar el estado para mostrarlo en pantalla
            estadoPersonas[key] = { accion: accion, timestamp: Date.now() };
            procesando[key] = false;
            mostrarToast(`${nombre} — ${accion} registrado`, 'success');
        } else {
            procesando[key] = false;
            mostrarToast('Error al registrar el acceso', 'error');
        }
    } catch (error) {
        console.error('Error registrando acceso:', error);
        procesando[key] = false;
        mostrarToast('Error de conexión', 'error');
    }
}

// ============ 6. DIBUJAR BOX ============
function dibujarBox(ctx, box, color) {
    const { x, y, width, height } = box;
    const cornerLength = Math.min(width, height) * 0.25;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    
    ctx.beginPath(); ctx.moveTo(x, y + cornerLength); ctx.lineTo(x, y); ctx.lineTo(x + cornerLength, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + width - cornerLength, y); ctx.lineTo(x + width, y); ctx.lineTo(x + width, y + cornerLength); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + height - cornerLength); ctx.lineTo(x, y + height); ctx.lineTo(x + cornerLength, y + height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + width - cornerLength, y + height); ctx.lineTo(x + width, y + height); ctx.lineTo(x + width, y + height - cornerLength); ctx.stroke();
    
    ctx.shadowBlur = 0;
}

// ============ 7. ETIQUETA ============
function dibujarEtiqueta(ctx, box, nombre, tipo, accion, color) {
    const { x, y } = box;
    const padding = 10;
    const cajaAlto = 48;
    const cajaY = y - cajaAlto - 8;
    
    ctx.font = 'bold 14px "Poppins", sans-serif';
    const textoAncho = Math.max(ctx.measureText(nombre).width, ctx.measureText(`${tipo} — ${accion}`).width);
    const cajaAncho = textoAncho + padding * 2;
    
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(x, cajaY, cajaAncho, cajaAlto, 6);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#0A1628';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 14px "Poppins", sans-serif';
    ctx.fillText(nombre, x + padding, cajaY + 14);
    
    ctx.font = 'bold 10px "Poppins", sans-serif';
    ctx.fillText(`${tipo} — ${accion}`, x + padding, cajaY + 32);
}

// ============ 8. TOGGLE CÁMARA ============
btnToggleCamara.addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        isDetecting = false;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        statusDiv.textContent = 'Cámara detenida.';
        statusDiv.style.color = 'var(--silver-fog)';
        resultadoDiv.textContent = '';
        btnText.textContent = 'Iniciar Cámara';
    } else {
        startVideo();
        btnText.textContent = 'Detener Cámara';
    }
});

// ============ INICIAR ============
document.addEventListener('DOMContentLoaded', inicializar);
