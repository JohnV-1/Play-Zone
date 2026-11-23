const db = require('../database/db');
const JuegoModel = require('./juegoModel');

function mapearFavoritos(ids) {
    return (ids || [])
        .map((juegoId) => JuegoModel.obtenerPorId(juegoId))
        .filter(Boolean);
}

const PerfilModel = {
    obtener() {
        return {
            ...db.perfil,
            esPropio: true,
            favoritos: mapearFavoritos(db.favoritosIds)
        };
    },

    obtenerPorId(id) {
        const idNum = Number(id);
        if (!idNum || idNum === db.perfil.id) {
            return this.obtener();
        }

        const otroUsuario = db.usuarios.find((u) => u.id === idNum);
        if (!otroUsuario) return null;

        return {
            id: otroUsuario.id,
            nombre: otroUsuario.nombre,
            descripcion: otroUsuario.descripcion,
            avatar: otroUsuario.avatar,
            esPropio: false,
            favoritos: mapearFavoritos(otroUsuario.favoritosIds)
        };
    },

    actualizar({ nombre, descripcion }) {
        db.perfil = {
            ...db.perfil,
            nombre: nombre.trim(),
            descripcion: descripcion !== undefined ? descripcion.trim() : db.perfil.descripcion
        };
        return this.obtener();
    },

    reiniciarCuenta() {
        db.perfil = {
            id: 1,
            nombre: 'David',
            descripcion: 'Me gustan los juegos casuales y mejorar mis récords.',
            avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png'
        };
        db.favoritosIds = [];
        return true;
    }
};

module.exports = PerfilModel;