import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

const EditRoomForm = ({ roomId, reloadHouseDetails, closeModal }) => {
  const [room, setRoom] = useState(null);
  const [name, setName] = useState('');
  const [floorSize, setFloorSize] = useState('');
  const [numberOfBeds, setNumberOfBeds] = useState('');
  const [amenities, setAmenities] = useState('');
  const [rent, setRent] = useState('');
  const [minBookingDays, setMinBookingDays] = useState('');
  const [maxBookingDays, setMaxBookingDays] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const roomResponse = await axios.get(`${ BASE_URL }/api/owner/room/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const roomData = roomResponse.data;
        setRoom(roomData);
        setName(roomData.name || '');
        setFloorSize(roomData.floorSize ? roomData.floorSize.toString() : '');
        setNumberOfBeds(roomData.numberOfBeds ? roomData.numberOfBeds.toString() : '');
        setAmenities(roomData.amenities || '');
        setRent(roomData.rent ? roomData.rent.toString() : '');
        setMinBookingDays(roomData.minBookingDays ? roomData.minBookingDays.toString() : '');
        setMaxBookingDays(roomData.maxBookingDays ? roomData.maxBookingDays.toString() : '');
        setLoading(false);  
      } catch (error) {
        console.error('Error fetching room details:', error);
        setError(error.message || 'Error fetching room details');
        setLoading(false);  
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const updatedRoom = {
        name,
        floorSize: parseFloat(floorSize),
        numberOfBeds: parseInt(numberOfBeds),
        amenities,
        rent: parseFloat(rent),
        minBookingDays: parseInt(minBookingDays),
        maxBookingDays: parseInt(maxBookingDays),
      };
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        setUploading(true);
        const photoResponse = await axios.post(`${ BASE_URL }/api/owner/room/${roomId}/photo`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedRoom.photo = photoResponse.data.photoUrl;
        setUploading(false);
      }
      await axios.put(`${ BASE_URL }/api/owner/room/${roomId}`, updatedRoom, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await reloadHouseDetails();
      closeModal();
    } catch (error) {
      console.error('Error updating room:', error);
      setError(error.message || 'Error updating room');
      setUploading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!room) {
    return <div>No room details found.</div>;
  }

  return (
    <div>
      <h3>Edit Room: {room.name}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Floor Size (sq ft):
          <input type="text" value={floorSize} onChange={(e) => setFloorSize(e.target.value)} />
        </label>
        <label>
          Number of Beds:
          <input type="number" value={numberOfBeds} onChange={(e) => setNumberOfBeds(e.target.value)} />
        </label>
        <label>
          Amenities:
          <input type="text" value={amenities} onChange={(e) => setAmenities(e.target.value)} />
        </label>
        <label>
          Rent (₹ per day):
          <input type="number" value={rent} onChange={(e) => setRent(e.target.value)} />
        </label>
        <label>
          Min Booking Days:
          <input type="number" value={minBookingDays} onChange={(e) => setMinBookingDays(e.target.value)} />
        </label>
        <label>
          Max Booking Days:
          <input type="number" value={maxBookingDays} onChange={(e) => setMaxBookingDays(e.target.value)} />
        </label>
        <label>
          Room Photo:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        {uploading && <p>Uploading photo...</p>}
        <button type="submit" disabled={uploading}>Update Room</button>
      </form>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default EditRoomForm;
