# Guest Room Booking Application

## Overview

The Guest Room Booking application allows house owners to list their properties for short-term stays, while customers can browse and book rooms. The application manages room availability, booking durations, and provides a seamless booking experience.

TechStack
Frontend: React
Backend: Node.js (Express)
Database: MongoDB Atlas
Others: CSS for styling, React Router for navigation

Modules
Customer Module 
House Owner Module 

## Features

- **House Owners:**
  - Create an account and access a dashboard.
  - Register and manage properties
  - Add, edit, delete room details
  - Set minimum and maximum booking periods
  - Set rent amount per day
  - Upload photos of rooms

- **Customers:**
  - Register for an account
  - Create an account and view account details after login.
  - Browse available rooms
  - View room details and photos
  - Check availability on a calendar
  - Book rooms for specific dates
  - Make bookings for preferred rooms.

## Project Structure

- `frontend/` - Contains the frontend React application
- `backend/` - Contains the backend Node.js/Express application
  
## Installation

1. **Clone the repository**:

   git clone https://github.com/vithyawessalini/Guest_Room_Booking_Application.git
2. **Navigate to the project directory**:
   
   cd Guest_Room_Booking_Application
   
## Running the Application

## Frontend

1. **Navigate to the frontend directory**:
   
   cd frontend
2. **Install the dependencies:**

   npm install
3. **Start the frontend development server**:
   
   npm start
4. **Access the frontend application**:
   
   Open your web browser and navigate to http://localhost:3000.
   
## Backend

1. **Navigate to the backend directory**:
   
   cd backend
2. **Install the dependencies:**

   npm install express 
3. **Start the backend server**:
   
   node Server.js
4. **Backend API**:
   
   The backend server will be running at http://localhost:5000 (or the port specified in your configuration).
   
## Database Schema Structure
**Users Schema**
const userSchema = new mongoose.Schema({
  userType: {type: String,enum: ['owner', 'customer'],required: true,},
  name: {type: String,required: true,},
  email: {type: String,required: true,unique: true,},
  phoneNumber: {type: String,required: true,},
  address: {type: String,required: true,},
  dob: {type: Date,required: true,},
  password: {type: String,required: true,},
});

**House Schema**
const houseSchema = new mongoose.Schema({
  owner: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true,},
  name: {type: String,required: true,},
  address: {type: String,required: true,},
  photo: {data: Buffer,contentType: String,},
  rooms: [{  type: mongoose.Schema.Types.ObjectId,  ref: 'Room', },],
});

**Room Schema**
const RoomSchema = new Schema({
  name: {type: String,required: true,},
  floorSize: {type: Number,required: true,},
  numberOfBeds: {type: Number,required: true,},
  amenities: {type: String,required: true,},
  rent: {type: Number,required: true,},
  minBookingDays: {type: Number,required: true,},
  maxBookingDays: {type: Number,required: true,},
  photos: [{data: Buffer,contentType: String,}],
  house: {type: Schema.Types.ObjectId,ref: 'House',required: true,}
});

**Booking Schema**
const bookingSchema = new mongoose.Schema({
  room: {type: mongoose.Schema.Types.ObjectId,ref: 'Room',required: true,},
  userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true,},
  checkIn: {type: Date,required: true,},
  checkOut: {type: Date,required: true,},
});

## Sample Data
**User**
**Owner**
userType:"owner"
name:"John"
email:"john@gmail.com"
phoneNumber:"8056987479"
address:"Coimbatore"
dob:1998-02-18T00:00:00.000+00:00
password:"John@123"

**Customer**
userType:"customer"
name:"Vithya"
email:"vithya@gmail.com"
phoneNumber:"8056987479"
address:"Erode"
dob:2000-06-14T00:00:00.000+00:00
password:"Vithya@123'

**House**

owner:6690f4c42e170b31264e2ab6
name:"Rose Cottage"
address:"Kalam street , Ramanadhapuram ."
photo:Object
  data:BinData(0, '/9j/4AAQSkZJRgABAQEBLAEsAAD/4QCoRXhpZgAASUkqAAgAAAADAA4BAgBeAAAAMgAAABoBBQABAAAAkAAAABsBBQABAAAAmAAA…')
  contentType:"image/jpeg"
**Room**

name:"Lilac"
floorSize:1000
numberOfBeds:1
amenities:"wifi,food,parking,gym"
rent:1500
minBookingDays:1
maxBookingDays:14
photos:Object
  data:BinData(0, '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExIVFhUVFxYYGBcXGBUYGBgYGBkYFh0YGBgZHSggGBolGxgVITEjJSkr…')
  contentType:"image/jpeg"
house:6690f7832e170b31264e2ac1

**Booking**

room:6690f94d2e170b31264e2af3
userId:6690fd3f2e170b31264e2c2d
checkIn:2024-07-24T00:00:00.000+00:00
checkOut:2024-07-31T00:00:00.000+00:00
