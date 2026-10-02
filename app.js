const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");

//primero se crea la app, y solo despues se le pueden agregar cosas con app.use
const app = express();

//cors deja que un front en otra direccion, como el de la entrega 3, le haga peticiones a este backend
app.use(cors());
//convierte el json que llega en el body de la peticion en un objeto, que queda en req.body
app.use(express.json());

//morgan escribe en la terminal cada peticion que llega, solo mientras desarrollamos
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//ruta de bienvenida, sirve para comprobar rapido que el servidor esta vivo
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de PhantomBids",
    version: "1.0.0",
  });
});

//aqui se van a registrar las rutas de cada recurso a medida que las hagamos, por ejemplo
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/houses", require("./routes/houses"));

//si la peticion no entro en ninguna ruta de arriba, llega aca y se responde 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

//el errorHandler va de ultimo, para atrapar los errores de todo lo que esta arriba
app.use(errorHandler);

module.exports = app;