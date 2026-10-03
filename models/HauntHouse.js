const mongoose = require("mongoose");

//"sub-rol" cada miembro de la casa tiene un rol DE JUEGO (distinto al role admin/user de User)
const miembroSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["HeadHaunter", "SeniorSpook", "Spirit", "Poltergeist"],
      default: "Spirit",
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const hauntHouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre de la casa es obligatorio"],
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
  },
  theme: {
    type: String,
    required: [true, "El tema es obligatorio"],
    enum: ["Darkness", "Comedy", "Terror", "Corporate"],
  },
  description: {
    type: String,
    default: "",
  },
  coverImageUrl: {
    type: String,
    default: "",
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  inviteCode: {
    type: String,
    default: null, //solo las casas privadas tienen codigo
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  members: [miembroSchema],
});

module.exports = mongoose.model("HauntHouse", hauntHouseSchema);