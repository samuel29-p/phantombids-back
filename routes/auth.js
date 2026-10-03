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
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { username: "samuel", email: "samuel@phantom.com", password: "123456" }
 *     responses:
 *       "201": { description: Usuario creado, devuelve el usuario y su token }
 *       "400": { description: Datos invalidos }
 *       "409": { description: El username o el email ya existen }
 */
router.post("/register", validarRegistro, validarCampos, registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesion
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { email: "vinland@phantom.com", password: "123456" }
 *     responses:
 *       "200": { description: Devuelve el usuario y su token }
 *       "400": { description: Datos invalidos }
 *       "401": { description: Email o contrasena incorrectos }
 */
router.post("/login", validarLogin, validarCampos, iniciarSesion);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Devuelve el perfil del usuario autenticado
 *     tags: [Auth]
 *     responses:
 *       "200": { description: El usuario dueno del token }
 *       "401": { description: Falta el token o no es valido }
 */
router.get("/me", autenticar, miPerfil);

module.exports = router;
