const { validationResult } = require("express-validator");

//va despues de las reglas de express-validator en cada ruta
//si alguna regla fallo, corta la peticion con 400 y la lista de errores, si no, sigue al controlador
function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: "Datos invalidos",
      detalles: errores.array().map((e) => e.msg),
    });
  }
  next();
}

module.exports = validar;
