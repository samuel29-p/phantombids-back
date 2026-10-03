const express = require("express");
const { CURSE_LIST } = require("../utils/curses");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Curses
 *   description: Catalogo publico de maldiciones
 */

/**
 * @swagger
 * /api/curses:
 *   get:
 *     summary: Devuelve el catalogo de las 8 maldiciones (ruta publica)
 *     tags: [Curses]
 *     security: []
 *     responses:
 *       "200": { description: Lista de las 8 maldiciones }
 */
//es publico y no pasa por servicio porque es una lista fija que no vive en la base de datos
router.get("/", (req, res) => {
  res.status(200).json({ maldiciones: CURSE_LIST });
});

module.exports = router;
