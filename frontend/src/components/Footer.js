
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Guest Room Booking. All Rights Reserved.</p>
        <p>Contact us: <a href="mailto:your-email@example.com">guestnest@gmail.com</a></p>
      </div>
    </footer>
  );
};

export default Footer;
