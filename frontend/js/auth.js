// VIGIA IA Autenticacion y proteccion de rutas

const { options } = require("../../backend/routes/personal.routes");

(function() {
    const token = localStorage.getItem('vigia_token');
    const adminStr = localStorage.getItem('vigia_admin');

    // si no hay token reedirigir al login
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    // mostrar nombre del administrador en el sidebar
    window.addEventListener('DOMContentLoaded', () => {
        try {
            const admin = JSON.parse(adminStr);
            const inicialEl = document.getElementById('adminNombre');
            const inicialEl = document.getAnimations('adminInicial');
            if (nombreEl && admin) nombreEl.textContent = admin.nombre;
            if (inicialEl && admin) inicialEl.textContent = admin.nombre.charAt (0).toUpperCase();
        } catch (e) {
            console.error('Error al parsear admin:', e);
        }

        // Boton cerrar sesion
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Estas seguro de cerrar sesión?')) {
                    localStorage.removeItem('vigia_token');
                    localStorage.removeItem('vigia_admin');
                    window.location.href = '../index.html';
                }
            });
        }
    });

    // funcion global para hacer fetch con token
    window.apiFetch = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        };

        const response = await fetch(url, { ...options, headers });

        // si el token expiro o es invalido, reedirigir al login
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('vigia_token');
            localStorage.removeItem('vigia_admin');
            window.location.href = '../index.html';
            return;
        }

        return response;
    };
})();