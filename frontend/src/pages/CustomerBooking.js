

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerNavbar from '../components/CustomerNavbar';
import '../styles/CustomerBooking.css';
import { BASE_URL } from '../config';
const CustomerBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${ BASE_URL }/api/customer/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message || 'Error fetching bookings');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);  

  return (
    <div className="customer-booking-page">
      <CustomerNavbar />
      <div className="booking-list">
        {bookings.length === 0 ? (
          <p className="no-bookings-message">.</p>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>House</th>
                <th>Room</th>
                <th>Address</th>
                <th>Check-in</th>
                <th>Check-out</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.room.house.name}</td>
                  <td>{booking.room.name}</td>
                  <td>{booking.room.house.address}</td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerBookingPage;
