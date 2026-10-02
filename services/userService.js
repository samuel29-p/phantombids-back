const User = require("../models/User");
 
async function obtenerUsuarios() {
  return User.find();
}
 
async function obtenerUsuarioPorId(id) {
  const usuario = await User.findById(id);
  if (!usuario) {
    throw { status: 404, message: "Usuario no encontrado" };
  }
  return usuario;
}
 
async function actualizarUsuario(id, datos) {
  const usuario = await User.findById(id);
  if (!usuario) {
    throw { status: 404, message: "Usuario no encontrado" };
  }
 
  //usamos save() en vez de findByIdAndUpdate, para que SI corran las validaciones y el hook que hashea la contrasena si cambia
  Object.assign(usuario, datos);
  await usuario.save();
 
  return usuario;
}
 
async function eliminarUsuario(id) {
  const usuario = await User.findByIdAndDelete(id);
  if (!usuario) {
    throw { status: 404, message: "Usuario no encontrado" };
  }
  return usuario;
}
 
module.exports = { obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario };