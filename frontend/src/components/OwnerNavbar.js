import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
const OwnerNavbar = () => {
  const navigate = useNavigate();

  // logout after clicking the logout and the token will be removed
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1> &nbsp; <FontAwesomeIcon icon={faHome} />  Guest Nest</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/owner/dashboard" className="navbar-link">Home</Link>
        </li>
        <li>
          <Link to="/owner/profile" className="navbar-link">Profile</Link>
        </li>
        <li>
          <Link to="/" className="navbar-link"  onClick={handleLogout}> Logout </Link>
        </li>
      </ul>
    </nav>
  );
};

export default OwnerNavbar;
