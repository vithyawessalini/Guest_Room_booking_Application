const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  floorSize: {
    type: Number,
    required: true,
  },
  numberOfBeds: {
    type: Number,
    required: true,
  },
  amenities: {
    type: String,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  minBookingDays: {
    type: Number,
    required: true,
  },
  maxBookingDays: {
    type: Number,
    required: true,
  },
  photos: [{
    data: Buffer,
    contentType: String,
  }],
  house: {
    type: Schema.Types.ObjectId,   // Refer to the 'House' model
    ref: 'House',
    required: true,
  }
});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;