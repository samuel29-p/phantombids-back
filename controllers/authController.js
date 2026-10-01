
const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");
 
const registrar = asyncHandler(async (req, res) => {
  const { usuario, token } = await authService.registrar(req.body);
  res.status(201).json({ usuario, token });
});
 
//POST /api/auth/login
const iniciarSesion = asyncHandler(async (req, res) => {
  const { usuario, token } = await authService.iniciarSesion(req.body);
  res.status(200).json({ usuario, token });
});
 
module.exports = { registrar, iniciarSesion };