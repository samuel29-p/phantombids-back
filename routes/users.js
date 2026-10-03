const express = require("express");
const router = express.Router();
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
const validarCampos = require("../middlewares/validarCampos");
const { validarActualizarUsuario, validarIdParam } = require("../middlewares/validadores");
const {
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion de usuarios registrados
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos los usuarios (solo admin)
 *     tags: [Users]
 */
router.get("/", autenticar, autorizar("admin"), listarUsuarios);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su id
 *     tags: [Users]
 *   put:
 *     summary: Actualiza un usuario (el mismo usuario o un admin)
 *     tags: [Users]
 *   delete:
 *     summary: Elimina un usuario (solo admin)
 *     tags: [Users]
 */
router.get("/:id", autenticar, validarIdParam, validarCampos, obtenerUsuario);
router.put("/:id", autenticar, validarIdParam, validarActualizarUsuario, validarCampos, actualizarUsuario);
router.delete("/:id", autenticar, autorizar("admin"), validarIdParam, validarCampos, eliminarUsuario);

module.exports = router;