const db = require('../config/db');

const Visitante = {
    listar: (callback) => {
        const sql = 'SELECT * FROM visitantes ORDER BY fecha_registro DESC';
        db.query(sql, callback);
    },
    
    buscarPorId: (id, callback) => {
        const sql = 'SELECT * FROM visitantes WHERE id = ?';
        db.query(sql, [id], callback);
    },
    
    buscarPorDocumento: (documento, callback) => {
        const sql = 'SELECT * FROM visitantes WHERE documento = ?';
        db.query(sql, [documento], callback);
    },
    
    crear: (datos, callback) => {
        const sql = `
        INSERT INTO visitantes (nombre, documento, apartamento, persona_visitada, empresa)
        VALUES (?, ?, ?, ?, ?)
        `;
        const valores = [
            datos.nombre,
            datos.documento,
            datos.apartamento || null,
            datos.persona_visitada || null,
            datos.empresa || null
        ];
        db.query(sql, valores, callback);
    },
    
    actualizar: (id, datos, callback) => {
        const sql = `
        UPDATE visitantes
        SET nombre = ?, documento = ?, apartamento = ?, persona_visitada = ?, empresa = ?
        WHERE id = ?
        `;
        const valores = [
            datos.nombre,
            datos.documento,
            datos.apartamento || null,
            datos.persona_visitada || null,
            datos.empresa || null,
            id
        ];
        db.query(sql, valores, callback);
    },
    
    registrarSalida: (id, callback) => {
        const sql = 'UPDATE visitantes SET fecha_salida = NOW() WHERE id = ? AND fecha_salida IS NULL';
        db.query(sql, [id], callback);
    },
    
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM visitantes WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Visitante;
