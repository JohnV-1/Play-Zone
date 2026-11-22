const db = require('../database/db');

const PerfilModel = {
    obtener() {
        return db.perfil;
    },

    actualizar({ nombre, descripcion }) {
        db.perfil = {
            ...db.perfil,
            nombre: nombre.trim(),
            descripcion: descripcion !== undefined ? descripcion.trim() : db.perfil.descripcion
        };
        return db.perfil;
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