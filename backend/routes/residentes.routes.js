const express = require('express');
const router = express.Router();
const residentesController = require('../controllers/residentes.controller');

// Listar todo
router.get('/', residentesController.listar);

// Obtener rostros registrados (ANTES DE /:id)
router.get('/rostros', residentesController.obtenerRostros);

// Buscar por documento (ANTES DE /:id)
router.get('/documento/:documento', residentesController.buscarPorDocumento);

// Buscar por ID
router.get('/:id', residentesController.buscarPorId);

// Crear
router.post('/', residentesController.crear);

// Actualizar
router.put('/:id', residentesController.actualizar);

// Guardar descriptor facial
router.put('/:id/rostro', residentesController.guardarRostro);

// Eliminar descriptor facial
router.delete('/:id/rostro', residentesController.eliminarRostro);

// Eliminar residente
router.delete('/:id', residentesController.eliminar);

module.exports = router;
