const db = require('../database/db');
const JuegoModel = require('./juegoModel');

const FavoritoModel = {
    obtenerTodos(usuarioId) {
        return db.favoritos
            .filter((f) => f.usuarioId === usuarioId)
            .map((f) => JuegoModel.obtenerPorId(f.juegoId))
            .filter(Boolean);
    },

    // Regresa null si el juego no existe
    agregar(usuarioId, juegoId) {
        if (!JuegoModel.obtenerPorId(juegoId)) return null;

        const yaExiste = db.favoritos.some((f) => f.usuarioId === usuarioId && f.juegoId === juegoId);
        if (!yaExiste) {
            db.favoritos.push({ usuarioId, juegoId });
        }
        return this.obtenerTodos(usuarioId);
    },

    // Regresa null si el juego no estaba en favoritos
    eliminar(usuarioId, juegoId) {
        const antes = db.favoritos.length;
        db.favoritos = db.favoritos.filter((f) => !(f.usuarioId === usuarioId && f.juegoId === juegoId));
        if (db.favoritos.length === antes) return null;
        return this.obtenerTodos(usuarioId);
    }
};

module.exports = FavoritoModel;