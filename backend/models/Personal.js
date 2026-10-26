const db = require('../config/db');

const Personal = {
    listar: (callback) => {
        const sql = 'SELECT * FROM personal ORDER BY fecha_registro DESC';
        db.query(sql, callback);
    },
    
    buscarPorId: (id, callback) => {
        const sql = 'SELECT * FROM personal WHERE id = ?';
        db.query(sql, [id], callback);
    },
    
    
    buscarPorCedula: (cedula, callback) => {
        const sql = 'SELECT * FROM personal WHERE cedula = ?';
        db.query(sql, [cedula], callback);
    },
    
    crear: (datos, callback) => {
        const sql = 'INSERT INTO personal (nombre, cedula, cargo, area, telefono, foto) VALUES (?, ?, ?, ?, ?, ?)';
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

    actualizar: (id, datos, callback) => {
        const sql = 'UPDATE personal SET nombre = ?, cedula = ?, cargo = ?, area = ?, telefono = ?, foto = ? WHERE id = ?';
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

    eliminar: (id, callback) => {
        const sql = 'DELETE FROM personal WHERE id = ?';
        db.query(sql, [id], callback);
    },

// ============ FUNCIONES PARA RECONOCIMIENTO ============
    guardarDescriptor: (id, descriptor, callback) => {
        const sql = 'UPDATE personal SET descriptor_facial = ? WHERE id = ?';
        db.query(sql, [descriptor, id], callback);
    },

    obtenerRostros: (callback) => {
        const sql = 'SELECT id, nombre, cedula, cargo, descriptor_facial FROM personal WHERE descriptor_facial IS NOT NULL';
        db.query(sql, callback);
    },

    eliminarDescriptor: (id, callback) => {
        const sql = 'UPDATE personal SET descriptor_facial = NULL WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Personal;
