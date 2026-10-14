const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');

// Reportes en JSON
router.get('/accesos', reportesController.accesosGenerales);
router.get('/accesos/fecha/:desde/:hasta', reportesController.accesosPorFecha);
router.get('/horas-trabajadas', reportesController.horasTrabajadas);
router.get('/visitas-apartamento', reportesController.visitasPorApartamento);

// Exportación a Excel
router.get('/accesos/excel', reportesController.accesosGeneralesExcel);
router.get('/accesos/fecha/:desde/:hasta/excel', reportesController.accesosPorFechaExcel);
router.get('/horas-trabajadas/excel', reportesController.horasTrabajadasExcel);
router.get('/visitas-apartamento/excel', reportesController.visitasPorApartamentoExcel);

module.exports = router;

