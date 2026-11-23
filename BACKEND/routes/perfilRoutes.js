const express = require('express');
const router = express.Router();
const PerfilController = require('../controllers/perfilController');
const AuthController = require('../controllers/authController');

// Tu perfil: requiere sesión
router.get('/', AuthController.requiereSesion, PerfilController.obtenerPerfil);
router.put('/', AuthController.requiereSesion, PerfilController.actualizarPerfil);
router.delete('/', AuthController.requiereSesion, PerfilController.eliminarPerfil);

// Perfil de otro jugador (desde Clasificaciones): público
router.get('/:id', AuthController.sesionOpcional, PerfilController.obtenerPerfilPorId);

module.exports = router;
