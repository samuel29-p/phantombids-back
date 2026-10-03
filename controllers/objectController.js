const asyncHandler = require("../utils/asyncHandler");
const objectService = require("../services/objectService");
const { CURSE_LIST } = require("../utils/Curses");

const crearObjeto = asyncHandler(async (req, res) => {
  const objeto = await objectService.crearObjeto(req.body, req.usuario._id);
  res.status(201).json({ objeto });
});

const listarObjetos = asyncHandler(async (req, res) => {
  const objetos = await objectService.obtenerObjetos();
  res.status(200).json({ objetos });
});

const obtenerObjeto = asyncHandler(async (req, res) => {
  const objeto = await objectService.obtenerObjetoPorId(req.params.id);
  res.status(200).json({ objeto });
});

const actualizarObjeto = asyncHandler(async (req, res) => {
  const objeto = await objectService.actualizarObjeto(req.params.id, req.body, req.usuario);
  res.status(200).json({ objeto });
});

const eliminarObjeto = asyncHandler(async (req, res) => {
  await objectService.eliminarObjeto(req.params.id, req.usuario);
  res.status(200).json({ mensaje: "Objeto eliminado" });
});

//GET /api/curses - publica, no necesita autenticar
const listarMaldiciones = asyncHandler(async (req, res) => {
  res.status(200).json({ curses: CURSE_LIST });
});

module.exports = {
  crearObjeto,
  listarObjetos,
  obtenerObjeto,
  actualizarObjeto,
  eliminarObjeto,
  listarMaldiciones,
};