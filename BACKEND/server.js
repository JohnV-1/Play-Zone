const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const favoritosRoutes = require('./routes/favoritosRoutes');
const juegosRoutes = require('./routes/juegosRoutes');
const rankingsRoutes = require('./routes/rankingsRoutes');

const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});