// ============================================================
// VIGIA IA - Autenticación y protección de rutas
// ============================================================

(function() {
    const token = localStorage.getItem('vigia_token');
    const adminStr = localStorage.getItem('vigia_admin');

  // Si no hay token, redirigir al login
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

  // Esperar a que cargue el DOM
        window.addEventListener('DOMContentLoaded', () => {

    // Mostrar nombre del administrador en el sidebar
    try {
        const admin = JSON.parse(adminStr);
        
        const nombreEl = document.getElementById('adminNombre');
        const inicialEl = document.getElementById('adminInicial');
        
        if (nombreEl && admin) nombreEl.textContent = admin.nombre;
        if (inicialEl && admin) inicialEl.textContent = admin.nombre.charAt(0).toUpperCase();
    } catch (e) {
        console.error('Error al parsear admin:', e);
    }

    // Botón cerrar sesión
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Estás seguro de cerrar sesión?')) {
                localStorage.removeItem('vigia_token');
                localStorage.removeItem('vigia_admin');
                window.location.href = '../index.html';
            }
        });
    }
});

  // Función global para hacer fetch con token
window.apiFetch = async (url, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('vigia_token');
        localStorage.removeItem('vigia_admin');
        window.location.href = '../index.html';
        return;
    
    }
    
    return response;
};
})();
