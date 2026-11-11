// ---------- Filtros del catálogo ----------
const buscarJuego = document.getElementById('buscarJuego');
const filtroCategoria = document.getElementById('filtroCategoria');
const tarjetas = document.querySelectorAll('#catalogo > div');
function filtrarJuegos() {
    const texto = buscarJuego.value.toLowerCase().trim();
    let visibles = 0;
    tarjetas.forEach((tarjeta) => {
        const nombre = tarjeta.querySelector('.card-title').textContent.toLowerCase();
        const categoria = tarjeta.querySelector('.badge-categoria').textContent;
        const mostrar = nombre.includes(texto) && (!filtroCategoria.value || categoria === filtroCategoria.value);
        tarjeta.classList.toggle('d-none', !mostrar);
        if (mostrar) visibles++;
    });
    document.getElementById('sinResultados').classList.toggle('d-none', visibles > 0);
}
buscarJuego.addEventListener('input', filtrarJuegos);
filtroCategoria.addEventListener('change', filtrarJuegos);
