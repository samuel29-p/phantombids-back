const mongoose = require("mongoose");

//se conecta a la base de datos usando la url que esta en el .env
//es async porque conectarse toma tiempo, await espera a que termine
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB correctamente");
  } catch (error) {
    //si la url esta mal o falta, no tiene sentido seguir, se apaga el proceso con un codigo de error
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;