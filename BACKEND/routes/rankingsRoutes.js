const express = require('express');
const router = express.Router();
const RankingsController = require('../controllers/rankingsController');

router.get('/:juego', RankingsController.obtenerPorJuego);
router.post('/', RankingsController.guardarPuntuacion);

module.exports = router;