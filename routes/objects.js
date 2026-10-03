const express = require("express");
const router = express.Router();
const autenticar = require("../middlewares/autenticar");
const validarCampos = require("../middlewares/validarCampos");
const {
  validarObjeto,
  validarObjetoActualizar,
  validarIdParam,
} = require("../middlewares/validadores");
const {
  crearObjeto,
  listarObjetos,
  obtenerObjeto,
  actualizarObjeto,
  eliminarObjeto,
} = require("../controllers/objectController");

/**
 * @swagger
 * tags:
 *   name: Objects
 *   description: Objetos malditos (CursedObject)
 */

/**
 * @swagger
 * /api/objects:
 *   get:
 *     summary: Lista todos los objetos malditos
 *     tags: [Objects]
 *   post:
 *     summary: Crea un objeto (debes ser miembro de la casa)
 *     tags: [Objects]
 */
router.get("/", autenticar, listarObjetos);
router.post("/", autenticar, validarObjeto, validarCampos, crearObjeto);

/**
 * @swagger
 * /api/objects/{id}:
 *   get:
 *     summary: Obtiene un objeto por su id
 *     tags: [Objects]
 *   put:
 *     summary: Actualiza un objeto (el creador o un admin)
 *     tags: [Objects]
 *   delete:
 *     summary: Elimina un objeto (el creador o un admin)
 *     tags: [Objects]
 */
router.get("/:id", autenticar, validarIdParam, validarCampos, obtenerObjeto);
router.put("/:id", autenticar, validarIdParam, validarObjetoActualizar, validarCampos, actualizarObjeto);
router.delete("/:id", autenticar, validarIdParam, validarCampos, eliminarObjeto);

module.exports = router;