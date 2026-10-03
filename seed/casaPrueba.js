require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const HauntHouse = require("../models/HauntHouse");

//script temporal, crea una casa de prueba con el usuario del email como headhaunter
//sirve para probar objetos y subastas mientras el crud de casas no esta listo
//se usa asi: node seed/casaPrueba.js tu@email.com
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = process.argv[2];
  const usuario = await User.findOne({ email: email });
  if (!usuario) {
    console.log("No existe un usuario con ese email, registralo primero en Postman");
    process.exit(1);
  }

  const casa = await HauntHouse.create({
    name: "The Silent Crypt",
    theme: "Darkness",
    description: "Objects that only whisper when nobody is watching.",
    members: [{ userId: usuario._id, role: "HeadHaunter" }],
  });

  console.log("Casa creada, su id es:", casa._id.toString());
  await mongoose.disconnect();
}

main();
