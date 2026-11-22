const express = require('express');
const router = express.Router();
const JuegosController = require('../controllers/juegosController');

router.get('/', JuegosController.listarJuegos);
router.get('/:id', JuegosController.obtenerJuego);

module.exports = router;