// ---------- Elementos del HTML ----------
const pista = document.getElementById('pista');
const jugador = document.getElementById('jugador');
const obstaculo = document.getElementById('obstaculo');
const puntajeEl = document.getElementById('puntaje');
const recordEl = document.getElementById('record');
const estado = document.getElementById('estado');
const botonJugar = document.getElementById('jugar');

// ---------- Estado del juego ----------
let jugando = false;
let carrilJugador = 1;
let carrilObstaculo = 0;
let posicionY = -45;
let puntaje = 0;
let velocidad = 5;
let reloj;
let record = Number(localStorage.getItem('recordEsquiva')) || 0;
recordEl.textContent = record;

// ---------- Controles ----------
botonJugar.addEventListener('click', iniciar);
document.getElementById('izquierda').addEventListener('click', () => mover(-1));
document.getElementById('derecha').addEventListener('click', () => mover(1));
document.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft' || evento.key === 'ArrowRight') {
        evento.preventDefault();
        mover(evento.key === 'ArrowLeft' ? -1 : 1);
    }
});

// ---------- Funciones del juego ----------
function iniciar() {
    clearInterval(reloj);
    jugando = true;
    carrilJugador = 1;
    puntaje = 0;
    velocidad = 5;
    puntajeEl.textContent = puntaje;
    jugador.style.left = '50%';
    jugador.hidden = false;
    obstaculo.hidden = false;
    estado.textContent = 'Muévete entre los tres carriles y evita el bloque rojo.';
    botonJugar.textContent = 'Reiniciar';
    nuevoObstaculo();
    reloj = setInterval(actualizar, 30);
}

function mover(direccion) {
    if (!jugando) return;
    carrilJugador = Math.max(0, Math.min(2, carrilJugador + direccion));
    jugador.style.left = ((carrilJugador + 0.5) * 100 / 3) + '%';
}

function nuevoObstaculo() {
    carrilObstaculo = Math.floor(Math.random() * 3);
    posicionY = -45;
    obstaculo.style.left = ((carrilObstaculo + 0.5) * 100 / 3) + '%';
    obstaculo.style.top = posicionY + 'px';
}

function actualizar() {
    posicionY += velocidad;
    obstaculo.style.top = posicionY + 'px';
    const jugadorY = pista.clientHeight - 65;
    if (carrilJugador === carrilObstaculo && posicionY + 40 > jugadorY && posicionY < jugadorY + 40) {
        terminar();
        return;
    }
    if (posicionY > pista.clientHeight) {
        puntaje += 10;
        puntajeEl.textContent = puntaje;
        velocidad = Math.min(5 + Math.floor(puntaje / 50), 12);
        nuevoObstaculo();
    }
}

function terminar() {
    clearInterval(reloj);
    jugando = false;
    estado.textContent = '¡Choque! Tu puntaje fue de ' + puntaje + '. Intenta de nuevo.';
    if (puntaje > record) {
        record = puntaje;
        localStorage.setItem('recordEsquiva', record);
        recordEl.textContent = record;
    }
}
