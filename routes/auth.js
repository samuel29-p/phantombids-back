const express = require("express");
const router = express.Router();
const { registrar, iniciarSesion, miPerfil } = require("../controllers/authController");
const autenticar = require("../middlewares/autenticar");
const validarCampos = require("../middlewares/validarCampos");
const { validarRegistro, validarLogin } = require("../middlewares/validadores");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registro, login y perfil del usuario autenticado
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 */
router.post("/register", validarRegistro, validarCampos, registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesion
 *     tags: [Auth]
 */
router.post("/login", validarLogin, validarCampos, iniciarSesion);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Devuelve el perfil del usuario autenticado
 *     tags: [Auth]
 */
router.get("/me", autenticar, miPerfil);

module.exports = router;