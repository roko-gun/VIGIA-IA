const Personal = require('../models/Personal');

// Listar todo el personal
exports.listar = (req, res) => {
    Personal.listar((err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al listar personal', error: err.message });
        }
        res.json(results);
    });
};

// Buscar personal por ID
exports.buscarPorId = (req, res) => {
    const { id } = req.params;
    Personal.buscarPorId(id, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al buscar personal', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Personal no encontrado' });
        }
        res.json(results[0]);
    });
};

// Buscar personal por cédula
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

// Crear nuevo registro de personal
exports.crear = (req, res) => {
    const { nombre, cedula, cargo } = req.body;
    
    
    if (!nombre || !cedula || !cargo) {
        return res.status(400).json({
            mensaje: 'Nombre, cédula y cargo son obligatorios'
        });
    }
    
    Personal.crear(req.body, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ mensaje: 'La cédula ya está registrada' });
            }
            return res.status(500).json({ mensaje: 'Error al crear personal', error: err.message });
        }
        
        res.status(201).json({
            mensaje: 'Personal creado correctamente',
            id: result.insertId
        });
    });
};

// Actualizar personal
exports.actualizar = (req, res) => {
    const { id } = req.params;
    const { nombre, cedula, cargo } = req.body;
    
    if (!nombre || !cedula || !cargo) {
        return res.status(400).json({
            mensaje: 'Nombre, cédula y cargo son obligatorios'
        });
    }
    
    Personal.actualizar(id, req.body, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ mensaje: 'La cédula ya está registrada en otro registro' });
            }
            return res.status(500).json({ mensaje: 'Error al actualizar personal', error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Personal no encontrado' });
        }
        res.json({ mensaje: 'Personal actualizado correctamente' });
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

// ============ NUEVAS FUNCIONES PARA RECONOCIMIENTO ============

// Guardar descriptor facial del personal
exports.guardarRostro = (req, res) => {
    const { id } = req.params;
    const { descriptor } = req.body;
    
    if (!descriptor) {
        return res.status(400).json({ mensaje: 'El descriptor facial es obligatorio' });
    }
    
    Personal.guardarDescriptor(id, descriptor, (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al guardar descriptor', error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Personal no encontrado' });
        }
        res.json({ mensaje: 'Rostro registrado correctamente' });
    });
};

// Obtener todos los rostros registrados
exports.obtenerRostros = (req, res) => {
    Personal.obtenerRostros((err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al obtener rostros', error: err.message });
        }
        res.json(results);
    });
};

// Eliminar descriptor facial
exports.eliminarRostro = (req, res) => {
    const { id } = req.params;
    Personal.eliminarDescriptor(id, (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al eliminar descriptor', error: err.message });
        }
        res.json({ mensaje: 'Descriptor eliminado correctamente' });
    });
};
