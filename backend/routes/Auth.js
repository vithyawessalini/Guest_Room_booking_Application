const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
  const { userType, name, email, phoneNumber, address, dob, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create a new user
    const user = new User({
      userType,
      name,
      email,
      phoneNumber,
      address,
      dob,
      password,
    });

    await user.save();
    // console.log('User registered successfully:', user); 
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    // Find the user by email and user type
    const user = await User.findOne({ email, userType });
    if (!user) {
      console.error('User not found:', email); 
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Invalid credentials for user:', email); 
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Prepare JWT payload
    const payload = {
      userId: user._id,
      userType: user.userType,
    };

    // Generate JWT token
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

    // console.log('Login successful for user:', user); 
    res.json({ token, userType: user.userType });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
  
router.get('/getProfile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});


module.exports = router;
