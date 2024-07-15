import React from 'react';
import '../styles/Modal.css'
const Modal = ({ isOpen, onClose, children }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
