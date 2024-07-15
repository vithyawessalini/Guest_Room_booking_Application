import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';  
import { BASE_URL } from '../config';
const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userType: '',
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    dob: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //  validate the fields whether all fields are filled or not
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field} is required`;
      }
    });
    return newErrors;
  };

  // add a user 
  const handleRegistration = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(`${ BASE_URL }/api/register`, formData);
      console.log('Registration successful:', response.data);
      alert('Registration successful!');

      setFormData({
        userType: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        dob: '',
        password: '',
      });
      setErrors({});

      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-content">
          <div className="registration-image">
            <img src="https://media.istockphoto.com/id/1199804796/photo/portrait-of-tourist-woman-raised-her-hands-and-standing-nearly-window-looking-to-beautiful.jpg?s=612x612&w=0&k=20&c=1aFeaqMrXPu04AzjeztOoVvRmLm2lbNM5EH_f_fApng=" alt="Registration" />
          </div>
          <div className="registration-form">
            <h2 className="card-title">Registration Form</h2>
            <form onSubmit={handleRegistration}>
              <div className="mb-3">
                {/* <label htmlFor="userType" className="form-label">User Type</label> */}
                <select id="userType" name="userType" className="form-select" value={formData.userType} onChange={handleChange} required>
                  <option value="">Select user type</option>
                  <option value="owner">Owner</option>
                  <option value="customer">Customer</option>
                </select>
                {errors.userType && <p className="error">{errors.userType}</p>}
              </div>
              <div className="mb-3">
                {/* <label htmlFor="name" className="form-label">Name</label> */}
                <input type="text" id="name" name="name" className="form-control" placeholder='Name' value={formData.name} onChange={handleChange} required />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
              <div className="mb-3">
                {/* <label htmlFor="email" className="form-label">Email</label> */}
                <input type="email" id="email" name="email" className="form-control" placeholder='Email' value={formData.email} onChange={handleChange} required />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div className="mb-3">
                {/* <label htmlFor="phoneNumber" className="form-label">Phone Number</label> */}
                <input type="tel" id="phoneNumber" name="phoneNumber" className="form-control" placeholder='Phonenumber' value={formData.phoneNumber} onChange={handleChange} required />
                {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
              </div>
              <div className="mb-3">
                {/* <label htmlFor="address" className="form-label">Address</label> */}
                <textarea id="address" name="address" className="form-control" placeholder='Address' value={formData.address} onChange={handleChange}></textarea>
                {errors.address && <p className="error">{errors.address}</p>}
              </div>
              <div className="mb-3">
                {/* <label htmlFor="dob" className="form-label">Date of Birth</label> */}
                <input type="date" id="dob" name="dob" className="form-control"plac value={formData.dob} onChange={handleChange} />
                {errors.dob && <p className="error">{errors.dob}</p>}
              </div>
              <div className="mb-3">
                {/* <label htmlFor="password" className="form-label">Password</label> */}
                <input type="password" id="password" name="password" className="form-control" placeholder='Password' value={formData.password} onChange={handleChange} required />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
