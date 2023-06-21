const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (_req, res, next) => {
  const result = await mongodb.getDb().db('MRS').collection('Users').find();
  result.toArray().then((Users) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(Users);
  });
};

const getUserById = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db('MRS')
    .collection('Users')
    .find({ _id: userId });
  result.toArray().then((Users) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(Users[0]);
  });
};

const createUser = async (req, res) => {
  try {
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteMovie: req.body.favoriteMovie,
      birthday: req.body.birthday,
      favoriteActor: req.body.favoriteActor
    };
    const response = await mongodb.getDb().db('MRS').collection('Users').insertOne(user);
    console.log('Response:', response);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the user.');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json(error.message || 'Some error occurred while creating the user.');
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteMovie: req.body.favoriteMovie,
      birthday: req.body.birthday,
      favoriteActor: req.body.favoriteActor
      // Update other relevant fields for the user
    };

    const response = await mongodb
      .getDb()
      .db('MRS')
      .collection('Users')
      .replaceOne({ _id: userId }, user);
    console.log(response);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Error encountered: The user was not updated');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json('Invalid JSON payload');
  }
};

const deleteUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db('MRS').collection('Users').deleteOne({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || 'An error occurred while trying to delete the user. Please try again..');
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};