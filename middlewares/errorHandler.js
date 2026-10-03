//el middleware global de errores, express lo reconoce porque recibe cuatro parametros
//todo error lanzado en cualquier capa termina aqui, y aqui se decide que codigo responder
function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);

  //los errores que lanzamos nosotros en los servicios, con throw { status, message }
  if (err.status) {
    return res.status(err.status).json({ error: err.message, detalles: err.detalles });
  }

  //mongoose rechazo los datos porque no cumplen el schema, por ejemplo falta un campo required
  //se juntan los mensajes de cada campo para que el cliente sepa que corregir
  if (err.name === "ValidationError") {
    const errores = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: "Datos invalidos", detalles: errores });
  }

  //el id que llego en la url no tiene la forma de un id de mongo
  if (err.name === "CastError") {
    return res.status(400).json({ error: "El id no es valido" });
  }

  //se intento guardar un valor que debe ser unico y ya existe, por ejemplo un email repetido
  if (err.code === 11000) {
    return res.status(409).json({ error: "Ese registro ya existe" });
  }

  //cualquier otra cosa es un error nuestro que no esperabamos
  return res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = errorHandler;