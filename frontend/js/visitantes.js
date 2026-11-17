// ============================================================
// VIGIA IA - Módulo Visitantes con Empresa y Salida
// ============================================================

const API_URL = 'http://localhost:3000/api';

let listaVisitantes = [];
let visitanteEditando = null;

// Elementos del DOM
const tablaVisitantes = document.getElementById('tablaVisitantes');
const buscador = document.getElementById('buscador');
const contadorVisitantes = document.getElementById('contadorVisitantes');
const modalVisitante = document.getElementById('modalVisitante');
const modalTitle = document.getElementById('modalTitle');
const btnNuevoVisitante = document.getElementById('btnNuevoVisitante');
const btnCerrarModal = document.getElementById('btnCerrarModal');
const btnCancelar = document.getElementById('btnCancelar');
const formVisitante = document.getElementById('formVisitante');
const btnGuardar = document.getElementById('btnGuardar');
const btnGuardarTexto = document.getElementById('btnGuardarTexto');
const toastVigia = document.getElementById('toastVigia');

// Inputs del formulario
const inputId = document.getElementById('visitanteId');
const inputNombre = document.getElementById('inputNombre');
const inputDocumento = document.getElementById('inputDocumento');
const inputEmpresa = document.getElementById('inputEmpresa');
const inputApartamento = document.getElementById('inputApartamento');
const inputPersonaVisitada = document.getElementById('inputPersonaVisitada');
const aceptoPolitica = document.getElementById('aceptoPolitica');

// Modal de política
const modalPolitica = document.getElementById('modalPolitica');
const linkPolitica = document.getElementById('linkPolitica');
const btnCerrarPolitica = document.getElementById('btnCerrarPolitica');
const btnCerrarPolitica2 = document.getElementById('btnCerrarPolitica2');

// ============ TOAST ============
function mostrarToast(mensaje, tipo = 'success') {
    toastVigia.textContent = mensaje;
    toastVigia.className = `toast-vigia ${tipo} activo`;
    setTimeout(() => { toastVigia.classList.remove('activo'); }, 3500);
}

// ============ CARGAR VISITANTES ============
async function cargarVisitantes() {
    try {
        const response = await fetch(`${API_URL}/visitantes`);
        const data = await response.json();
        if (!response.ok) {
            mostrarToast('Error al cargar visitantes', 'error');
            return;
        }
        listaVisitantes = data;
        renderizarTabla(data);
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
}

// ============ RENDERIZAR TABLA ============
function renderizarTabla(datos) {
    contadorVisitantes.textContent = `${datos.length} registro${datos.length === 1 ? '' : 's'}`;
    
    if (datos.length === 0) {
        tablaVisitantes.innerHTML = '<tr><td colspan="9" class="text-center text-muted" style="padding:2rem;">No hay visitantes registrados</td></tr>';
        return;
    }
    
    tablaVisitantes.innerHTML = datos.map(v => {
        const fechaEntrada = new Date(v.fecha_registro).toLocaleString('es-CO', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
        
        const fechaSalida = v.fecha_salida
        ? new Date(v.fecha_salida).toLocaleString('es-CO', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
        : '<span style="color:var(--amber-warm); font-size:0.75rem;">Sin salida</span>';

        // Botón de salida (solo si no tiene fecha_salida)
        const btnSalida = !v.fecha_salida
        ? `<button class="btn-accion salida" onclick="registrarSalida(${v.id}, '${v.nombre}')" title="Registrar salida">
        <i class="bi bi-box-arrow-right"></i>
        </button>`
        : `<span style="color:var(--mint-neon); font-size:0.9rem;" title="Salida registrada">
        <i class="bi bi-check-circle-fill"></i>
        </span>`;
        
        return `
        <tr>
            <td><span style="color:var(--silver-fog);">#${v.id}</span></td>
            <td><strong>${v.nombre}</strong></td>
            <td>${v.documento}</td>
            <td>${v.empresa || '<span style="color:var(--silver-fog);">-</span>'}</td>
            <td>${v.apartamento || '-'}</td>
            <td>${v.persona_visitada || '-'}</td>
            <td style="color:var(--silver-fog);font-size:0.8rem;">${fechaEntrada}</td>
            <td style="font-size:0.8rem;">${fechaSalida}</td>
            <td class="text-end">
            ${btnSalida}
            <button class="btn-accion editar" onclick="abrirEditar(${v.id})" title="Editar">
            <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-accion eliminar" onclick="eliminarVisitante(${v.id}, '${v.nombre}')" title="Eliminar">
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
        renderizarTabla(listaVisitantes);
        return;
    }
    const filtrados = listaVisitantes.filter(v =>
        v.nombre.toLowerCase().includes(termino) ||
        v.documento.toLowerCase().includes(termino) ||
        (v.empresa && v.empresa.toLowerCase().includes(termino)) ||
        (v.apartamento && v.apartamento.toLowerCase().includes(termino))
    );
    renderizarTabla(filtrados);
});

// ============ CONTROL DE MODAL ============
function abrirModal() { modalVisitante.classList.add('activo'); }
function cerrarModal() { modalVisitante.classList.remove('activo'); }

// ============ ABRIR MODAL CREAR ============
function abrirCrear() {
    visitanteEditando = null;
    modalTitle.textContent = 'Nuevo Visitante';
    btnGuardarTexto.textContent = 'Guardar';
    formVisitante.reset();
    inputId.value = '';
    abrirModal();
}

// ============ ABRIR MODAL EDITAR ============
window.abrirEditar = (id) => {
    const v = listaVisitantes.find(x => x.id === id);
    if (!v) return;
    
    visitanteEditando = v;
    modalTitle.textContent = 'Editar Visitante';
    btnGuardarTexto.textContent = 'Actualizar';
    
    inputId.value = v.id;
    inputNombre.value = v.nombre;
    inputDocumento.value = v.documento;
    inputEmpresa.value = v.empresa || '';
    inputApartamento.value = v.apartamento || '';
    inputPersonaVisitada.value = v.persona_visitada || '';
    aceptoPolitica.checked = true;
    
    abrirModal();
};

// Eventos del modal
btnNuevoVisitante.addEventListener('click', abrirCrear);
btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);
modalVisitante.addEventListener('click', (e) => {
    if (e.target === modalVisitante) cerrarModal();
});

// ============ ENVÍO DEL FORMULARIO ============
formVisitante.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const datos = {
        nombre: inputNombre.value.trim(),
        documento: inputDocumento.value.trim(),
        empresa: inputEmpresa.value.trim(),
        apartamento: inputApartamento.value.trim(),
        persona_visitada: inputPersonaVisitada.value.trim()
    };
    
    if (!datos.nombre || !datos.documento) {
        mostrarToast('Nombre y documento son obligatorios', 'error');
        return;
    }
    
    if (!aceptoPolitica.checked) {
        mostrarToast('Debes aceptar la política de tratamiento de datos', 'error');
        return;
    }
    
    btnGuardar.disabled = true;
    btnGuardarTexto.textContent = visitanteEditando ? 'Actualizando...' : 'Guardando...';
    
    try {
        const url = visitanteEditando
        ? `${API_URL}/visitantes/${visitanteEditando.id}`
        : `${API_URL}/visitantes`;
        const method = visitanteEditando ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al guardar', 'error');
            btnGuardar.disabled = false;
            btnGuardarTexto.textContent = visitanteEditando ? 'Actualizar' : 'Guardar';
            return;
        }
        
        mostrarToast(visitanteEditando ? 'Visitante actualizado correctamente' : 'Visitante creado correctamente');
        cerrarModal();
        cargarVisitantes();
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión con el servidor', 'error');
    } finally {
        btnGuardar.disabled = false;
        btnGuardarTexto.textContent = visitanteEditando ? 'Actualizar' : 'Guardar';
    }
});

// ============ REGISTRAR SALIDA ============
window.registrarSalida = async (id, nombre) => {
    if (!confirm(`¿Registrar salida de ${nombre}?`)) return;
    
    try {
        const response = await fetch(`${API_URL}/visitantes/${id}/salida`, {
            method: 'PUT'
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al registrar salida', 'error');
            return;
        }
        
        mostrarToast(`Salida de ${nombre} registrada correctamente`, 'success');
        cargarVisitantes();
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
};

// ============ ELIMINAR ============
window.eliminarVisitante = async (id, nombre) => {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;
    
    try {
        const response = await fetch(`${API_URL}/visitantes/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al eliminar', 'error');
            return;
        }
        
        mostrarToast('Visitante eliminado correctamente');
        cargarVisitantes();
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
document.addEventListener('DOMContentLoaded', cargarVisitantes);
