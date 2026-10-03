const express = require("express");
const { body, param, query } = require("express-validator");
const autenticar = require("../middlewares/autenticar");
const validar = require("../middlewares/validar");
const { CURSE_CODES } = require("../utils/curses");
const controller = require("../controllers/cursedObjectController");

const router = express.Router();

//todas las rutas de objetos piden sesion, por eso autenticar va una sola vez para todo el router
router.use(autenticar);

//revisa que el :id de la url tenga forma de id de mongo antes de ir a la base
const validarId = [param("id").isMongoId().withMessage("El id del objeto no es valido")];

//reglas para crear, cada campo con su mensaje
const validarCrear = [
  body("hauntHouseId").isMongoId().withMessage("hauntHouseId debe ser un id valido"),
  body("name")
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage("El nombre debe tener entre 3 y 80 caracteres"),
  body("description").optional().isLength({ max: 300 }).withMessage("La descripcion no puede pasar de 300 caracteres"),
  body("imageUrl").optional().isString().withMessage("imageUrl debe ser texto"),
  body("baseCurse").isIn(CURSE_CODES).withMessage("baseCurse debe ser una de las 8 maldiciones del catalogo"),
  body("minBid").isInt({ min: 1, max: 100 }).withMessage("minBid debe ser un entero entre 1 y 100"),
  body("maxBid").isInt({ max: 500 }).withMessage("maxBid debe ser un entero de maximo 500"),
  body("durationDays").isInt({ min: 1, max: 7 }).withMessage("durationDays debe ser un entero entre 1 y 7"),
];

//para editar son las mismas reglas pero todas opcionales, porque se puede cambiar solo un campo
const validarEditar = [
  body("name").optional().trim().isLength({ min: 3, max: 80 }).withMessage("El nombre debe tener entre 3 y 80 caracteres"),
  body("description").optional().isLength({ max: 300 }).withMessage("La descripcion no puede pasar de 300 caracteres"),
  body("imageUrl").optional().isString().withMessage("imageUrl debe ser texto"),
  body("baseCurse").optional().isIn(CURSE_CODES).withMessage("baseCurse debe ser una de las 8 maldiciones del catalogo"),
  body("minBid").optional().isInt({ min: 1, max: 100 }).withMessage("minBid debe ser un entero entre 1 y 100"),
  body("maxBid").optional().isInt({ max: 500 }).withMessage("maxBid debe ser un entero de maximo 500"),
  body("durationDays").optional().isInt({ min: 1, max: 7 }).withMessage("durationDays debe ser un entero entre 1 y 7"),
];

const validarFiltros = [
  query("hauntHouseId").optional().isMongoId().withMessage("hauntHouseId debe ser un id valido"),
];

//el orden en cada ruta es siempre el mismo: reglas, validar, y por ultimo el controlador
router.get("/", validarFiltros, validar, controller.listar);
router.get("/:id", validarId, validar, controller.obtener);
router.post("/", validarCrear, validar, controller.crear);
router.put("/:id", validarId, validarEditar, validar, controller.actualizar);
router.delete("/:id", validarId, validar, controller.eliminar);

module.exports = router;
