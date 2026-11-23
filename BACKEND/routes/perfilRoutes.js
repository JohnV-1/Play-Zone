const express = require('express');
const router = express.Router();
const PerfilController = require('../controllers/perfilController');

router.get('/', PerfilController.obtenerPerfil);
router.get('/:id', PerfilController.obtenerPerfilPorId);
router.put('/', PerfilController.actualizarPerfil);
router.delete('/', PerfilController.eliminarPerfil);

module.exports = router;