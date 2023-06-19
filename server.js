const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

const port = 8000;

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Movie Recommendation System API',
        version: '1.0.0',
        description: 'API documentation for the Movie Recommendation System',
      },
      servers: [{ url: 'http://localhost:8000' }],
    },
    apis: ['./routes/moviesRoutes.js'],
  };
  
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Other app configurations and middleware
  
  // Use the movies routes
  const moviesRoutes = require('./routes/moviesRoutes');
  app.use('/movies', moviesRoutes);

app.listen(process.env.PORT || port,() => {
console.log(`Server listening at ${port}`)
})
