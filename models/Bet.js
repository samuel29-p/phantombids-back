const mongoose = require("mongoose");

//una apuesta de reputacion sobre quien va a ganar una subasta, requisitos 16 al 19
const betSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: [true, "La apuesta debe pertenecer a una subasta"],
    },
    bettorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La apuesta debe tener un apostador"],
    },
    //se apuesta a un alias y nunca a un username real, requisito 17
    predictedAlias: {
      type: String,
      required: [true, "Hay que escoger un alias para apostar"],
      trim: true,
    },
    //el enum tambien funciona con numeros, solo deja apostar estos cuatro valores
    amount: {
      type: Number,
      required: [true, "El monto de la apuesta es obligatorio"],
      enum: {
        values: [5, 10, 25, 50],
        message: "La apuesta debe ser 5, 10, 25 o 50",
      },
    },
    //pending mientras la subasta sigue abierta, al cerrar pasa a won, lost o refunded
    status: {
      type: String,
      enum: {
        values: ["pending", "won", "lost", "refunded"],
        message: "El estado debe ser pending, won, lost o refunded",
      },
      default: "pending",
    },
    //lo que se le devuelve al apostador, arranca en cero porque despues se suma en los rankings
    payout: {
      type: Number,
      default: 0,
      min: [0, "El pago no puede ser negativo"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bet", betSchema);
