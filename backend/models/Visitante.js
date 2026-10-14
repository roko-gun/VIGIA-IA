const db = require('../config/db');

const Visitante = {
    // listar todos los visitantes
    listar: (callback)=> {
        const sql = 'SELECT * FROM visitantes ORDER BY fecha_registro DESC';
        db.query(sql, callback);
    },

    // Buscar por id
    buscarPorId: (id, callback) => {
        const sql = 'SELECT * FROM visitantes WHERE id = ?';
        db.query(sql, [id], callback);
    },

      // Buscar por documento
    buscarPorDocumento: (documento, callback) => {
        const sql = 'SELECT * FROM visitantes WHERE documento = ?';
        db.query(sql, [documento], callback);
    },

    // Crear nuevo visitante
    crear: (datos, callback) => {
        const sql = `
            INSERT INTO visitantes (nombre, documento, apartamento, persona_visitada)
            VALUES (?, ?, ?, ?)
            `;
        const valores = [
            datos.nombre,
            datos.documento,
            datos.apartamento || null,
            datos.persona_visitada || null
        ];
        db.query(sql, valores, callback);
    },

    // Actualizar visitante
    actualizar: (id, datos, callback) => {
        const sql = `
            UPDATE visitantes
            SET nombre = ?, documento = ?, apartamento = ?, persona_visitada = ? WHERE id = ?
            `;
        const valores = [
            datos.nombre,
            datos.documento,
            datos.apartamento || null, 
            datos.persona_visitada || null,
            id
        ];
        db.query(sql, valores, callback);
    },

    // Eliminar visitante
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM visitantes WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Visitante;