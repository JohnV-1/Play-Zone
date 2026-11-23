// Base de datos en memoria (temporal para la Entrega 3).
// En la entrega final esta información se guardará en MongoDB Atlas.
// Al reiniciar el servidor, todo vuelve a estos valores iniciales.

const AVATAR_DEFAULT = 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png';

const db = {
    AVATAR_DEFAULT,

    juegos: [
        {
            id: 'gato',
            nombre: 'Gato Jump',
            categoria: 'Arcade',
            descripcion: 'Salta los obstáculos y consigue tu mejor puntuación.',
            controles: 'Espacio, W, flecha arriba o toque en la pantalla.',
            imagen: '../assets/imagenes/Juego1.png',
            pagina: 'Game_01.html'
        },
        {
            id: 'atrapa',
            nombre: 'Atrapa la estrella',
            categoria: 'Arcade',
            descripcion: 'Atrapa la estrella tantas veces como puedas en 20 segundos.',
            controles: 'Clic o toque sobre la estrella.',
            imagen: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23131825'/><text x='50%25' y='54%25' font-size='110' text-anchor='middle' dominant-baseline='middle' fill='%23facc15'>★</text></svg>",
            pagina: 'Game_02.html'
        },
        {
            id: 'esquiva',
            nombre: 'Esquiva bloques',
            categoria: 'Arcade',
            descripcion: 'Cambia de carril para evitar los bloques rojos.',
            controles: 'Flechas izquierda y derecha o botones en pantalla.',
            imagen: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23131825'/><text x='50%25' y='54%25' font-size='85' text-anchor='middle' dominant-baseline='middle' fill='%239361ff'>▲ ▣</text></svg>",
            pagina: 'Game_03.html'
        },
        {
            id: 'snake',
            nombre: 'Gato Snake',
            categoria: 'Arcade',
            descripcion: 'Guía a la serpiente, come para crecer y no choques con las paredes ni contigo mismo.',
            controles: 'Flechas, WASD, deslizar el dedo o botones en pantalla.',
            imagen: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23131825'/><text x='50%25' y='54%25' font-size='70' text-anchor='middle' dominant-baseline='middle' fill='%239361ff'>■■■<tspan fill='%23facc15'>●</tspan></text></svg>",
            pagina: 'Game_04.html'
        }
    ],

    // Usuarios de prueba. Las contraseñas están en texto plano SOLO en este avance;
    // en la entrega final se guardarán cifradas (bcrypt) en MongoDB.
    usuarios: [
        { id: 1, nombre: 'David', email: 'david@playzone.com', password: '123456', descripcion: 'Me gustan los juegos casuales y mejorar mis récords.', avatar: AVATAR_DEFAULT },
        { id: 2, nombre: 'John', email: 'john@p.com', password: '123456', descripcion: 'Holaaaaaa', avatar: AVATAR_DEFAULT },
        { id: 3, nombre: 'Luna', email: 'luna@playzone.com', password: '123456', descripcion: 'Especialista en reflejos rápidos y estrellas fugaces.', avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png' },
        { id: 4, nombre: 'RetroMax', email: 'retromax@playzone.com', password: '123456', descripcion: 'Fanático de los clásicos arcade de los 80 y 90.', avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140037.png' },
        { id: 5, nombre: 'Astro', email: 'astro@playzone.com', password: '123456', descripcion: 'Explorando cada minijuego de Play Zone.', avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140051.png' }
    ],
    siguienteUsuarioId: 6,

    // token -> id del usuario que inició sesión
    sesiones: {},

    // Cada favorito pertenece a un usuario
    favoritos: [
        { usuarioId: 1, juegoId: 'gato' },
        { usuarioId: 2, juegoId: 'gato' },
        { usuarioId: 2, juegoId: 'atrapa' },
        { usuarioId: 3, juegoId: 'atrapa' },
        { usuarioId: 3, juegoId: 'esquiva' },
        { usuarioId: 4, juegoId: 'gato' },
        { usuarioId: 4, juegoId: 'esquiva' },
        { usuarioId: 5, juegoId: 'esquiva' }
    ],

    // Una puntuación (el récord) por usuario y por juego.
    // El nombre y avatar se toman del usuario, así siempre están actualizados.
    puntuaciones: [
        // Gato Jump
        { juegoId: 'gato', usuarioId: 2, puntuacion: 420, fecha: '18 nov 2026' },
        { juegoId: 'gato', usuarioId: 3, puntuacion: 310, fecha: '19 nov 2026' },
        { juegoId: 'gato', usuarioId: 1, puntuacion: 250, fecha: '20 nov 2026' },
        { juegoId: 'gato', usuarioId: 4, puntuacion: 180, fecha: '21 nov 2026' },

        // Atrapa la estrella
        { juegoId: 'atrapa', usuarioId: 3, puntuacion: 240, fecha: '19 nov 2026' },
        { juegoId: 'atrapa', usuarioId: 1, puntuacion: 190, fecha: '20 nov 2026' },
        { juegoId: 'atrapa', usuarioId: 5, puntuacion: 150, fecha: '21 nov 2026' },
        { juegoId: 'atrapa', usuarioId: 2, puntuacion: 120, fecha: '21 nov 2026' },

        // Esquiva bloques
        { juegoId: 'esquiva', usuarioId: 1, puntuacion: 350, fecha: '20 nov 2026' },
        { juegoId: 'esquiva', usuarioId: 4, puntuacion: 290, fecha: '20 nov 2026' },
        { juegoId: 'esquiva', usuarioId: 2, puntuacion: 210, fecha: '21 nov 2026' },
        { juegoId: 'esquiva', usuarioId: 5, puntuacion: 140, fecha: '22 nov 2026' }
    ]
};

module.exports = db;