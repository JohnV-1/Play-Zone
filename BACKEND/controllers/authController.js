const PerfilModel = require('../models/perfilModel');

// Lee el header "Authorization: Bearer <token>" y busca al usuario de esa sesión.
function obtenerSesion(req) {
    const header = req.headers.authorization || '';
    const [tipo, token] = header.split(' ');
    if (tipo !== 'Bearer' || !token) return null;

    const usuario = PerfilModel.obtenerPorToken(token);
    return usuario ? { usuario, token } : null;
}

const AuthController = {
    // ---------- Middlewares de sesión (se usan en las rutas) ----------

    // Para rutas que SOLO funcionan con sesión iniciada (perfil, favoritos, guardar puntuación).
    requiereSesion(req, res, next) {
        const sesion = obtenerSesion(req);
        if (!sesion) {
            return res.status(401).json({ ok: false, mensaje: 'Debes iniciar sesión para realizar esta acción.' });
        }
        req.usuario = sesion.usuario;
        req.token = sesion.token;
        next();
    },

    // Para rutas públicas que muestran algo extra si hay sesión (ej. "tu posición" en rankings).
    sesionOpcional(req, res, next) {
        const sesion = obtenerSesion(req);
        req.usuario = sesion ? sesion.usuario : null;
        req.token = sesion ? sesion.token : null;
        next();
    },

    // ---------- Rutas /api/auth ----------
    registro(req, res) {
        const { nombre, email, password } = req.body || {};

        if (!PerfilModel.esTextoValido(nombre, 3, 25)) {
            return res.status(400).json({ ok: false, mensaje: 'El nombre de usuario debe tener entre 3 y 25 caracteres.' });
        }
        if (!PerfilModel.esEmailValido(email)) {
            return res.status(400).json({ ok: false, mensaje: 'El correo electrónico no es válido.' });
        }
        if (typeof password !== 'string' || password.length < 6 || password.length > 64) {
            return res.status(400).json({ ok: false, mensaje: 'La contraseña debe tener entre 6 y 64 caracteres.' });
        }
        if (PerfilModel.obtenerPorEmail(email)) {
            return res.status(409).json({ ok: false, mensaje: 'Ya existe una cuenta con ese correo.' });
        }
        if (PerfilModel.nombreEnUso(nombre)) {
            return res.status(409).json({ ok: false, mensaje: 'Ese nombre de usuario ya está en uso.' });
        }

        const usuario = PerfilModel.crear({ nombre, email, password });
        const token = PerfilModel.crearSesion(usuario.id);
        res.status(201).json({
            ok: true,
            mensaje: '¡Cuenta creada con éxito!',
            token,
            usuario: PerfilModel.sinPassword(usuario)
        });
    },

    login(req, res) {
        const { email, password } = req.body || {};
        if (!PerfilModel.esEmailValido(email) || typeof password !== 'string' || !password) {
            return res.status(400).json({ ok: false, mensaje: 'Escribe un correo válido y tu contraseña.' });
        }

        const usuario = PerfilModel.obtenerPorEmail(email);
        if (!usuario || usuario.password !== password) {
            return res.status(401).json({ ok: false, mensaje: 'Correo o contraseña incorrectos.' });
        }

        const token = PerfilModel.crearSesion(usuario.id);
        res.json({
            ok: true,
            mensaje: `¡Bienvenido, ${usuario.nombre}!`,
            token,
            usuario: PerfilModel.sinPassword(usuario)
        });
    },

    // Usa sesionOpcional: si el token ya no existe, igual responde ok
    logout(req, res) {
        if (req.token) {
            PerfilModel.cerrarSesion(req.token);
        }
        res.json({ ok: true, mensaje: 'Sesión cerrada.' });
    }
};

module.exports = AuthController;