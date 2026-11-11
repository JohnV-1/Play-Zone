# Play-Zone
Nuestro proyecto consiste en el desarrollo de una plataforma web interactiva de
videojuegos casuales (inspirada en conceptos híbridos de portales tipo Friv y
launchers minimalistas como Steam). La aplicación permitirá a los usuarios
registrarse, iniciar sesión de forma segura, explorar un catálogo dinámico de juegos
web, jugarlos directamente desde la plataforma, gestionar sus perfiles de usuario y
administrar colecciones o valoraciones mediante diversos módulos
complementarios (CRUDs adicionales).
#  Estructura del Proyecto
```
Play Zone/
├── BACKEND/
│   ├── controllers/
│   ├── database/
│   ├── models/
│   ├── node_modules/       # (Se genera automáticamente con npm install)
│   ├── routes/
│   ├── package.json        # Dependencias del proyecto
│   ├── package-lock.json
│   └── server.js           # Archivo principal del servidor
├── FRONTEND/
│   ├── controllers/
│   └── views/              # Archivos HTML (home, login, tasks)
└── test.http               # Pruebas de peticiones HTTP
```
# Guía de Instalación y Ejecución
* Clonar el repositorio
    - git clone https://github.com/JohnV-1/Play-Zone.git
    - cd ../BACKEND
* Instalar las dependencias
    - npm install
* Iniciar el servidor
    - node server.js<br>
En el paquete de node viene instalado nodemon se recomienda correr el servidor con: <br>
    -npx nodemon server.js<br>
De esta manera no se tiene que volver a correr el servidor con cada cambio<br>

Nota: el archivo test.http sirve para hacer pruebas en el servidor 

## Entrega 2: prototipo de interfaces

Para revisar las pantallas de esta entrega no es necesario iniciar el Backend.
Abre `FRONTEND/views/Login.html` con Live Server de Visual Studio Code, o ejecuta desde la raíz:

```bash
python3 -m http.server 8080 --bind 127.0.0.1 --directory FRONTEND
```

Abre http://localhost:8080/views/Login.html. Bootstrap y las imágenes externas requieren internet.
Los juegos se pueden abrir desde el catálogo sin iniciar sesión.

Juegos disponibles:

- Gato Jump: `FRONTEND/views/Game_01.html`.
- Atrapa la estrella: `FRONTEND/views/Game_02.html`.
- Esquiva bloques: `FRONTEND/views/Game_03.html`.

El acceso, el registro, las reseñas y la administración son de demostración. No hay autenticación real ni conexión con MongoDB en este avance. Las contraseñas no se guardan; no uses contraseñas reales. Los récords y favoritos se guardan en el navegador.

