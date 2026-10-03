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
 *     responses:
 *       "200": { description: Lista de usuarios }
 *       "403": { description: Solo un admin puede ver la lista }
 */
router.get("/", autenticar, autorizar("admin"), listarUsuarios);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su id
 *     tags: [Users]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: El usuario }
 *       "404": { description: Usuario no encontrado }
 *   put:
 *     summary: Actualiza un usuario (el mismo usuario o un admin)
 *     tags: [Users]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           example: { username: "samuelnuevo", avatarUrl: "/images/AV2.png" }
 *     responses:
 *       "200": { description: Usuario actualizado }
 *       "403": { description: No puedes editar a otro usuario }
 *   delete:
 *     summary: Elimina un usuario (solo admin)
 *     tags: [Users]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       "200": { description: Usuario eliminado }
 *       "403": { description: Solo un admin puede eliminar usuarios }
 */
router.get("/:id", autenticar, validarIdParam, validarCampos, obtenerUsuario);
router.put("/:id", autenticar, validarIdParam, validarActualizarUsuario, validarCampos, actualizarUsuario);
router.delete("/:id", autenticar, autorizar("admin"), validarIdParam, validarCampos, eliminarUsuario);

module.exports = router;
