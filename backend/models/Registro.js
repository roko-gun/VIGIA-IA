const db = require('../config/db');

const Registro = {
    listar: (callback) => {
        const sql = 'SELECT * FROM registros_acceso ORDER BY fecha_hora DESC';
        db.query(sql, callback);
    },
    
    buscarPorId: (id, callback) => {
        const sql = 'SELECT * FROM registros_acceso WHERE id = ?';
        db.query(sql, [id], callback);
    },
    
    listarPorTipo: (tipo, callback) => {
        const sql = 'SELECT * FROM registros_acceso WHERE tipo_usuario = ? ORDER BY fecha_hora DESC';
        db.query(sql, [tipo], callback);
    },
    
    listarPorAccion: (accion, callback) => {
        const sql = 'SELECT * FROM registros_acceso WHERE accion = ? ORDER BY fecha_hora DESC';
        db.query(sql, [accion], callback);
    },
    
    listarPorFecha: (fecha, callback) => {
        const sql = 'SELECT * FROM registros_acceso WHERE DATE(fecha_hora) = ? ORDER BY fecha_hora DESC';
        db.query(sql, [fecha], callback);
    },
    
    crear: (datos, callback) => {
        const sql = 'INSERT INTO registros_acceso (tipo_usuario, usuario_id, accion) VALUES (?, ?, ?)';
        db.query(sql, [datos.tipo_usuario, datos.usuario_id, datos.accion], callback);
    },
    
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM registros_acceso WHERE id = ?';
        db.query(sql, [id], callback);
    },

  // ============ ÚLTIMO ACCESO ============
ultimoAcceso: (tipo_usuario, usuario_id, callback) => {
    const sql = `
    SELECT accion, fecha_hora
    FROM registros_acceso
    WHERE tipo_usuario = ? AND usuario_id = ?
    ORDER BY fecha_hora DESC
    LIMIT 1
    `;
    db.query(sql, [tipo_usuario, usuario_id], callback);
}
};

module.exports = Registro;
