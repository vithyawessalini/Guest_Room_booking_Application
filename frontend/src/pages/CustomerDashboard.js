
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import '../styles/CustomerDashboard.css';  
import { BASE_URL } from '../config';
const CustomerDashboard = () => {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    fetchHouses();
  }, []);

  // fetch the house using this api
  const fetchHouses = async () => {
    try {
      const response = await axios.get(`${ BASE_URL }/api/customer/houses`);
      setHouses(response.data);
    } catch (error) {
      console.error('Error fetching houses:', error);
    }
  };

  return (
    <div className="customer-dashboard">
      <CustomerNavbar />
      <h2>&emsp;Houses</h2>
      <div className="house-list">
        {houses.map(house => (
          <div key={house._id} className="house-card-container">
            <div className="house-card">
              <img src={`${ BASE_URL }/api/customer/houses/${house._id}/image`} alt={house.name} className="house-image" />
              <div className="house-details">
                <h3>{house.name}</h3>
                <p>{house.address}</p>
                <Link to={`/houses/${house._id}/rooms`} className="house-link">
                  View Rooms
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
