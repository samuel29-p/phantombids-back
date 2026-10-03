const asyncHandler = require("../utils/asyncHandler");
const betService = require("../services/betService");

//POST /api/auctions/:id/bets
const apostar = asyncHandler(async (req, res) => {
  const apuesta = await betService.apostar(req.params.id, req.body, req.usuario);
  res.status(201).json({ apuesta });
});

//GET /api/auctions/:id/bets
const listar = asyncHandler(async (req, res) => {
  const apuestas = await betService.listar(req.params.id);
  res.status(200).json({ apuestas });
});

module.exports = { apostar, listar };
