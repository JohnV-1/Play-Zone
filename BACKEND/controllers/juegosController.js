const JuegoModel = require('../models/juegoModel');

const JuegosController = {
    listarJuegos(req, res) {
        res.json(JuegoModel.obtenerTodos());
    },

    obtenerJuego(req, res) {
        const juego = JuegoModel.obtenerPorId(req.params.id);
        if (!juego) {
            return res.status(404).json({ ok: false, mensaje: 'Juego no encontrado.' });
        }
        res.json(juego);
    }
};

module.exports = JuegosController;