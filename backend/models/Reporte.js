const db = require('../config/db');

const Reporte = {
  // 1. Reporte general de accesos con nombre del personal o visitante
    accesosGenerales: (callback) => {
    const sql = `
      SELECT 
        ra.id,
        ra.tipo_usuario,
        ra.usuario_id,
        COALESCE(p.nombre, v.nombre, 'Desconocido') AS nombre_usuario,
        ra.accion,
        ra.fecha_hora
      FROM registros_acceso ra
      LEFT JOIN personal p ON (ra.tipo_usuario = 'PERSONAL' AND ra.usuario_id = p.id)
      LEFT JOIN visitantes v ON (ra.tipo_usuario = 'VISITANTE' AND ra.usuario_id = v.id)
      ORDER BY ra.fecha_hora DESC
    `;
    db.query(sql, callback);
  },

  // 2. Accesos por rango de fechas
  accesosPorFecha: (desde, hasta, callback) => {
    const sql = `
      SELECT 
        ra.id,
        ra.tipo_usuario,
        ra.usuario_id,
        COALESCE(p.nombre, v.nombre, 'Desconocido') AS nombre_usuario,
        ra.accion,
        ra.fecha_hora
      FROM registros_acceso ra
      LEFT JOIN personal p ON (ra.tipo_usuario = 'PERSONAL' AND ra.usuario_id = p.id)
      LEFT JOIN visitantes v ON (ra.tipo_usuario = 'VISITANTE' AND ra.usuario_id = v.id)
      WHERE DATE(ra.fecha_hora) BETWEEN ? AND ?
      ORDER BY ra.fecha_hora DESC
    `;
    db.query(sql, [desde, hasta], callback);
  },

  // 3. Horas trabajadas por personal
  horasTrabajadas: (callback) => {
    const sql = `
      SELECT 
        p.id,
        p.nombre,
        p.cedula,
        p.cargo,
        MIN(CASE WHEN ra.accion = 'INGRESO' THEN ra.fecha_hora END) AS primer_ingreso,
        MAX(CASE WHEN ra.accion = 'SALIDA' THEN ra.fecha_hora END) AS ultima_salida,
        COUNT(CASE WHEN ra.accion = 'INGRESO' THEN 1 END) AS total_ingresos,
        COUNT(CASE WHEN ra.accion = 'SALIDA' THEN 1 END) AS total_salidas
      FROM personal p
      LEFT JOIN registros_acceso ra ON ra.tipo_usuario = 'PERSONAL' AND ra.usuario_id = p.id
      GROUP BY p.id, p.nombre, p.cedula, p.cargo
      ORDER BY p.nombre ASC
    `;
    db.query(sql, callback);
  },

  // 4. Visitas por apartamento
  visitasPorApartamento: (callback) => {
    const sql = `
      SELECT 
        apartamento,
        COUNT(*) AS total_visitas,
        COUNT(DISTINCT documento) AS visitantes_unicos
      FROM visitantes
      WHERE apartamento IS NOT NULL
      GROUP BY apartamento
      ORDER BY total_visitas DESC
    `;
    db.query(sql, callback);
  }
};

module.exports = Reporte;

