const asyncHandler = require("../utils/asyncHandler");
const houseService = require("../services/houseService");

//POST /api/houses
const crearCasa = asyncHandler(async (req, res) => {
  const casa = await houseService.crearCasa(req.body, req.usuario._id);
  res.status(201).json({ casa });
});

//GET /api/houses
const listarCasas = asyncHandler(async (req, res) => {
  const casas = await houseService.obtenerCasas();
  res.status(200).json({ casas });
});

//GET /api/houses/:id
const obtenerCasa = asyncHandler(async (req, res) => {
  const casa = await houseService.obtenerCasaPorId(req.params.id);
  res.status(200).json({ casa });
});

//PUT /api/houses/:id
const actualizarCasa = asyncHandler(async (req, res) => {
  const casa = await houseService.actualizarCasa(req.params.id, req.body, req.usuario);
  res.status(200).json({ casa });
});

//DELETE /api/houses/:id
const eliminarCasa = asyncHandler(async (req, res) => {
  await houseService.eliminarCasa(req.params.id);
  res.status(200).json({ mensaje: "Casa eliminada" });
});

//POST /api/houses/:id/join
const unirseCasa = asyncHandler(async (req, res) => {
  const casa = await houseService.unirseCasa(req.params.id, req.usuario._id, req.body.inviteCode);
  res.status(200).json({ casa });
});

//GET /api/houses/:id/members
const obtenerMiembros = asyncHandler(async (req, res) => {
  const miembros = await houseService.obtenerMiembros(req.params.id, req.usuario._id);
  res.status(200).json({ miembros });
});

module.exports = {
  crearCasa,
  listarCasas,
  obtenerCasa,
  actualizarCasa,
  eliminarCasa,
  unirseCasa,
  obtenerMiembros,
};