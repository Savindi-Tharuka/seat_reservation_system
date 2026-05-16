import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, addDays } from 'date-fns';

const SeatBooking = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [internName, setInternName] = useState('');
  const [internId, setInternId] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setInternName(userData.username);
      setInternId(userData.id);
    }
  }, []);

  useEffect(() => {
    fetchAvailableSeats();
  }, [selectedDate]);

  const fetchAvailableSeats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/seats/available/${selectedDate}`);
      setAvailableSeats(response.data.availableSeats);
    } catch (error) {
      console.error('Error fetching available seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSeat || !internName.trim()) {
      alert('Please select a seat and enter your name');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/reservations', {
        internId,
        internName: internName.trim(),
        seatNumber: selectedSeat,
        date: selectedDate
      });
      
      alert('Seat booked successfully!');
      navigate('/reservations');
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Error booking seat. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateDateOptions = () => {
    const options = [];
    for (let i = 0; i < 30; i++) {
      const date = addDays(new Date(), i);
      options.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'MMM dd, yyyy')
      });
    }
    return options;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Book Your Seat</h1>
          <p className="text-blue-700">Select a date and choose your preferred seat</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-blue-200">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {generateDateOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

                             {/* Intern Name */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Your Name
                 </label>
                 <input
                   type="text"
                   value={internName}
                   onChange={(e) => setInternName(e.target.value)}
                   placeholder="Enter your full name"
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   disabled
                 />
                 <p className="text-xs text-gray-500 mt-1">Name is set from your account</p>
               </div>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Available Seats for {format(new Date(selectedDate), 'MMM dd, yyyy')}
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading available seats...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-10 gap-2 mb-6">
                  {Array.from({ length: 50 }, (_, i) => {
                    const seatNumber = i + 1;
                    const isAvailable = availableSeats.includes(seatNumber);
                    const isSelected = selectedSeat === seatNumber;
                    
                    return (
                      <button
                        key={seatNumber}
                        onClick={() => isAvailable && setSelectedSeat(seatNumber)}
                        disabled={!isAvailable}
                        className={`
                          p-3 rounded-lg text-sm font-medium transition-all duration-200
                          ${isSelected 
                            ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                            : isAvailable 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-md' 
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }
                        `}

                      >
                        {seatNumber}
                      </button>
                    );
                  })}
                </div>
                

              </>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                <span className="text-green-800">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                <span className="text-blue-800">Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                <span className="text-gray-500">Booked</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Back to Dashboard
            </button>
            
            <button
              onClick={handleBooking}
              disabled={!selectedSeat || !internName.trim() || loading}
              className={`
                px-8 py-3 rounded-lg font-medium transition-all duration-200
                ${selectedSeat && internName.trim() && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {loading ? 'Booking...' : 'Book Seat'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking; 