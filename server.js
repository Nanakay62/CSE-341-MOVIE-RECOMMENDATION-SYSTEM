const express = require('express');
const dotenv = require('dotenv');
const { initDb } = require('./db/connect');
const { movieRoutes, userRoutes } = require('./routes/');
const bodyParser = require('body-parser');
const cors = require('cors');
const setupSwagger = require('./swagger');

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', movieRoutes);
app.use('/', userRoutes);

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
  }
});