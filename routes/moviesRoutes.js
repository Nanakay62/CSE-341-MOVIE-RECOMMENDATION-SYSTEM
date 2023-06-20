const express = require('express');
const router = express.Router();

// Import movie controller
const movieController = require('../controllers/movieController');

// Routes
router.get('/', movieController.getAllMovies);
router.post('/', movieController.createMovie);
router.get('/:id', movieController.getMovieById);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;