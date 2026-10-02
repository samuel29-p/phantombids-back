const express = require("express");
const router = express.Router();
const autenticar = require("../middlewares/autenticar");
const autorizar = require("../middlewares/autorizar");
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
router.get("/:id", autenticar, obtenerCasa);
router.post("/", autenticar, crearCasa);
router.put("/:id", autenticar, actualizarCasa);
router.delete("/:id", autenticar, autorizar("admin"), eliminarCasa);
router.post("/:id/join", autenticar, unirseCasa);
router.get("/:id/members", autenticar, obtenerMiembros);

module.exports = router;