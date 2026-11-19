// ============================================================
// VIGIA IA - Dashboard con Ingresos y Salidas
// ============================================================

const API_URL = 'https://vigia-ia-1.onrender.com/api';

async function cargarDashboard() {
    try {
        console.log('[DASHBOARD] Consultando stats...');
        const response = await fetch(`${API_URL}/dashboard/stats`);
        const data = await response.json();
        console.log('[DASHBOARD] Datos:', data);
        
        if (!response.ok) {
            console.error('Error al cargar dashboard:', data);
            return;
        }

        // Tarjetas
        document.getElementById('statPersonal').textContent = data.total_personal || 0;
        document.getElementById('statVisitantes').textContent = data.total_visitantes || 0;
        document.getElementById('statResidentes').textContent = data.total_residentes || 0;
        document.getElementById('statIngresosHoy').textContent = data.total_ingresos_hoy || 0;
        document.getElementById('statSalidasHoy').textContent = data.total_salidas_hoy || 0;

        // Gráfico
        renderizarGrafico(data.accesos_por_dia || []);

        // Tabla
        renderizarUltimosAccesos(data.ultimos_accesos || []);
    
    } catch (error) {
        console.error('[DASHBOARD ERROR]', error);
    }
}

let chartInstance = null;

function renderizarGrafico(datos) {
    const ctx = document.getElementById('chartAccesos');
    if (!ctx) return;
    
    const hoy = new Date();
    const dias = [];
    const valores = [];
    
    for (let i = 6; i >= 0; i--) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() - i);
        const fechaStr = fecha.toISOString().split('T')[0];
        
        const diaNombre = fecha.toLocaleDateString('es-CO', { weekday: 'short' });
        dias.push(diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1));
        
        const encontrado = datos.find(d => {
            const dFecha = new Date(d.fecha).toISOString().split('T')[0];
            return dFecha === fechaStr;
        });
        
        valores.push(encontrado ? encontrado.total : 0);
    }
    
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dias,
            datasets: [{
                label: 'Accesos',
                data: valores,
                borderColor: '#00E5FF',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00E5FF',
                pointBorderColor: '#0A1628',
                pointBorderWidth: 2,
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
                    ticks: { color: '#8A9BB0', stepSize: 1, precision: 0 },
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
            day: '2-digit', month: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });
        
        const tipoClass = a.tipo_usuario === 'PERSONAL' ? 'personal'
        : a.tipo_usuario === 'RESIDENTE' ? 'residente'
        : 'visitante';
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

document.addEventListener('DOMContentLoaded', () => {
    cargarDashboard();
    setInterval(cargarDashboard, 30000);
});
