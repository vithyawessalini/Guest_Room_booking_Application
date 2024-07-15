const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/rooms/:roomId/book
// Book a room
router.post('/rooms/:roomId/book', async (req, res) => {
  try {
    const { checkIn, checkOut, userId } = req.body;
    const { roomId } = req.params;

    // Create a new booking
    const booking = new Booking({
      room: roomId,
      userId: userId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
    });

    await booking.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
      console.error('Error booking room:', error); // Log detailed error message
      res.status(500).json({ message: 'Booking failed. Please try again.' });
  }
});

module.exports = router;
