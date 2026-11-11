// ---------- Datos de ejemplo ----------
const juegos = [
    {id: 'gato', nombre: 'Gato Jump', descripcion: 'Salta los obstáculos y consigue tu mejor puntuación.', controles: 'Espacio, W, flecha arriba o toque en la pantalla.', pagina: 'Game_01.html'},
    {id: 'atrapa', nombre: 'Atrapa la estrella', descripcion: 'Atrapa la estrella tantas veces como puedas en 20 segundos.', controles: 'Clic o toque sobre la estrella.', pagina: 'Game_02.html'},
    {id: 'esquiva', nombre: 'Esquiva bloques', descripcion: 'Cambia de carril para evitar los bloques rojos.', controles: 'Flechas izquierda y derecha o botones en pantalla.', pagina: 'Game_03.html'}
];
const solicitado = new URLSearchParams(window.location.search).get('juego');
const juego = juegos.find((item) => item.id === solicitado) || juegos[1];
const juegoId = juego.id;
document.getElementById('nombreJuego').textContent = juego.nombre;
document.getElementById('categoriaJuego').textContent = 'Arcade';
document.getElementById('descripcionJuego').textContent = juego.descripcion;
document.getElementById('controlesJuego').textContent = 'Controles: ' + juego.controles;
document.getElementById('jugarDetalle').href = juego.pagina;
document.getElementById('rankingDetalle').href = 'Clasificaciones.html?juego=' + juegoId;
let resenas = [{nombre: 'Luna', texto: 'Es fácil de aprender y entretenido.', calificacion: 5}];
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
    const resena = {nombre: sessionStorage.getItem('usuarioDemo') || 'Jugador de ejemplo', texto: comentario.value.trim(), calificacion: calificacion.value, propia: true};
    if (editando === -1) resenas.push(resena);
    else resenas[editando] = resena;
    editando = -1;
    form.reset();
    document.getElementById('guardarResena').textContent = 'Publicar reseña';
    mostrarResenas();
});
mostrarResenas();

// ---------- Favoritos ----------
const favorito = document.getElementById('favorito');
function mostrarFavorito() {
    favorito.textContent = localStorage.getItem('favorito-' + juegoId) ? 'Quitar de favoritos' : 'Agregar a favoritos';
}
favorito.addEventListener('click', () => {
    if (localStorage.getItem('favorito-' + juegoId)) localStorage.removeItem('favorito-' + juegoId);
    else localStorage.setItem('favorito-' + juegoId, 'true');
    mostrarFavorito();
    document.getElementById('estadoFavorito').textContent = 'Favoritos actualizados en este navegador.';
});
mostrarFavorito();
