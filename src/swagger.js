const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Set up Swagger definition and configuration
 */
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Website Analytics API',
    version: '1.0.0',
    description: 'API documentation for Website Analytics System',
    contact: {
      name: 'Your Name',
      email: 'your.email@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
};

/**
 * Set up Swagger options
 */
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Path to the API routes for generating documentation
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Serve Swagger JSON documentation
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
  });
};

module.exports = swaggerDocs;
