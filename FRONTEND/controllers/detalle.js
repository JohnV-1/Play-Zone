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
    } catch (error) {
        document.getElementById('nombreJuego').textContent = 'Juego no encontrado';
        document.getElementById('descripcionJuego').textContent = error.message;
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
        nombre: sessionStorage.getItem('usuarioDemo') || 'David',
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
    try {
        const listaFavoritos = await apiFetch('/favoritos');
        esFavorito = listaFavoritos.some((item) => item.id === juegoId);
        actualizarBotonFavorito();
    } catch (error) {
        estadoFavorito.textContent = 'No se pudo consultar el estado de favoritos.';
    }
}

favorito.addEventListener('click', async () => {
    try {
        if (esFavorito) {
            await apiFetch(`/favoritos/${juegoId}`, { method: 'DELETE' });
            esFavorito = false;
            estadoFavorito.textContent = 'Juego eliminado de tus favoritos.';
        } else {
            await apiFetch('/favoritos', {
                method: 'POST',
                body: JSON.stringify({ juegoId })
            });
            esFavorito = true;
            estadoFavorito.textContent = 'Juego agregado a tus favoritos.';
        }
        actualizarBotonFavorito();
    } catch (error) {
        estadoFavorito.textContent = 'Error al actualizar favoritos: ' + error.message;
    }
});

cargarDetalleJuego().then(sincronizarFavorito);
mostrarResenas();