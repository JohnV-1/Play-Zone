// ---------- Formularios de demostración ----------
const loginForm = document.getElementById('loginForm');
const registroForm = document.getElementById('registroForm');

if (loginForm) {
    loginForm.addEventListener('submit', (evento) => {
        evento.preventDefault();
        sessionStorage.setItem('usuarioDemo', 'Jugador');
        window.location.href = 'Home.html';
    });
}

if (registroForm) {
    registroForm.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const password = document.getElementById('password').value;
        const confirmar = document.getElementById('confirmar').value;
        const error = document.getElementById('errorRegistro');
        if (password !== confirmar) {
            error.classList.remove('d-none');
            return;
        }
        error.classList.add('d-none');
        sessionStorage.setItem('usuarioDemo', document.getElementById('nombre').value.trim());
        window.location.href = 'Home.html';
    });
}

// ---------- Navegación ----------
const usuarioDemo = sessionStorage.getItem('usuarioDemo');
const perfilLink = document.querySelector('.navbar a[href="Perfil.html"]');
const accesoLink = document.querySelector('.navbar a[href="Login.html"]');
if (usuarioDemo && perfilLink) perfilLink.textContent = usuarioDemo;
if (usuarioDemo && accesoLink) {
    accesoLink.textContent = 'Cerrar sesión';
    accesoLink.addEventListener('click', () => sessionStorage.removeItem('usuarioDemo'));
}
document.querySelectorAll('button[title="Cerrar Sesión"]').forEach((boton) => {
    boton.addEventListener('click', () => sessionStorage.removeItem('usuarioDemo'));
});
