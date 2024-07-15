import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
const Navbar = () => {
  return (
    <nav className="navbar">
      <h1> &nbsp; <FontAwesomeIcon icon={faHome} />   Guest Nest</h1>
      <div className="links">
        <Link to="/" style={{textDecoration:'none'}}>Home</Link>
        <Link to="/login" style={{textDecoration:'none'}}>Login</Link>
        <Link to="/register" style={{textDecoration:'none'}}>Register</Link>&emsp;
      </div>
    </nav>
  );
};

export default Navbar;
