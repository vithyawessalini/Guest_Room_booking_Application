import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
const AddHouseForm = ({ closeModal, reloadHouses }) => {
  const [houseDetails, setHouseDetails] = useState({
    name: '',
    address: '',
  });
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHouseDetails({ ...houseDetails, [name]: value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  //add a new house 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const formData = new FormData();
      formData.append('name', houseDetails.name);
      formData.append('address', houseDetails.address);
      formData.append('photo', photo);
      const response = await axios.post(`${ BASE_URL }/api/owner/add-house`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('House added successfully:', response.data);
      alert('House added successfully!');
      setHouseDetails({ name: '', address: '' });
      setPhoto(null);
      closeModal();
      reloadHouses();
    } catch (error) {
      console.error('Error adding house:', error);
      console.error('Error details:', error.response?.data);
      alert(`Error adding house: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div>
      <h2>Add House</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={houseDetails.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Address:</label>
          <input type="text" name="address" value={houseDetails.address} onChange={handleChange} required />
        </div>
        <div>
          <label>Photo:</label>
          <input type="file" name="photo" onChange={handlePhotoChange} required />
        </div>
        <button type="submit">Add House</button>
      </form>
    </div>
  );
};

export default AddHouseForm;
