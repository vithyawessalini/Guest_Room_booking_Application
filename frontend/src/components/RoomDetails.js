import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AvailabilityCalendar from './AvailabilityCalendar';
import BookingForm from './BookingForm';
import Modal from './Modal';
import '../styles/RoomDetails.css';
import { BASE_URL } from '../config';

const RoomDetails = ({ userId }) => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  // fetch the room details
  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`${ BASE_URL }/api/rooms/${id}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room details:', error);
    }
  };

  const openCalendarModal = () => setIsCalendarModalOpen(true);
  const closeCalendarModal = () => setIsCalendarModalOpen(false);

  const openBookingModal = () => setIsBookingModalOpen(true);
  const closeBookingModal = () => setIsBookingModalOpen(false);

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="room-details-container">
      <div className="room-details-card">
        <div className="room-image-container">
          <img
            src={`${ BASE_URL }/api/owner/room-photos/${room._id}/0`} // Assuming first photo
            alt={room.name}
            className="room-image"
          />
        </div>
        <div className="room-details-content">
          <h2>{room.name}</h2>
          <p>Floor Size: {room.floorSize} sqm</p>
          <p>Number of Beds: {room.numberOfBeds}</p>
          <p>Amenities: {room.amenities}</p>
          <p>Rent: ₹{room.rent} per night</p>
          <p>Min Booking Days: {room.minBookingDays}</p>
          <p>Max Booking Days: {room.maxBookingDays}</p>
          <div className="room-actions1">
            <button onClick={openCalendarModal}>Availability Calendar</button>
            <button onClick={openBookingModal}>Book Room</button>
          </div>
        </div>
      </div>

      <Modal isOpen={isCalendarModalOpen} onClose={closeCalendarModal}>
        <AvailabilityCalendar room={room} />
      </Modal>

      <Modal isOpen={isBookingModalOpen} onClose={closeBookingModal}>
        <BookingForm room={room} userId={userId} closeModal={closeBookingModal} />
      </Modal>
    </div>
  );
};

export default RoomDetails;
