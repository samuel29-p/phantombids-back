const mongoose = require("mongoose");

//cada miembro de la casa con su rol del juego, requisito 7
//este schema no es un modelo aparte, vive adentro de cada casa como un arreglo
const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El miembro debe tener un usuario"],
    },
    role: {
      type: String,
      enum: {
        values: ["HeadHaunter", "SeniorSpook", "Spirit", "Poltergeist"],
        message: "El rol debe ser HeadHaunter, SeniorSpook, Spirit o Poltergeist",
      },
      default: "Spirit",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  //_id false porque un miembro se identifica por su userId, no necesita un id propio
  { _id: false },
);

//una casa de subastas tematica, requisito 4
const hauntHouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la casa es obligatorio"],
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [60, "El nombre no puede pasar de 60 caracteres"],
      trim: true,
    },
    theme: {
      type: String,
      required: [true, "El tema es obligatorio"],
      enum: {
        values: ["Darkness", "Comedy", "Terror", "Corporate"],
        message: "El tema debe ser Darkness, Comedy, Terror o Corporate",
      },
    },
    description: {
      type: String,
      maxlength: [300, "La descripcion no puede pasar de 300 caracteres"],
      trim: true,
      default: "",
    },
    coverImageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    //solo las casas privadas tienen codigo, las publicas lo dejan en null
    inviteCode: {
      type: String,
      trim: true,
      default: null,
    },
    members: [memberSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("HauntHouse", hauntHouseSchema);
