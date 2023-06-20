const express = require('express');
const dotenv = require('dotenv');
const { initDb } = require('./db/connect');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const cors = require('cors');
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();
app.use(cors());
const port = 8000;

app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.use('/', routes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Initialize the database connection
initDb((err) => {
  if (err) {
    console.error('Sorry, there was an error connecting to the database', err);
    process.exit(1);
  } else {
    // Setup Swagger API documentation
    setupSwagger(app);

    app.listen(process.env.PORT || port, () => {
      console.log(`Web Server is listening at port ${port}`);
      console.log('Database connected');
    });
  }});



/*const express = require('express');
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
})*/
