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

router.get("/", validarFiltros, validar, controller.listar);
router.get("/:id", validarId, validar, controller.obtener);
router.post("/", validarCrear, validar, controller.crear);
router.put("/:id", validarId, validarEditar, validar, controller.actualizar);
//borrar una subasta es solo para admin, aqui se ve el middleware autorizar en accion
router.delete("/:id", autorizar("admin"), validarId, validar, controller.eliminar);

//cerrar la subasta decide el ganador y aplica la maldicion, lo puede hacer el creador o un admin
router.post("/:id/close", validarId, validar, controller.cerrar);

//las pujas viven dentro de una subasta, por eso la ruta es /api/auctions/:id/bids
router.post("/:id/bids", validarId, validarPuja, validar, bidController.pujar);
router.get("/:id/bids", validarId, validar, bidController.listar);

//las apuestas tambien viven dentro de una subasta
router.post("/:id/bets", validarId, validarApuesta, validar, betController.apostar);
router.get("/:id/bets", validarId, validar, betController.listar);

module.exports = router;
