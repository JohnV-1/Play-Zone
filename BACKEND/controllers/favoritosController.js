const FavoritoModel = require('../models/favoritoModel');

const FavoritosController = {
    listarFavoritos(req, res) {
        res.json(FavoritoModel.obtenerTodos());
    },

    agregarFavorito(req, res) {
        const { juegoId } = req.body;
        if (!juegoId) {
            return res.status(400).json({ ok: false, mensaje: 'Se requiere juegoId.' });
        }

        const favoritos = FavoritoModel.agregar(juegoId);
        if (!favoritos) {
            return res.status(404).json({ ok: false, mensaje: 'El juego no existe en el catálogo.' });
        }

        res.status(201).json({ agregado: true, favoritos });
    },

    eliminarFavorito(req, res) {
        const { juegoId } = req.params;
        const favoritos = FavoritoModel.eliminar(juegoId);
        res.json({ eliminado: true, favoritos });
    }
};

module.exports = FavoritosController;