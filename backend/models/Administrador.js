const db = require ('../config/db');

const Administrador = {
    buscarPorCorreo: (correo, callback) => {
        const sql = 'SELECT * FROM administradores WHERE correo = ?';
        db.query(sql, [correo], callback);
    },

    buscarPorId: (id, callback) => {
        const sql = 'SELECT id, nombre, correo, fecha_creacion FROM administradores WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Administrador;