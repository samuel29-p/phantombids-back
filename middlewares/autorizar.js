//Recibe los roles permitidos como argumentos
//siempre va DESPUES de "autenticar" en la ruta, porque necesita que req.usuario ya exista
function autorizar(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      throw { status: 401, message: "Debes iniciar sesion primero" };
    }
 
    if (!rolesPermitidos.includes(req.usuario.role)) {
      throw { status: 403, message: "No tienes permiso para hacer esto" };
    }
 
    next();
  };
}
 
module.exports = autorizar;