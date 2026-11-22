const db = require('../database/db');

const JuegoModel = {
    obtenerTodos() {
        return db.juegos;
    },

    obtenerPorId(id) {
        return db.juegos.find((juego) => juego.id === id) || null;
    }
};

module.exports = JuegoModel;