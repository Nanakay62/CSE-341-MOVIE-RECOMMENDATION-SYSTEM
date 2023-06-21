const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAllMovies = async (_req, res, next) => {
  try {
    const movies = await mongodb.getDb().db('MRS').db.collection('Movies').find().toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error retrieving movies:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
const getMovieById = async (req, res, next) => {
  try {
    const movieId = req.params.id;

    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const objectId = new ObjectId(movieId);
    const db = mongodb.getDb();
    const movie = await db.collection('Movies').findOne({ _id: objectId });

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error('Error retrieving movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const createMovie = async (req, res) => {
  try {
    const movie = {
      description: req.body.description,
      director: req.body.director,
      duration: req.body.director,
      genre: req.body.description,
      title:req.body.title,
      writer: req.body.writer
    };
    const response = await mongodb.getDb().db("MRS").collection('Movies').insertOne(movie);
    console.log('Response:', response);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the movie.');
    }
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json(error.message || 'Some error occurred while creating the movie.');
  }
};

const updateMovie = async (req, res) => {
  try {
    const movieId = new ObjectId(req.params.id);
    const movie = {
      description: req.body.description,
      director: req.body.director,
      duration: req.body.director,
      genre: req.body.description,
      title:req.body.title,
      writer: req.body.writer
    };

    const response = await mongodb.getDb().db("MRS").collection("Movies").replaceOne({ _id: movieId }, movie);
    console.log(response);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || "Error encountered: The movie was not updated");
    }
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(400).json("Invalid JSON payload");
  }
};

const deleteMovie = async (req, res) => {
  const movieId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db("MRS").collection('Movies').deleteOne({ _id: movieId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while trying to delete the movie. Please try again.');
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};