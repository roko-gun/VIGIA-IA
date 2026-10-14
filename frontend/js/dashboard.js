const { options } = require("../../backend/routes/personal.routes");

const API_URL = 'http://localhost:3000/api'

// =============== CARGAR ESTADISTICAS ============//
async function cargarDashboard() {
    try {
        const response = await fetch(`${API_URL}/dashboard/stats`);
        const data = await response.json();

        if (!response.ok) {
            console.error('Error al cargar dashboard:', data);
            return;
        }

        // Actualizar tarjetas
        document.getElementById('statPersonal').textContent = data.total_personal;
        document.getElementById('statVisitantes').textContent = data.total_visitantes;
        document.getElementById('statResidentes').textContent = data.total_residentes;
        document.getElementById('statAccesosHoy').textContent = data.total_accesos_hoy;

        // Grafico de accesos por dia
        renderizarGrafico(data.ultimos_accesos);

    } catch (error) {
        console.error('Error de conexion:', error);
    }
}

// ============= grafico chart.js =================
let chartInstance = null;

function renderizarGrafico(datos) {
    const ctx = document.getElementById('chartAccesos');
    if (!ctx) return;

    // Generar los ultimos 7 dias (rellenando con 0 los que no tengan datos)
    const hoy = new Date();
    const dias = [];
    const valores = [];

    for (let i = 6; i >= 0; i--) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() - 1);
        const fechaStr = fecha.toISOString().split('T') [0];

        const diaNombre = fecha.toLocaleDateString('es-CO', { weekday: 'short'});
        dias.push(diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1));

        const encontrado = datos.find(d => {
            const dFecha = new Date(d.fecha).toISOString().split('T') [0];
            return dFecha === fechaStr;
        });

        valores.push(encontrado ? encontrado.total : 0);
    }

    // destruir grafico anterior si existe
    if (chartInstance) chartInstance.destroy();

    chartInstance = new chartInstance(ctx, {
        type: 'line',
        data: {
            labels: dias,
            datasets: [{
                label: 'Accesos',
                data: valores,
                borderColor: '#00E5FF',
                backgroundColor: 'rgba(0, 229, 255, 0.1',
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00E5FF',
                pointBorderColor: '#0A1628',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111E32',
                    titleColor: '#00E5FF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#1F2D45',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#8A9BB0',
                        stepSize: 1,
                        precision: 0
                    },
                    grid: { color: 'rgba(31, 45, 69, 0.5)' }
                },
                x: {
                    ticks: { color: '#8A9BB0' },
                    grid: { display: false }
                }
            }
        }
    });
}

// ================== Tabla ultimos accesos ===============
function renderizarUltimosAccesos(accesos) {
    const tbody = document.getElementById('tablaUltimosAccesos');
    if (!tbody) return;

    if (!accesos || accesos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay accesos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = accesos.map(a => {
        const fecha = new Date(a.fecha_hora);
        const fechaStr = fecha.toLocaleString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        const tipoClass = a.tipo_usuario === 'PERSONAL' ? 'personal' : 'visitante';
        const accionClass = a.accion === 'INGRESO' ? 'ingreso' : 'salida';

        return `
            <tr>
                <td>${a.nombre_usuario}</td>
                <td><span class="badge-tipo ${tipoClass}">${a.tipo_usuario}</span></td>
                <td><span class="badge-accion ${accionClass}">${a.accion}</span></td>
                <td>${fechaStr}</td>
            </tr>
            `;
        }).join('');
}

// =========== inciar ============
document.addEventListener('DOMContentLoaded', cargarDashboard);