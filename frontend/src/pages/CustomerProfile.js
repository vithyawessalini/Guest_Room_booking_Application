 

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerNavbar from '../components/CustomerNavbar';
import '../styles/CustomerProfile.css'
import { BASE_URL } from '../config';
const CustomerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  // fetch the user details
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`${BASE_URL}/api/getProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError(error.message || 'Error fetching user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      <CustomerNavbar />
      <div className="user-container">
        {loading ? (
          <p></p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          user && (
            <div className="user-profile">
              <h2 style={{ textAlign: 'center' }}>User Profile</h2>
              <div className="profile-details">
                <div>
                  <strong>Name:</strong>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; {user.name}
                </div>
                <hr />
                <div>
                  <strong>Email:</strong> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;{user.email}
                </div>
                <hr />
                <div>
                  <strong>User Type:</strong> &emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;{user.userType}
                </div>
                <hr />
                <div>
                  <strong>Phone Number:</strong> &emsp;&emsp;&nbsp;&nbsp;{user.phoneNumber}
                </div>
                <hr />
                <div>
                  <strong>Address:</strong>&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp; {user.address}
                </div>
                <hr />
                <div>
                  <strong>Date of Birth:</strong> &emsp;&emsp;&emsp;&nbsp;&nbsp;{new Date(user.dob).toLocaleDateString()}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;