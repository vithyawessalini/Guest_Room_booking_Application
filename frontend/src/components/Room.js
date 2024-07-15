import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Room.css';
import { BASE_URL } from '../config';

const Room = ({ room, userId }) => {
  // const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  // const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // const openCalendarModal = () => setIsCalendarModalOpen(true);
  // const closeCalendarModal = () => setIsCalendarModalOpen(false);

  // const openBookingModal = () => setIsBookingModalOpen(true);
  // const closeBookingModal = () => setIsBookingModalOpen(false);

  return (
    <div className="room-card">
      {room.photos.map((photo, index) => (
        <img
          key={index}
          src={`${ BASE_URL }/api/owner/room-photos/${room._id}/${index}`}
          alt={`Room ${index + 1}`}
          className="room-image1"
        />
      ))}
      <h3>{room.name}</h3>
      <p>Floor Size: {room.floorSize} sqm</p>
      <p>Number of Beds: {room.numberOfBeds}</p>
      <p>Amenities: {room.amenities}</p>
      <p>Rent: ₹{room.rent} per night</p>
      <p>Min Booking Days: {room.minBookingDays}</p>
      <p>Max Booking Days: {room.maxBookingDays}</p>

      <Link to={`/rooms/${room._id}`} className="view-link"><button>View</button></Link>
      {/* <button onClick={openCalendarModal}>Availability Calendar</button>
      <button onClick={openBookingModal}>Book</button>

      <Modal isOpen={isCalendarModalOpen} onClose={closeCalendarModal}>
        <AvailabilityCalendar room={room} />
      </Modal>

      <Modal isOpen={isBookingModalOpen} onClose={closeBookingModal}>
        <BookingForm room={room} userId={userId} />
      </Modal> */}
    </div>
  );
};

export default Room;
