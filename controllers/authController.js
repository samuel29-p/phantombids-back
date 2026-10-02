const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");
 
//POST /api/auth/register
const registrar = asyncHandler(async (req, res) => {
  const { usuario, token } = await authService.registrar(req.body);
  res.status(201).json({ usuario, token });
});
 
//POST /api/auth/login
const iniciarSesion = asyncHandler(async (req, res) => {
  const { usuario, token } = await authService.iniciarSesion(req.body);
  res.status(200).json({ usuario, token });
});
 
//GET /api/auth/me 
const miPerfil = asyncHandler(async (req, res) => {
  res.status(200).json({ usuario: req.usuario });
});
 
module.exports = { registrar, iniciarSesion, miPerfil };