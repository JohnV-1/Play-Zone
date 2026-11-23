const juegoRanking = document.getElementById('juegoRanking');
const tituloJuegoRanking = document.getElementById('tituloJuegoRanking');
const descJuegoRanking = document.getElementById('descJuegoRanking');
const btnJugarHero = document.getElementById('btnJugarHero');
const rankingBody = document.getElementById('rankingBody');
const estadoRanking = document.getElementById('estadoRanking');
const mejorPuntajeEl = document.getElementById('mejorPuntaje');
const posicionActualEl = document.getElementById('posicionActual');
const imagenJuegoPanel = document.getElementById('imagenJuegoPanel');
const volverJuego = document.getElementById('volverJuego');

const juegosValidos = ['gato', 'atrapa', 'esquiva', 'snake'];
const solicitado = new URLSearchParams(window.location.search).get('juego');

if (juegosValidos.includes(solicitado)) {
    juegoRanking.value = solicitado;
}

function formatearPuntaje(valor) {
    return Number(valor || 0).toLocaleString('es-MX');
}

function abrirPerfilUsuario(filaDatos) {
    if (filaDatos.esUsuarioActual) {
        window.location.href = 'Perfil.html';
    } else {
        window.location.href = `Perfil.html?usuario=${filaDatos.usuarioId}`;
    }
}

function renderizarTabla(tabla) {
    rankingBody.innerHTML = '';

    if (!tabla.length) {
        const filaVacia = document.createElement('tr');
        const celda = document.createElement('td');
        celda.colSpan = 5;
        celda.className = 'text-secondary py-4';
        celda.textContent = 'Aún no hay puntuaciones registradas para este juego.';
        filaVacia.appendChild(celda);
        rankingBody.appendChild(filaVacia);
        return;
    }

    tabla.forEach((filaDatos) => {
        const tr = document.createElement('tr');
        tr.className = 'clickable-row';
        tr.title = `Ver perfil de ${filaDatos.nombre}`;
        if (filaDatos.esUsuarioActual) {
            tr.classList.add('current-player');
        }

        tr.addEventListener('click', () => abrirPerfilUsuario(filaDatos));

        // Posición
        const tdPos = document.createElement('td');
        const spanPos = document.createElement('span');
        spanPos.textContent = filaDatos.posicion;
        tdPos.appendChild(spanPos);

        // Avatar
        const tdAvatar = document.createElement('td');
        const img = document.createElement('img');
        img.src = filaDatos.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png';
        img.alt = filaDatos.nombre;
        img.width = 45;
        img.height = 45;
        img.className = 'rounded-pill';
        tdAvatar.appendChild(img);

        // Nombre con enlace accesible
        const tdNombre = document.createElement('td');
        const enlacePerfil = document.createElement('a');
        enlacePerfil.href = filaDatos.esUsuarioActual
            ? 'Perfil.html'
            : `Perfil.html?usuario=${filaDatos.usuarioId}`;
        enlacePerfil.className = 'text-white text-decoration-none fw-semibold';
        enlacePerfil.textContent = filaDatos.esUsuarioActual
            ? `${filaDatos.nombre} (Tú)`
            : filaDatos.nombre;
        tdNombre.appendChild(enlacePerfil);

        // Puntuación
        const tdPuntos = document.createElement('td');
        const strongPuntos = document.createElement('strong');
        strongPuntos.textContent = formatearPuntaje(filaDatos.puntuacion);
        tdPuntos.appendChild(strongPuntos);

        // Fecha
        const tdFecha = document.createElement('td');
        tdFecha.textContent = filaDatos.fecha;

        tr.append(tdPos, tdAvatar, tdNombre, tdPuntos, tdFecha);
        rankingBody.appendChild(tr);
    });
}

async function cargarRanking(juegoId) {
    estadoRanking.textContent = 'Cargando clasificación...';

    try {
        const datos = await apiFetch(`/rankings/${juegoId}`);
        const { juego, tabla, mejorPuntaje, posicionActual } = datos;

        tituloJuegoRanking.textContent = juego.nombre;
        descJuegoRanking.textContent = juego.descripcion;
        btnJugarHero.href = juego.pagina;
        volverJuego.href = juego.pagina;
        imagenJuegoPanel.src = juego.imagen;
        imagenJuegoPanel.alt = juego.nombre;

        renderizarTabla(tabla);

        mejorPuntajeEl.textContent = formatearPuntaje(mejorPuntaje);
        posicionActualEl.innerHTML = posicionActual
            ? `Posición <strong>#${posicionActual}</strong>`
            : 'Sin clasificación aún';

        estadoRanking.textContent = 'Haz clic sobre cualquier jugador para ver su perfil.';

        const url = new URL(window.location);
        url.searchParams.set('juego', juegoId);
        window.history.replaceState({}, '', url);
    } catch (error) {
        estadoRanking.textContent = 'Error al cargar la clasificación: ' + error.message;
    }
}

juegoRanking.addEventListener('change', () => {
    cargarRanking(juegoRanking.value);
});

cargarRanking(juegoRanking.value);