const asyncHandler = require("../utils/asyncHandler");
const cursedObjectService = require("../services/cursedObjectService");

//el controlador solo saca los datos de la peticion, llama al servicio y arma la respuesta
//req.query son los filtros de la url, req.params el id, req.body el json y req.usuario el que inicio sesion

//GET /api/objects
const listar = asyncHandler(async (req, res) => {
  const objetos = await cursedObjectService.listar(req.query);
  res.status(200).json({ objetos });
});

//GET /api/objects/:id
const obtener = asyncHandler(async (req, res) => {
  const objeto = await cursedObjectService.obtenerPorId(req.params.id);
  res.status(200).json({ objeto });
});

//POST /api/objects, 201 porque se creo algo nuevo
const crear = asyncHandler(async (req, res) => {
  const objeto = await cursedObjectService.crear(req.body, req.usuario);
  res.status(201).json({ objeto });
});

//PUT /api/objects/:id
const actualizar = asyncHandler(async (req, res) => {
  const objeto = await cursedObjectService.actualizar(req.params.id, req.body, req.usuario);
  res.status(200).json({ objeto });
});

//DELETE /api/objects/:id
const eliminar = asyncHandler(async (req, res) => {
  await cursedObjectService.eliminar(req.params.id, req.usuario);
  res.status(200).json({ mensaje: "Objeto eliminado" });
});

module.exports = { listar, obtener, crear, actualizar, eliminar };
