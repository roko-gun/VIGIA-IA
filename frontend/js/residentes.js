// ============================================================
// VIGIA IA - Módulo Residentes (CRUD)
// ============================================================

const API_URL = 'http://localhost:3000/api';

let listaResidentes = [];
let residenteEditando = null;

// Elementos del DOM
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

// Inputs del formulario
const inputId = document.getElementById('residenteId');
const inputNombre = document.getElementById('inputNombre');
const inputDocumento = document.getElementById('inputDocumento');
const inputApartamento = document.getElementById('inputApartamento');
const inputTorre = document.getElementById('inputTorre');
const inputTelefono = document.getElementById('inputTelefono');
const inputCorreo = document.getElementById('inputCorreo');
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
    setTimeout(() => {
        toastVigia.classList.remove('activo');
    }, 3500);
}

// ============ CARGAR RESIDENTES ============
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

// ============ RENDERIZAR TABLA ============
function renderizarTabla(datos) {
    contadorResidentes.textContent = `${datos.length} registro${datos.length === 1 ? '' : 's'}`;
    
    if (datos.length === 0) {
        tablaResidentes.innerHTML = '<tr><td colspan="8" class="text-center text-muted" style="padding:2rem;">No hay residentes registrados</td></tr>';
        return;
    }
    
    tablaResidentes.innerHTML = datos.map(r => `
        <tr>
            <td><span style="color:var(--silver-fog);">#${r.id}</span></td>
            <td><strong>${r.nombre}</strong></td>
            <td>${r.documento}</td>
            <td>${r.apartamento}</td>
            <td>${r.torre || '-'}</td>
            <td>${r.telefono || '-'}</td>
            <td>${r.correo || '-'}</td>
            <td class="text-end">
            <button class="btn-accion editar" onclick="abrirEditar(${r.id})" title="Editar">
            <i class="bi bi-pencil"></i>
            </button>
            <button class="btn-accion eliminar" onclick="eliminarResidente(${r.id}, '${r.nombre}')" title="Eliminar">
            <i class="bi bi-trash"></i>
            </button>
            </td>
        </tr>
        `).join('');
    }

// ============ BUSCADOR ============
buscador.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase().trim();
    
    if (!termino) {
        renderizarTabla(listaResidentes);
        return;
    }
    
    const filtrados = listaResidentes.filter(r =>
        r.nombre.toLowerCase().includes(termino) ||
        r.documento.toLowerCase().includes(termino) ||
        r.apartamento.toLowerCase().includes(termino)
    );
    
    renderizarTabla(filtrados);
});

// ============ CONTROL DE MODAL ============
function abrirModal() {
    modalResidente.classList.add('activo');
}

function cerrarModal() {
    modalResidente.classList.remove('activo');
}

// ============ ABRIR MODAL CREAR ============
function abrirCrear() {
    residenteEditando = null;
    modalTitle.textContent = 'Nuevo Residente';
    btnGuardarTexto.textContent = 'Guardar';
    formResidente.reset();
    inputId.value = '';
    abrirModal();
}

// ============ ABRIR MODAL EDITAR ============
window.abrirEditar = (id) => {
    const r = listaResidentes.find(x => x.id === id);
    if (!r) return;
    
    residenteEditando = r;
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
    
    abrirModal();
};

// Eventos del modal
btnNuevoResidente.addEventListener('click', abrirCrear);
btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);

modalResidente.addEventListener('click', (e) => {
    if (e.target === modalResidente) cerrarModal();
});

// ============ ENVÍO DEL FORMULARIO ============
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
        const url = residenteEditando
        ? `${API_URL}/residentes/${residenteEditando.id}`
        : `${API_URL}/residentes`;
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
        
        mostrarToast(residenteEditando ? 'Residente actualizado correctamente' : 'Residente creado correctamente');
        cerrarModal();
        cargarResidentes();

    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión con el servidor', 'error');
    } finally {
        btnGuardar.disabled = false;
        btnGuardarTexto.textContent = residenteEditando ? 'Actualizar' : 'Guardar';
    }
});

// ============ ELIMINAR ============
window.eliminarResidente = async (id, nombre) => {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;
    
    try {
        const response = await fetch(`${API_URL}/residentes/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (!response.ok) {
            mostrarToast(result.mensaje || 'Error al eliminar', 'error');
            return;
        }
        
        mostrarToast('Residente eliminado correctamente');
        cargarResidentes();
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
document.addEventListener('DOMContentLoaded', cargarResidentes);
