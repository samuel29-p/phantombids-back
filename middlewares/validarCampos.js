const { validationResult } = require("express-validator");

//revisa si alguna de las reglas de validacion (las que van antes en la ruta) fallo
//y, si fallo, lanza el error
function validarCampos(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const detalles = errores.array().map((e) => e.msg);
    throw { status: 400, message: "Datos invalidos", detalles };
  }

  next();
}

module.exports = validarCampos;