const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const router = express.Router();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

// Define a helper function to get the MongoDB client
const getClient = async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client;
};

// GET /movies
router.get('/', async (req, res) => {
  try {
    const client = await getClient();
    const db = client.db('MRS');
    const movies = await db.collection('movies').find().toArray();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.close();
  }
});

// GET /movies/:id
router.get('/:id', async (req, res) => {
  try {
    const client = await getClient();
    const db = client.db('MRS');
    const movieId = req.params.id;
    const movie = await db.collection('movies').findOne({ _id: ObjectId(movieId) });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.close();
  }
});

// POST /movies
router.post('/', async (req, res) => {
  try {
    const client = await getClient();
    const db = client.db('MRS');
    const movie = req.body;
    const result = await db.collection('movies').insertOne(movie);
    res.json(result.ops[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.close();
  }
});

// PUT /movies/:id
router.put('/:id', async (req, res) => {
  try {
    const client = await getClient();
    const db = client.db('MRS');
    const movieId = req.params.id;
    const updatedMovie = req.body;
    const result = await db.collection('movies').updateOne({ _id: ObjectId(movieId) }, { $set: updatedMovie });
    if (result.modifiedCount > 0) {
      res.json({ message: 'Movie updated successfully' });
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.close();
  }
});

// DELETE /movies/:id
router.delete('/:id', async (req, res) => {
  try {
    const client = await getClient();
    const db = client.db('MRS');
    const movieId = req.params.id;
    const result = await db.collection('movies').deleteOne({ _id: ObjectId(movieId) });
    if (result.deletedCount > 0) {
      res.json({ message: 'Movie deleted successfully' });
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.close();
  }
});

module.exports = router;