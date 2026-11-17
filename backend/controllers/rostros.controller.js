const db = require('../config/db');

// Obtener todos los rostros (personal y residentes)
exports.todos = (req, res) => {
    const sqlPersonal = 'SELECT id, nombre, descriptor_facial FROM personal WHERE descriptor_facial IS NOT NULL';
    const sqlResidentes = 'SELECT id, nombre, descriptor_facial FROM residentes WHERE descriptor_facial IS NOT NULL';

    db.query(sqlPersonal, (err, personal) => {
        if (err) return res.status(500).json({ mensaje: 'Error al obtener personal', error: err.message });

        db.query(sqlResidentes, (err, residentes) => {
            if (err) return res.status(500).json({ mensaje: 'Error al obtener residentes', error: err.message });

            const todos = [
                ...personal.map(p => ({ id: p.id, nombre: p.nombre, tipo: 'PERSONAL', descriptor_facial: p.descriptor_facial })),
        ...residentes.map(r => ({ id: r.id, nombre: r.nombre, tipo: 'RESIDENTE', descriptor_facial: r.descriptor_facial }))
            ];

            res.json(todos);
        });
    });
};