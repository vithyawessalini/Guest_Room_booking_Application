import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/CustomerNavbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
const CustomerNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1> &nbsp; <FontAwesomeIcon icon={faHome} />   Guest Nest</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/customer/dashboard" className="navbar-link"> Home </Link>
        </li>
        <li >
          <Link to="/customer/booking" className="navbar-link"> Booking </Link>
        </li>
        <li >
          <Link to="/customer/profile" className="navbar-link"> Profile </Link>
        </li>
        <li >
          <Link to="/" className="navbar-link"  onClick={handleLogout}> Logout </Link>
        </li>
        </ul>
    </nav>
  );
};

export default CustomerNavbar;
