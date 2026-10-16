// ============================================================
// VIGIA IA - Reconocimiento Facial con UI tipo "Scanner"
// ============================================================

const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const statusDiv = document.getElementById('status');
const btnText = document.getElementById('btnText');

let stream = null;
let isDetecting = false;
let scanLineY = 0;
let scanDirection = 1;

// ============ 1. CARGAR MODELOS ============
async function loadModels() {
    try {
        const modelPath = '../models';
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
            faceapi.nets.faceLandmark68Net.loadFromUri(modelPath)
        ]);
        statusDiv.textContent = "Modelos cargados. Iniciando cámara...";
        startVideo();
    } catch (error) {
        console.error("Error cargando modelos:", error);
        statusDiv.textContent = "Error al cargar la IA. Verifica la carpeta /models.";
        statusDiv.className = "status-err";
    }
}

// ============ 2. INICIAR CÁMARA ============
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
        statusDiv.textContent = "Buscando rostro...";
        statusDiv.className = "";
    } catch (err) {
        console.error("Error cámara:", err);
        statusDiv.textContent = "No se pudo acceder a la cámara.";
        statusDiv.className = "status-err";
    }
}

// ============ 3. LOOP DE DETECCIÓN ============
async function detectLoop() {
    if (!isDetecting) return;
    
    const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
    ).withFaceLandmarks();
    
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
    
    const resized = faceapi.resizeResults(detections, displaySize);
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    if (resized.length > 0) {
        // Tomamos solo el primer rostro detectado
        const det = resized[0];
        const box = det.detection.box;
        const landmarks = det.landmarks;
        
        // 1. Dibujar las 4 esquinas tipo scanner
    
        dibujarEsquinasScanner(ctx, box);
        
        // 2. Dibujar la línea de escaneo animada
    
        dibujarLineaEscaneo(ctx, box);

        // 3. Dibujar los puntos faciales (ojos, nariz, boca)
        dibujarPuntosFaciales(ctx, landmarks);

        // 4. Etiqueta con nombre
        dibujarEtiqueta(ctx, box, "Carlos Ramírez", "ACCESO PERMITIDO");

        // Actualizar estado
    
        statusDiv.textContent = "✅ ACCESO PERMITIDO - Carlos Ramírez";
        statusDiv.className = "status-ok";
    } else {
        statusDiv.textContent = "🔍 Buscando rostro...";
        statusDiv.className = "";
    }
    
    requestAnimationFrame(detectLoop);
}

// ============ 4. DIBUJAR ESQUINAS TIPO SCANNER ============
function dibujarEsquinasScanner(ctx, box) {
    const { x, y, width, height } = box;
    const cornerLength = Math.min(width, height) * 0.25; // Largo de cada esquina
    // const grosor = 4;

    const color = '#00E5FF';
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    ctx.lineCap = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    // Esquina superior izquierda

    ctx.beginPath();
    ctx.moveTo(x, y + cornerLength);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cornerLength, y);
    ctx.stroke();

    // Esquina superior derecha
    ctx.beginPath();
    ctx.moveTo(x + width - cornerLength, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + cornerLength);
    ctx.stroke();

    // Esquina inferior izquierda
    ctx.beginPath();
    ctx.moveTo(x, y + height - cornerLength);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + cornerLength, y + height);
    ctx.stroke();

    // Esquina inferior derecha
    ctx.beginPath();
    ctx.moveTo(x + width - cornerLength, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y + height - cornerLength);
    ctx.stroke();

    ctx.shadowBlur = 0;
}

// ============ 5. LÍNEA DE ESCANEO ANIMADA ============
function dibujarLineaEscaneo(ctx, box) {
    const { x, y, width, height } = box;
    // Movimiento de la línea

    scanLineY += scanDirection * 3;
    if (scanLineY >= height || scanLineY <= 0) {
        scanDirection *= -1;
    }
    
    const lineaY = y + scanLineY;
    
    // Gradiente horizontal

    const grad = ctx.createLinearGradient(x, lineaY, x + width, lineaY);
    grad.addColorStop(0, 'rgba(0, 229, 255, 0)');
    grad.addColorStop(0.5, 'rgba(0, 229, 255, 0.9)');
    grad.addColorStop(1, 'rgba(0, 229, 255, 0)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.moveTo(x, lineaY);
    ctx.lineTo(x + width, lineaY);
    ctx.stroke();

    ctx.shadowBlur = 0;
}

// ============ 6. PUNTOS FACIALES ============
function dibujarPuntosFaciales(ctx, landmarks) {
    const puntos = landmarks.positions;
    
    ctx.fillStyle = '#00FFB2';
    ctx.shadowColor = '#00FFB2';
    ctx.shadowBlur = 8;
    
    // Dibujar puntos principales (muestra cada 2 puntos para no saturar)

    puntos.forEach((p, i) => {
        if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    
    ctx.shadowBlur = 0;
}

// ============ 7. ETIQUETA CON NOMBRE ============
function dibujarEtiqueta(ctx, box, nombre, estado) {
    const { x, y, width } = box;
    const padding = 10;
    const fontSize = 14;
    
    ctx.font = `bold ${fontSize}px 'Poppins', sans-serif`;
    const textoAncho = ctx.measureText(nombre).width;
    const cajaAncho = textoAncho + padding * 2;
    const cajaAlto = 28;
    const cajaY = y - cajaAlto - 8;
    
    // Fondo de la etiqueta

    ctx.fillStyle = 'rgba(0, 229, 255, 0.9)';
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(x, cajaY, cajaAncho, cajaAlto, 6);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // Texto

    ctx.fillStyle = '#0A1628';
    ctx.textBaseline = 'middle';
    ctx.fillText(nombre, x + padding, cajaY + cajaAlto / 2);
}

// ============ 8. CONTROL DE CÁMARA ============
function toggleCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        isDetecting = false;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        statusDiv.textContent = "Cámara detenida.";
        statusDiv.className = "";
        btnText.textContent = "Iniciar Cámara";
    } else {
        startVideo();
        btnText.textContent = "Detener Cámara";
    }
}

// ============ INICIAR ============
document.addEventListener('DOMContentLoaded', loadModels);
