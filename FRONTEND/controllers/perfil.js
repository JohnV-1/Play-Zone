// ---------- Edición del perfil ----------
const nombrePerfil = document.getElementById('nombrePerfil');
const descripcionPerfil = document.getElementById('descripcionPerfil');
const editarNombre = document.getElementById('editarNombre');
const editarDescripcion = document.getElementById('editarDescripcion');
const modalPerfil = new bootstrap.Modal(document.getElementById('editarPerfilModal'));
nombrePerfil.textContent = sessionStorage.getItem('usuarioDemo') || 'Jugador de ejemplo';
descripcionPerfil.textContent = sessionStorage.getItem('descripcionDemo') || descripcionPerfil.textContent;
document.getElementById('editarPerfilModal').addEventListener('show.bs.modal', () => {
    editarNombre.value = nombrePerfil.textContent;
    editarDescripcion.value = descripcionPerfil.textContent;
});
document.getElementById('perfilForm').addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (editarNombre.value.trim().length < 3) return;
    nombrePerfil.textContent = editarNombre.value.trim();
    descripcionPerfil.textContent = editarDescripcion.value.trim();
    sessionStorage.setItem('usuarioDemo', nombrePerfil.textContent);
    sessionStorage.setItem('descripcionDemo', descripcionPerfil.textContent);
    document.querySelector('.navbar a[href="Perfil.html"]').textContent = nombrePerfil.textContent;
    modalPerfil.hide();
});
document.getElementById('confirmarEliminarCuenta').addEventListener('click', () => {
    sessionStorage.removeItem('usuarioDemo');
    sessionStorage.removeItem('descripcionDemo');
    window.location.href = 'Login.html';
});

// ---------- Favoritos guardados ----------
const favoritos = document.getElementById('misFavoritos');
const juegosFavoritos = [{id: 'gato', nombre: 'Gato Jump'}, {id: 'atrapa', nombre: 'Atrapa la estrella'}, {id: 'esquiva', nombre: 'Esquiva bloques'}];
function mostrarFavoritos() {
    favoritos.innerHTML = '';
    juegosFavoritos.forEach((juego) => {
        if (!localStorage.getItem('favorito-' + juego.id)) return;
        const grupo = document.createElement('div');
        const enlace = document.createElement('a');
        enlace.className = 'btn me-2';
        enlace.href = 'Detalle.html?juego=' + juego.id;
        enlace.textContent = juego.nombre;
        const quitar = document.createElement('button');
        quitar.className = 'btn btn-sm';
        quitar.textContent = 'Quitar';
        quitar.addEventListener('click', () => {
            localStorage.removeItem('favorito-' + juego.id);
            mostrarFavoritos();
        });
        grupo.append(enlace, quitar);
        favoritos.appendChild(grupo);
    });
    if (!favoritos.children.length) favoritos.textContent = 'Aún no has guardado juegos. Agrégalos desde Detalles.';
}
mostrarFavoritos();
