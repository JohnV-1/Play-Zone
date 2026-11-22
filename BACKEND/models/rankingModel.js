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
    obtenerPorJuego(juegoId) {
        const juego = JuegoModel.obtenerPorId(juegoId);
        if (!juego) return null;

        const registros = db.puntuaciones
            .filter((item) => item.juegoId === juegoId)
            .map((item) => {
                const esUsuarioActual = item.usuarioId === db.perfil.id;
                return {
                    usuarioId: item.usuarioId,
                    nombre: esUsuarioActual ? db.perfil.nombre : item.nombre,
                    avatar: esUsuarioActual ? db.perfil.avatar : item.avatar,
                    puntuacion: item.puntuacion,
                    fecha: item.fecha,
                    esUsuarioActual
                };
            })
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .map((item, indice) => ({
                posicion: indice + 1,
                avatar: item.avatar,
                nombre: item.nombre,
                puntuacion: item.puntuacion,
                fecha: item.fecha,
                esUsuarioActual: item.esUsuarioActual
            }));

        const registroUsuario = registros.find((item) => item.esUsuarioActual);

        return {
            juego,
            tabla: registros,
            mejorPuntaje: registroUsuario ? registroUsuario.puntuacion : 0,
            posicionActual: registroUsuario ? registroUsuario.posicion : null
        };
    },

    registrarPuntuacion({ juegoId, puntuacion }) {
        const juego = JuegoModel.obtenerPorId(juegoId);
        if (!juego) return null;

        const puntajeNumerico = Math.max(0, Math.floor(Number(puntuacion) || 0));
        const fechaHoy = formatearFechaActual();

        const existente = db.puntuaciones.find(
            (item) => item.juegoId === juegoId && item.usuarioId === db.perfil.id
        );

        let nuevoRecord = false;

        if (!existente) {
            db.puntuaciones.push({
                juegoId,
                usuarioId: db.perfil.id,
                nombre: db.perfil.nombre,
                avatar: db.perfil.avatar,
                puntuacion: puntajeNumerico,
                fecha: fechaHoy
            });
            nuevoRecord = puntajeNumerico > 0;
        } else if (puntajeNumerico > existente.puntuacion) {
            existente.puntuacion = puntajeNumerico;
            existente.fecha = fechaHoy;
            nuevoRecord = true;
        }

        const rankingActualizado = this.obtenerPorJuego(juegoId);

        return {
            guardado: true,
            nuevoRecord,
            ...rankingActualizado
        };
    }
};

module.exports = RankingModel;