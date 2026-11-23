const db = require('../database/db');
const JuegoModel = require('./juegoModel');

function formatearFechaActual() {
    return new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).replace('.', '');
}

const RankingModel = {
    // usuarioActualId puede ser null cuando no hay sesión
    obtenerPorJuego(juegoId, usuarioActualId = null) {
        const juego = JuegoModel.obtenerPorId(juegoId);
        if (!juego) return null;

        const tabla = db.puntuaciones
            .filter((item) => item.juegoId === juegoId)
            .map((item) => {
                const usuario = db.usuarios.find((u) => u.id === item.usuarioId);
                if (!usuario) return null; // usuario eliminado
                return {
                    usuarioId: usuario.id,
                    nombre: usuario.nombre,
                    avatar: usuario.avatar,
                    puntuacion: item.puntuacion,
                    fecha: item.fecha,
                    esUsuarioActual: usuario.id === usuarioActualId
                };
            })
            .filter(Boolean)
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .map((item, indice) => ({ posicion: indice + 1, ...item }));

        const registroUsuario = tabla.find((item) => item.esUsuarioActual);

        return {
            juego,
            tabla,
            mejorPuntaje: registroUsuario ? registroUsuario.puntuacion : 0,
            posicionActual: registroUsuario ? registroUsuario.posicion : null
        };
    },

    // Solo se guarda si es mejor que el récord anterior del usuario
    registrarPuntuacion(usuarioId, juegoId, puntuacion) {
        if (!JuegoModel.obtenerPorId(juegoId)) return null;

        const fechaHoy = formatearFechaActual();
        const existente = db.puntuaciones.find(
            (item) => item.juegoId === juegoId && item.usuarioId === usuarioId
        );

        let nuevoRecord = false;
        if (!existente) {
            db.puntuaciones.push({ juegoId, usuarioId, puntuacion, fecha: fechaHoy });
            nuevoRecord = puntuacion > 0;
        } else if (puntuacion > existente.puntuacion) {
            existente.puntuacion = puntuacion;
            existente.fecha = fechaHoy;
            nuevoRecord = true;
        }

        return {
            guardado: true,
            nuevoRecord,
            ...this.obtenerPorJuego(juegoId, usuarioId)
        };
    }
};

module.exports = RankingModel;