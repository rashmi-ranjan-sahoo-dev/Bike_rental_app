import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Bike, Zap, Wind } from 'lucide-react';
import { API } from '../api/api';

const BookingModal = ({ bike, onClose }) => {
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    dropDate: '',
    dropTime: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [rentalType, setRentalType] = useState('hour');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculatePrice();
  }, [formData, rentalType]);

  const calculatePrice = () => {
    const { pickupDate, pickupTime, dropDate, dropTime } = formData;
    
    if (!pickupDate || !pickupTime || !dropDate || !dropTime) {
      setTotalPrice(0);
      return;
    }

    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const drop = new Date(`${dropDate}T${dropTime}`);
    const diffMs = drop - pickup;
    
    if (diffMs <= 0) {
      setTotalPrice(0);
      return;
    }

    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;
    const diffWeeks = diffDays / 7;

    let price = 0;
    if (rentalType === 'hour') {
      price = Math.ceil(diffHours) * bike.pricePerHour;
    } else if (rentalType === 'day') {
      price = Math.ceil(diffDays) * bike.pricePerDay;
    } else if (rentalType === 'week') {
      price = Math.ceil(diffWeeks) * bike.pricePerWeek;
    }

    setTotalPrice(Math.round(price));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        setError('Please login to book');
        setLoading(false);
        return;
      }

      const bookingData = {
        bike: bike._id,
        helmet: null,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        dropDate: formData.dropDate,
        dropTime: formData.dropTime,
        totalPrice: totalPrice
      };

      const response = await fetch('/api/v1/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.message || 'Booking failed');
      }
    } catch (err) {
      console.log(err)
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform animate-scaleIn">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-3">Booking Confirmed!</h3>
          <p className="text-gray-600 text-lg">Your {bike.model} is reserved and ready for you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-screen overflow-y-auto shadow-2xl transform animate-slideUp">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Book Your Ride</h2>
              <p className="text-blue-100 text-lg">{bike.model}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center transition-all text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-shake">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Select Rental Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setRentalType('hour')}
                className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  rentalType === 'hour'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-bold text-lg">Hourly</div>
                <div className="text-sm mt-1 opacity-90">₹{bike.pricePerHour}/hr</div>
              </button>
              <button
                onClick={() => setRentalType('day')}
                className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  rentalType === 'day'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-bold text-lg">Daily</div>
                <div className="text-sm mt-1 opacity-90">₹{bike.pricePerDay}/day</div>
              </button>
              <button
                onClick={() => setRentalType('week')}
                className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  rentalType === 'week'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-bold text-lg">Weekly</div>
                <div className="text-sm mt-1 opacity-90">₹{bike.pricePerWeek}/wk</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="inline w-4 h-4 mr-2 text-blue-600" />
                Pickup Date
              </label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="inline w-4 h-4 mr-2 text-blue-600" />
                Pickup Time
              </label>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="inline w-4 h-4 mr-2 text-blue-600" />
                Drop Date
              </label>
              <input
                type="date"
                name="dropDate"
                value={formData.dropDate}
                onChange={handleChange}
                min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="inline w-4 h-4 mr-2 text-blue-600" />
                Drop Time
              </label>
              <input
                type="time"
                name="dropTime"
                value={formData.dropTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl mb-8 border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ₹{totalPrice}
              </span>
            </div>
            {totalPrice > 0 && (
              <p className="text-sm text-gray-600 mt-2">Inclusive of all charges</p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || totalPrice === 0}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BikeCard = () => {
  const [bikes, setBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const response = await fetch(`${API}/admin/bikes`);
      const data = await response.json();
      setBikes(data.bikes || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bikes:', error);
      setLoading(false);
    }
  };

  const handleBookNow = (bike) => {
    setSelectedBike(bike);
    setShowBookingModal(true);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'electric': return <Zap className="w-5 h-5" />;
      case 'scooter': return <Wind className="w-5 h-5" />;
      default: return <Bike className="w-5 h-5" />;
    }
  };

  const filteredBikes = filter === 'all' 
    ? bikes 
    : bikes.filter(bike => bike.type === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading awesome bikes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn">
              Find Your Perfect Ride
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fadeIn">
              Premium bikes for every adventure
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-4 mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Bikes
            </button>
            <button
              onClick={() => setFilter('motorbike')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filter === 'motorbike'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bike className="w-5 h-5 inline mr-2" />
              Motorbikes
            </button>
            <button
              onClick={() => setFilter('scooter')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filter === 'scooter'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Wind className="w-5 h-5 inline mr-2" />
              Scooters
            </button>
            <button
              onClick={() => setFilter('electric')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                filter === 'electric'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Zap className="w-5 h-5 inline mr-2" />
              Electric
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBikes.map((bike, index) => (
            <div 
              key={bike._id} 
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative group">
                {bike.imageUrl ? (
                  <img 
                    src={bike.imageUrl} 
                    alt={bike.model} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                    <Bike className="w-20 h-20 opacity-30" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                    bike.status === 'available' ? 'bg-green-500 text-white' :
                    bike.status === 'booked' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {bike.status.toUpperCase()}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-2 rounded-full text-white bg-black bg-opacity-50 backdrop-blur-sm text-xs font-semibold flex items-center gap-1">
                    {getTypeIcon(bike.type)}
                    {bike.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{bike.model}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <span className="text-gray-600 font-medium text-sm">Per Hour</span>
                    <span className="font-bold text-blue-600 text-lg">₹{bike.pricePerHour}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <span className="text-gray-600 font-medium text-sm">Per Day</span>
                    <span className="font-bold text-purple-600 text-lg">₹{bike.pricePerDay}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl">
                    <span className="text-gray-600 font-medium text-sm">Per Week</span>
                    <span className="font-bold text-pink-600 text-lg">₹{bike.pricePerWeek}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBookNow(bike)}
                  disabled={bike.status !== 'available'}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                    bike.status === 'available'
                      ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {bike.status === 'available' ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBikes.length === 0 && (
          <div className="text-center py-20">
            <Bike className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <p className="text-gray-500 text-2xl font-semibold">No bikes available in this category.</p>
            <p className="text-gray-400 mt-3 text-lg">Try selecting a different filter.</p>
          </div>
        )}
      </div>

      {showBookingModal && selectedBike && (
        <BookingModal
          bike={selectedBike}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedBike(null);
          }}
        />
      )}
    </div>
  );
};

export default BikeCard;