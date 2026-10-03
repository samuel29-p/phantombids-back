const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
 
//revisa el header Authorization, valida el token, y deja el usuario en req.usuario
const autenticar = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
 
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw { status: 401, message: "No se encontro un token, inicia sesion" };
  }
 
  const token = authHeader.split(" ")[1];
 
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw { status: 401, message: "Token invalido o expirado" };
  }
 
  const usuario = await User.findById(payload.id);
 
  if (!usuario) {
    throw { status: 401, message: "El usuario de este token ya no existe" };
  }
 
  req.usuario = usuario;
  next();
});
 
module.exports = autenticar;