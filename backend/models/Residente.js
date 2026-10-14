const db = require('../config/db');
const { buscarPorId, buscarPorCorreo } = require('./Administrador');

const Residente = {
    // listar todos los residentes
    listar: (callback) => {
        const sql = 'SELECT * FROM residentes ORDER BY fecha_registro DESC';
        db.query(sql, callback);
    },

    // Buscar por el ID del residente
    buscarPorId: (id, callback) => {
        const sql = 'SELECT * FROM residentes WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Buscar por el documento de identificacion 
    buscarPorDocumento: (documento, callback) => {
        const sql = 'SELECT * FROM residentes WHERE documento = ?';
        db.query(sql, [documento], callback);
    },

    // Crear un nuevo residente
    crear: (datos, callback) => {
        const sql = `
            INSERT INTO residentes (nombre, documento, apartamento, torre, telefono, correo)
            VALUES (?, ?, ?, ?, ?, ?)
            `;
        const valores = [
            datos.nombre,
            datos.documento,
            datos.apartamento,
            datos.torre || null,
            datos.telefono || null,
            datos.correo || null
        ];
        db.query(sql, valores, callback);
    },

    // Actualizar residente
    actualizar: (id, datos, callback) => {
        const sql = `
            UPDATE residentes
            SET nombre = ?, documento = ?, apartamento = ?, torre = ?, telefono = ?, correo = ?
            WHERE id = ?
            `;
        const valores = [
            datos.nombre,
            datos.documento,
            datos.apartamento,
            datos.torre || null,
            datos.telefono || null,
            datos.correo || null,
            id
        ];
        db.query(sql, valores, callback);
    },

    // Eliminar un residente
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM residentes WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Residente;