const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
    res.json({ ok: true, mensaje: 'Servidor activo' });
});

// --- DATOS HARDCODEADOS DE CLASIFICACIONES ---
const rankingsPorJuego = {
  gato: {
    mejorPuntaje: 1450,
    posicionActual: 2,
    tabla: [
      { posicion: 1, nombre: "Ana", puntuacion: 1800, fecha: "2026-11-15", esUsuarioActual: false },
      { posicion: 2, nombre: "David", puntuacion: 1450, fecha: "2026-11-17", esUsuarioActual: true },
      { posicion: 3, nombre: "Carlos", puntuacion: 1200, fecha: "2026-11-16", esUsuarioActual: false },
      { posicion: 4, nombre: "Lucía", puntuacion: 950, fecha: "2026-11-14", esUsuarioActual: false }
    ]
  },
  atrapa: {
    mejorPuntaje: 2300,
    posicionActual: 3,
    tabla: [
      { posicion: 1, nombre: "Lucía", puntuacion: 3100, fecha: "2026-11-18", esUsuarioActual: false },
      { posicion: 2, nombre: "Ana", puntuacion: 2750, fecha: "2026-11-16", esUsuarioActual: false },
      { posicion: 3, nombre: "David", puntuacion: 2300, fecha: "2026-11-17", esUsuarioActual: true },
      { posicion: 4, nombre: "Mateo", puntuacion: 1900, fecha: "2026-11-12", esUsuarioActual: false }
    ]
  },
  esquiva: {
    mejorPuntaje: 4200,
    posicionActual: 1,
    tabla: [
      { posicion: 1, nombre: "David", puntuacion: 4200, fecha: "2026-11-18", esUsuarioActual: true },
      { posicion: 2, nombre: "Carlos", puntuacion: 3850, fecha: "2026-11-17", esUsuarioActual: false },
      { posicion: 3, nombre: "Mateo", puntuacion: 3400, fecha: "2026-11-15", esUsuarioActual: false },
      { posicion: 4, nombre: "Ana", puntuacion: 2900, fecha: "2026-11-13", esUsuarioActual: false }
    ]
  }
};

// --- RUTAS DE CLASIFICACIONES Y RÉCORDS ---

app.get('/api/rankings/:juego', (req, res) => {
  const { juego } = req.params;
  const datosRanking = rankingsPorJuego[juego];

  if (!datosRanking) {
    return res.status(404).json({
      ok: false,
      mensaje: `No se encontraron clasificaciones para el juego: ${juego}`
    });
  }

  res.json({
    tabla: datosRanking.tabla,
    mejorPuntaje: datosRanking.mejorPuntaje,
    posicionActual: datosRanking.posicionActual
  });
});

app.post('/api/rankings', (req, res) => {
  const { juegoId, puntuacion } = req.body;

  if (!juegoId || puntuacion === undefined) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Se requieren juegoId y puntuacion'
    });
  }

  res.json({
    guardado: true,
    nuevoRecord: true,
    posicionActual: 6
  });
});

// --- DATOS HARDCODEADOS DEL PERFIL ---
let perfilUsuario = {
  nombre: "David",
  descripcion: "Me gustan los juegos casuales y mejorar mis récords.",
};

// --- RUTAS DE PERFIL ---

app.get('/api/perfil', (req, res) => {
  res.json(perfilUsuario);
});

app.put('/api/perfil', (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || !nombre.trim()) {
    return res.status(400).json({
      ok: false,
      mensaje: 'El nombre es obligatorio'
    });
  }

  perfilUsuario = {
    ...perfilUsuario,
    nombre: nombre.trim(),
    descripcion: descripcion !== undefined ? descripcion.trim() : perfilUsuario.descripcion
  };

  res.json(perfilUsuario);
});

app.delete('/api/perfil', (req, res) => {
  res.json({ eliminado: true });
});

app.listen(port, () => {
    console.log('Servidor corriendo en puerto' + port)
})