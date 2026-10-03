const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PhantomBids API",
      version: "1.0.0",
      description: "Casa de subastas inversa de objetos embrujados.",
    },
    servers: [
      { url: "http://localhost:3000", description: "Servidor local" },
      // SAMUEL: agrega aqui la URL de Render cuando este desplegado
      // { url: "https://phantombids-back.onrender.com", description: "Produccion (Render)" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },

  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);