const db = require('../config/db');
const { buscarPorId } = require('./Visitante');

const personal = {
    // listar todo el personal
    listar: (callback) => {
        const sql = 'SELECT * FROM personal ORDER BY fecha_registro DESC';
        db.query(sql, callback);
    },

    // Buscar por id 
    buscarPorId: (id, callback) => {
        const sql = 'SELECT * FROM personal WHERE id = ?';
        db.query(sql, [id], callback);
    },

    buscarPorCedula: (cedula, callback) => {   
        const sql = 'SELECT * FROM personal WHERE cedula = ?';
        db.query(sql, [cedula], callback);
    },

    // crear nuevo registro de personal
    crear: (datos, callback) => {
        const sql = `
            INSERT INTO personal (nombre, cedula, cargo, area, telefono, foto)
            VALUES (?, ?, ?, ?, ?, ?)
            `;
        const valores = [
            datos.nombre,
            datos.cedula,
            datos.cargo,
            datos.area || null,
            datos.telefono || null,
            datos.foto || null
        ];
        db.query(sql, valores, callback);
    },

    // Actualizar personal
    actualizar: (id, datos, callback) => {
        const sql = `
            UPDATE personal
            SET nombre = ?, cedula = ?, cargo = ?, area = ?, telefono = ?, foto = ?
            WHERE id = ?
            `;
        const valores = [
            datos.nombre,
            datos.cedula,
            datos.cargo,
            datos.area || null,
            datos.telefono || null,
            datos.foto || null,
            id
        ];
        db.query(sql, valores, callback);
    },

    // eliminar personal
    eliminar: (id, callback) => {
        const sql = 'DELETE FROM personal WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = personal;