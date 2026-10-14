const Residente = require('../models/Residente');

// listar todos los residentes
exports.listar = (req, res) => {
    Residente.listar((err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al listar residentes', error: err.message });
        }
        res.json(results);
    });
};

// Buscar residente por ID
exports.buscarPorId = (req, res) => {
    const { id } = req.params;

    Residente.buscarPorId(id, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al buscar por residente', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Residente no encontrado' });
        }
        res.json(results[0]);
    });
};

// buscar residente por documento
exports.buscarPorDocumento = (req, res) => {
    const { documento } = req.params;

    Residente.buscarPorDocumento(documento, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al buscar residente', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Residente no encontrado' });
        }
        res.json(results[0]);
    });
};

// crear nuevo residente 
exports.crear = (req, res) => {
    const { nombre, documento, apartamento, torre, telefono, correo } = req.body;

    if (!nombre || !documento || !apartamento) {
        return res.status(400).json({
            mensaje: 'Nombre, documento y apartamento son obligatorios'
        });
    }

    Residente.crear(req.body, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ mensaje: 'El documento ya esta registrado' });
            }
            return res.status(500).json({ mensaje: 'Error al crear residente', erro: err.message });
        }

        res.status(201).json({
            mensaje: 'Residente creado correctamente',
            id: result.insertId
        });
    });
};

//Actualizar residente
exports.actualizar = (req, res) => {
    const { id } = req.params;
    const { nombre, documento, apartamento } = req.body;

    if (!nombre || !documento || !apartamento) {
        return res.status(400).json({
            mensaje: 'Nombre, documento y apartamento son obligatorios'
        });
    }

    Residente.actualizar(id, req.body, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ mensaje: 'El documento ya esta registrado en otro residente' });
            }
            return res.status(500).json({ mensaje: 'Error al actualizar residente', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Residente no encontrado '});
        }

        res.json({ mensaje: 'Residente actualizado correctamente' });
    });
};

// Eliminar registro residente
exports.eliminar = (req, res) => {
    const { id } = req.params;

    Residente.eliminar(id, (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al eliminar residente', error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Residente no encontrado' });
        }

        res.json({ mensaje: 'Residente eliminado correctamente' });
    });
};