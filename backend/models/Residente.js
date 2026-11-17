const db = require('../config/db');

const Residente = {
  listar: (callback) => {
    const sql = 'SELECT * FROM residentes ORDER BY fecha_registro DESC';
    db.query(sql, callback);
  },

  buscarPorId: (id, callback) => {
    const sql = 'SELECT * FROM residentes WHERE id = ?';
    db.query(sql, [id], callback);
  },

  buscarPorDocumento: (documento, callback) => {
    const sql = 'SELECT * FROM residentes WHERE documento = ?';
    db.query(sql, [documento], callback);
  },

  crear: (datos, callback) => {
    const sql = 'INSERT INTO residentes (nombre, documento, apartamento, torre, telefono, correo) VALUES (?, ?, ?, ?, ?, ?)';
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

  actualizar: (id, datos, callback) => {
    const sql = 'UPDATE residentes SET nombre = ?, documento = ?, apartamento = ?, torre = ?, telefono = ?, correo = ? WHERE id = ?';
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

  eliminar: (id, callback) => {
    const sql = 'DELETE FROM residentes WHERE id = ?';
    db.query(sql, [id], callback);
  },

  // ============ RECONOCIMIENTO FACIAL ============
  guardarDescriptor: (id, descriptor, callback) => {
    const sql = 'UPDATE residentes SET descriptor_facial = ? WHERE id = ?';
    db.query(sql, [descriptor, id], callback);
  },

  obtenerRostros: (callback) => {
    const sql = 'SELECT id, nombre, documento, apartamento, descriptor_facial FROM residentes WHERE descriptor_facial IS NOT NULL';
    db.query(sql, callback);
  },

  eliminarDescriptor: (id, callback) => {
    const sql = 'UPDATE residentes SET descriptor_facial = NULL WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Residente;
