const RankingModel = require('../models/rankingModel');

// Límite para evitar puntuaciones imposibles enviadas a mano
const PUNTUACION_MAXIMA = 100000;

const RankingsController = {
    obtenerPorJuego(req, res) {
        const usuarioId = req.usuario ? req.usuario.id : null;
        const datos = RankingModel.obtenerPorJuego(req.params.juego, usuarioId);
        if (!datos) {
            return res.status(404).json({
                ok: false,
                mensaje: `No se encontraron clasificaciones para el juego: ${req.params.juego}`
            });
        }
        res.json(datos);
    },

    guardarPuntuacion(req, res) {
        const { juegoId, puntuacion } = req.body || {};
        if (typeof juegoId !== 'string' || !juegoId.trim()) {
            return res.status(400).json({ ok: false, mensaje: 'Se requiere juegoId.' });
        }
        if (!Number.isInteger(puntuacion) || puntuacion < 0 || puntuacion > PUNTUACION_MAXIMA) {
            return res.status(400).json({
                ok: false,
                mensaje: `La puntuación debe ser un número entero entre 0 y ${PUNTUACION_MAXIMA}.`
            });
        }

        const resultado = RankingModel.registrarPuntuacion(req.usuario.id, juegoId.trim(), puntuacion);
        if (!resultado) {
            return res.status(404).json({ ok: false, mensaje: 'El juego indicado no existe en el catálogo.' });
        }

        res.status(201).json(resultado);
    }
};

module.exports = RankingsController;