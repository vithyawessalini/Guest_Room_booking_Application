const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const User = require('./models/User');
// const House = require('./models/House');
const ownerRoutes = require('./routes/Owner');
const roomRoutes = require('./routes/Room');
const bookingRoutes = require('./routes/Booking');
const customerRoutes = require('./routes/Customer');
const availabilityRoutes = require('./routes/Availability');
const authRoutes = require('./routes/Auth');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', roomRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api', bookingRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api', availabilityRoutes);
app.use('/api',authRoutes);

mongoose.connect('mongodb+srv://Vithyawessalini:7Ty1Nlwmpt05br4g@cluster0.95wjl6y.mongodb.net/guestRoomBooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
