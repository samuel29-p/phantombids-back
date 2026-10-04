const express = require("express");
const { body, param, query } = require("express-validator");
const autenticar = require("../middlewares/autenticar");
const validarCampos = require("../middlewares/validarCampos");
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

/**
 * @swagger
 * tags:
 *   name: Objects
 *   description: Objetos malditos que se pueden subastar
 */

/**
 * @swagger
 * /api/objects:
 *   get:
 *     summary: Lista los objetos malditos, se puede filtrar por casa
 *     tags: [Objects]
 *     parameters: [{ in: query, name: hauntHouseId, schema: { type: string }, description: Id de la casa }]
 *     responses:
 *       "200": { description: Lista de objetos }
 *       "401": { description: Falta el token o no es valido }
 *   post:
 *     summary: Crea un objeto maldito (hay que ser miembro de la casa)
 *     tags: [Objects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { hauntHouseId: "6ac07c1f7d8bff4ce6f9e7ee", name: "Cursed Music Box", description: "Plays by itself at 3am", baseCurse: "LOSE_10_REPUTATION", minBid: 10, maxBid: 50, durationDays: 3 }
 *     responses:
 *       "201": { description: Objeto creado }
 *       "400": { description: Datos invalidos, o maxBid menor a minBid mas 10 }
 *       "403": { description: No eres miembro de la casa }
 *       "404": { description: La casa no existe }
 */
//el orden en cada ruta es siempre el mismo: reglas, validarCampos, y por ultimo el controlador
router.get("/", validarFiltros, validarCampos, controller.listar);
router.post("/", validarCrear, validarCampos, controller.crear);

/**
 * @swagger
 * /api/objects/{id}:
 *   get:
 *     summary: Obtiene un objeto por su id
 *     tags: [Objects]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: El objeto }
 *       "400": { description: El id no es valido }
 *       "404": { description: Objeto no encontrado }
 *   put:
 *     summary: Edita un objeto (su creador o un admin)
 *     tags: [Objects]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           example: { name: "Cursed Music Box Deluxe", description: "Now it also screams" }
 *     responses:
 *       "200": { description: Objeto editado }
 *       "403": { description: No eres el creador ni admin }
 *   delete:
 *     summary: Borra un objeto (su creador o un admin), no se puede si esta en subasta abierta
 *     tags: [Objects]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: Objeto eliminado }
 *       "403": { description: No eres el creador ni admin }
 *       "409": { description: El objeto esta en una subasta abierta }
 */
router.get("/:id", validarId, validarCampos, controller.obtener);
router.put("/:id", validarId, validarEditar, validarCampos, controller.actualizar);
router.delete("/:id", validarId, validarCampos, controller.eliminar);

module.exports = router;
