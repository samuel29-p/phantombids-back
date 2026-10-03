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

router.get("/", autenticar, listarObjetos);
router.get("/:id", autenticar, validarIdParam, validarCampos, obtenerObjeto);
router.post("/", autenticar, validarObjeto, validarCampos, crearObjeto);
router.put("/:id", autenticar, validarIdParam, validarObjetoActualizar, validarCampos, actualizarObjeto);
router.delete("/:id", autenticar, validarIdParam, validarCampos, eliminarObjeto);

module.exports = router;