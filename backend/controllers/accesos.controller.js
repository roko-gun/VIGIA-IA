const Registro = require('../models/Registro');

// listar todos los registros
exports.listar = (req, res) => {
    Registro.listar((err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al listar registros', error: err.message });
        }
        res.json(results);
    });
};

// Buscar Por ID
exports.buscarPorId = (req, res) => {
    const { id } = req.params;

    Registro.buscarPorId(id, (err, results) =>{
        if (err) {
            return res.status(500).json({ mensaje: 'Erro al buscar registro', error: err.message });
        }
        if (results.length === 0 ) {
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }
        res.json(results[0]);
    });
};

// Listar por tipo (personal o Visitante)
exports.listarPorTipo = (req, res) => {
    const { tipo } = req.params;

    Registro.listarPorTipo(tipo.toUpperCase(), (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al listar registros', error: err.message});
        }
        res.json(results);
    });
};

// Listar por accion (ingreso o salida)
exports.listarPorAccion = (req, res) => {
    const { accion } = req.params;

    Registro.listarPorAccion(accion.toUpperCase(), (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: ' Error al listar registros', error: err.message});
        }
        res.json(results);
    });
};


// Listar por  fecha
exports.listarPorFecha = (req, res) => {
    const { fecha } = req.params;

    Registro.listarPorFecha(fecha, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: ' Error al listar registros', error: err.message});
        }
        res.json(results);
    });
};

// crear nuevo registro
exports.crear = (req, res) => {
    const { tipo_usuario, usuario_id, accion } = req.body;

    if (!tipo_usuario || !usuario_id || !accion) {
        return res.status(400).json({
            mensaje: 'tipo_usuario, usuario_id y accion son obligatorios'
        });
    }

    const tiposValidos = ['PERSONAL', 'VISITANTE'];
    const accionesValidas = ['INGRESO', 'SALIDA'];

    if (!tiposValidos.includes(tipo_usuario.toUpperCase())) {
        return res.status(400).json({ mensaje: 'tipo_usuario debe ser PERSONAL o VISITANTE' });
    }

    if (!accionesValidas.includes(accion.toUpperCase())) {
        return res.status(400).json({ mensaje: 'accion debe ser INGRESO o SALIDA'});
    }

    const datos = {
        tipo_usuario: tipo_usuario.toUpperCase(),
        usuario_id,
        accion: accion.toUpperCase()
    };

    Registro.crear(datos, (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al crear registro', error: err.message });
        }

        res.status(201).json({
            mensaje: 'Registro creado correctamente',
            id: result.insertId
        });
    });
};

// Eliminar registro
exports.eliminar = (req, res) => {
    const { id } = req.params;

    Registro.eliminar(id, (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: ' Error al  eliminar registro', error: err.message});
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Registro no encontrado' });
        }

        res.json({ mensaje: 'Registro eliminado correctamente' });
    });;
};


