const Auction = require("../models/Auction");
const CursedObject = require("../models/CursedObject");
const Bid = require("../models/Bid");
const Bet = require("../models/Bet");
const { buscarCasaYMiembro } = require("../utils/membresia");

//si llegan ?status o ?hauntHouseId en la url, filtra por ellos
async function listar(filtros) {
  const consulta = {};
  if (filtros.status) consulta.status = filtros.status;
  if (filtros.hauntHouseId) consulta.hauntHouseId = filtros.hauntHouseId;
  return Auction.find(consulta).sort({ createdAt: -1 });
}

async function obtenerPorId(id) {
  const subasta = await Auction.findById(id);
  if (!subasta) {
    throw { status: 404, message: "Subasta no encontrada" };
  }
  return subasta;
}

//crea una subasta a partir de un objeto que ya existe, igual que createAuction del front
async function crear(datos, usuario) {
  const objeto = await CursedObject.findById(datos.cursedObjectId);
  if (!objeto) {
    throw { status: 404, message: "Objeto no encontrado" };
  }

  //la casa de la subasta es la misma del objeto, no la manda el usuario
  const { miembro } = await buscarCasaYMiembro(objeto.hauntHouseId, usuario._id);
  if (!miembro && usuario.role !== "admin") {
    throw { status: 403, message: "Debes ser miembro de la casa para crear subastas" };
  }

  //un objeto no puede estar en dos subastas abiertas al mismo tiempo
  const yaSubastado = await Auction.findOne({ cursedObjectId: objeto._id, status: "open" });
  if (yaSubastado) {
    throw { status: 409, message: "Este objeto ya esta en una subasta abierta" };
  }

  //la fecha de cierre se calcula sumando los dias de duracion del objeto, en milisegundos
  const ahora = new Date();
  const cierre = new Date(ahora.getTime() + objeto.durationDays * 24 * 60 * 60 * 1000);

  return Auction.create({
    hauntHouseId: objeto.hauntHouseId,
    cursedObjectId: objeto._id,
    createdBy: usuario._id,
    startsAt: ahora,
    endsAt: cierre,
  });
}

//lo unico que se puede cambiar de una subasta es su fecha de cierre, y solo mientras este abierta
//el estado y el ganador los cambia el cierre de la subasta, nunca se editan a mano
async function actualizar(id, datos, usuario) {
  const subasta = await obtenerPorId(id);

  const esCreador = subasta.createdBy.toString() === usuario._id.toString();
  if (!esCreador && usuario.role !== "admin") {
    throw { status: 403, message: "Solo el creador de la subasta o un admin puede editarla" };
  }
  if (subasta.status !== "open") {
    throw { status: 409, message: "Solo se puede editar una subasta abierta" };
  }

  const nuevoCierre = new Date(datos.endsAt);
  if (nuevoCierre <= new Date()) {
    throw { status: 400, message: "La nueva fecha de cierre debe estar en el futuro" };
  }

  subasta.endsAt = nuevoCierre;
  await subasta.save();
  return subasta;
}

//al borrar una subasta se borran tambien sus pujas y apuestas, para no dejar datos huerfanos
async function eliminar(id) {
  const subasta = await obtenerPorId(id);
  await Bid.deleteMany({ auctionId: subasta._id });
  await Bet.deleteMany({ auctionId: subasta._id });
  await subasta.deleteOne();
  return subasta;
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
