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

router.get("/", autenticar, listarCasas);
router.get("/:id", autenticar, validarIdParam, validarCampos, obtenerCasa);
router.post("/", autenticar, validarCasa, validarCampos, crearCasa);
router.put("/:id", autenticar, validarIdParam, validarCasaActualizar, validarCampos, actualizarCasa);
router.delete("/:id", autenticar, autorizar("admin"), validarIdParam, validarCampos, eliminarCasa);
router.post("/:id/join", autenticar, validarIdParam, validarUnirseCasa, validarCampos, unirseCasa);
router.get("/:id/members", autenticar, validarIdParam, validarCampos, obtenerMiembros);

module.exports = router;