import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
const OwnerHouses = () => {
  const [houses, setHouses] = useState([]);

  // fetch the house details
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get(`${ BASE_URL }/api/owner/houses`);
        setHouses(response.data);
      } catch (error) {
        console.error('Error fetching houses:', error);
      }
    };
    fetchHouses();
  }, []);

  return (
    <div>
      <h2>Your Houses</h2>
      {houses.length === 0 ? (
        <p>No houses found.</p>
      ) : (
        <ul>
          {houses.map((house) => (
            <li key={house._id}>
              <h3>{house.name}</h3>
              <p>{house.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OwnerHouses;
