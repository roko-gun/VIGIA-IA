// ============================================================
// VIGIA IA - Módulo Reportes
// ============================================================

const API_URL = 'http://localhost:3000/api';

const panelResultados = document.getElementById('panelResultados');
const tituloResultado = document.getElementById('tituloResultado');
const theadReporte = document.getElementById('theadReporte');
const tbodyReporte = document.getElementById('tbodyReporte');
const toastVigia = document.getElementById('toastVigia');

// Modal fecha
const modalFecha = document.getElementById('modalFecha');
const formFecha = document.getElementById('formFecha');
const inputDesde = document.getElementById('inputDesde');
const inputHasta = document.getElementById('inputHasta');
const btnCerrarModalFecha = document.getElementById('btnCerrarModalFecha');
const btnCancelarFecha = document.getElementById('btnCancelarFecha');
const btnDescargarFecha = document.getElementById('btnDescargarFecha');

// ============ TOAST ============
function mostrarToast(mensaje, tipo = 'success') {
    toastVigia.textContent = mensaje;
    toastVigia.className = `toast-vigia ${tipo} activo`;
    setTimeout(() => {
        toastVigia.classList.remove('activo');
    }, 3500);
}

// ============ VER REPORTE ============
async function verReporte(tipo) {
    try {
        const response = await fetch(`${API_URL}/reportes/${tipo}`);
        const data = await response.json();
        
        if (!response.ok) {
            mostrarToast('Error al cargar reporte', 'error');
            return;
        }
        
        mostrarResultados(tipo, data);
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
}

// ============ MOSTRAR RESULTADOS EN TABLA ============
function mostrarResultados(tipo, datos) {
    panelResultados.style.display = 'block';
    
    let titulo = '';
    let columnas = [];
    
    switch (tipo) {
        case 'accesos':
            titulo = 'Accesos Generales';
            columnas = [
                { key: 'id', label: 'ID' },
                { key: 'nombre_usuario', label: 'Nombre' },
                { key: 'tipo_usuario', label: 'Tipo' },
                { key: 'accion', label: 'Acción' },
                { key: 'fecha_hora', label: 'Fecha y Hora', formato: 'fecha' }
            ];
            break;
            
            case 'horas-trabajadas':
                titulo = 'Horas Trabajadas por Personal';
                columnas = [
                    { key: 'id', label: 'ID' },
                    { key: 'nombre', label: 'Nombre' },
                    { key: 'cedula', label: 'Cédula' },
                    { key: 'cargo', label: 'Cargo' },
                    { key: 'primer_ingreso', label: 'Primer Ingreso', formato: 'fecha' },
                    { key: 'ultima_salida', label: 'Última Salida', formato: 'fecha' },
                    { key: 'total_ingresos', label: 'Ingresos' },
                    { key: 'total_salidas', label: 'Salidas' }
                ];
                break;
            
            case 'visitas-apartamento':
                titulo = 'Visitas por Apartamento';
                columnas = [
                    { key: 'apartamento', label: 'Apartamento' },
                    { key: 'total_visitas', label: 'Total Visitas' },
                    { key: 'visitantes_unicos', label: 'Visitantes Únicos' }
                ];
                break;
            
            case 'accesos-fecha':
                titulo = 'Accesos por Rango de Fechas';
                columnas = [
                    { key: 'id', label: 'ID' },
                    { key: 'nombre_usuario', label: 'Nombre' },
                    { key: 'tipo_usuario', label: 'Tipo' },
                    { key: 'accion', label: 'Acción' },
                    { key: 'fecha_hora', label: 'Fecha y Hora', formato: 'fecha' }
                ];
            
                break;
                
                default:
                    titulo = 'Resultados';
                    columnas = Object.keys(datos[0] || {}).map(k => ({ key: k, label: k }));
                }
                
                
                tituloResultado.innerHTML = `<i class="bi bi-table"></i> ${titulo}`;
                
                // Encabezados

                theadReporte.innerHTML = `
                <tr>
                ${columnas.map(c => `<th>${c.label}</th>`).join('')}
                </tr>
                `;

                // Filas
    
                if (datos.length === 0) {
                    tbodyReporte.innerHTML = `<tr><td colspan="${columnas.length}" class="text-center text-muted" style="padding:2rem;">No hay datos para mostrar</td></tr>`;
                    return;
                }
                
                tbodyReporte.innerHTML = datos.map(fila => `
                    <tr>
                    ${columnas.map(c => {
                        let valor = fila[c.key];
                        
                        if (c.formato === 'fecha' && valor) {
                            valor = new Date(valor).toLocaleString('es-CO', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            });
                        }
                        
                        if (valor === null || valor === undefined) valor = '-';
                        
                        // Badges para tipo y acción
        
                        if (c.key === 'tipo_usuario') {
                            const cls = valor === 'PERSONAL' ? 'personal' : 'visitante';
                            return `<td><span class="badge-tipo ${cls}">${valor}</span></td>`;
                        }
                        if (c.key === 'accion') {
                            const cls = valor === 'INGRESO' ? 'ingreso' : 'salida';
                            return `<td><span class="badge-accion ${cls}">${valor}</span></td>`;
                        }
                        
                        return `<td>${valor}</td>`;
                    }).join('')}
                    </tr>
                    `).join('');
                    
                    // Scroll automático

                    panelResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

// ============ CERRAR RESULTADOS ============
function cerrarResultados() {
    panelResultados.style.display = 'none';
}

// ============ DESCARGAR EXCEL ============
function descargarExcel(tipo) {
    const url = `${API_URL}/reportes/${tipo}/excel`;
    window.location.href = url;
    mostrarToast('Descargando archivo Excel...');
}

// ============ MODAL RANGO DE FECHAS ============
function abrirModalFecha() {
    formFecha.reset();
    modalFecha.classList.add('activo');
}

function cerrarModalFecha() {
    modalFecha.classList.remove('activo');
}

document.querySelector('[onclick="abrirModalFecha()"]').addEventListener('click', abrirModalFecha);
btnCerrarModalFecha.addEventListener('click', cerrarModalFecha);
btnCancelarFecha.addEventListener('click', cerrarModalFecha);

modalFecha.addEventListener('click', (e) => {
    if (e.target === modalFecha) cerrarModalFecha();
});

// ============ VER ACCESOS POR FECHA ============
formFecha.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const desde = inputDesde.value;
    const hasta = inputHasta.value;
    
    if (!desde || !hasta) {
        mostrarToast('Selecciona ambas fechas', 'error');
        return;
    }
    
    if (desde > hasta) {
        mostrarToast('La fecha "desde" no puede ser mayor que "hasta"', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/reportes/accesos/fecha/${desde}/${hasta}`);
        const data = await response.json();
    
        if (!response.ok) {
            mostrarToast('Error al cargar reporte', 'error');
            return;
        }
        
        cerrarModalFecha();
        mostrarResultados('accesos-fecha', data);
    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
});

// ============ DESCARGAR EXCEL POR FECHA ============
btnDescargarFecha.addEventListener('click', () => {
    const desde = inputDesde.value;
    const hasta = inputHasta.value;
    
    if (!desde || !hasta) {
        mostrarToast('Selecciona ambas fechas', 'error');
        return;
    }
    
    const url = `${API_URL}/reportes/accesos/fecha/${desde}/${hasta}/excel`;
    window.location.href = url;
    mostrarToast('Descargando archivo Excel...');
    cerrarModalFecha();
});
