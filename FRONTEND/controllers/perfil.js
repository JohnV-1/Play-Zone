const avatarPerfil = document.getElementById('avatarPerfil');
const nombrePerfil = document.getElementById('nombrePerfil');
const descripcionPerfil = document.getElementById('descripcionPerfil');
const btnEditarPerfil = document.getElementById('btnEditarPerfil');
const btnVolverClasificaciones = document.getElementById('btnVolverClasificaciones');
const seccionEliminarCuenta = document.getElementById('seccionEliminarCuenta');
const tituloFavoritosPerfil = document.getElementById('tituloFavoritosPerfil');
const editarNombre = document.getElementById('editarNombre');
const editarDescripcion = document.getElementById('editarDescripcion');
const modalPerfilEl = document.getElementById('editarPerfilModal');
const modalPerfil = new bootstrap.Modal(modalPerfilEl);
const contenedorFavoritos = document.getElementById('misFavoritos');
const estadoFavoritos = document.getElementById('estadoFavoritosPerfil');

const usuarioConsultado = new URLSearchParams(window.location.search).get('usuario');

async function cargarPerfil() {
    try {
        const endpoint = usuarioConsultado ? `/perfil/${usuarioConsultado}` : '/perfil';
        const perfil = await apiFetch(endpoint);

        nombrePerfil.textContent = perfil.nombre;
        descripcionPerfil.textContent = perfil.descripcion;
        if (perfil.avatar && avatarPerfil) {
            avatarPerfil.src = perfil.avatar;
        }

        if (perfil.esPropio) {
            btnEditarPerfil.classList.remove('d-none');
            seccionEliminarCuenta.classList.remove('d-none');
            btnVolverClasificaciones.classList.add('d-none');
            tituloFavoritosPerfil.textContent = 'Mis juegos favoritos';
            estadoFavoritos.textContent = 'Administra tus juegos guardados o agrega más desde el catálogo.';

            sessionStorage.setItem('usuarioDemo', perfil.nombre);
            actualizarNombreNavbar(perfil.nombre);
        } else {
            btnEditarPerfil.classList.add('d-none');
            seccionEliminarCuenta.classList.add('d-none');
            btnVolverClasificaciones.classList.remove('d-none');
            tituloFavoritosPerfil.textContent = `Favoritos de ${perfil.nombre}`;
            estadoFavoritos.textContent = `Juegos guardados por ${perfil.nombre}.`;
        }

        renderizarFavoritos(perfil.favoritos || [], perfil.esPropio);
    } catch (error) {
        nombrePerfil.textContent = 'Usuario no encontrado';
        descripcionPerfil.textContent = error.message;
        btnEditarPerfil.classList.add('d-none');
        seccionEliminarCuenta.classList.add('d-none');
        btnVolverClasificaciones.classList.remove('d-none');
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

function renderizarFavoritos(lista, esPropio) {
    contenedorFavoritos.innerHTML = '';

    if (!lista.length) {
        contenedorFavoritos.className = '';
        const aviso = document.createElement('p');
        aviso.className = 'text-secondary mb-0';
        aviso.textContent = esPropio
            ? 'Aún no tienes juegos favoritos. Entra a Detalles de cualquier juego para agregarlo.'
            : 'Este jugador aún no tiene juegos favoritos.';
        contenedorFavoritos.appendChild(aviso);
        return;
    }

    contenedorFavoritos.className = 'row g-3';

    lista.forEach((juego) => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

        const card = document.createElement('div');
        card.className = 'card card-juego h-100 shadow-sm position-relative';

        // Solo muestra el botón para quitar favorito si es tu propio perfil
        if (esPropio) {
            const btnFav = document.createElement('button');
            btnFav.type = 'button';
            btnFav.className = 'btn-fav position-absolute top-0 end-0 m-2';
            btnFav.title = 'Quitar de favoritos';
            btnFav.setAttribute('aria-label', `Quitar ${juego.nombre} de favoritos`);

            const iconoCorazon = document.createElement('i');
            iconoCorazon.className = 'bi bi-heart-fill';
            btnFav.appendChild(iconoCorazon);
            btnFav.addEventListener('click', () => quitarFavorito(juego.id, juego.nombre));

            card.appendChild(btnFav);
        }

        const img = document.createElement('img');
        img.src = juego.imagen;
        img.className = 'card-img-top';
        img.alt = juego.nombre;

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex flex-column p-3';

        const titulo = document.createElement('h6');
        titulo.className = 'card-title text-white fw-bold mb-2';
        titulo.textContent = juego.nombre;

        const pieTarjeta = document.createElement('div');
        pieTarjeta.className = 'mt-auto';

        const badge = document.createElement('span');
        badge.className = 'badge badge-categoria px-2 py-1 me-1';
        badge.textContent = juego.categoria || 'Arcade';

        const linkDetalles = document.createElement('a');
        linkDetalles.href = `Detalle.html?juego=${juego.id}`;
        linkDetalles.className = 'small';
        linkDetalles.textContent = 'Detalles';

        const btnPlay = document.createElement('a');
        btnPlay.href = juego.pagina;
        btnPlay.className = 'btn-play';
        btnPlay.setAttribute('aria-label', `Jugar ${juego.nombre}`);

        const iconoPlay = document.createElement('i');
        iconoPlay.className = 'bi bi-play-fill';
        btnPlay.appendChild(iconoPlay);

        pieTarjeta.append(badge, linkDetalles, btnPlay);
        cardBody.append(titulo, pieTarjeta);
        card.append(img, cardBody);
        col.appendChild(card);
        contenedorFavoritos.appendChild(col);
    });
}

async function quitarFavorito(juegoId, nombreJuego) {
    try {
        const respuesta = await apiFetch(`/favoritos/${juegoId}`, { method: 'DELETE' });
        renderizarFavoritos(respuesta.favoritos, true);
        estadoFavoritos.textContent = `Se quitó "${nombreJuego}" de tus favoritos.`;
    } catch (error) {
        estadoFavoritos.textContent = 'Error al quitar favorito: ' + error.message;
    }
}

cargarPerfil();