const PerfilModel = require('../models/perfilModel');

const AuthController = {
    login(req, res) {
        const { usuario, email, password } = req.body;
        if ((!usuario && !email) || !password) {
            return res.status(400).json({ ok: false, mensaje: 'Faltan credenciales' });
        }

        const perfil = PerfilModel.obtener();
        res.json({
            token: 'demo-token',
            usuario: perfil
        });
    },

    logout(req, res) {
        res.json({ ok: true });
    }
};

module.exports = AuthController;