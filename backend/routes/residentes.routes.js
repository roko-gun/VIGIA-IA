const express = require('express');
const router = express.Router();
const residentesController = require('../controllers/residentes.controller');

// Listar todos
router.get('/', residentesController.listar);

// Buscar por documento (DEBE IR ANTES DE /:id)
router.get('/documento/:documento', residentesController.buscarPorDocumento);

// Buscar por ID (VA DESPUÉS)
router.get('/:id', residentesController.buscarPorId);

// Crear
router.post('/', residentesController.crear);

// Actualizar
router.put('/:id', residentesController.actualizar);

// Eliminar
router.delete('/:id', residentesController.eliminar);

module.exports = router;