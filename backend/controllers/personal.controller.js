const Personal = require('../models/Personal');

// listar todo el personal
exports.listar = (req, res) => {
    Personal.listar((err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al listar personal', error: err.message });
        }
        res.json(results);
    });
};

// Buscar personal por Id
exports.buscarPorId = (req, res) => {
    const { id } = req.params;

    Personal.buscarPorId(id, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al buscar personal', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json ({ mensaje: 'Personal no encontrado' });
        }
        res.json(results[0]);
    });
};

// Buscar personal por cedula 
exports.buscarPorCedula = (req, res) => {
    const { cedula } = req.params;

    Personal.buscarPorCedula(cedula, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al buscar personal', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Personal no encontrado' });
        }
        res.json(results[0]);
    });
};

// crear nuevo registro de personal
exports.crear = (req, res ) => {
    const { nombre, cedula, cargo } = req.body;

    if (!nombre || !cedula || !cargo) {
        return res.status(400).json({
            mensaje: 'Nombre, cedula y cargo son obligatorios'
        });
    }

    Personal.crear(req.body, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ mensaje: 'La cedula ya esta registrada' });
            }
            return res.status(500).json({ mensaje: 'Error al crear personal', error: err.message });
        }

        res.status(201).json({
            mensaje: 'personal creado correctamente',
            id: result.insertId
        });
    });
};

// actualizar personal
exports.actualizar = (req, res) => {
    const { id } = req.params;
    const{ nombre, cedula, cargo } = req.body;

    if (!nombre || !cedula || !cargo) {
        return res.status(400).json({
            mensaje: 'Nombre, cedula y cargo son obligatorios'
        });
    }

    Personal.actualizar(id, req.body, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ mensaje: 'La cedula ya esta registrada en otro registro' });
            }
            return res.status(500).json ({ mensaje: 'Error al actualizar personal', error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Personal no encontrado' });
        }

        res.json({ mensaje: 'Personal actualizado correctamente '});
    });
};

// Eliminar personal
exports.eliminar = (req, res) => {
    const { id } = req.params;

    Personal.eliminar(id, (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al eliminar personal', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Personal no encontrado' });
        }

        res.json({ mensaje: 'Personal eliminado correctamente' });
    });
};