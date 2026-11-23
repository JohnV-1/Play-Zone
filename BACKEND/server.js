const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');
const juegosRoutes = require('./routes/juegosRoutes');
const rankingsRoutes = require('./routes/rankingsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Servir la carpeta FRONTEND como archivos estáticos
app.use(express.static(path.join(__dirname, '../FRONTEND')));

// 2. Redirigir http://localhost:3000 al catálogo principal
app.get('/', (req, res) => {
    res.redirect('/views/Home.html');
});

app.get('/api/status', (req, res) => {
    res.json({ ok: true, mensaje: 'Servidor Play Zone activo' });
});

app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/juegos', juegosRoutes);
app.use('/api/rankings', rankingsRoutes);

// 3. Cualquier ruta /api que no exista responde JSON (no una página HTML)
app.use('/api', (req, res) => {
    res.status(404).json({ ok: false, mensaje: `La ruta ${req.method} ${req.originalUrl} no existe.` });
});

// 4. Manejador global de errores: el Frontend siempre recibe JSON con "mensaje"
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ ok: false, mensaje: 'Los datos enviados no son un JSON válido.' });
    }
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Ocurrió un error en el servidor. Intenta de nuevo.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});