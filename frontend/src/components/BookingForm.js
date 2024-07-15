import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
const BookingForm = ({ room, closeModal }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [availability, setAvailability] = useState([]);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [minBookingDays, setMinBookingDays] = useState(0);
  const [maxBookingDays, setMaxBookingDays] = useState(14);
  const [checkoutMinDate, setCheckoutMinDate] = useState('');

  useEffect(() => {
    fetchRoomDetails();
    fetchAvailability();
    fetchUserProfile();
  }, [room]);

  useEffect(() => {
    if (checkIn) {
      const minDate = new Date(checkIn);
      minDate.setDate(minDate.getDate() + 1);
      setCheckoutMinDate(minDate.toISOString().split('T')[0]);
    } else {
      setCheckoutMinDate('');
    }
  }, [checkIn]);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`${ BASE_URL }/api/rooms/${room._id}/details`);
      setMinBookingDays(response.data.minBookingDays); 
      setMaxBookingDays(response.data.maxBookingDays); 
    } catch (error) {
      console.error('Error fetching room details:', error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`${ BASE_URL }/api/rooms/${room._id}/availability`);
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${ BASE_URL }/api/getProfile`, config);
      setUserId(response.data._id); 
      setUserName(response.data.name);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleBooking = async () => {
    try {
      if (!checkIn || !checkOut) {
        setBookingMessage('Please select both check-in and check-out dates.');
        return;
      }
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = Math.abs(checkOutDate - checkInDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < minBookingDays || diffDays > maxBookingDays) {
        setBookingMessage(`Booking must be between ${minBookingDays} and ${maxBookingDays} days.`);
        return;
      }
      if (isDateBooked(checkInDate) || isDateBooked(checkOutDate)) {
        setBookingMessage('Cannot book on selected dates as they are already booked.');
        return;
      }

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`${ BASE_URL }/api/rooms/${room._id}/book`, {
        userId,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
      }, config);

      setBookingMessage(response.data.message);
      alert("Booking has been done successfully");
      setCheckIn('');
      setCheckOut('');
      setBookingMessage('');
      closeModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setBookingMessage(error.response.data.error);
      } else {
        console.error('Error booking room:', error);
        setBookingMessage('Booking failed. Please try again.');
      }
    }
  };

  const isDateBooked = (date) => {
    return availability.some(booking => {
      const bookingStartDate = new Date(booking.checkIn);
      const bookingEndDate = new Date(booking.checkOut);
      return date >= bookingStartDate && date < bookingEndDate;
    });
  };

  const getDateInputStyle = (dateString) => {
    const date = new Date(dateString);
    if (isDateBooked(date)) {
      return {
        backgroundColor: 'red',
        color: 'white'
      };
    }
    return {};
  };

  return (
    <div className="booking-form">
      <h3>Book Room</h3>
      {userName && <p>Booking on behalf of: {userName}</p>}
      <div>
        <label>Check-in Date:</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          style={getDateInputStyle(checkIn)}
          min={new Date().toISOString().split('T')[0]} 
        />
      </div>
      <div>
        <label>Check-out Date:</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          style={getDateInputStyle(checkOut)}
          min={checkoutMinDate}
          />
      </div>
      <br />
      <button onClick={handleBooking}>Book Room</button>
      {bookingMessage && <p>{bookingMessage}</p>}
    </div>
  );
};

export default BookingForm;
