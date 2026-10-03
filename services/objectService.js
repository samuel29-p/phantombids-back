const CursedObject = require("../models/CursedObject");
const HauntHouse = require("../models/HauntHouse");

async function crearObjeto(datos, creadorId) {
  const casa = await HauntHouse.findById(datos.hauntHouseId);
  if (!casa) {
    throw { status: 404, message: "La casa indicada no existe" };
  }

  //solo un miembro de la casa puede publicar un objeto ahi
  const esMiembro = casa.members.some((m) => m.userId.toString() === creadorId.toString());
  if (!esMiembro) {
    throw { status: 403, message: "Debes ser miembro de la casa para publicar un objeto" };
  }

  return CursedObject.create({
    hauntHouseId: datos.hauntHouseId,
    createdBy: creadorId,
    name: datos.name,
    description: datos.description,
    imageUrl: datos.imageUrl,
    baseCurse: datos.baseCurse,
    minBid: datos.minBid,
    maxBid: datos.maxBid,
    durationDays: datos.durationDays,
  });
}

async function obtenerObjetos() {
  return CursedObject.find();
}

async function obtenerObjetoPorId(id) {
  const objeto = await CursedObject.findById(id);
  if (!objeto) {
    throw { status: 404, message: "Objeto no encontrado" };
  }
  return objeto;
}

function puedeModificar(objeto, usuarioActual) {
  const esCreador = objeto.createdBy.toString() === usuarioActual._id.toString();
  const esAdmin = usuarioActual.role === "admin";
  return esCreador || esAdmin;
}

async function actualizarObjeto(id, datos, usuarioActual) {
  const objeto = await obtenerObjetoPorId(id);

  if (!puedeModificar(objeto, usuarioActual)) {
    throw { status: 403, message: "Solo el creador o un admin pueden editar este objeto" };
  }

  Object.assign(objeto, datos);
  await objeto.save();
  return objeto;
}

async function eliminarObjeto(id, usuarioActual) {
  const objeto = await obtenerObjetoPorId(id);

  if (!puedeModificar(objeto, usuarioActual)) {
    throw { status: 403, message: "Solo el creador o un admin pueden eliminar este objeto" };
  }

  await objeto.deleteOne();
  return objeto;
}

module.exports = { crearObjeto, obtenerObjetos, obtenerObjetoPorId, actualizarObjeto, eliminarObjeto };