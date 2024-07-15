import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/EditHouse.css';  
import { BASE_URL } from '../config'; 

const EditHouseForm = ({ house, closeModal, reloadHouses }) => {
  const [formData, setFormData] = useState({
    name: house.name,
    address: house.address,
    photo: null,  
  });

  const [error, setError] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);

  // fetch the house photo 
  useEffect(() => {
    const fetchHousePhoto = async () => {
      try {
        const response = await axios.get(`${ BASE_URL }/api/owner/house-photo/${house._id}`, {
          responseType: 'blob',  
        });
        setExistingPhoto(URL.createObjectURL(response.data));  
      } catch (error) {
        console.error('Error fetching house photo:', error);
        setError('Error fetching house photo. Please try again.');  
      }
    };
    fetchHousePhoto();
  }, [house._id]);

  // change the photo  if the photo is given to update
  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      setFormData({
        ...formData,
        photo: e.target.files[0],  
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // update the changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const formDataUpload = new FormData();
      formDataUpload.append('name', formData.name);
      formDataUpload.append('address', formData.address);
      if (formData.photo) {
        formDataUpload.append('photo', formData.photo); 
      }
      await axios.put(`${ BASE_URL }/api/owner/house/${house._id}`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', 
        },
      });
      closeModal();
      reloadHouses(); 
    } catch (error) {
      console.error('Error updating house:', error);
      setError('Error updating house. Please try again.'); 
    }
  };

  return (
    <form className="edit-house-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="photo">Photo</label>
        <input
          type="file"
          id="photo"
          name="photo"
          onChange={handleChange}
        />
      </div>
      {existingPhoto && (
        <div className="existing-photo">
          <img src={existingPhoto} alt="Existing House" className="existing-photo-img" />
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      <button type="submit">Update House</button>
    </form>
  );
};

export default EditHouseForm;
