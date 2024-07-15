// routes/customer.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const House = require('../models/House');
// const User = require('../models/User');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

// Function to verify JWT token
const verifyToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('No token found');
  }

  return jwt.verify(token, 'your_jwt_secret'); 
};

// Route to fetch all rooms available 
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// To fetch the house details
router.get('/houses', async (req, res) => {
  try {
    const houses = await House.find();
    res.json(houses);
  } catch (error) {
    console.error('Error fetching houses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// To fetch rooms by house ID
router.get('/houses/:houseId/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ house: req.params.houseId });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Route to fetch the image of house
router.get('/houses/:id/image', async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    if (!house || !house.photo.data) {
      throw new Error('Image not found');
    }

    res.set('Content-Type', house.photo.contentType);
    res.send(house.photo.data);
  } catch (error) {
    console.error('Error fetching house image:', error.message);
    res.status(404).send('Image not found');
  }
});
// Route to get the booking of the user(customer)
router.get('/bookings', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    const bookings = await Booking.find({ userId: userId }).populate({
      path: 'room',
      populate: { path: 'house', select: 'name address' } // Ensure 'name' and 'address' are selected
    });

    res.json(bookings);
    // console.log(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
