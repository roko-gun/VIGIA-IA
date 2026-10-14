const express = require('express');
const router = express.Router();
const personalController = require('../controllers/personal.controller');

// Listar todo
router.get('/', personalController.listar);

// Buscar por cédula (DEBE IR ANTES DE /:id)
router.get('/cedula/:cedula', personalController.buscarPorCedula);

// Buscar por ID
router.get('/:id', personalController.buscarPorId);

// Crear
router.post('/', personalController.crear);

// Actualizar
router.put('/:id', personalController.actualizar);

// Eliminar
router.delete('/:id', personalController.eliminar);

module.exports = router;