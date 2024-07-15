import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import Login from './pages/Login';
import Register from './pages/Register';   
import OwnerDashboard from './pages/OwnerDashboard';  
import AddHouse from './pages/AddHouse';  
import HouseDetails from './pages/HouseDetails';  
import AddRoom from './pages/AddRoom'; 
import CustomerDashboard from './pages/CustomerDashboard';
import RoomDetails from './components/RoomDetails';
import RoomPage from './components/CustomerHouseDetails';
import CustomerBooking from './pages/CustomerBooking';
import CustomerProfile from './pages/CustomerProfile';
import OwnerProfile from './pages/OwnerProfile';
import NotFound from './components/NotFound'; 
import './App.css'
const App = () => {

  return (
    <Router>
      <div className="app">
        {/* <header>
          <h1>Guest Room Booking App</h1>
        </header> */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/add-house" element={<AddHouse />} />
            <Route path="/owner/house/:id" element={<HouseDetails />} />
            <Route path="/owner/house/:id/add-room" element={<AddRoom />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard/>} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/houses/:houseId/rooms" element={<RoomPage/>}/>
            <Route path="/customer/booking" element={<CustomerBooking/>} />
            <Route path="/customer/profile" element={<CustomerProfile/>} />
            <Route path="/owner/profile" element={<OwnerProfile/>} />
            <Route path="*" element={<NotFound />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
