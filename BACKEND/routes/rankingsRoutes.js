const express = require('express');
const router = express.Router();
const RankingsController = require('../controllers/rankingsController');
const AuthController = require('../controllers/authController');

router.get('/:juego', AuthController.sesionOpcional, RankingsController.obtenerPorJuego);
router.post('/', AuthController.requiereSesion, RankingsController.guardarPuntuacion);

module.exports = router;