const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API Auth & User CRUD",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Swagger baca JSDoc di route
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;