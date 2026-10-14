const API_URL = 'http://localhost:3000/api';

let listaPersonal = [];
let personalEditando = null;

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
        tablaPersonal.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding:2rem;">No hay personal registrado</td></tr>';
        return;
    }
    
    tablaPersonal.innerHTML = datos.map(p => `
        <tr>
            <td><span style="color:var(--silver-fog);">#${p.id}</span></td>
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
    `).join('');
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

// ============ CONTROL DE MODAL ============
function abrirModal() {
    modalPersonal.classList.add('activo');
}

function cerrarModal() {
    modalPersonal.classList.remove('activo');
}

// ============ ABRIR MODAL CREAR ============
function abrirCrear() {
    personalEditando = null;
    modalTitle.textContent = 'Nuevo Personal';
    btnGuardarTexto.textContent = 'Guardar';
    formPersonal.reset();
    inputId.value = '';
    abrirModal();
}

// ============ ABRIR MODAL EDITAR ============
window.abrirEditar = (id) => {
    const p = listaPersonal.find(x => x.id === id);
    if (!p) return;
    
    personalEditando = p;
    modalTitle.textContent = 'Editar Personal';
    btnGuardarTexto.textContent = 'Actualizar';

    inputId.value = p.id;
    inputNombre.value = p.nombre;
    inputCedula.value = p.cedula;
    inputCargo.value = p.cargo;
    inputArea.value = p.area || '';
    inputTelefono.value = p.telefono || '';
    aceptoPolitica.checked = true;
    
    abrirModal();
};

// Eventos del modal
btnNuevoPersonal.addEventListener('click', abrirCrear);
btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);

modalPersonal.addEventListener('click', (e) => {
    if (e.target === modalPersonal) cerrarModal();
});

// ============ ENVÍO DEL FORMULARIO ============
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
        
        mostrarToast(personalEditando ? 'Personal actualizado correctamente' : 'Personal creado correctamente');
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