const solicitado = new URLSearchParams(window.location.search).get('juego') || 'atrapa';
let juegoId = solicitado;

async function cargarDetalleJuego() {
    try {
        const juego = await apiFetch(`/juegos/${solicitado}`);
        juegoId = juego.id;
        document.getElementById('nombreJuego').textContent = juego.nombre;
        document.getElementById('categoriaJuego').textContent = juego.categoria;
        document.getElementById('descripcionJuego').textContent = juego.descripcion;
        document.getElementById('controlesJuego').textContent = 'Controles: ' + juego.controles;
        document.getElementById('jugarDetalle').href = juego.pagina;
        document.getElementById('rankingDetalle').href = 'Clasificaciones.html?juego=' + juego.id;
        return true;
    } catch (error) {
        document.getElementById('nombreJuego').textContent = 'Juego no encontrado';
        document.getElementById('descripcionJuego').textContent = error.message;
        document.getElementById('controlesJuego').textContent = '';
        document.getElementById('jugarDetalle').classList.add('d-none');
        favorito.classList.add('d-none');
        return false;
    }
}

// ---------- Reseñas ----------
let resenas = [{ nombre: 'Luna', texto: 'Es fácil de aprender y entretenido.', calificacion: 5 }];
let editando = -1;
const lista = document.getElementById('listaResenas');
const form = document.getElementById('resenaForm');
const comentario = document.getElementById('comentario');
const calificacion = document.getElementById('calificacion');

function mostrarResenas() {
    lista.innerHTML = '';
    resenas.forEach((resena, indice) => {
        const bloque = document.createElement('article');
        bloque.className = 'border-bottom py-3';
        const titulo = document.createElement('strong');
        titulo.textContent = resena.nombre + ' · ' + resena.calificacion + '/5';
        const texto = document.createElement('p');
        texto.textContent = resena.texto;
        bloque.append(titulo, texto);
        if (resena.propia) {
            const editar = document.createElement('button');
            editar.className = 'btn btn-sm me-2';
            editar.textContent = 'Editar';
            editar.addEventListener('click', () => {
                editando = indice;
                comentario.value = resena.texto;
                calificacion.value = resena.calificacion;
                document.getElementById('guardarResena').textContent = 'Guardar cambios';
            });
            const eliminar = document.createElement('button');
            eliminar.className = 'btn btn-sm btn-outline-danger';
            eliminar.textContent = 'Eliminar';
            eliminar.addEventListener('click', () => {
                resenas.splice(indice, 1);
                editando = -1;
                form.reset();
                document.getElementById('guardarResena').textContent = 'Publicar reseña';
                mostrarResenas();
            });
            bloque.append(editar, eliminar);
        }
        lista.appendChild(bloque);
    });
}

form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!comentario.value.trim()) return;
    const resena = {
        nombre: sessionStorage.getItem('usuario') || 'Invitado',
        texto: comentario.value.trim(),
        calificacion: calificacion.value,
        propia: true
    };
    if (editando === -1) resenas.push(resena);
    else resenas[editando] = resena;
    editando = -1;
    form.reset();
    document.getElementById('guardarResena').textContent = 'Publicar reseña';
    mostrarResenas();
});

// ---------- Favoritos (conectado al backend) ----------
const favorito = document.getElementById('favorito');
const estadoFavorito = document.getElementById('estadoFavorito');
let esFavorito = false;

function actualizarBotonFavorito() {
    favorito.textContent = esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos';
}

async function sincronizarFavorito() {
    actualizarBotonFavorito();
    if (!sesionIniciada()) return; // los favoritos son por usuario
    try {
        const listaFavoritos = await apiFetch('/favoritos');
        esFavorito = listaFavoritos.some((item) => item.id === juegoId);
        actualizarBotonFavorito();
    } catch (error) {
        estadoFavorito.textContent = 'No se pudo consultar el estado de favoritos.';
    }
}

favorito.addEventListener('click', async () => {
    if (!sesionIniciada()) {
        mostrarAlerta('Inicia sesión para guardar tus juegos favoritos.', 'warning');
        return;
    }
    favorito.disabled = true;
    try {
        if (esFavorito) {
            await apiFetch(`/favoritos/${juegoId}`, { method: 'DELETE' });
            esFavorito = false;
            mostrarAlerta('Juego eliminado de tus favoritos.', 'success');
        } else {
            await apiFetch('/favoritos', {
                method: 'POST',
                body: JSON.stringify({ juegoId })
            });
            esFavorito = true;
            mostrarAlerta('Juego agregado a tus favoritos.', 'success');
        }
        actualizarBotonFavorito();
    } catch (error) {
        mostrarAlerta('Error al actualizar favoritos: ' + error.message);
    } finally {
        favorito.disabled = false;
    }
});

cargarDetalleJuego().then((existe) => {
    if (existe) sincronizarFavorito();
});
mostrarResenas();