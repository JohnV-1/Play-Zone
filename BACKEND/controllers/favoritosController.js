const FavoritoModel = require('../models/favoritoModel');

const FavoritosController = {
    listarFavoritos(req, res) {
        res.json(FavoritoModel.obtenerTodos(req.usuario.id));
    },

    agregarFavorito(req, res) {
        const { juegoId } = req.body || {};
        if (typeof juegoId !== 'string' || !juegoId.trim()) {
            return res.status(400).json({ ok: false, mensaje: 'Se requiere juegoId.' });
        }

        const favoritos = FavoritoModel.agregar(req.usuario.id, juegoId.trim());
        if (!favoritos) {
            return res.status(404).json({ ok: false, mensaje: 'El juego no existe en el catálogo.' });
        }

        res.status(201).json({ ok: true, agregado: true, favoritos });
    },

    eliminarFavorito(req, res) {
        const favoritos = FavoritoModel.eliminar(req.usuario.id, req.params.juegoId);
        if (!favoritos) {
            return res.status(404).json({ ok: false, mensaje: 'Ese juego no está en tus favoritos.' });
        }
        res.json({ ok: true, eliminado: true, favoritos });
    }
};

module.exports = FavoritosController;