//lo primero de todo, carga las variables del archivo .env dentro de process.env
require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

//el puerto sale del .env, y si no esta, usa el 3000
//render pone su propio PORT, por eso no se deja fijo en el codigo
const PORT = process.env.PORT || 3000;

//primero se conecta a mongo y solo cuando la conexion funciona se enciende el servidor,
//asi nunca queda un servidor prendido que no puede guardar nada
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});