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

router.get("/", autenticar, autorizar("admin"), listarUsuarios);
router.get("/:id", autenticar, validarIdParam, validarCampos, obtenerUsuario);
router.put("/:id", autenticar, validarIdParam, validarActualizarUsuario, validarCampos, actualizarUsuario);
router.delete("/:id", autenticar, autorizar("admin"), validarIdParam, validarCampos, eliminarUsuario);

module.exports = router;