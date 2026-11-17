const express = require('express');
const router = express.Router();
const visitantesController = require('../controllers/visitantes.controller');

// Listar todos
router.get('/', visitantesController.listar);

// Buscar por documento (ANTES DE /:id)
router.get('/documento/:documento', visitantesController.buscarPorDocumento);

// Buscar por ID
router.get('/:id', visitantesController.buscarPorId);

// Crear
router.post('/', visitantesController.crear);

// Actualizar
router.put('/:id', visitantesController.actualizar);

// Registrar salida
router.put('/:id/salida', visitantesController.registrarSalida);

// Eliminar
router.delete('/:id', visitantesController.eliminar);

module.exports = router;
