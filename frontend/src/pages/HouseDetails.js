import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/HouseDetails.css';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AddRoomForm from './AddRoom';
import RoomBookingsModal from '../components/RoomBookingsModal';
import { BASE_URL } from '../config';
const HouseDetails = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [editRoomData, setEditRoomData] = useState(null);
  const [roomImages, setRoomImages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const houseResponse = await axios.get(`${ BASE_URL }/api/owner/house/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHouse(houseResponse.data);

        const roomsResponse = await axios.get(`${ BASE_URL }/api/owner/house/${id}/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRooms(roomsResponse.data);
      } catch (error) {
        console.error('Error fetching house details:', error);
        setError(error.message || 'Error fetching house details');
      }
    };

    fetchHouseDetails();
  }, [id]);

  const openEditModal = (room) => {
    setEditRoomData(room);
    setIsEditModalOpen(true);
    setRoomImages(room.photos || []);
  };

  const openBookingsModal = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${ BASE_URL }/api/owner/room/${roomId}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data);
      setSelectedRoomId(roomId);
      setIsBookingsModalOpen(true);  
    } catch (error) {
      console.error('Error fetching bookings for room:', error);
      setError(error.message || 'Error fetching bookings for room');
    }
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setIsBookingsModalOpen(false);
    setEditRoomData(null);
    setRoomImages([]);
  };

  const reloadHouseDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const houseResponse = await axios.get(`${ BASE_URL }/api/owner/house/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHouse(houseResponse.data);
      const roomsResponse = await axios.get(`${ BASE_URL }/api/owner/house/${id}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(roomsResponse.data);
    } catch (error) {
      console.error('Error reloading house details:', error);
      setError(error.message || 'Error reloading house details');
    }
  };

  const editRoom = (room) => {
    setEditRoomData(room);
    setIsEditModalOpen(true);
    setRoomImages(room.photos || []);
  };

  const deleteRoom = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      await axios.delete(`${ BASE_URL }/api/owner/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));  
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const formData = new FormData();
      formData.append('name', editRoomData.name);
      formData.append('floorSize', editRoomData.floorSize);
      formData.append('numberOfBeds', editRoomData.numberOfBeds);
      formData.append('amenities', editRoomData.amenities);
      formData.append('rent', editRoomData.rent);
      formData.append('minBookingDays', editRoomData.minBookingDays);
      formData.append('maxBookingDays', editRoomData.maxBookingDays);
      roomImages.forEach((image, index) => {
        formData.append('photos', image);
      });
      const response = await axios.put(`${ BASE_URL }/api/owner/room/${editRoomData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedRoomIndex = rooms.findIndex(room => room._id === editRoomData._id);
      if (updatedRoomIndex !== -1) {
        const updatedRooms = [...rooms];
        updatedRooms[updatedRoomIndex] = response.data;
        setRooms(updatedRooms);  
      }
      console.log('Room updated:', response.data);
      closeModal();  
      reloadHouseDetails();
    } catch (error) {
      console.error('Error editing room:', error);
      setError(error.message || 'Error editing room');
    }
  };

  const fetchBookingsForRoom = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${ BASE_URL }/api/owner/room/${roomId}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data);
      setSelectedRoomId(roomId);
      setIsBookingsModalOpen(true);  
    } catch (error) {
      console.error('Error fetching bookings for room:', error);
      setError(error.message || 'Error fetching bookings for room');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setRoomImages(files); 
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="house-details-container1">
        <div className="house-card1">
          {house && house.photo && (
            <img
              src={`${ BASE_URL }/api/owner/house-photo/${house._id}`}
              alt={house.name}
              className="house-image1"
            />
          )}
          <div className="house-info1">
            <h2>House name: {house ? house.name : ''}</h2>
            <h2>Location: {house ? house.address : ''}</h2>
            <p>Owner: {house ? house.owner.name : ''}</p>
            <button className="add-room-button1" onClick={() => setIsEditModalOpen(true)}>
              Add Room
            </button>
          </div>
        </div>
      </div>
      <div className="rooms-container1">
        <h3 style={{ textAlign: 'center' }}>Rooms:</h3>
        <div className="rooms-row1">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div className="room-card1" key={room._id}>
                <div className="room-images1">
                {room.photos && room.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={`${ BASE_URL }/api/owner/room-photos/${room._id}/${index}`}
                      alt={`Room ${index + 1}`}
                      className="room-image1" 
                      style={{height:"200px"}}  
                    />
                  ))}
                </div>
                <h4>{room.name}</h4>
                <p>Floor Size: {room.floorSize} sq ft</p>
                <p>Beds: {room.numberOfBeds}</p>
                <p>Amenities: {room.amenities}</p>
                <p>Rent: ₹{room.rent} per day</p>
                <p>Min Booking Days: {room.minBookingDays}</p>
                <p>Max Booking Days: {room.maxBookingDays}</p>
                <br/><br/><br/>
                <div className="room-actions">
                  <button className="action-button" onClick={() => editRoom(room)}>
                    <FontAwesomeIcon icon={faEdit} className="fa-icon" />
                  </button>
                  <button className="action-button" onClick={() => deleteRoom(room._id)}>
                    <FontAwesomeIcon icon={faTrashAlt} className="fa-icon" />
                  </button>
                  <button className="bookings-button" onClick={() => fetchBookingsForRoom(room._id)}>
                    View Bookings
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No rooms available.</p>
          )}
        </div>
      </div>
      <Modal isOpen={isEditModalOpen} onClose={closeModal}>
        {editRoomData ? (
          <form onSubmit={handleEditSubmit} className="edit-room-form">
            <h3>Edit Room: {editRoomData.name}</h3>
            <label>
              Room Name:
              <input
                type="text"
                name="name"
                value={editRoomData.name}
                onChange={(e) => setEditRoomData({ ...editRoomData, name: e.target.value })}
                required
              />
            </label>
            <label>
              Floor Size (sq ft):
              <input
                type="number"
                name="floorSize"
                value={editRoomData.floorSize}
                onChange={(e) => setEditRoomData({ ...editRoomData, floorSize: e.target.value })}
                required
              />
            </label>
            <label>
              Number of Beds:
              <input
                type="number"
                name="numberOfBeds"
                value={editRoomData.numberOfBeds}
                onChange={(e) => setEditRoomData({ ...editRoomData, numberOfBeds: e.target.value })}
                required
              />
            </label>
            <label>
              Amenities:
              <input
                type="text"
                name="amenities"
                value={editRoomData.amenities}
                onChange={(e) => setEditRoomData({ ...editRoomData, amenities: e.target.value })}
                required
              />
            </label>
            <label>
              Rent (per day):
              <input
                type="number"
                name="rent"
                value={editRoomData.rent}
                onChange={(e) => setEditRoomData({ ...editRoomData, rent: e.target.value })}
                required
              />
            </label>
            <label>
              Min Booking Days:
              <input
                type="number"
                name="minBookingDays"
                value={editRoomData.minBookingDays}
                onChange={(e) => setEditRoomData({ ...editRoomData, minBookingDays: e.target.value })}
                required
              />
            </label>
            <label>
              Max Booking Days:
              <input
                type="number"
                name="maxBookingDays"
                value={editRoomData.maxBookingDays}
                onChange={(e) => setEditRoomData({ ...editRoomData, maxBookingDays: e.target.value })}
                required
              />
            </label>
            <label>
              Photos:
              <input
                type="file"
                multiple
                onChange={handleImageChange}
              />
              <div className="uploaded-images">
                {roomImages.map((image, index) => (
                  <img
                    key={index}
                    src={`${ BASE_URL }/api/owner/room-photos/${editRoomData._id}/${index}`}
                    alt="image"
                    className="uploaded-image"
                  />
                )
                )}
              </div>
            </label>
            <button type="submit">Save Changes</button>
          </form>
        ): (
          <AddRoomForm closeModal={closeModal} reloadHouseDetails={reloadHouseDetails} />
        )}
      </Modal>
      <Modal isOpen={isBookingsModalOpen} onClose={closeModal}>
        {selectedRoomId && (
          <RoomBookingsModal
            isOpen={isBookingsModalOpen}
            closeModal={closeModal}
            bookings={bookings}
            roomName={rooms.find((room) => room._id === selectedRoomId)?.name}
          />
        )}
      </Modal>
    </div>
  );
};

export default HouseDetails;
