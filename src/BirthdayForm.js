import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.css';
import './BirthdayForm.css';


const BirthdayForm = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBirthday, setSelectedBirthday] = useState(null);
  const [birthdays, setBirthdays] = useState([]);

  const fetchBirthdayByDate = async (formattedDate) => {
    try {
      const response = await axios.get(`https://qpjh1ob0ei.execute-api.ap-south-1.amazonaws.com/dev/getBithdayByDate/${formattedDate}`);
      console.log('Response:', response); // Log the response to inspect its structure
      setSelectedBirthday(response.data.birthday);
    } catch (error) {
      console.error('Error fetching birthday:', error);
      setErrorMessage('Error occurred while fetching birthday.');
    }
  };

  const fetchAllBirthdays = async () => {
    try {
      const response = await axios.get('https://qpjh1ob0ei.execute-api.ap-south-1.amazonaws.com/dev/birthdays');
      console.log('All Birthdays:', response.data.birthdays);
      setBirthdays(response.data.birthdays);
    } catch (error) {
      console.error('Error fetching all birthdays:', error);
      setErrorMessage('Error occurred while fetching all birthdays.');
    }
  };

  useEffect(() => {
    const formattedDate = moment(date).tz('Asia/Kolkata').format('YYYY-MM-DD');
    fetchBirthdayByDate(formattedDate);
    fetchAllBirthdays();
  }, [date]); // Fetch data when date changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedDate = moment(date).tz('Asia/Kolkata').format('YYYY-MM-DD');

      const response = await axios.post(
        'https://qpjh1ob0ei.execute-api.ap-south-1.amazonaws.com/dev/create',
        {
          Date: formattedDate,
          Events: events.split(',').map(event => event.trim())
        }
      );

      console.log('Success:', response.data);
      
      // Fetch updated birthday after successful submission
      fetchBirthdayByDate(formattedDate);
      fetchAllBirthdays();

      // Clear input fields after successful submission
      setDate(new Date());
      setEvents('');

      // Handle success, maybe show a success message or redirect
    } catch (error) {
      console.error('Error:', error.response.data.error);
      setErrorMessage('Error occurred while adding birthday.');
      // Handle error, maybe show an error message to the user
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '45%' }}>
        <h2 style={{ color: '#2E8B57' }}>Add BirthDay</h2>
        {errorMessage && <div>{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <label>Date:</label>
          <DatePicker selected={date} onChange={date => setDate(date)} />&nbsp;&nbsp;&nbsp;&nbsp;
          <label>Events:</label>
          <input type="text" value={events} onChange={(e) => setEvents(e.target.value)} />&nbsp;&nbsp;&nbsp;
          <button className="submit-button" type="submit">Submit</button>
        </form>

        {selectedBirthday && selectedBirthday.Date && selectedBirthday.Date.S && (
          <div>
           <h2 style={{ color: '#2E8B57' }}>Event</h2>
            <p><h5>Date</h5>{selectedBirthday.Date.S}</p>
            <h5>Event-details</h5>
            <ol style={{ listStyleType: 'none', paddingLeft: '0' }}>
              {selectedBirthday.Events && selectedBirthday.Events.L && selectedBirthday.Events.L.map((event, index) => (
                <li key={index}>
                  <span>&#9733;</span> {event.S}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div style={{ width: '45%' }}>
        <h2 style={{ color: '#2E8B57' }}>Favourite Birthdays</h2>
        {birthdays.map((birthday, index) => (
          <div key={index}>
            <h3>{birthday.Date.S}</h3>
            <ol style={{ listStyleType: 'none', paddingLeft: '0' }}>
              {birthday.Events && birthday.Events.L && birthday.Events.L.map((event, index) => (
                <li key={index}>
                  <span>&#9733;</span> {event.S}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BirthdayForm;
