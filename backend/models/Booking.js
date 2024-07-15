//backend/model/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,   // Refer to the 'Room' model
    ref: 'Room',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,    // Refer to the 'User' model(customer)
    ref: 'User',
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
