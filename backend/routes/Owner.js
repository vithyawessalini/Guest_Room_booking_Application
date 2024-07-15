
//backend/routes/Owner.js
const express = require('express');
const router = express.Router();
const House = require('../models/House');
const Room = require('../models/Room');
const Booking = require('../models/Booking')
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Helper function to verify token
const verifyToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('No token found');
  }

  return jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your actual JWT secret
};

// Fetch house details by ID
router.get('/house/:id', async (req, res) => {
  try {
    const houseId = req.params.id;
    const house = await House.findById(houseId).populate('owner', 'name'); // Assuming 'owner' is populated with 'name'
    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }
    res.json(house);
  } catch (error) {
    console.error('Error fetching house details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch rooms by house ID
router.get('/house/:id/rooms', async (req, res) => {
  try {
    const houseId = req.params.id;
    const rooms = await Room.find({ house: houseId });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update house details
// PUT route to update house details and photo
router.put('/house/:id', upload.single('photo'), async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  try {
    const house = await House.findById(id);
    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }

    // Update house details
    house.name = name;
    house.address = address;

    // Update photo if provided
    if (req.file) {
      house.photo.data = req.file.buffer;
      house.photo.contentType = req.file.mimetype;
    }

    await house.save();

    res.json({ message: 'House updated successfully', house });
  } catch (error) {
    console.error('Error updating house:', error);
    res.status(500).json({ error: 'Failed to update house. Please try again.' });
  }
});

// Delete house
router.delete('/house/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const decoded = verifyToken(req);

    const house = await House.findById(id);
    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }

    if (house.owner.toString() !== decoded.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this house' });
    }

    // Delete rooms associated with the house
    await Room.deleteMany({ _id: { $in: house.rooms } });

    // Remove the house
    await House.deleteOne({ _id: house._id });

    res.json({ message: 'House deleted successfully' });
  } catch (error) {
    console.error('Error deleting house:', error);
    res.status(500).json({ error: 'Failed to delete house. Please try again.' });
  }
});


// Backend route to add a room
router.post('/house/:id/add-room', upload.array('images', 5), [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('floorSize').isNumeric().withMessage('Floor size must be a number'),
  check('numberOfBeds').isNumeric().withMessage('Number of beds must be a number'),
  check('amenities').not().isEmpty().withMessage('Amenities are required'),
  check('rent').isNumeric().withMessage('Rent must be a number'),
  check('minBookingDays').isNumeric().withMessage('Minimum booking days must be a number'),
  check('maxBookingDays').isNumeric().withMessage('Maximum booking days must be a number'),
], async (req, res) => {
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, floorSize, numberOfBeds, amenities, rent, minBookingDays, maxBookingDays } = req.body;
  const images = req.files;

  try {
    const house = await House.findById(id);
    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }

    const newRoom = new Room({
      name,
      floorSize,
      numberOfBeds,
      amenities,
      rent,
      minBookingDays,
      maxBookingDays,
      house: id,
      photos: images.map(image => ({
        data: image.buffer,
        contentType: image.mimetype,
      })),
    });

    await newRoom.save();

    res.status(201).json({ message: 'Room added successfully', newRoom });
  } catch (error) {
    console.error('Error adding room:', error);
    res.status(500).json({ error: 'Failed to add room. Please try again.' });
  }
});

// Get room photos
router.get('/room-photos/:roomId/:index', async (req, res) => {
  const { roomId, index } = req.params;
  try {
      const room = await Room.findById(roomId);
      if (!room) {
          return res.status(404).json({ message: 'Room not found' });
      }

      const photo = room.photos[index];
      if (!photo) {
          return res.status(404).json({ message: 'Photo not found' });
      }

      res.set('Content-Type', photo.contentType);
      res.send(photo.data);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});

// Update a room
// PUT route to update a room
router.put('/room/:roomId', upload.array('photos', 5), async (req, res) => {
  const { roomId } = req.params;
  const { name, floorSize, numberOfBeds, amenities, rent, minBookingDays, maxBookingDays } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Update room details
    room.name = name;
    room.floorSize = floorSize;
    room.numberOfBeds = numberOfBeds;
    room.amenities = amenities;
    room.rent = rent;
    room.minBookingDays = minBookingDays;
    room.maxBookingDays = maxBookingDays;

    // Update room photos if uploaded
    if (req.files && req.files.length > 0) {
      room.photos = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
      }));
    }

    await room.save();
    res.json({ message: 'Room updated successfully', room });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Failed to update room. Please try again.' });
  }
});


  
// Backend route to delete a room
router.delete('/room/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    await Room.deleteOne({ _id: id });

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room. Please try again.' });
  }
});
router.get('/room/:roomId/bookings', async (req, res) => {
  try {
    const { roomId } = req.params;
    // console.log(roomId)
    const bookings = await Booking.find({ room: roomId }).populate({
      path: 'userId',
      select: 'name'  
    });
    res.json(bookings);
    // console.log(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

router.post('/add-house', upload.single('photo'), async (req, res) => {
  const { name, address } = req.body;
  const photo = req.file;

  if (!photo) {
    return res.status(400).json({ error: 'Photo is required' });
  }

  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'your_jwt_secret');
  const ownerId = decoded.userId;

  try {
    const newHouse = new House({
      name,
      address,
      owner: ownerId,
      photo: {
        data: photo.buffer,
        contentType: photo.mimetype,
      },
    });

    await newHouse.save();
    res.status(201).json({ message: 'House added successfully', house: newHouse });
  } catch (error) {
    console.error('Error adding house:', error);
    res.status(500).json({ error: 'Failed to add house. Please try again.' });
  }
});

router.get('/houses', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const ownerId = decoded.userId;

    const houses = await House.find({ owner: ownerId }).populate('owner', 'name');
    res.json(houses);
  } catch (error) {
    console.error('Error fetching houses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/house-photo/:id', async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    if (!house || !house.photo.data) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', house.photo.contentType);
    res.send(house.photo.data);
  } catch (error) {
    console.error('Error fetching house photo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/house/:houseId/rooms', async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const { houseId } = req.params;
    const house = await House.findById(houseId).populate('owner');

    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }

    if (house.owner._id.toString() !== decoded.userId) {
      return res.status(403).json({ error: 'Unauthorized to view rooms of this house' });
    }

    const rooms = await Room.find({ house: houseId }).populate('house');

    if (!rooms) {
      return res.status(404).json({ error: 'No rooms found for this house' });
    }

    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
