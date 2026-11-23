const PerfilModel = require('../models/perfilModel');

const PerfilController = {
    // GET /api/perfil (requiere sesión): tu perfil completo, con correo y favoritos
    obtenerPerfil(req, res) {
        res.json({
            ...PerfilModel.obtenerPublico(req.usuario.id, req.usuario.id),
            email: req.usuario.email
        });
    },

    // GET /api/perfil/:id (sesión opcional): perfil público de cualquier jugador
    obtenerPerfilPorId(req, res) {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ ok: false, mensaje: 'El id de usuario no es válido.' });
        }

        const usuarioActualId = req.usuario ? req.usuario.id : null;
        const perfil = PerfilModel.obtenerPublico(id, usuarioActualId);
        if (!perfil) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
        }
        res.json(perfil);
    },

    // Las siguientes rutas usan AuthController.requiereSesion, así que req.usuario siempre existe.

    actualizarPerfil(req, res) {
        const { nombre, descripcion } = req.body || {};

        if (!PerfilModel.esTextoValido(nombre, 3, 25)) {
            return res.status(400).json({ ok: false, mensaje: 'El nombre debe tener entre 3 y 25 caracteres.' });
        }
        if (descripcion !== undefined && !PerfilModel.esTextoValido(descripcion, 0, 200)) {
            return res.status(400).json({ ok: false, mensaje: 'La descripción debe ser texto de máximo 200 caracteres.' });
        }
        if (PerfilModel.nombreEnUso(nombre, req.usuario.id)) {
            return res.status(409).json({ ok: false, mensaje: 'Ese nombre de usuario ya está en uso.' });
        }

        const actualizado = PerfilModel.actualizar(req.usuario.id, { nombre, descripcion });
        res.json(PerfilModel.sinPassword(actualizado));
    },

    eliminarPerfil(req, res) {
        PerfilModel.eliminar(req.usuario.id);
        res.json({ ok: true, eliminado: true, mensaje: 'Tu cuenta fue eliminada.' });
    }
};

module.exports = PerfilController;