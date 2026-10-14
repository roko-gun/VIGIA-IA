const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Administrador = require('../models/Administrador');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_vigia_ia';

exports.login = (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    Administrador.buscarPorCorreo(correo, async (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const admin = results[0];

        const passwordValida = await bcrypt.compare(password, admin.password);

        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: admin.id, correo: admin.correo },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            mensaje: 'Acceso Autorizado',
            token,
            administrador: {
                id: admin.id,
                nombre: admin.nombre,
                correo: admin.correo
            }
        });
    });
};