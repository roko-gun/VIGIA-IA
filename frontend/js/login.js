const API_URL = 'http://localhost:3000/api';

const loginForm = document.getElementById('loginForm');
const correoInput = document.getElementById('correo');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const alertMessage = document.getElementById('alertMessage');
const togglePassword = document.getElementById('togglePassword');
const toggleIcon = document.getElementById('toggleIcon');
const recordarmeCheck = document.getElementById('recordarme');

// ========== mostrar/ocultar contraseña ====================
togglePassword.addEventListener('click', () => {
    const tipo = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = tipo;

    toggleIcon.classList.toggle('bi-eye');
    toggleIcon.classList.toggle('bi-eye-slash');
});

// ========== mostrar alertas ============
function mostrarAlerta(mensaje, tipo = 'error') {
    alertMessage.textContent = mensaje;
    alertMessage.className = `alert-message ${tipo}`;

    setTimeout(() => {
        alertMessage.className = 'alert-message';
    }, 5000);
}

// ========== cargar correo recordado ============

window.addEventListener('DOMContentLoaded', () => {
    const correoGuardado = localStorage.getItem('vigia_correo_recordado');
    if (correoGuardado) {
        correoInput.value = correoGuardado;
        recordarmeCheck.checked = true;
    }

    const token = localStorage.getItem('vigia_token');
    if (token) {
        window.location.href = 'pages/dashboard.html';
    }
});

// ========== envio del formulario ==========
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = correoInput.value.trim();
    const password = passwordInput.value;

    if (!correo || !password) {
        mostrarAlerta('Por favor completa todos los campos');
        return;
    }

    btnLogin.disabled = true;
    btnLogin.innerHTML = '<span class="spinner"></span><span>Validando...</span>';

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, password })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarAlerta(data.mensaje || 'Credenciales incorrectas');
            btnLogin.disabled = false;
            btnLogin.innerHTML = 'i class="bi bi-box-arrow-in-right"></i><span>Iniciar Sesión</span>';
            return;
        }

        localStorage.setItem('vigia_token', data.token);
        localStorage.setItem('vigia_admin', JSON.stringify(data.administrador));

        if (recordarmeCheck.checked) {
            localStorage.setItem('vigia_correo_recordado', correo);
        } else {
            localStorage.removeItem('vigia_correo_recordado');
        }

        mostrarAlerta('Acceso autorizado. Redirigiendo...', 'success');

        setTimeout(() => {
            window.location.href = 'pages/dashboard.html';
        }, 800);

    } catch (error) {
        console.error('Error al iniciar sesion: ', error);
        mostrarAlerta('No se pudo conectar con el servidor. Verifica que el backend este activo.');
        btnLogin.disabled = false;
        btnLogin.innerHTML = '<i class="bi bi-box-arrow-in-right"></i><span>Iniciar Sesión</span>';
    }
});