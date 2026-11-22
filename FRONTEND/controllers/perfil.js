const avatarPerfil = document.getElementById('avatarPerfil');
const nombrePerfil = document.getElementById('nombrePerfil');
const descripcionPerfil = document.getElementById('descripcionPerfil');
const editarNombre = document.getElementById('editarNombre');
const editarDescripcion = document.getElementById('editarDescripcion');
const modalPerfilEl = document.getElementById('editarPerfilModal');
const modalPerfil = new bootstrap.Modal(modalPerfilEl);
const contenedorFavoritos = document.getElementById('misFavoritos');
const estadoFavoritos = document.getElementById('estadoFavoritosPerfil');

async function cargarPerfil() {
    try {
        const perfil = await apiFetch('/perfil');
        nombrePerfil.textContent = perfil.nombre;
        descripcionPerfil.textContent = perfil.descripcion;
        if (perfil.avatar && avatarPerfil) {
            avatarPerfil.src = perfil.avatar;
        }
        sessionStorage.setItem('usuarioDemo', perfil.nombre);
        actualizarNombreNavbar(perfil.nombre);
    } catch (error) {
        nombrePerfil.textContent = 'Error al cargar perfil';
        descripcionPerfil.textContent = error.message;
    }
}

modalPerfilEl.addEventListener('show.bs.modal', () => {
    editarNombre.value = nombrePerfil.textContent;
    editarDescripcion.value = descripcionPerfil.textContent;
});

document.getElementById('perfilForm').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const nombre = editarNombre.value.trim();
    const descripcion = editarDescripcion.value.trim();
    if (nombre.length < 3) return;

    try {
        const actualizado = await apiFetch('/perfil', {
            method: 'PUT',
            body: JSON.stringify({ nombre, descripcion })
        });
        nombrePerfil.textContent = actualizado.nombre;
        descripcionPerfil.textContent = actualizado.descripcion;
        sessionStorage.setItem('usuarioDemo', actualizado.nombre);
        actualizarNombreNavbar(actualizado.nombre);
        modalPerfil.hide();
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('confirmarEliminarCuenta').addEventListener('click', async () => {
    try {
        await apiFetch('/perfil', { method: 'DELETE' });
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('usuarioDemo');
        sessionStorage.removeItem('descripcionDemo');
        window.location.href = 'Login.html';
    } catch (error) {
        alert(error.message);
    }
});

function renderizarFavoritos(lista) {
    contenedorFavoritos.innerHTML = '';

    if (!lista.length) {
        contenedorFavoritos.className = '';
        const aviso = document.createElement('p');
        aviso.className = 'text-secondary mb-0';
        aviso.textContent = 'Aún no tienes juegos favoritos. Entra a Detalles de cualquier juego para agregarlo.';
        contenedorFavoritos.appendChild(aviso);
        return;
    }

    contenedorFavoritos.className = 'row row-cols-2 row-cols-sm-4 g-3 g-lg-4';

    lista.forEach((juego) => {
        const col = document.createElement('div');
        col.className = 'col';

        const card = document.createElement('div');
        card.className = 'game-cover';

        const img = document.createElement('img');
        img.src = juego.imagen;
        img.alt = juego.nombre;

        const btnFav = document.createElement('button');
        btnFav.type = 'button';
        btnFav.className = 'btn-fav';
        btnFav.title = 'Quitar de favoritos';
        btnFav.setAttribute('aria-label', `Quitar ${juego.nombre} de favoritos`);

        const iconoCorazon = document.createElement('i');
        iconoCorazon.className = 'bi bi-heart-fill';
        btnFav.appendChild(iconoCorazon);

        btnFav.addEventListener('click', () => quitarFavorito(juego.id, juego.nombre));

        const titulo = document.createElement('a');
        titulo.href = `Detalle.html?juego=${juego.id}`;
        titulo.className = 'game-cover-title text-decoration-none text-white';
        titulo.textContent = juego.nombre;

        const btnPlay = document.createElement('a');
        btnPlay.href = juego.pagina;
        btnPlay.className = 'btn-play';
        btnPlay.setAttribute('aria-label', `Jugar ${juego.nombre}`);

        const iconoPlay = document.createElement('i');
        iconoPlay.className = 'bi bi-play-fill';
        btnPlay.appendChild(iconoPlay);

        card.append(img, btnFav, titulo, btnPlay);
        col.appendChild(card);
        contenedorFavoritos.appendChild(col);
    });
}

async function cargarFavoritos() {
    try {
        const favoritos = await apiFetch('/favoritos');
        renderizarFavoritos(favoritos);
    } catch (error) {
        estadoFavoritos.textContent = 'No se pudieron cargar los favoritos: ' + error.message;
    }
}

async function quitarFavorito(juegoId, nombreJuego) {
    try {
        const respuesta = await apiFetch(`/favoritos/${juegoId}`, { method: 'DELETE' });
        renderizarFavoritos(respuesta.favoritos);
        estadoFavoritos.textContent = `Se quitó "${nombreJuego}" de tus favoritos.`;
    } catch (error) {
        estadoFavoritos.textContent = 'Error al quitar favorito: ' + error.message;
    }
}

cargarPerfil();
cargarFavoritos();