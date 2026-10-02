const express = require("express");
const router = express.Router();
const autenticar = require("../middlewares/autenticar");
const {
  crearObjeto,
  listarObjetos,
  obtenerObjeto,
  actualizarObjeto,
  eliminarObjeto,
} = require("../controllers/objectController");

router.get("/", autenticar, listarObjetos);
router.get("/:id", autenticar, obtenerObjeto);
router.post("/", autenticar, crearObjeto);
router.put("/:id", autenticar, actualizarObjeto);
router.delete("/:id", autenticar, eliminarObjeto);

module.exports = router;