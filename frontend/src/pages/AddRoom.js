import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../config';
const AddRoomForm = ({ closeModal,reloadHouseDetails }) => {
  const { id } = useParams();
  const [roomDetails, setRoomDetails] = useState({
    name: '',
    floorSize: '',
    numberOfBeds: '',
    amenities: '',
    rent: '',
    minBookingDays: 1,
    maxBookingDays: 30,
    images: [],  
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomDetails({ ...roomDetails, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setRoomDetails({ ...roomDetails, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', roomDetails.name);
      formData.append('floorSize', roomDetails.floorSize);
      formData.append('numberOfBeds', roomDetails.numberOfBeds);
      formData.append('amenities', roomDetails.amenities);
      formData.append('rent', roomDetails.rent);
      formData.append('minBookingDays', roomDetails.minBookingDays);
      formData.append('maxBookingDays', roomDetails.maxBookingDays);
      roomDetails.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post(`${ BASE_URL }/api/owner/house/${id}/add-room`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Room added successfully:', response.data);
      alert('Room added successfully!');
      setRoomDetails({
        name: '',
        floorSize: '',
        numberOfBeds: '',
        amenities: '',
        rent: '',
        minBookingDays: 1,
        maxBookingDays: 30,
        images: '',
      });
      closeModal();
      reloadHouseDetails();  
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Error adding room.');
    }
  };

  return (
    <div>
      <h2>Add Room</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={roomDetails.name} onChange={handleChange} />
        </div>
        <div>
          <label>Floor Size:</label>
          <input type="text" name="floorSize" value={roomDetails.floorSize} onChange={handleChange} />
        </div>
        <div>
          <label>Number of Beds:</label>
          <input type="number" name="numberOfBeds" value={roomDetails.numberOfBeds} onChange={handleChange} />
        </div>
        <div>
          <label>Amenities:</label>
          <input type="text" name="amenities" value={roomDetails.amenities} onChange={handleChange} />
        </div>
        <div>
          <label>Rent:</label>
          <input type="number" name="rent" value={roomDetails.rent} onChange={handleChange} />
        </div>
        <div>
          <label>Minimum Booking Days:</label>
          <input type="number" name="minBookingDays" value={roomDetails.minBookingDays} onChange={handleChange} min="1" max="30" />
        </div>
        <div>
          <label>Maximum Booking Days:</label>
          <input type="number" name="maxBookingDays" value={roomDetails.maxBookingDays} onChange={handleChange} min="1" max="30" />
        </div>
        <div>
          <label>Room Images:</label>
          <input type="file" name="images" onChange={handleImageChange} multiple />
        </div>
        <div style={{paddingTop:'5px'}}>
        <button type="submit">Add Room</button>
        </div>
      </form>
    </div>
  );
};

export default AddRoomForm;
