import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import OwnerNavbar from '../components/OwnerNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal';
import AddHouseForm from './AddHouse';
import EditHouseForm from '../components/EditHouse';  
import '../styles/OwnerDashboard.css';
import { BASE_URL } from '../config';
const OwnerDashboard = () => {
  const [houses, setHouses] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentHouse, setCurrentHouse] = useState(null);
  const navigate = useNavigate();

  // fetch houses
  const fetchHouses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${ BASE_URL }/api/owner/houses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHouses(response.data);
    } catch (error) {
      console.error('Error fetching houses:', error);
      setError(error.message || 'Error fetching houses');
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        } 
        const response = await axios.get(`${ BASE_URL }/api/getProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setError(error.message || 'Error fetching user details');
        }
      }
    };
    fetchUserProfile();
    fetchHouses();
  }, [navigate]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (house) => {
    setCurrentHouse(house);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentHouse(null);
  };

  // if delete the house then delete their room as well as
  const handleDelete = async (houseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      await axios.delete(`${ BASE_URL }/api/owner/house/${houseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHouses(houses.filter(house => house._id !== houseId));
    } catch (error) {
      console.error('Error deleting house:', error);
      setError(error.message || 'Error deleting house');
    }
  };

  const reloadHouses = () => {
    fetchHouses();
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <OwnerNavbar />
      <div className="owner-dashboard-container">
        <button className="add-button" onClick={openModal}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
          Add New House
        </button>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="modal-content">
            <AddHouseForm closeModal={closeModal} reloadHouses={reloadHouses} />
          </div>
        </Modal>

        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <div className="modal-content">
            {currentHouse && <EditHouseForm house={currentHouse} closeModal={closeEditModal} reloadHouses={reloadHouses} />}
          </div>
        </Modal>

        <div className="houses-container">
          {houses.map((house) => (
            <div className="house-card" key={house._id}>
              {house.photo && (
                <img
                  src={`${ BASE_URL }/api/owner/house-photo/${house._id}`}
                  alt={house.name}
                  className="house-image"
                />
              )}
              <div className="house-info">
                <h3>House name : {house.name}</h3>
                <p>Location : {house.address}</p>
                <div className='house-button'>
                <Link to={`/owner/house/${house._id}`} >View Details</Link>
                <div className="house-actions">
                  <button onClick={() => openEditModal(house)}>
                    <FontAwesomeIcon icon={faEdit} className="fa-icon1" />
                  </button>
                  <button onClick={() => handleDelete(house._id)}>
                    <FontAwesomeIcon icon={faTrash} className="fa-icon1" />
                  </button>
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
