// ============================================================
// VIGIA IA - Módulo Accesos
// ============================================================

const API_URL = 'http://localhost:3000/api';

let listaAccesos = [];

// Elementos del DOM
const tablaAccesos = document.getElementById('tablaAccesos');
const contadorAccesos = document.getElementById('contadorAccesos');
const filtroTipo = document.getElementById('filtroTipo');
const filtroAccion = document.getElementById('filtroAccion');
const filtroFecha = document.getElementById('filtroFecha');
const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');

const modalAcceso = document.getElementById('modalAcceso');
const btnNuevoAcceso = document.getElementById('btnNuevoAcceso');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnCancelar = document.getElementById('btnCancelar');
const formAcceso = document.getElementById('formAcceso');
const btnGuardar = document.getElementById('btnGuardar');
const btnGuardarTexto = document.getElementById('btnGuardarTexto');
const toastVigia = document.getElementById('toastVigia');

// Inputs del formulario
const inputTipoUsuario = document.getElementById('inputTipoUsuario');
const inputUsuarioId = document.getElementById('inputUsuarioId');
const inputAccion = document.getElementById('inputAccion');

// ============ TOAST ============
function mostrarToast(mensaje, tipo = 'success') {
    toastVigia.textContent = mensaje;
    toastVigia.className = `toast-vigia ${tipo} activo`;
    setTimeout(() => {
        toastVigia.classList.remove('activo');
    }, 3500);
}

// ============ CARGAR ACCESOS ============
async function cargarAccesos() {
    try {
        const response = await fetch(`${API_URL}/reportes/accesos`);
        const data = await response.json();
        
        if (!response.ok) {
            mostrarToast('Error al cargar accesos', 'error');
            return;
        }
        
        listaAccesos = data;
        aplicarFiltros();
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
}

// ============ APLICAR FILTROS ============
function aplicarFiltros() {
    let filtrados = [...listaAccesos];
    
    const tipo = filtroTipo.value;
    const accion = filtroAccion.value;
    const fecha = filtroFecha.value;
    
    if (tipo) {
        filtrados = filtrados.filter(a => a.tipo_usuario === tipo);
    }
    
    if (accion) {
        filtrados = filtrados.filter(a => a.accion === accion);
    }
    
    if (fecha) {
        filtrados = filtrados.filter(a => {
            const f = new Date(a.fecha_hora).toISOString().split('T')[0];
            return f === fecha;
        });
    }
    
    renderizarTabla(filtrados);
}

// ============ RENDERIZAR TABLA ============
function renderizarTabla(datos) {
    contadorAccesos.textContent = `${datos.length} registro${datos.length === 1 ? '' : 's'}`;
    
    if (datos.length === 0) {
        tablaAccesos.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:2rem;">No hay accesos registrados</td></tr>';
        return;
    }
    
    tablaAccesos.innerHTML = datos.map(a => {
        const fecha = new Date(a.fecha_hora).toLocaleString('es-CO', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        
        const tipoClass = a.tipo_usuario === 'PERSONAL' ? 'personal' : 'visitante';
        const accionClass = a.accion === 'INGRESO' ? 'ingreso' : 'salida';
        
        return `
            <tr>
                <td><span style="color:var(--silver-fog);">#${a.id}</span></td>
                <td><strong>${a.nombre_usuario}</strong></td>
                <td><span class="badge-tipo ${tipoClass}">${a.tipo_usuario}</span></td>
                <td><span class="badge-accion ${accionClass}">${a.accion}</span></td>
                <td style="color:var(--silver-fog);font-size:0.8rem;">${fecha}</td>
                <td class="text-end">
                <button class="btn-accion eliminar" onclick="eliminarAcceso(${a.id})" title="Eliminar">
                <i class="bi bi-trash"></i>
                </button>
                </td>
            </tr>
            `;
        }).join('');
    }

// ============ FILTROS ============
filtroTipo.addEventListener('change', aplicarFiltros);
filtroAccion.addEventListener('change', aplicarFiltros);
filtroFecha.addEventListener('change', aplicarFiltros);

btnLimpiarFiltros.addEventListener('click', () => {
    filtroTipo.value = '';
    filtroAccion.value = '';
    filtroFecha.value = '';
    aplicarFiltros();
});

// ============ MODAL ============
function abrirModal() {
    modalAcceso.classList.add('activo');
}

function cerrarModal() {
    modalAcceso.classList.remove('activo');
}

btnNuevoAcceso.addEventListener('click', () => {
    formAcceso.reset();
    abrirModal();
});

btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);

modalAcceso.addEventListener('click', (e) => {
    if (e.target === modalAcceso) cerrarModal();
});

// ============ ENVÍO DEL FORMULARIO ============
formAcceso.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datos = {
        tipo_usuario: inputTipoUsuario.value,
        usuario_id: parseInt(inputUsuarioId.value),
        accion: inputAccion.value
    };
    
    if (!datos.tipo_usuario || !datos.usuario_id || !datos.accion) {
        mostrarToast('Todos los campos son obligatorios', 'error');
        return;
    }
    
    btnGuardar.disabled = true;
    btnGuardarTexto.textContent = 'Registrando...';
    
    try {
        const response = await fetch(`${API_URL}/accesos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al registrar', 'error');
            btnGuardar.disabled = false;
            btnGuardarTexto.textContent = 'Registrar';
            return;
        }
        
        mostrarToast('Acceso registrado correctamente');
        cerrarModal();
        cargarAccesos();

    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    } finally {
        btnGuardar.disabled = false;
        btnGuardarTexto.textContent = 'Registrar';
    }
});

// ============ ELIMINAR ============
window.eliminarAcceso = async (id) => {
    if (!confirm('¿Eliminar este registro de acceso? Esta acción no se puede deshacer.')) return;
    
    try {
        const response = await fetch(`${API_URL}/accesos/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al eliminar', 'error');
            return;
        }
        
        mostrarToast('Acceso eliminado correctamente');
        cargarAccesos();
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
};

// ============ INICIAR ============
document.addEventListener('DOMContentLoaded', cargarAccesos);
