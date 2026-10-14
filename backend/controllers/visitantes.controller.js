const Visitante = require('../models/Visitante');

// Listar todos los visitantes
exports.listar = (req, res) => {
    Visitante.listar((err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al listar visitantes', error: err.message });
        }
        res.json(results);
    });
};

// Buscar visitante por Id 
exports.buscarPorId = (req, res) => {
  const { id } = req.params;

  Visitante.buscarPorId(id, (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al buscar visitante', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Visitante no encontrado' });
    }
    res.json(results[0]);
  });
};

// buscar visitantes por documento
exports.buscarPorDocumento = (req, res) => {
  const { documento } = req.params;

  Visitante.buscarPorDocumento(documento, (err, results) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al buscar visitante', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Visitante no encontrado' });
    }
    res.json(results[0]);
  });
};

// Crear nuevo visitante
exports.crear = (req, res) => {
  const { nombre, documento } =req.body;

  if (!nombre || !documento) {
    return res.status(400).json({
      mensaje: 'Nombre y documento son obligatorios'
    });
  }

  Visitante.crear(req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al crear visitante', error: err.message });
    }

    res.status(201).json({
      mensaje: 'Visitante creado correctamente',
      id: result.insertId
    });
  });
};

//Actualizar visitante
exports.actualizar = (req, res) => {
  const { id } = req.params;
  const { nombre, documento } = req.body;

  if (!nombre || !documento) {
    return res.status(400).json({
      mensaje: 'Nombre y documento son obligatorios '
    });
  }

  Visitante.actualizar(id, req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al actualizar visitante', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Visitante no encontrado' });
    }

    res.json({ mensaje: 'Visitante actualizado correctamente' });
  });
};

// Eliminar visitante
exports.eliminar = (req, res) => {
  const { id } = req.params;

  Visitante.eliminar(id, (err, result) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al eliminar visitante', error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Visitante no encontrado' });
    }

    res.json({ mensaje: 'Visitante eliminado correctamente' });
  });
};
