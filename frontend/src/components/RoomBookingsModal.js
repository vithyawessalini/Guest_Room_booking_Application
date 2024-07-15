import React from 'react';
import '../styles/Modal.css';

const RoomBookingsModal = ({ isOpen, onClose, roomId, bookings }) => {
  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" >
            <h2>Bookings for Room ID: {roomId}</h2>
            <div className="booking-table-container">
              <table className="booking-table">
                <thead>
                  <tr>
                    <th>User name</th>
                    <th>Check-in Date</th>
                    <th>Check-out Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.userId.name}</td>
                        <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                        <td>{new Date(booking.checkOut).toLocaleDateString()}</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No bookings found for this room.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomBookingsModal;
