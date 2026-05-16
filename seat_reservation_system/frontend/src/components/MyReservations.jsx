import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

const MyReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [internId, setInternId] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setInternId(userData.id);
    }
  }, []);

  useEffect(() => {
    if (internId) {
      fetchReservations();
    }
  }, [internId]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/reservations/intern/${internId}`);
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/reservations/${reservationId}/cancel`);
      alert('Reservation cancelled successfully!');
      fetchReservations(); // Refresh the list
    } catch (error) {
      alert('Error cancelling reservation. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const isFutureReservation = (date) => {
    return new Date(date) > new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">My Reservations</h1>
          <p className="text-blue-700">View and manage your seat bookings</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Reservations List */}
          <div className="bg-white rounded-lg shadow-lg border border-blue-200">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading your reservations...</p>
              </div>
            ) : reservations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reservations Found</h3>
                <p className="text-gray-600 mb-4">You haven't made any seat reservations yet.</p>
                <button
                  onClick={() => navigate('/booking')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Your First Seat
                </button>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Your Reservations ({reservations.length})
                </h3>
                
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-bold text-blue-600">
                                  {reservation.seatNumber}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  Seat {reservation.seatNumber}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {format(parseISO(reservation.date), 'EEEE, MMMM dd, yyyy')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                {getStatusText(reservation.status)}
                              </span>
                              {isFutureReservation(reservation.date) && reservation.status === 'active' && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  Upcoming
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {reservation.status === 'active' && isFutureReservation(reservation.date) && (
                            <button
                              onClick={() => handleCancel(reservation._id)}
                              className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {reservations.length > 0 && (
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Quick Actions</h4>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/booking')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Book Another Seat
                </button>
                <button
                  onClick={fetchReservations}
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  Refresh List
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReservations; 