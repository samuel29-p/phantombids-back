const express = require("express");
const router = express.Router();
const { registrar, iniciarSesion, miPerfil } = require("../controllers/authController");
const autenticar = require("../middlewares/autenticar");
const validarCampos = require("../middlewares/validarCampos");
const { validarRegistro, validarLogin } = require("../middlewares/validadores");

router.post("/register", validarRegistro, validarCampos, registrar);
router.post("/login", validarLogin, validarCampos, iniciarSesion);
router.get("/me", autenticar, miPerfil);

module.exports = router;