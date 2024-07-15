import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';  
import { BASE_URL } from '../config';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('User Type');  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    const userData = {
      email,
      password,
      userType,  
    };

    try {
      const response = await axios.post(`${ BASE_URL }/api/login`, userData);
      console.log('Login successful:', response.data);
      alert('Login successful!');

      localStorage.setItem('token', response.data.token);

      // according to the usertype navigate
      if (response.data.userType === 'owner') {
        navigate('/owner/dashboard');
      } else if (response.data.userType === 'customer') {
        navigate('/customer/dashboard');
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }

    
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="col-md-6 col-lg-7 d-none d-md-block">
          <img
            src="https://www.bhg.com/thmb/O308V5FawLSwluNQ8K1RHHtIW1I=/1244x0/filters:no_upscale():strip_icc()/modern-bedroom-neutrals-gold-sconces-7bLa8Fz-4H883NnY4KOJvi-261ce61898a340ff9cf6352ba1744ab7.jpg"
            alt="login form"
            className="login-image"
          />
        </div>
        <div className="col-md-7 col-lg-5 d-flex align-items-center">
          <br/>
        <h2> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Login Form</h2>
          <div className="login-form">
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="login-select"
                  required
                >
                  <option value="">User Type</option>
                  <option value="owner">Owner</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="Password"
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
