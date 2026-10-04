# PhantomBids API

Backend de PhantomBids, una casa de subastas inversas de objetos embrujados. En cada subasta los usuarios pujan en secreto con un alias anonimo, gana la puja mas baja que nadie mas repitio, y al ganador le cae la maldicion del objeto.

Proyecto de Ingenieria Web, Universidad EIA. Entrega 2: backend.

## Enlaces

| Que | URL |
|---|---|
| API desplegada en Render | https://phantombids-back.onrender.com |
| Documentacion Swagger | https://phantombids-back.onrender.com/api-docs |
| Repositorio | https://github.com/samuel29-p/phantombids-back |
| Colecciones de Postman | `PhantomBids.postman_collection.json` (todas las rutas y errores) y `PhantomBids-ciclo-completo.postman_collection.json` (ciclo completo de subasta: pujas, apuestas y cierre) en la raiz del repositorio |

El plan gratis de Render se duerme despues de 15 minutos sin uso, asi que la primera peticion puede tardar cerca de un minuto.

## Herramientas usadas

- Node.js 22 y Express 5
- MongoDB Atlas con Mongoose 9
- JWT (jsonwebtoken) y bcryptjs para la autenticacion
- express-validator para validar los datos de entrada
- dotenv, cors y morgan
- swagger-jsdoc y swagger-ui-express para la documentacion
- nodemon en desarrollo

## Estructura del proyecto

```
phantombids-back/
  config/         conexion a MongoDB y configuracion de Swagger
  controllers/    reciben la peticion y devuelven la respuesta
  middlewares/    autenticar, autorizar, validadores, validarCampos y errorHandler
  models/         schemas de Mongoose con sus validaciones
  routes/         rutas de cada recurso y su documentacion de Swagger
  services/       logica del negocio y acceso a la base de datos
  utils/          asyncHandler, catalogo de maldiciones, alias y membresia
  seed/           datos semilla
  app.js          arma la app de Express y registra las rutas
  index.js        conecta a la base de datos y prende el servidor
```

Cada peticion pasa por: ruta, middlewares (autenticar, autorizar y validaciones), controlador, servicio y modelo. Si algo falla en cualquier capa, el error llega al middleware global `errorHandler`, que responde con el codigo HTTP correcto.

## Instalacion local

1. Clonar el repositorio e instalar dependencias:

```
git clone https://github.com/samuel29-p/phantombids-back.git
cd phantombids-back
npm install
```

2. Crear un archivo `.env` en la raiz, copiando `.env.example` y llenando los valores:

```
PORT=3000
MONGODB_URI=pega_aqui_la_url_de_tu_cluster_de_atlas
JWT_SECRET=una_clave_larga_y_secreta
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

El archivo `.env` esta en `.gitignore` y nunca se sube al repositorio.

3. Cargar los datos semilla (opcional, borra lo que haya en la base):

```
node seed/seed.js
```

4. Prender el servidor:

```
npm run dev
```

La API queda en http://localhost:3000 y Swagger en http://localhost:3000/api-docs.

## Scripts

| Comando | Que hace |
|---|---|
| `npm run dev` | Prende el servidor con nodemon, se reinicia al guardar cambios |
| `npm start` | Prende el servidor con node, es el que usa Render |
| `node seed/seed.js` | Borra la base y carga los datos semilla |

## Datos semilla

El seed crea 12 usuarios, 3 casas, 8 objetos malditos, 4 subastas (3 abiertas y 1 cerrada), 10 pujas, 3 apuestas y una maldicion aplicada. Son los mismos datos del front de la entrega 1.

Todos los usuarios tienen la contrasena `123456`. Por ejemplo: `vinland@phantom.com`, `newfoundland@phantom.com`, `illWin@phantom.com`.

## Autenticacion y roles

- `POST /api/auth/register` y `POST /api/auth/login` devuelven un token JWT.
- Las rutas protegidas piden el header `Authorization: Bearer <token>`.
- El middleware `autenticar` valida el token y deja al usuario en `req.usuario`.
- El middleware `autorizar("admin")` deja pasar solo a los administradores.
- Hay dos tipos de rol: el rol global del usuario (`user` o `admin`) y el rol dentro de cada casa (`HeadHaunter`, `SeniorSpook`, `Spirit` o `Poltergeist`).

## Endpoints

### Auth

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| POST | /api/auth/register | Registra un usuario | Publico |
| POST | /api/auth/login | Inicia sesion | Publico |
| GET | /api/auth/me | Perfil del usuario del token | Con token |

### Users

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| GET | /api/users | Lista los usuarios | Admin |
| GET | /api/users/:id | Obtiene un usuario | Con token |
| PUT | /api/users/:id | Edita un usuario | El mismo usuario o admin |
| DELETE | /api/users/:id | Elimina un usuario | Admin |

### Houses

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| GET | /api/houses | Lista las casas | Con token |
| POST | /api/houses | Crea una casa, el creador queda como HeadHaunter | Con token |
| GET | /api/houses/:id | Obtiene una casa | Con token |
| PUT | /api/houses/:id | Edita una casa | HeadHaunter o admin |
| DELETE | /api/houses/:id | Elimina una casa | Admin |
| POST | /api/houses/:id/join | Unirse a una casa, pide codigo si es privada | Con token |
| GET | /api/houses/:id/members | Lista los miembros | Miembros |

### Objects

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| GET | /api/objects | Lista los objetos, filtro opcional `?hauntHouseId=` | Con token |
| POST | /api/objects | Crea un objeto maldito | Miembros de la casa |
| GET | /api/objects/:id | Obtiene un objeto | Con token |
| PUT | /api/objects/:id | Edita un objeto | Creador o admin |
| DELETE | /api/objects/:id | Borra un objeto, no si esta en subasta abierta | Creador o admin |

### Auctions, pujas y apuestas

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| GET | /api/auctions | Lista subastas, filtros `?status=` y `?hauntHouseId=` | Con token |
| POST | /api/auctions | Abre una subasta para un objeto | Miembros de la casa |
| GET | /api/auctions/:id | Obtiene una subasta | Con token |
| PUT | /api/auctions/:id | Cambia la fecha de cierre | Creador o admin |
| DELETE | /api/auctions/:id | Borra la subasta con sus pujas y apuestas | Admin |
| POST | /api/auctions/:id/bids | Puja secreta con alias anonimo | Miembros, no Poltergeist |
| GET | /api/auctions/:id/bids | Abierta: solo alias. Cerrada: alias y montos | Con token |
| POST | /api/auctions/:id/bets | Apuesta reputacion a un alias | Miembros |
| GET | /api/auctions/:id/bets | Lista las apuestas | Con token |
| POST | /api/auctions/:id/close | Cierra la subasta y aplica los efectos | Creador o admin |

### Curses

| Metodo | Ruta | Descripcion | Acceso |
|---|---|---|---|
| GET | /api/curses | Catalogo de las 8 maldiciones | Publico |

## Reglas del juego

- **Pujas secretas:** cada usuario puja una sola vez por subasta, dentro del rango `minBid` y `maxBid` del objeto. El servidor le asigna un alias anonimo distinto en cada subasta, y mientras la subasta esta abierta nadie ve los montos.
- **Ganador:** al cerrar, gana la puja mas baja que nadie mas repitio.
- **Pujas duplicadas:** los usuarios que repitieron un monto pierden 5 de reputacion.
- **Maldicion:** al ganador le cae la maldicion base del objeto y queda registrada en `CurseLog`. Algunas bajan reputacion y otras duran unas horas, por ejemplo Brief Exile vuelve al ganador Poltergeist en la casa.
- **Apuestas:** se apuesta 5, 10, 25 o 50 de reputacion a un alias. Lo apostado se descuenta al apostar. Si el alias gana, se paga el doble; si pierde, se pierde; si no hubo ganador, se devuelve. No se puede apostar por el propio alias, y la maldicion Blind Eye impide apostar.

## Codigos de respuesta

| Codigo | Cuando |
|---|---|
| 200 | La peticion salio bien |
| 201 | Se creo un recurso |
| 400 | Datos invalidos o id con formato incorrecto |
| 401 | Falta el token o no es valido |
| 403 | No tiene permiso para esa accion |
| 404 | El recurso no existe |
| 409 | Conflicto, por ejemplo email repetido, puja repetida o subasta cerrada |
| 500 | Error inesperado del servidor |

## Integrantes del equipo

- Samuel Restrepo Zapata
- Maria Paula Rozo Arboleda
