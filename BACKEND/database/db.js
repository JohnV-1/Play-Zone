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
    puntuaciones: [
        // Gato Jump
        { juegoId: 'gato', usuarioId: 2, nombre: 'Nova', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 420, fecha: '18 nov 2026' },
        { juegoId: 'gato', usuarioId: 3, nombre: 'Luna', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 310, fecha: '19 nov 2026' },
        { juegoId: 'gato', usuarioId: 1, nombre: 'David', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 250, fecha: '20 nov 2026' },
        { juegoId: 'gato', usuarioId: 4, nombre: 'RetroMax', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 180, fecha: '21 nov 2026' },

        // Atrapa la estrella
        { juegoId: 'atrapa', usuarioId: 3, nombre: 'Luna', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 240, fecha: '19 nov 2026' },
        { juegoId: 'atrapa', usuarioId: 1, nombre: 'David', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 190, fecha: '20 nov 2026' },
        { juegoId: 'atrapa', usuarioId: 5, nombre: 'Astro', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 150, fecha: '21 nov 2026' },
        { juegoId: 'atrapa', usuarioId: 2, nombre: 'Nova', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 120, fecha: '21 nov 2026' },

        // Esquiva bloques
        { juegoId: 'esquiva', usuarioId: 1, nombre: 'David', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 350, fecha: '20 nov 2026' },
        { juegoId: 'esquiva', usuarioId: 4, nombre: 'RetroMax', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 290, fecha: '20 nov 2026' },
        { juegoId: 'esquiva', usuarioId: 2, nombre: 'Nova', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 210, fecha: '21 nov 2026' },
        { juegoId: 'esquiva', usuarioId: 5, nombre: 'Astro', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', puntuacion: 140, fecha: '22 nov 2026' }
    ]
};

module.exports = db;