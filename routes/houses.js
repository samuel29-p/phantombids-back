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
 *   post:
 *     summary: Crea una casa (quien la crea queda como HeadHaunter)
 *     tags: [Houses]
 */
router.get("/", autenticar, listarCasas);
router.post("/", autenticar, validarCasa, validarCampos, crearCasa);

/**
 * @swagger
 * /api/houses/{id}:
 *   get:
 *     summary: Obtiene una casa por su id
 *     tags: [Houses]
 *   put:
 *     summary: Actualiza una casa (el HeadHaunter o un admin)
 *     tags: [Houses]
 *   delete:
 *     summary: Elimina una casa (solo admin)
 *     tags: [Houses]
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
 */
router.post("/:id/join", autenticar, validarIdParam, validarUnirseCasa, validarCampos, unirseCasa);

/**
 * @swagger
 * /api/houses/{id}/members:
 *   get:
 *     summary: Lista los miembros de una casa (solo miembros)
 *     tags: [Houses]
 */
router.get("/:id/members", autenticar, validarIdParam, validarCampos, obtenerMiembros);

module.exports = router;