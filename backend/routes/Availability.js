const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Route to Fetch availability for a specific room
router.get('/rooms/:roomId/availability', async (req, res) => {
  const { roomId } = req.params;

  try {
    //To Fetch existing bookings for the room
    const bookings = await Booking.find({ room: roomId });

    // Extract booked dates from bookings
    const bookedDates = bookings.map(booking => ({
      checkIn: booking.checkIn.toISOString().split('T')[0], // Format to YYYY-MM-DD
      checkOut: booking.checkOut.toISOString().split('T')[0], // Format to YYYY-MM-DD
    }));

    res.json(bookedDates);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});


module.exports = router;
