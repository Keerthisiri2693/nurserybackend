const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nursery Backend API",
      version: "1.0.0",
      description: "API documentation for Nursery App",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"], // IMPORTANT
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;