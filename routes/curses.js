const express = require("express");
const router = express.Router();
const { listarMaldiciones } = require("../controllers/objectController");

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
 */
router.get("/", listarMaldiciones);

module.exports = router;