const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Mismos campos del front + Role (nuevo)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "El username es obligatorio"],
    minlength: [3, "El username debe tener al menos 3 caracteres"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "El email no es valido"],
  },
  password: {
    type: String,
    required: [true, "La contrasena es obligatoria"],
    minlength: [6, "La contrasena debe tener al menos 6 caracteres"],
  },
  reputation: {
    type: Number,
    default: 100, //reputacion inicial 
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  avatarUrl: {
    type: String,
    default: "",
  },
  //rol global distinto al de la "casa"
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

//Mongoose 9 ya no usa next() en los hooks,por eso es una funcion async normal, sin llamar next 
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//compara la contraseña que llega en el login contra el hash guardado
userSchema.methods.compararPassword = async function (passwordIngresada) {
  return bcrypt.compare(passwordIngresada, this.password);
};

//evita que el hash de la contraseña salga en las respuestas JSON de la API
userSchema.methods.toJSON = function () {
  const usuario = this.toObject();
  delete usuario.password;
  return usuario;
};

module.exports = mongoose.model("User", userSchema);