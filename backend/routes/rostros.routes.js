const express = require('express');
const router = express.Router();
const rostrosController = require('../controllers/rostros.controller');

router.get('/todos', rostrosController.todos);

module.exports = router;