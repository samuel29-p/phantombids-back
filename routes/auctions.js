const express = require("express");
const { body, param, query } = require("express-validator");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const validar = require("../middlewares/validar");
const controller = require("../controllers/auctionController");
const bidController = require("../controllers/bidController");
const betController = require("../controllers/betController");

const router = express.Router();

//todas las rutas de subastas piden sesion
router.use(autenticar);

const validarId = [param("id").isMongoId().withMessage("El id de la subasta no es valido")];

const validarCrear = [
  body("cursedObjectId").isMongoId().withMessage("cursedObjectId debe ser un id valido"),
];

const validarEditar = [
  body("endsAt").isISO8601().withMessage("endsAt debe ser una fecha, por ejemplo 2026-10-20T18:00:00"),
];

//el rango exacto de cada objeto se revisa en el servicio, aqui solo el rango general
const validarPuja = [
  body("amount").isInt({ min: 1, max: 500 }).withMessage("amount debe ser un entero entre 1 y 500"),
];

//solo se puede apostar 5, 10, 25 o 50 de reputacion
const validarApuesta = [
  body("predictedAlias").notEmpty().withMessage("predictedAlias es obligatorio"),
  body("amount").isIn(["5", "10", "25", "50"]).withMessage("amount debe ser 5, 10, 25 o 50"),
];

const validarFiltros = [
  query("status").optional().isIn(["open", "closed", "cancelled"]).withMessage("status debe ser open, closed o cancelled"),
  query("hauntHouseId").optional().isMongoId().withMessage("hauntHouseId debe ser un id valido"),
];

/**
 * @swagger
 * tags:
 *   name: Auctions
 *   description: Subastas inversas, pujas secretas, apuestas y cierre
 */

/**
 * @swagger
 * /api/auctions:
 *   get:
 *     summary: Lista las subastas, se puede filtrar por estado y por casa
 *     tags: [Auctions]
 *     parameters: [{ in: query, name: status, schema: { type: string, enum: [open, closed, cancelled] } }, { in: query, name: hauntHouseId, schema: { type: string } }]
 *     responses:
 *       "200": { description: Lista de subastas }
 *   post:
 *     summary: Abre una subasta para un objeto, la fecha de cierre sale de durationDays
 *     tags: [Auctions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { cursedObjectId: "6ac1280150335697ca601a0d" }
 *     responses:
 *       "201": { description: Subasta creada }
 *       "403": { description: No eres miembro de la casa }
 *       "409": { description: El objeto ya esta en una subasta abierta }
 */
router.get("/", validarFiltros, validar, controller.listar);
router.post("/", validarCrear, validar, controller.crear);

/**
 * @swagger
 * /api/auctions/{id}:
 *   get:
 *     summary: Obtiene una subasta por su id
 *     tags: [Auctions]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: La subasta }
 *       "404": { description: Subasta no encontrada }
 *   put:
 *     summary: Cambia la fecha de cierre (el creador o un admin, solo si esta abierta)
 *     tags: [Auctions]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { endsAt: "2026-10-10T23:59:00.000Z" }
 *     responses:
 *       "200": { description: Subasta editada }
 *       "400": { description: La fecha no es valida o ya paso }
 *       "409": { description: La subasta ya no esta abierta }
 *   delete:
 *     summary: Borra una subasta con sus pujas y apuestas (solo admin)
 *     tags: [Auctions]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: Subasta eliminada }
 *       "403": { description: Solo un admin puede borrar subastas }
 */
router.get("/:id", validarId, validar, controller.obtener);
router.put("/:id", validarId, validarEditar, validar, controller.actualizar);
//borrar una subasta es solo para admin, aqui se ve el middleware autorizar en accion
router.delete("/:id", autorizar("admin"), validarId, validar, controller.eliminar);

/**
 * @swagger
 * /api/auctions/{id}/close:
 *   post:
 *     summary: Cierra la subasta, gana la puja mas baja y unica, castiga duplicados, aplica la maldicion y resuelve apuestas
 *     tags: [Auctions]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: Resultado del cierre con ganador, duplicados, maldicion y apuestas resueltas }
 *       "403": { description: Solo el creador o un admin puede cerrarla }
 *       "409": { description: La subasta ya estaba cerrada }
 */
//cerrar la subasta decide el ganador y aplica la maldicion, lo puede hacer el creador o un admin
router.post("/:id/close", validarId, validar, controller.cerrar);

/**
 * @swagger
 * /api/auctions/{id}/bids:
 *   get:
 *     summary: Lista las pujas, mientras esta abierta solo muestra los alias y al cerrar muestra los montos
 *     tags: [Auctions]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: Lista de pujas sin el usuario real }
 *   post:
 *     summary: Hace la puja secreta, una por usuario, el servidor le asigna un alias anonimo
 *     tags: [Auctions]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { amount: 20 }
 *     responses:
 *       "201": { description: Puja registrada con su alias }
 *       "400": { description: El monto esta fuera del rango del objeto }
 *       "403": { description: No eres miembro de la casa o eres Poltergeist }
 *       "409": { description: Ya pujaste o la subasta no esta abierta }
 */
//las pujas viven dentro de una subasta, por eso la ruta es /api/auctions/:id/bids
router.post("/:id/bids", validarId, validarPuja, validar, bidController.pujar);
router.get("/:id/bids", validarId, validar, bidController.listar);

/**
 * @swagger
 * /api/auctions/{id}/bets:
 *   get:
 *     summary: Lista las apuestas de la subasta, sin mostrar quien aposto
 *     tags: [Auctions]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: Lista de apuestas }
 *   post:
 *     summary: Apuesta 5, 10, 25 o 50 de reputacion a que un alias gana
 *     tags: [Auctions]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { predictedAlias: "Pale Lantern", amount: 10 }
 *     responses:
 *       "201": { description: Apuesta registrada, la reputacion se descuenta de una vez }
 *       "400": { description: Monto invalido, sin reputacion suficiente o es tu propio alias }
 *       "403": { description: No eres miembro o tienes la maldicion Blind Eye }
 *       "404": { description: Ese alias no tiene pujas en la subasta }
 *       "409": { description: Ya apostaste o la subasta no esta abierta }
 */
//las apuestas tambien viven dentro de una subasta
router.post("/:id/bets", validarId, validarApuesta, validar, betController.apostar);
router.get("/:id/bets", validarId, validar, betController.listar);

module.exports = router;
