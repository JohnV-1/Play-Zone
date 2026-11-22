const db = {
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
        }
    ],
    perfil: {
        id: 1,
        nombre: 'David',
        descripcion: 'Me gustan los juegos casuales y mejorar mis récords.',
        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png'
    },
    favoritosIds: ['gato'],
    rankings: {
        gato: {
            mejorPuntaje: 1450,
            posicionActual: 2,
            tabla: [
                { posicion: 1, avatar: '🐱', nombre: 'Ana', puntuacion: 1800, fecha: '2026-11-15', esUsuarioActual: false },
                { posicion: 2, avatar: '🎮', nombre: 'David', puntuacion: 1450, fecha: '2026-11-17', esUsuarioActual: true },
                { posicion: 3, avatar: '🚀', nombre: 'Carlos', puntuacion: 1200, fecha: '2026-11-16', esUsuarioActual: false },
                { posicion: 4, avatar: '⭐', nombre: 'Lucía', puntuacion: 950, fecha: '2026-11-14', esUsuarioActual: false }
            ]
        },
        atrapa: {
            mejorPuntaje: 2300,
            posicionActual: 3,
            tabla: [
                { posicion: 1, avatar: '⭐', nombre: 'Lucía', puntuacion: 3100, fecha: '2026-11-18', esUsuarioActual: false },
                { posicion: 2, avatar: '🐱', nombre: 'Ana', puntuacion: 2750, fecha: '2026-11-16', esUsuarioActual: false },
                { posicion: 3, avatar: '🎮', nombre: 'David', puntuacion: 2300, fecha: '2026-11-17', esUsuarioActual: true },
                { posicion: 4, avatar: '👾', nombre: 'Mateo', puntuacion: 1900, fecha: '2026-11-12', esUsuarioActual: false }
            ]
        },
        esquiva: {
            mejorPuntaje: 4200,
            posicionActual: 1,
            tabla: [
                { posicion: 1, avatar: '🎮', nombre: 'David', puntuacion: 4200, fecha: '2026-11-18', esUsuarioActual: true },
                { posicion: 2, avatar: '🚀', nombre: 'Carlos', puntuacion: 3850, fecha: '2026-11-17', esUsuarioActual: false },
                { posicion: 3, avatar: '👾', nombre: 'Mateo', puntuacion: 3400, fecha: '2026-11-15', esUsuarioActual: false },
                { posicion: 4, avatar: '🐱', nombre: 'Ana', puntuacion: 2900, fecha: '2026-11-13', esUsuarioActual: false }
            ]
        },
        'space-invaders': {
            mejorPuntaje: 5600,
            posicionActual: 2,
            tabla: [
                { posicion: 1, avatar: '👾', nombre: 'Mateo', puntuacion: 6400, fecha: '2026-11-18', esUsuarioActual: false },
                { posicion: 2, avatar: '🎮', nombre: 'David', puntuacion: 5600, fecha: '2026-11-17', esUsuarioActual: true },
                { posicion: 3, avatar: '⭐', nombre: 'Lucía', puntuacion: 4900, fecha: '2026-11-15', esUsuarioActual: false },
                { posicion: 4, avatar: '🚀', nombre: 'Carlos', puntuacion: 4100, fecha: '2026-11-11', esUsuarioActual: false }
            ]
        }
    }
};

module.exports = db;