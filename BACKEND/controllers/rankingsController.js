const db = require('../database/db');

const RankingsController = {
    obtenerPorJuego(req, res) {
        const datos = db.rankings[req.params.juego];
        if (!datos) {
            return res.status(404).json({ ok: false, mensaje: 'Ranking no encontrado.' });
        }
        res.json(datos);
    },

    guardarPuntuacion(req, res) {
        const { juegoId, puntuacion } = req.body;
        if (!juegoId || puntuacion === undefined) {
            return res.status(400).json({ ok: false, mensaje: 'Se requieren juegoId y puntuacion.' });
        }
        res.json({ guardado: true, nuevoRecord: true, posicionActual: 6 });
    }
};

module.exports = RankingsController;