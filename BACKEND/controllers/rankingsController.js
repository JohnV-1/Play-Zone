const RankingModel = require('../models/rankingModel');

const RankingsController = {
    obtenerPorJuego(req, res) {
        const datos = RankingModel.obtenerPorJuego(req.params.juego);
        if (!datos) {
            return res.status(404).json({
                ok: false,
                mensaje: `No se encontraron clasificaciones para el juego: ${req.params.juego}`
            });
        }
        res.json(datos);
    },

    guardarPuntuacion(req, res) {
        const { juegoId, puntuacion } = req.body;
        if (!juegoId || puntuacion === undefined) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Se requieren juegoId y puntuacion.'
            });
        }

        const resultado = RankingModel.registrarPuntuacion({ juegoId, puntuacion });
        if (!resultado) {
            return res.status(404).json({
                ok: false,
                mensaje: 'El juego indicado no existe en el catálogo.'
            });
        }

        res.status(201).json(resultado);
    }
};

module.exports = RankingsController;