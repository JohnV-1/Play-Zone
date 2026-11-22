const PerfilModel = require('../models/perfilModel');

const PerfilController = {
    obtenerPerfil(req, res) {
        res.json(PerfilModel.obtener());
    },

    actualizarPerfil(req, res) {
        const { nombre, descripcion } = req.body;
        if (!nombre || nombre.trim().length < 3) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El nombre debe tener al menos 3 caracteres.'
            });
        }

        const actualizado = PerfilModel.actualizar({ nombre, descripcion });
        res.json(actualizado);
    },

    eliminarPerfil(req, res) {
        PerfilModel.reiniciarCuenta();
        res.json({ eliminado: true });
    }
};

module.exports = PerfilController;