const express = require('express');
const router = express.Router();
const FavoritosController = require('../controllers/favoritosController');
const AuthController = require('../controllers/authController');

router.use(AuthController.requiereSesion);

router.get('/', FavoritosController.listarFavoritos);
router.post('/', FavoritosController.agregarFavorito);
router.delete('/:juegoId', FavoritosController.eliminarFavorito);

module.exports = router;