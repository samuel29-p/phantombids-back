const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PhantomBids API",
      version: "1.0.0",
      description: "Casa de subastas inversa de objetos embrujados.",
    },
    //en swagger se escoge a cual servidor mandarle las peticiones
    servers: [
      { url: "https://phantombids-back.onrender.com", description: "Produccion (Render)" },
      { url: "http://localhost:3000", description: "Servidor local" },
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
