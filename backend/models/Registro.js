const db = require('../config/db');
const { buscarPorId } = require('./Visitante');

const Registro = {
    // Listar todos los registros
    listar: (callback) => {
        const sql = 'SELECT * FROM registros_acceso ORDER BY fecha_hora DESC';
        db.query(sql, callback);
    },

    // Buscar por id
    buscarPorId: (id, callback) => {
        const sql = 'SELECT * FROM registros_acceso WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // listar por tipo de usuario (PERSONAL VISITANTE)
    listarPorTipo: (tipo, callback) => {
        const sql = 'SELECT * FROM registros_acceso WHERE tipo_usuario = ? ORDER BY fecha_hora DESC';
        db.query(sql, [tipo], callback);
    },

    // listar por accion (ingreso y salida)
    listarPorAccion: (accion, callback) => {
        const sql = 'SELECT * FROM registros_acceso WHERE accion = ? ORDER BY fecha_hora DESC';
        db.query(sql, [accion], callback);
    },

    // listar por fecha (formato yyyy-mm-dd)
    listarPorFecha: (fecha, callback) => {
        const sql = 'SELECT * FROM registros_acceso WHERE DATE(fecha_hora) = ? ORDER BY fecha_hora DESC';
        db.query(sql, [fecha], callback);
    },

    // crear nuevo registro
    crear: (datos, callback) => {
        const sql = `
            INSERT INTO registros_acceso (tipo_usuario, usuario_id, accion)
            VALUES (?, ?, ?)
            `;
        const valores = [
            datos.tipo_usuario,
            datos.usuario_id,
            datos.accion
        ];
        db.query(sql, valores, callback);
    },

    // eliminar un registro
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM registros_acceso WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Registro;