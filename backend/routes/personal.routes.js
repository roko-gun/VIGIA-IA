const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personal.controller');

// Listar todo
router.get('/', personalController.listar);

// Obtener todos los rostros registrados (DEBE IR ANTES DE /:id)
router.get('/rostros', personalController.obtenerRostros);

// Buscar por cédula (DEBE IR ANTES DE /:id)
router.get('/cedula/:cedula', personalController.buscarPorCedula);

// Buscar por ID
router.get('/:id', personalController.buscarPorId);

// Crear
router.post('/', personalController.crear);

// Actualizar
router.put('/:id', personalController.actualizar);

// Guardar descriptor facial
router.put('/:id/rostro', personalController.guardarRostro);

// Eliminar descriptor facial
router.delete('/:id/rostro', personalController.eliminarRostro);

// Eliminar personal
router.delete('/:id', personalController.eliminar);

module.exports = router;
