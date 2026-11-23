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
        sessionStorage.setItem('usuario', perfil.nombre);
        actualizarNombreNavbar(perfil.nombre);
    } catch (error) {
        if (error.status === 401) {
            // La sesión ya no es válida (ej. se reinició el servidor)
            avisoSiguientePagina('Tu sesión expiró. Vuelve a iniciar sesión.', 'warning');
            window.location.href = 'Login.html';
            return;
        }
        nombrePerfil.textContent = 'Error al cargar perfil';
        descripcionPerfil.textContent = error.message;
        mostrarAlerta(error.message);
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
    if (nombre.length < 3 || nombre.length > 25) {
        mostrarAlerta('El nombre debe tener entre 3 y 25 caracteres.', 'warning');
        return;
    }
    if (descripcion.length > 200) {
        mostrarAlerta('La descripción puede tener máximo 200 caracteres.', 'warning');
        return;
    }

    const boton = evento.submitter;
    bloquearBoton(boton, true, 'Guardando...');
    try {
        const actualizado = await apiFetch('/perfil', {
            method: 'PUT',
            body: JSON.stringify({ nombre, descripcion })
        });
        nombrePerfil.textContent = actualizado.nombre;
        descripcionPerfil.textContent = actualizado.descripcion;
        sessionStorage.setItem('usuario', actualizado.nombre);
        actualizarNombreNavbar(actualizado.nombre);
        modalPerfil.hide();
        mostrarAlerta('Perfil actualizado correctamente.', 'success');
    } catch (error) {
        mostrarAlerta(error.message);
    } finally {
        bloquearBoton(boton, false);
    }
});

document.getElementById('confirmarEliminarCuenta').addEventListener('click', async (evento) => {
    const boton = evento.currentTarget;
    bloquearBoton(boton, true, 'Eliminando...');
    try {
        const respuesta = await apiFetch('/perfil', { method: 'DELETE' });
        limpiarSesion();
        avisoSiguientePagina(respuesta.mensaje || 'Tu cuenta fue eliminada.', 'info');
        window.location.href = 'Login.html';
    } catch (error) {
        mostrarAlerta(error.message);
        bloquearBoton(boton, false);
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

    contenedorFavoritos.className = 'row g-3';

    lista.forEach((juego) => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

        const card = document.createElement('div');
        card.className = 'card card-juego h-100 shadow-sm position-relative';

        // Botón de corazón en la esquina superior derecha para quitar de favoritos
        const btnFav = document.createElement('button');
        btnFav.type = 'button';
        btnFav.className = 'btn-fav position-absolute top-0 end-0 m-2';
        btnFav.title = 'Quitar de favoritos';
        btnFav.setAttribute('aria-label', `Quitar ${juego.nombre} de favoritos`);

        const iconoCorazon = document.createElement('i');
        iconoCorazon.className = 'bi bi-heart-fill';
        btnFav.appendChild(iconoCorazon);
        btnFav.addEventListener('click', () => quitarFavorito(juego.id, juego.nombre));

        // Imagen superior idéntica a Home.html
        const img = document.createElement('img');
        img.src = juego.imagen;
        img.className = 'card-img-top';
        img.alt = juego.nombre;

        // Cuerpo de la tarjeta idéntico a Home.html
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
        card.append(btnFav, img, cardBody);
        col.appendChild(card);
        contenedorFavoritos.appendChild(col);
    });
}

async function cargarFavoritos() {
    try {
        const favoritos = await apiFetch('/favoritos');
        renderizarFavoritos(favoritos);
    } catch (error) {
        if (error.status === 401) return; // cargarPerfil ya redirige al Login
        estadoFavoritos.textContent = 'No se pudieron cargar los favoritos: ' + error.message;
    }
}

async function quitarFavorito(juegoId, nombreJuego) {
    try {
        const respuesta = await apiFetch(`/favoritos/${juegoId}`, { method: 'DELETE' });
        renderizarFavoritos(respuesta.favoritos);
        mostrarAlerta(`Se quitó "${nombreJuego}" de tus favoritos.`, 'success');
    } catch (error) {
        mostrarAlerta('Error al quitar favorito: ' + error.message);
    }
}

// Perfil solo se puede ver con sesión iniciada
if (requiereSesion()) {
    cargarPerfil();
    cargarFavoritos();
}