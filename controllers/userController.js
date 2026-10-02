const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");
 
//GET /api/users (la ruta ya exige admin con el middleware autorizar)
const listarUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await userService.obtenerUsuarios();
  res.status(200).json({ usuarios });
});
 
//GET /api/users/:id (cualquiera con sesion)
const obtenerUsuario = asyncHandler(async (req, res) => {
  const usuario = await userService.obtenerUsuarioPorId(req.params.id);
  res.status(200).json({ usuario });
});
 
//PUT /api/users/:id (el mismo usuario, o un admin)
const actualizarUsuario = asyncHandler(async (req, res) => {
  const esElMismoUsuario = req.usuario._id.toString() === req.params.id;
  const esAdmin = req.usuario.role === "admin";
 
  if (!esElMismoUsuario && !esAdmin) {
    throw { status: 403, message: "No puedes editar a otro usuario" };
  }
 
  //un usuario normal no se puede autopromover a admin, solo un admin cambia roles
  const datosPermitidos = {
    username: req.body.username,
    email: req.body.email,
    avatarUrl: req.body.avatarUrl,
    password: req.body.password,
  };
  if (esAdmin) {
    datosPermitidos.role = req.body.role;
  }

  Object.keys(datosPermitidos).forEach((campo) => {
    if (datosPermitidos[campo] === undefined) delete datosPermitidos[campo];
  });
 
  const usuario = await userService.actualizarUsuario(req.params.id, datosPermitidos);
  res.status(200).json({ usuario });
});
 
//DELETE /api/users/:id (admin)
const eliminarUsuario = asyncHandler(async (req, res) => {
  await userService.eliminarUsuario(req.params.id);
  res.status(200).json({ mensaje: "Usuario eliminado" });
});
 
module.exports = { listarUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario };