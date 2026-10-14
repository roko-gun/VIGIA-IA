const express = require('express');
const router = express.Router();
const accesosController = require('../controllers/accesos.controller');

// Listar todos
router.get('/', accesosController.listar);

// Filtros (DEBEN IR ANTES DE /:id)
router.get('/tipo/:tipo', accesosController.listarPorTipo);
router.get('/accion/:accion', accesosController.listarPorAccion);
router.get('/fecha/:fecha', accesosController.listarPorFecha);

// Buscar por ID
router.get('/:id', accesosController.buscarPorId);

// Crear
router.post('/', accesosController.crear);

// Eliminar
router.delete('/:id', accesosController.eliminar);

module.exports = router;