const express = require('express');
const router = express.Router();
const PerfilController = require('../controllers/perfilController');
const AuthController = require('../controllers/authController');

router.use(AuthController.requiereSesion);

router.get('/', PerfilController.obtenerPerfil);
router.put('/', PerfilController.actualizarPerfil);
router.delete('/', PerfilController.eliminarPerfil);

module.exports = router;