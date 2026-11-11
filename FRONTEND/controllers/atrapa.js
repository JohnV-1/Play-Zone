// ---------- Elementos del HTML ----------
const escenario = document.getElementById('escenario');
const estrella = document.getElementById('estrella');
const puntajeEl = document.getElementById('puntaje');
const tiempoEl = document.getElementById('tiempo');
const recordEl = document.getElementById('record');
const estado = document.getElementById('estado');
const botonJugar = document.getElementById('jugar');

// ---------- Estado del juego ----------
let jugando = false;
let puntaje = 0;
let tiempo = 20;
let reloj;
let record = Number(localStorage.getItem('recordAtrapa')) || 0;
recordEl.textContent = record;

botonJugar.addEventListener('click', iniciar);
estrella.addEventListener('click', () => {
    if (!jugando) return;
    puntaje += 10;
    puntajeEl.textContent = puntaje;
    moverEstrella();
});

// ---------- Funciones del juego ----------
function iniciar() {
    clearInterval(reloj);
    jugando = true;
    puntaje = 0;
    tiempo = 20;
    puntajeEl.textContent = puntaje;
    tiempoEl.textContent = tiempo;
    estrella.hidden = false;
    estado.textContent = '¡Atrapa la estrella antes de que se acabe el tiempo!';
    botonJugar.textContent = 'Reiniciar';
    moverEstrella();
    reloj = setInterval(() => {
        tiempo--;
        tiempoEl.textContent = tiempo;
        if (tiempo === 0) terminar();
    }, 1000);
}

function moverEstrella() {
    const ancho = escenario.clientWidth - estrella.offsetWidth;
    const alto = escenario.clientHeight - estrella.offsetHeight;
    estrella.style.left = Math.floor(Math.random() * ancho) + 'px';
    estrella.style.top = Math.floor(Math.random() * alto) + 'px';
}

function terminar() {
    clearInterval(reloj);
    jugando = false;
    estrella.hidden = true;
    estado.textContent = '¡Tiempo! Tu puntaje fue de ' + puntaje + '. Puedes volver a jugar.';
    if (puntaje > record) {
        record = puntaje;
        localStorage.setItem('recordAtrapa', record);
        recordEl.textContent = record;
    }
}
window.addEventListener('resize', () => {
    if (jugando) moverEstrella();
});
