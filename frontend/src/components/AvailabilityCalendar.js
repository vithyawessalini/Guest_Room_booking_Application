import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
const AvailabilityCalendar = ({ room, updateTrigger }) => {
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
// fetch the details of booking to check availability
  useEffect(() => {
    fetchAvailability();
  }, [room, currentMonth, currentYear, updateTrigger]); 

  // fetch the availability data for the room
  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`${ BASE_URL }/api/rooms/${room._id}/availability`);
      setAvailability(response.data);//set the availability data
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };
// Function to check if a specific date is booked in a particular room
  const isDateBooked = (date) => {
    return availability.some(booking => {
      const bookingStartDate = new Date(booking.checkIn);
      const bookingEndDate = new Date(booking.checkOut);
      const targetDate = new Date(date);

      return targetDate >= bookingStartDate && targetDate < bookingEndDate;
    });
  };

  const handleDateClick = (dateString) => {
    setSelectedDate(dateString);
  };

  // generate the calender for the current month and year
  const generateCalendar = () => {
    const calendarRows = [];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthYear = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

    let day = 1;
    let weekRow = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      weekRow.push(<td key={`blank-${i}`} className="calendar-day empty"></td>);
    }

    while (day <= daysInMonth) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toISOString().split('T')[0];

      const isBooked = isDateBooked(dateString);
      const dayStyle = {
        backgroundColor: isBooked ? '#f44336' : 'green', 
        color: isBooked ? 'white' : 'black',
        pointerEvents: isBooked ? 'none' : 'auto' 
      };

      weekRow.push(
        <td
          key={dateString}
          className={`calendar-day ${isBooked ? 'booked' : 'available'}`}
          style={dayStyle}
          onClick={() => !isBooked && handleDateClick(dateString)}
        >
          {day}
        </td>
      );
     // check whether the current day is the last day of the week or the last day of the month
      if (date.getDay() === 6 || day === daysInMonth) {
        const remainingDays = 7 - weekRow.length;
        for (let i = 0; i < remainingDays; i++) {
          weekRow.push(<td key={`empty-${i}`} className="calendar-day empty"></td>);
        }
        calendarRows.push(<tr key={`row-${day}`}>{weekRow}</tr>);
        weekRow = []; // reset the week row for next week
      }

      day++;
    }

    return (
      <div className="calendar-container">
        <div className="calendar-nav">
          <h3>{room.name} Availability Calendar</h3>
          <h3>
            <button onClick={() => changeMonth(-1)}>&lt;</button>&emsp;{monthYear}&emsp;
            <button onClick={() => changeMonth(1)}>&gt;</button>
          </h3>
        </div>
        <table className="calendar-table">
          <thead>
            <tr>
              {weekdays.map(day => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>{calendarRows}</tbody>
        </table>
        {/* {selectedDate && (
          <div className="selected-date">
            Selected Date: {new Date(selectedDate).toLocaleDateString()}
          </div>
        )} */}
      </div>
    );
  };

  const changeMonth = (increment) => {
    const newMonth = currentMonth + increment;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(prevYear => prevYear - 1);
    } else if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(prevYear => prevYear + 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  return (
    <div className="availability-calendar">
      {generateCalendar()}
    </div>
  );
};

export default AvailabilityCalendar;
