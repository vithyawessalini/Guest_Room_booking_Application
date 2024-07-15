// backend/routes/Room.js

const express = require('express');
// const jwt = require('jsonwebtoken');
const Room = require('../models/Room');
// const House = require('../models/House');
const router = express.Router();

// fetch the room details of the house
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// fetch the room 
router.get('/rooms/:roomId', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get the room details 
router.get('/rooms/:roomId/details', async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    // console.log(room)
    // Extract relevant details, including minBookingDays and maxBookingDays
    const { minBookingDays, maxBookingDays } = room;

    res.json({ minBookingDays, maxBookingDays });
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
