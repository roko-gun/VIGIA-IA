const express = require('express');
const router = express.Router();
const visitantesController = require('../controllers/visitantes.controller');

//listar todos
router.get('/', visitantesController.listar);

//Buscar por documento siempre debe ir antes del ID
router.get('/documento/:documento', visitantesController.buscarPorDocumento);

// Buscar por ID
router.get('/:id', visitantesController.buscarPorId);

// crear
router.post('/', visitantesController.crear);

//actaulizar
router.put('/:id', visitantesController.actualizar);

//eliminar
router.delete('/:id', visitantesController.eliminar);

module.exports = router;

