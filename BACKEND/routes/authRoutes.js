const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/registro', AuthController.registro);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.sesionOpcional, AuthController.logout);

module.exports = router;