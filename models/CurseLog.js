const mongoose = require("mongoose");
const { CURSE_CODES } = require("../utils/curses");

//una maldicion que le cayo a un usuario al ganar una subasta, requisitos 20 al 22
//un usuario puede tener varias entradas al tiempo, por eso es una coleccion aparte y no un campo del usuario
const curseLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La maldicion debe tener un usuario"],
    },
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: [true, "La maldicion debe venir de una subasta"],
    },
    //solo acepta uno de los 8 codigos del catalogo
    curse: {
      type: String,
      required: [true, "El codigo de la maldicion es obligatorio"],
      enum: {
        values: CURSE_CODES,
        message: "Esa maldicion no existe en el catalogo",
      },
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    //null significa que el efecto es permanente, requisito 21
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CurseLog", curseLogSchema);
