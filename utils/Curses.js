const express = require("express");
const router = express.Router();
const { listarMaldiciones } = require("../controllers/objectController");

//publica, nadie necesita sesion para ver el catalogo
router.get("/", listarMaldiciones);

module.exports = router;