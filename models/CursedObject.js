const mongoose = require("mongoose");
const { CURSE_CODES } = require("../utils/curses");

//un objeto maldito que se puede subastar dentro de una casa, requisito 8
const cursedObjectSchema = new mongoose.Schema(
  {
    hauntHouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HauntHouse",
      required: [true, "El objeto debe pertenecer a una casa"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El objeto debe tener un creador"],
    },
    name: {
      type: String,
      required: [true, "El nombre del objeto es obligatorio"],
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [80, "El nombre no puede pasar de 80 caracteres"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [300, "La descripcion no puede pasar de 300 caracteres"],
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    //la maldicion base tiene que ser una de las 8 del catalogo
    baseCurse: {
      type: String,
      required: [true, "La maldicion base es obligatoria"],
      enum: {
        values: CURSE_CODES,
        message: "Esa maldicion no existe en el catalogo",
      },
    },
    minBid: {
      type: Number,
      required: [true, "La puja minima es obligatoria"],
      min: [1, "La puja minima no puede ser menor a 1"],
      max: [100, "La puja minima no puede ser mayor a 100"],
    },
    //la regla de que sea al menos minBid + 10 depende de otro campo, por eso se revisa en el servicio
    maxBid: {
      type: Number,
      required: [true, "La puja maxima es obligatoria"],
      max: [500, "La puja maxima no puede ser mayor a 500"],
    },
    durationDays: {
      type: Number,
      required: [true, "La duracion es obligatoria"],
      min: [1, "La duracion minima es 1 dia"],
      max: [7, "La duracion maxima es 7 dias"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CursedObject", cursedObjectSchema);
