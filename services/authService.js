const jwt = require("jsonwebtoken");
const User = require("../models/User");
 
//genera el token firmado con el id y el rol del usuario adentro
function generarToken(usuario) {
  return jwt.sign(
    { id: usuario._id, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}
 
async function registrar({ username, email, password }) {
  const existeEmail = await User.findOne({ email });
  if (existeEmail) {
    throw { status: 409, message: "Ese email ya esta registrado" };
  }
 
  const existeUsername = await User.findOne({ username });
  if (existeUsername) {
    throw { status: 409, message: "Ese username ya esta en uso" };
  }
 
  //no se hashea aqui, el hook "save" del modelo User se encarga solo
  const usuario = await User.create({ username, email, password });
 
  const token = generarToken(usuario);
  return { usuario, token };
}
 
async function iniciarSesion({ email, password }) {
  const usuario = await User.findOne({ email });
  if (!usuario) {
    throw { status: 401, message: "Email o contrasena incorrectos" };
  }
 
  const passwordValida = await usuario.compararPassword(password);
  if (!passwordValida) {
    throw { status: 401, message: "Email o contrasena incorrectos" };
  }
 
  const token = generarToken(usuario);
  return { usuario, token };
}
 
module.exports = { registrar, iniciarSesion };