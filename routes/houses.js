const express = require("express");
const router = express.Router();
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const validarCampos = require("../middlewares/validarCampos");
const {
  validarCasa,
  validarCasaActualizar,
  validarUnirseCasa,
  validarIdParam,
} = require("../middlewares/validadores");
const {
  crearCasa,
  listarCasas,
  obtenerCasa,
  actualizarCasa,
  eliminarCasa,
  unirseCasa,
  obtenerMiembros,
} = require("../controllers/houseController");

/**
 * @swagger
 * tags:
 *   name: Houses
 *   description: Casas de subastas (HauntHouse)
 */

/**
 * @swagger
 * /api/houses:
 *   get:
 *     summary: Lista todas las casas
 *     tags: [Houses]
 *     responses:
 *       "200": { description: Lista de casas }
 *   post:
 *     summary: Crea una casa (quien la crea queda como HeadHaunter)
 *     tags: [Houses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { name: "The Velvet Attic", theme: "Comedy", description: "Dusty jokes and haunted laughter.", isPrivate: false }
 *     responses:
 *       "201": { description: Casa creada }
 *       "400": { description: Datos invalidos }
 */
router.get("/", autenticar, listarCasas);
router.post("/", autenticar, validarCasa, validarCampos, crearCasa);

/**
 * @swagger
 * /api/houses/{id}:
 *   get:
 *     summary: Obtiene una casa por su id
 *     tags: [Houses]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: La casa }
 *       "404": { description: Casa no encontrada }
 *   put:
 *     summary: Actualiza una casa (el HeadHaunter o un admin)
 *     tags: [Houses]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           example: { description: "Now with more ghosts." }
 *     responses:
 *       "200": { description: Casa actualizada }
 *       "403": { description: Solo el HeadHaunter o un admin pueden editarla }
 *   delete:
 *     summary: Elimina una casa (solo admin)
 *     tags: [Houses]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: Casa eliminada }
 *       "403": { description: Solo un admin puede eliminar casas }
 */
router.get("/:id", autenticar, validarIdParam, validarCampos, obtenerCasa);
router.put("/:id", autenticar, validarIdParam, validarCasaActualizar, validarCampos, actualizarCasa);
router.delete("/:id", autenticar, autorizar("admin"), validarIdParam, validarCampos, eliminarCasa);

/**
 * @swagger
 * /api/houses/{id}/join:
 *   post:
 *     summary: Unirse a una casa (pide codigo si es privada)
 *     tags: [Houses]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           example: { inviteCode: "SALA13" }
 *     responses:
 *       "200": { description: Te uniste a la casa como Spirit }
 *       "403": { description: Codigo de invitacion incorrecto }
 *       "409": { description: Ya eres miembro de esta casa }
 */
router.post("/:id/join", autenticar, validarIdParam, validarUnirseCasa, validarCampos, unirseCasa);

/**
 * @swagger
 * /api/houses/{id}/members:
 *   get:
 *     summary: Lista los miembros de una casa (solo miembros)
 *     tags: [Houses]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: Lista de miembros con su rol }
 *       "403": { description: Solo los miembros pueden verla }
 */
router.get("/:id/members", autenticar, validarIdParam, validarCampos, obtenerMiembros);

module.exports = router;
