const asyncHandler = require("../utils/asyncHandler");
const auctionService = require("../services/auctionService");

//GET /api/auctions
const listar = asyncHandler(async (req, res) => {
  const subastas = await auctionService.listar(req.query);
  res.status(200).json({ subastas });
});

//GET /api/auctions/:id
const obtener = asyncHandler(async (req, res) => {
  const subasta = await auctionService.obtenerPorId(req.params.id);
  res.status(200).json({ subasta });
});

//POST /api/auctions
const crear = asyncHandler(async (req, res) => {
  const subasta = await auctionService.crear(req.body, req.usuario);
  res.status(201).json({ subasta });
});

//PUT /api/auctions/:id
const actualizar = asyncHandler(async (req, res) => {
  const subasta = await auctionService.actualizar(req.params.id, req.body, req.usuario);
  res.status(200).json({ subasta });
});

//DELETE /api/auctions/:id
const eliminar = asyncHandler(async (req, res) => {
  await auctionService.eliminar(req.params.id);
  res.status(200).json({ mensaje: "Subasta eliminada" });
});

module.exports = { listar, obtener, crear, actualizar, eliminar };
