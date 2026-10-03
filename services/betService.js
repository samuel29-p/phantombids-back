const Bet = require("../models/Bet");
const Bid = require("../models/Bid");
const Auction = require("../models/Auction");
const User = require("../models/User");
const CurseLog = require("../models/CurseLog");
const { buscarCasaYMiembro } = require("../utils/membresia");

//apuesta reputacion a que un alias va a ganar la subasta
async function apostar(auctionId, datos, usuario) {
  const subasta = await Auction.findById(auctionId);
  if (!subasta) {
    throw { status: 404, message: "Subasta no encontrada" };
  }
  if (subasta.status !== "open" || subasta.endsAt <= new Date()) {
    throw { status: 409, message: "Solo se puede apostar en subastas abiertas" };
  }

  const { miembro } = await buscarCasaYMiembro(subasta.hauntHouseId, usuario._id);
  if (!miembro) {
    throw { status: 403, message: "Debes ser miembro de la casa para apostar" };
  }

  //la maldicion blind eye no deja apostar mientras no haya vencido
  const ahora = new Date();
  const maldiciones = await CurseLog.find({ userId: usuario._id, curse: "CANNOT_BET_48_HOURS" });
  const castigado = maldiciones.some((m) => m.expiresAt && m.expiresAt > ahora);
  if (castigado) {
    throw { status: 403, message: "Tienes la maldicion Blind Eye, no puedes apostar por ahora" };
  }

  const yaAposto = await Bet.findOne({ auctionId: subasta._id, bettorId: usuario._id });
  if (yaAposto) {
    throw { status: 409, message: "Ya hiciste tu apuesta en esta subasta" };
  }

  //solo se puede apostar por un alias que de verdad tenga una puja en esta subasta
  const pujaApostada = await Bid.findOne({ auctionId: subasta._id, alias: datos.predictedAlias });
  if (!pujaApostada) {
    throw { status: 404, message: "Ese alias no tiene pujas en esta subasta" };
  }
  if (pujaApostada.userId.toString() === usuario._id.toString()) {
    throw { status: 400, message: "No puedes apostar por tu propio alias" };
  }

  //lo apostado se descuenta de una vez, al cerrar la subasta se paga lo que corresponda
  const monto = Number(datos.amount);
  if (usuario.reputation < monto) {
    throw { status: 400, message: "No tienes reputacion suficiente para esa apuesta" };
  }
  const apostador = await User.findById(usuario._id);
  apostador.reputation = apostador.reputation - monto;
  await apostador.save();

  return Bet.create({
    auctionId: subasta._id,
    bettorId: usuario._id,
    predictedAlias: datos.predictedAlias,
    amount: monto,
  });
}

//las apuestas no muestran quien aposto, solo a que alias, cuanto y como les fue
async function listar(auctionId) {
  const subasta = await Auction.findById(auctionId);
  if (!subasta) {
    throw { status: 404, message: "Subasta no encontrada" };
  }
  return Bet.find({ auctionId: subasta._id }).select("predictedAlias amount status payout createdAt");
}

module.exports = { apostar, listar };
