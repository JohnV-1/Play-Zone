const crypto = require('crypto');
const db = require('../database/db');
const FavoritoModel = require('./favoritoModel');

// ---------- Validaciones (reglas de los datos del usuario) ----------

// Revisa que el valor sea texto y que, sin espacios al inicio y final,
// tenga entre min y max caracteres.
function esTextoValido(valor, min, max) {
    if (typeof valor !== 'string') return false;
    const largo = valor.trim().length;
    return largo >= min && largo <= max;
}

function esEmailValido(valor) {
    return typeof valor === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
}

// Quita la contraseña antes de mandar el usuario al Frontend
function sinPassword(usuario) {
    if (!usuario) return null;
    const { password, ...resto } = usuario;
    return resto;
}

const PerfilModel = {
    esTextoValido,
    esEmailValido,
    sinPassword,

    obtenerPorId(id) {
        return db.usuarios.find((u) => u.id === id) || null;
    },

    // Datos públicos de un jugador (sin correo ni contraseña) y sus favoritos.
    // usuarioActualId es el usuario con sesión (o null) para saber si es su propio perfil.
    obtenerPublico(id, usuarioActualId = null) {
        const usuario = this.obtenerPorId(Number(id));
        if (!usuario) return null;
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            descripcion: usuario.descripcion,
            avatar: usuario.avatar,
            esPropio: usuario.id === usuarioActualId,
            favoritos: FavoritoModel.obtenerTodos(usuario.id)
        };
    },

    obtenerPorEmail(email) {
        const buscado = email.trim().toLowerCase();
        return db.usuarios.find((u) => u.email === buscado) || null;
    },

    nombreEnUso(nombre, excluirId = null) {
        const buscado = nombre.trim().toLowerCase();
        return db.usuarios.some((u) => u.nombre.toLowerCase() === buscado && u.id !== excluirId);
    },

    crear({ nombre, email, password }) {
        const nuevo = {
            id: db.siguienteUsuarioId++,
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            password,
            descripcion: '',
            avatar: db.AVATAR_DEFAULT
        };
        db.usuarios.push(nuevo);
        return nuevo;
    },

    actualizar(id, { nombre, descripcion }) {
        const usuario = this.obtenerPorId(id);
        if (!usuario) return null;
        usuario.nombre = nombre.trim();
        if (descripcion !== undefined) {
            usuario.descripcion = descripcion.trim();
        }
        return usuario;
    },

    // Borra al usuario y todo lo que le pertenece
    eliminar(id) {
        const existia = db.usuarios.some((u) => u.id === id);
        db.usuarios = db.usuarios.filter((u) => u.id !== id);
        db.favoritos = db.favoritos.filter((f) => f.usuarioId !== id);
        db.puntuaciones = db.puntuaciones.filter((p) => p.usuarioId !== id);
        Object.keys(db.sesiones).forEach((token) => {
            if (db.sesiones[token] === id) delete db.sesiones[token];
        });
        return existia;
    },

    // ---------- Sesiones ----------
    crearSesion(usuarioId) {
        const token = crypto.randomUUID();
        db.sesiones[token] = usuarioId;
        return token;
    },

    obtenerPorToken(token) {
        const usuarioId = db.sesiones[token];
        return usuarioId ? this.obtenerPorId(usuarioId) : null;
    },

    cerrarSesion(token) {
        delete db.sesiones[token];
    }
};

module.exports = PerfilModel;