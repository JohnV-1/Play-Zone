const db = require('../database/db');
const JuegoModel = require('./juegoModel');

const FavoritoModel = {
    obtenerTodos() {
        return db.favoritosIds
            .map((id) => JuegoModel.obtenerPorId(id))
            .filter(Boolean);
    },

    agregar(juegoId) {
        const juego = JuegoModel.obtenerPorId(juegoId);
        if (!juego) return null;

        if (!db.favoritosIds.includes(juegoId)) {
            db.favoritosIds.push(juegoId);
        }
        return this.obtenerTodos();
    },

    eliminar(juegoId) {
        db.favoritosIds = db.favoritosIds.filter((id) => id !== juegoId);
        return this.obtenerTodos();
    }
};

module.exports = FavoritoModel;