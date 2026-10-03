const Bid = require("../models/Bid");
const Auction = require("../models/Auction");
const CursedObject = require("../models/CursedObject");
const { buscarCasaYMiembro } = require("../utils/membresia");
const { getAlias } = require("../utils/alias");

async function buscarSubasta(auctionId) {
  const subasta = await Auction.findById(auctionId);
  if (!subasta) {
    throw { status: 404, message: "Subasta no encontrada" };
  }
  return subasta;
}

//registra la puja secreta de un usuario, cada usuario puja una sola vez por subasta
async function pujar(auctionId, amount, usuario) {
  const subasta = await buscarSubasta(auctionId);

  //solo se puja en subastas abiertas y que no hayan pasado su fecha de cierre
  if (subasta.status !== "open") {
    throw { status: 409, message: "La subasta ya no esta abierta" };
  }
  if (subasta.endsAt <= new Date()) {
    throw { status: 409, message: "La subasta ya paso su fecha de cierre" };
  }

  //hay que ser miembro de la casa, y los poltergeist estan castigados sin pujar
  const { miembro } = await buscarCasaYMiembro(subasta.hauntHouseId, usuario._id);
  if (!miembro) {
    throw { status: 403, message: "Debes ser miembro de la casa para pujar" };
  }
  if (miembro.role === "Poltergeist") {
    throw { status: 403, message: "Los Poltergeist no pueden pujar" };
  }

  const yaPujo = await Bid.findOne({ auctionId: subasta._id, userId: usuario._id });
  if (yaPujo) {
    throw { status: 409, message: "Ya hiciste tu puja secreta en esta subasta" };
  }

  //el rango exacto depende del objeto, por eso se revisa aqui y no en el schema
  const objeto = await CursedObject.findById(subasta.cursedObjectId);
  if (!objeto) {
    throw { status: 404, message: "El objeto de esta subasta ya no existe" };
  }
  if (amount < objeto.minBid || amount > objeto.maxBid) {
    throw {
      status: 400,
      message: "La puja debe estar entre " + objeto.minBid + " y " + objeto.maxBid,
    };
  }

  //el alias lo pone el servidor, si por casualidad otro ya lo tiene se le agrega un numero
  let alias = getAlias(subasta._id, usuario._id);
  const aliasRepetido = await Bid.findOne({ auctionId: subasta._id, alias: alias });
  if (aliasRepetido) {
    const cantidad = await Bid.countDocuments({ auctionId: subasta._id });
    alias = alias + " " + (cantidad + 1);
  }

  return Bid.create({
    auctionId: subasta._id,
    userId: usuario._id,
    amount: amount,
    alias: alias,
  });
}

//nunca se muestra el userId, asi nadie sabe quien esta detras de cada alias
//mientras la subasta este abierta los montos son secretos, solo se ven los alias para poder apostar
//cuando cierra ya se ven los montos, ordenados de menor a mayor
async function listar(auctionId) {
  const subasta = await buscarSubasta(auctionId);
  if (subasta.status === "open") {
    return Bid.find({ auctionId: subasta._id }).select("alias createdAt");
  }
  return Bid.find({ auctionId: subasta._id }).select("alias amount createdAt").sort({ amount: 1 });
}

module.exports = { pujar, listar };
