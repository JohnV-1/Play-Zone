// ---------- Récord del navegador ----------
const juegos = [
    {id: 'gato', record: 'recordMiniGame', pagina: 'Game_01.html'},
    {id: 'atrapa', record: 'recordAtrapa', pagina: 'Game_02.html'},
    {id: 'esquiva', record: 'recordEsquiva', pagina: 'Game_03.html'}
];
const juegoRanking = document.getElementById('juegoRanking');
const solicitado = new URLSearchParams(window.location.search).get('juego');
if (juegos.some((juego) => juego.id === solicitado)) juegoRanking.value = solicitado;
function mostrarRecordLocal() {
    const juego = juegos.find((item) => item.id === juegoRanking.value) || juegos[0];
    const record = Number(localStorage.getItem(juego.record)) || 0;
    document.getElementById('recordLocal').textContent = 'Tu mejor puntaje: ' + record;
    document.getElementById('volverJuego').href = juego.pagina;
}
juegoRanking.addEventListener('change', mostrarRecordLocal);
mostrarRecordLocal();
