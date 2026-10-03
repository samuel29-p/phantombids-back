const express = require("express");
const { body, param, query } = require("express-validator");
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const validar = require("../middlewares/validar");
const controller = require("../controllers/auctionController");

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

module.exports = router;
