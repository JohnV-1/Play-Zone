const API_URL = 'http://localhost:3000/api';

async function apiFetch(endpoint, opciones = {}) {
    const token = sessionStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opciones.headers || {})
    };

    const respuesta = await fetch(`${API_URL}${endpoint}`, {
        ...opciones,
        headers
    });

    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
        throw new Error(datos.mensaje || `Error HTTP ${respuesta.status}`);
    }
    return datos;
}

function actualizarNombreNavbar(nombre) {
    const perfilLink = document.querySelector('.navbar a[href="Perfil.html"]');
    if (!perfilLink || !nombre) return;

    const imagenAvatar = perfilLink.querySelector('img');
    if (imagenAvatar) {
        perfilLink.textContent = `${nombre} `;
        perfilLink.appendChild(imagenAvatar);
    } else {
        perfilLink.textContent = nombre;
    }
}

async function cerrarSesion() {
    try {
        await apiFetch('/auth/logout', { method: 'POST' });
    } catch (error) {
        console.warn('No se pudo notificar el cierre de sesión al servidor:', error.message);
    } finally {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuarioDemo');
        sessionStorage.removeItem('descripcionDemo');
        window.location.href = 'Login.html';
    }
}

// ---------- Formularios de demostración ----------
const loginForm = document.getElementById('loginForm');
const registroForm = document.getElementById('registroForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const email = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value;

        try {
            const datos = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            sessionStorage.setItem('token', datos.token);
            sessionStorage.setItem('usuarioDemo', datos.usuario.nombre);
            window.location.href = 'Home.html';
        } catch (error) {
            alert(error.message);
        }
    });
}

if (registroForm) {
    registroForm.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const password = document.getElementById('password').value;
        const confirmar = document.getElementById('confirmar').value;
        const error = document.getElementById('errorRegistro');
        if (password !== confirmar) {
            error.classList.remove('d-none');
            return;
        }
        error.classList.add('d-none');
        sessionStorage.setItem('usuarioDemo', document.getElementById('nombre').value.trim());
        window.location.href = 'Home.html';
    });
}

// ---------- Navegación ----------
const usuarioDemo = sessionStorage.getItem('usuarioDemo');
const accesoLink = document.querySelector('.navbar a[href="Login.html"]');

if (usuarioDemo) {
    actualizarNombreNavbar(usuarioDemo);
}

if (usuarioDemo && accesoLink) {
    accesoLink.textContent = 'Cerrar sesión';
    accesoLink.addEventListener('click', (evento) => {
        evento.preventDefault();
        cerrarSesion();
    });
}

document.querySelectorAll('button[title="Cerrar Sesión"]').forEach((boton) => {
    boton.addEventListener('click', (evento) => {
        evento.preventDefault();
        cerrarSesion();
    });
});