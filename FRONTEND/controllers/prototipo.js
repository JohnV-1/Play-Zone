// Script compartido por todas las vistas: llamadas al backend, sesión, alertas y navbar.

// Si la página la sirve el propio backend (puerto 3000) usamos una ruta relativa;
// si se abre con Live Server u otro puerto, apuntamos al backend en localhost:3000.
const API_URL = window.location.port === '3000' ? '/api' : 'http://localhost:3000/api';

// ---------- Sesión ----------
function sesionIniciada() {
    return Boolean(sessionStorage.getItem('token'));
}

function guardarSesion(token, usuario) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('usuario', usuario.nombre);
}

function limpiarSesion() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
}

// Mensaje que se mostrará en la siguiente página (ej. después de eliminar la cuenta)
function avisoSiguientePagina(mensaje, tipo = 'success') {
    sessionStorage.setItem('aviso', JSON.stringify({ mensaje, tipo }));
}

// Para páginas que solo puede ver un usuario con sesión. Regresa false y redirige si no hay sesión.
function requiereSesion() {
    if (sesionIniciada()) return true;
    avisoSiguientePagina('Inicia sesión para entrar a esa página.', 'warning');
    window.location.href = 'Login.html';
    return false;
}

// ---------- Peticiones al backend ----------
let solicitudesActivas = 0;
async function apiFetch(endpoint, opciones = {}) {
    let estado = document.getElementById('estadoPeticiones');
    if (!estado) {
        estado = document.createElement('div');
        estado.id = 'estadoPeticiones';
        estado.className = 'position-fixed bottom-0 end-0 m-3 px-3 py-2 bg-dark text-white rounded shadow';
        estado.style.zIndex = '2100';
        estado.setAttribute('role', 'status');
        document.body.append(estado);
    }
    solicitudesActivas++;
    estado.hidden = false;
    estado.textContent = 'Cargando…';
    try {
        return await solicitarDatos(endpoint, opciones);
    } finally {
        solicitudesActivas--;
        estado.hidden = solicitudesActivas === 0;
    }
}

async function solicitarDatos(endpoint, opciones) {
    const token = sessionStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(opciones.headers || {})
    };

    let respuesta;
    try {
        respuesta = await fetch(`${API_URL}${endpoint}`, { ...opciones, headers });
    } catch {
        throw new Error('No se pudo conectar con el servidor. ¿Está encendido el backend?');
    }

    const datos = await respuesta.json().catch(() => ({}));

    // El token ya no es válido (por ejemplo, se reinició el servidor): cerramos la sesión local
    if (respuesta.status === 401 && token) {
        limpiarSesion();
    }

    if (!respuesta.ok) {
        const error = new Error(datos.mensaje || `Error HTTP ${respuesta.status}`);
        error.status = respuesta.status;
        throw error;
    }
    return datos;
}

// ---------- Alertas ----------
// Muestra una alerta de Bootstrap en la esquina superior derecha que se quita sola.
// tipo: 'success' | 'danger' | 'warning' | 'info'
function mostrarAlerta(mensaje, tipo = 'danger') {
    let contenedor = document.getElementById('contenedorAlertas');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'contenedorAlertas';
        contenedor.className = 'position-fixed top-0 end-0 p-3';
        contenedor.style.zIndex = '2000';
        contenedor.style.maxWidth = '380px';
        document.body.appendChild(contenedor);
    }

    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} shadow mb-2`;
    alerta.setAttribute('role', tipo === 'danger' ? 'alert' : 'status');
    alerta.textContent = mensaje;
    contenedor.appendChild(alerta);

    setTimeout(() => alerta.remove(), 4000);
}

// ---------- Navbar ----------
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
        limpiarSesion();
        avisoSiguientePagina('Cerraste sesión correctamente.', 'info');
        window.location.href = 'Login.html';
    }
}

function prepararNavbar() {
    const nombreUsuario = sessionStorage.getItem('usuario');
    const accesoLink = document.querySelector('.navbar a[href="Login.html"]');

    if (nombreUsuario) {
        actualizarNombreNavbar(nombreUsuario);
    }

    if (nombreUsuario && accesoLink) {
        accesoLink.textContent = 'Cerrar sesión';
        accesoLink.addEventListener('click', (evento) => {
            evento.preventDefault();
            cerrarSesion();
        });
    }

    // Botón con ícono de salir (Home y Gato Jump)
    document.querySelectorAll('button[title="Cerrar Sesión"]').forEach((boton) => {
        boton.removeAttribute('onclick');
        boton.onclick = null;
        if (!nombreUsuario) {
            boton.title = 'Iniciar sesión';
        }
        boton.addEventListener('click', (evento) => {
            evento.preventDefault();
            if (sesionIniciada()) cerrarSesion();
            else window.location.href = 'Login.html';
        });
    });
}

// Muestra el aviso guardado por la página anterior, si lo hay
function mostrarAvisoPendiente() {
    const aviso = sessionStorage.getItem('aviso');
    if (!aviso) return;
    sessionStorage.removeItem('aviso');
    try {
        const { mensaje, tipo } = JSON.parse(aviso);
        mostrarAlerta(mensaje, tipo);
    } catch {
        /* aviso con formato inválido: se ignora */
    }
}

// Deshabilita el botón mientras se espera la respuesta para evitar doble envío
function bloquearBoton(boton, bloquear, textoEspera = 'Enviando...') {
    if (!boton) return;
    if (bloquear) {
        boton.dataset.textoOriginal = boton.textContent;
        boton.textContent = textoEspera;
        boton.disabled = true;
    } else {
        boton.textContent = boton.dataset.textoOriginal || boton.textContent;
        boton.disabled = false;
    }
}

// ---------- Formularios de Login y Registro ----------
function prepararLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const email = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value;
        const boton = loginForm.querySelector('button');

        bloquearBoton(boton, true, 'Iniciando sesión...');
        try {
            const datos = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            guardarSesion(datos.token, datos.usuario);
            avisoSiguientePagina(datos.mensaje || '¡Bienvenido!');
            window.location.href = 'Home.html';
        } catch (error) {
            mostrarAlerta(error.message);
            bloquearBoton(boton, false);
        }
    });
}

function prepararRegistro() {
    const registroForm = document.getElementById('registroForm');
    if (!registroForm) return;

    const errorRegistro = document.getElementById('errorRegistro');
    const mostrarError = (mensaje) => {
        errorRegistro.textContent = mensaje;
        errorRegistro.classList.remove('d-none');
    };

    registroForm.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value;
        const confirmar = document.getElementById('confirmar').value;
        const boton = registroForm.querySelector('button');

        // Validación en Frontend
        if (nombre.length < 3 || nombre.length > 25) {
            mostrarError('El nombre de usuario debe tener entre 3 y 25 caracteres.');
            return;
        }
        if (password.length < 6) {
            mostrarError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (password !== confirmar) {
            mostrarError('Las contraseñas no coinciden.');
            return;
        }
        errorRegistro.classList.add('d-none');

        bloquearBoton(boton, true, 'Creando cuenta...');
        try {
            const datos = await apiFetch('/auth/registro', {
                method: 'POST',
                body: JSON.stringify({ nombre, email, password })
            });
            guardarSesion(datos.token, datos.usuario);
            avisoSiguientePagina(datos.mensaje || '¡Cuenta creada!');
            window.location.href = 'Home.html';
        } catch (error) {
            // Errores del backend (correo repetido, datos inválidos, etc.)
            mostrarError(error.message);
            bloquearBoton(boton, false);
        }
    });
}

// ---------- Inicio ----------
// El script se carga al final del <body>, así que el DOM ya existe.
prepararNavbar();
prepararLogin();
prepararRegistro();
mostrarAvisoPendiente();
