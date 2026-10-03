const mongoose = require("mongoose");
const { CURSES } = require("../utils/Curses");

const cursedObjectSchema = new mongoose.Schema({
  hauntHouseId: { type: mongoose.Schema.Types.ObjectId, ref: "HauntHouse", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: {
    type: String,
    required: [true, "El nombre del objeto es obligatorio"],
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
  },
  description: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  baseCurse: {
    type: String,
    required: [true, "La maldicion base es obligatoria"],
    enum: Object.keys(CURSES),
  },
  minBid: {
    type: Number,
    required: true,
    min: [1, "minBid no puede ser menor a 1"],
    max: [100, "minBid no puede ser mayor a 100"],
  },
  maxBid: {
    type: Number,
    required: true,
    //validador, depende del minBid del MISMO documento
    validate: {
      validator: function (valor) {
        return valor >= this.minBid + 10 && valor <= 500;
      },
      message: "maxBid debe ser al menos minBid + 10, y no mayor a 500",
    },
  },
  durationDays: {
    type: Number,
    required: true,
    min: [1, "La duracion minima es 1 dia"],
    max: [7, "La duracion maxima es 7 dias"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CursedObject", cursedObjectSchema);