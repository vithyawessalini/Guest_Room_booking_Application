const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model (Owner)
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room', // Refers to the 'Room' model 
    },
  ],
});

const House = mongoose.model('House', houseSchema);
module.exports = House;
