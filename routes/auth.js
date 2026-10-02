const express = require("express");
const router = express.Router();
const { registrar, iniciarSesion, miPerfil } = require("../controllers/authController");
const autenticar = require("../middlewares/autenticar");
 
router.post("/register", registrar);
router.post("/login", iniciarSesion);
router.get("/me", autenticar, miPerfil);
 
module.exports = router;