const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

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
    documentacion: "/api-docs",
  });
});

//aqui se registran las rutas de cada recurso
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/houses", require("./routes/houses"));
app.use("/api/objects", require("./routes/cursedObjects"));
app.use("/api/auctions", require("./routes/auctions"));
app.use("/api/curses", require("./routes/curses"));

//la documentacion de swagger, se abre en el navegador en /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//si la peticion no entro en ninguna ruta de arriba, llega aca y se responde 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

//el errorHandler va de ultimo, para atrapar los errores de todo lo que esta arriba
app.use(errorHandler);

module.exports = app;
