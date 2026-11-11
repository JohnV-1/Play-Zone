// ---------- Datos del prototipo ----------
let juegos = [{nombre: 'Gato Jump', categoria: 'Arcade'}, {nombre: 'Atrapa la estrella', categoria: 'Arcade'}, {nombre: 'Esquiva bloques', categoria: 'Arcade'}];
let editando = -1;
let eliminando = -1;
const listaJuegos = document.getElementById('listaJuegos');
const juegoModal = new bootstrap.Modal(document.getElementById('juegoModal'));
const eliminarModal = new bootstrap.Modal(document.getElementById('eliminarJuegoModal'));
const juegoForm = document.getElementById('juegoForm');
const tituloJuego = document.getElementById('tituloJuego');
const categoria = document.getElementById('categoria');

function mostrarJuegos() {
    listaJuegos.innerHTML = '';
    juegos.forEach((juego, indice) => {
        const fila = document.createElement('tr');
        const nombre = document.createElement('td');
        nombre.textContent = juego.nombre;
        const tipo = document.createElement('td');
        tipo.textContent = juego.categoria;
        const acciones = document.createElement('td');
        const editar = document.createElement('button');
        editar.className = 'btn btn-sm me-2';
        editar.textContent = 'Editar';
        editar.addEventListener('click', () => {
            editando = indice;
            tituloJuego.value = juego.nombre;
            categoria.value = juego.categoria;
            document.getElementById('tituloModal').textContent = 'Editar juego';
            juegoModal.show();
        });
        const eliminar = document.createElement('button');
        eliminar.className = 'btn btn-sm btn-outline-danger';
        eliminar.textContent = 'Eliminar';
        eliminar.addEventListener('click', () => {
            eliminando = indice;
            eliminarModal.show();
        });
        acciones.append(editar, eliminar);
        fila.append(nombre, tipo, acciones);
        listaJuegos.appendChild(fila);
    });
}
document.getElementById('nuevoJuego').addEventListener('click', () => {
    editando = -1;
    juegoForm.reset();
    document.getElementById('tituloModal').textContent = 'Agregar juego';
});
juegoForm.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if (!tituloJuego.value.trim()) return;
    const juego = {nombre: tituloJuego.value.trim(), categoria: categoria.value};
    if (editando === -1) juegos.push(juego);
    else juegos[editando] = juego;
    mostrarJuegos();
    juegoModal.hide();
    document.getElementById('estadoCatalogo').textContent = 'Catálogo de demostración actualizado.';
});
document.getElementById('confirmarEliminarJuego').addEventListener('click', () => {
    juegos.splice(eliminando, 1);
    mostrarJuegos();
    eliminarModal.hide();
    document.getElementById('estadoCatalogo').textContent = 'Juego eliminado de la demostración.';
});
mostrarJuegos();
