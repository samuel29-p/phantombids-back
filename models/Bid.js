const mongoose = require("mongoose");

//una puja secreta dentro de una subasta, requisitos 10, 11 y 14
const bidSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: [true, "La puja debe pertenecer a una subasta"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La puja debe tener un usuario"],
    },
    //aqui va el rango general del enunciado, el rango exacto de cada objeto se revisa en el servicio
    //porque cambia de un objeto a otro y el schema no lo conoce
    amount: {
      type: Number,
      required: [true, "El monto de la puja es obligatorio"],
      min: [1, "La puja minima es 1"],
      max: [500, "La puja maxima es 500"],
    },
    //el alias anonimo del requisito 3, sale de la funcion getAlias y no lo manda el usuario
    alias: {
      type: String,
      required: [true, "La puja debe tener un alias"],
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bid", bidSchema);
