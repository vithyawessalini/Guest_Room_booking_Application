import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RoomCard from './Room';
import { BASE_URL } from '../config';

const HouseDetails = () => {
  const { houseId } = useParams();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRoomsByHouse();
  }, []);

  const fetchRoomsByHouse = async () => {
    try {
      const response = await axios.get(`${ BASE_URL }/api/customer/houses/${houseId}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  return (
    <div className="house-details">
      <h2>Rooms in this House</h2>
      <div className="room-list">
        {rooms.map(room => (
          <div key={room._id} className="room-card-container">
            <RoomCard room={room} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HouseDetails;
