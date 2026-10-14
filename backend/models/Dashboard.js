const db = require('../config/db');

const Dashboard = {
  // Totales generales
totales: (callback) => {
    const sql = `
    SELECT 
        (SELECT COUNT(*) FROM personal) AS total_personal,
        (SELECT COUNT(*) FROM visitantes) AS total_visitantes,
        (SELECT COUNT(*) FROM residentes) AS total_residentes,
        (SELECT COUNT(*) FROM registros_acceso WHERE DATE(fecha_hora) = CURDATE()) AS total_accesos_hoy
    `;
    db.query(sql, callback);
},

  // Accesos de los últimos 7 días
accesosPorDia: (callback) => {
    const sql = `
    SELECT 
        DATE(fecha_hora) AS fecha,
        COUNT(*) AS total
    FROM registros_acceso
    WHERE fecha_hora >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
    GROUP BY DATE(fecha_hora)
    ORDER BY fecha ASC
    `;
    db.query(sql, callback);
},

  // Últimos 10 accesos con nombre
    ultimosAccesos: (callback) => {
    const sql = `
    SELECT 
        ra.id,
        ra.tipo_usuario,
        ra.accion,
        ra.fecha_hora,
        COALESCE(p.nombre, v.nombre, 'Desconocido') AS nombre_usuario
    FROM registros_acceso ra
    LEFT JOIN personal p ON (ra.tipo_usuario = 'PERSONAL' AND ra.usuario_id = p.id)
    LEFT JOIN visitantes v ON (ra.tipo_usuario = 'VISITANTE' AND ra.usuario_id = v.id)
    ORDER BY ra.fecha_hora DESC
    LIMIT 10
    `;
    db.query(sql, callback);
    }
};

module.exports = Dashboard;
