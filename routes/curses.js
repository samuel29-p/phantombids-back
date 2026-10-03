const express = require("express");
const { CURSE_LIST } = require("../utils/curses");

const router = express.Router();

//GET /api/curses, el catalogo de las 8 maldiciones, requisito 9
//es publico y no pasa por servicio porque es una lista fija que no vive en la base de datos
router.get("/", (req, res) => {
  res.status(200).json({ maldiciones: CURSE_LIST });
});

module.exports = router;
