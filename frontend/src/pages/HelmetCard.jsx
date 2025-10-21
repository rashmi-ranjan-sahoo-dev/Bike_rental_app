import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Shield, Star, Award } from 'lucide-react';
import { API } from '../api/api';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ helmet, onClose }) => {

    const navigate = useNavigate();

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
      price = Math.ceil(diffHours) * helmet.pricePerHour;
    } else if (rentalType === 'day') {
      price = Math.ceil(diffDays) * helmet.pricePerDay;
    } else if (rentalType === 'week') {
      price = Math.ceil(diffWeeks) * helmet.pricePerWeek;
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
        bike: null,
        helmet: helmet._id,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        dropDate: formData.dropDate,
        dropTime: formData.dropTime,
        totalPrice: totalPrice
      };

      console.log(bookingData);

     const response = await axios.post(`${API}/booking`,bookingData, {
      headers : {
        Authorization : `Bearer ${token}`
      }
     })
     console.log(response);
        setBookingSuccess(true);
        navigate("/orders")
          onClose();
       
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
          <p className="text-gray-600 text-lg">Your {helmet.model} helmet is reserved and ready for you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-screen overflow-y-auto shadow-2xl transform animate-slideUp">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Book Your Helmet</h2>
              <p className="text-orange-100 text-lg">{helmet.model}</p>
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
                    ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white border-orange-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="font-bold text-lg">Hourly</div>
                <div className="text-sm mt-1 opacity-90">₹{helmet.pricePerHour}/hr</div>
              </button>
              <button
                onClick={() => setRentalType('day')}
                className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  rentalType === 'day'
                    ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white border-orange-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="font-bold text-lg">Daily</div>
                <div className="text-sm mt-1 opacity-90">₹{helmet.pricePerDay}/day</div>
              </button>
              <button
                onClick={() => setRentalType('week')}
                className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  rentalType === 'week'
                    ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white border-orange-600 shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="font-bold text-lg">Weekly</div>
                <div className="text-sm mt-1 opacity-90">₹{helmet.pricePerWeek}/wk</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="inline w-4 h-4 mr-2 text-orange-600" />
                Pickup Date
              </label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="inline w-4 h-4 mr-2 text-orange-600" />
                Pickup Time
              </label>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="inline w-4 h-4 mr-2 text-orange-600" />
                Drop Date
              </label>
              <input
                type="date"
                name="dropDate"
                value={formData.dropDate}
                onChange={handleChange}
                min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="inline w-4 h-4 mr-2 text-orange-600" />
                Drop Time
              </label>
              <input
                type="time"
                name="dropTime"
                value={formData.dropTime}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl mb-8 border-2 border-orange-100">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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
              className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HelmetCard = () => {

  
  const [helmets, setHelmets] = useState([]);
  const [selectedHelmet, setSelectedHelmet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchHelmets();
  }, []);

  const fetchHelmets = async () => {
    try {
      const response = await fetch(`${API}/admin/helmets`);
      const data = await response.json();
      setHelmets(data.helmets || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching helmets:', error);
      setLoading(false);
    }
  };

  const handleBookNow = (helmet) => {
    setSelectedHelmet(helmet);
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading premium helmets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full -ml-40 -mb-40"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <Shield className="w-20 h-20 mx-auto mb-6 animate-bounce" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn">
              Safety First, Style Always
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 animate-fadeIn">
              Premium helmets for maximum protection
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Certified Safety</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">Top Quality</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Award className="w-5 h-5 text-red-600" />
              <span className="font-semibold">Premium Collection</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helmets.map((helmet, index) => (
            <div 
              key={helmet._id} 
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-64 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden relative group">
                {helmet.imageUrl ? (
                  <img 
                    src={helmet.imageUrl} 
                    alt={helmet.model} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Shield className="w-32 h-32 text-orange-300 opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                    helmet.status === 'available' ? 'bg-green-500 text-white' :
                    helmet.status === 'booked' ? 'bg-red-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}>
                    {helmet.status.toUpperCase()}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-2 rounded-full text-white bg-black bg-opacity-50 backdrop-blur-sm text-xs font-semibold flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Safety Certified
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{helmet.model}</h3>
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                    <span className="text-gray-600 font-medium text-sm">Per Hour</span>
                    <span className="font-bold text-orange-600 text-lg">₹{helmet.pricePerHour}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                    <span className="text-gray-600 font-medium text-sm">Per Day</span>
                    <span className="font-bold text-red-600 text-lg">₹{helmet.pricePerDay}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                    <span className="text-gray-600 font-medium text-sm">Per Week</span>
                    <span className="font-bold text-pink-600 text-lg">₹{helmet.pricePerWeek}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBookNow(helmet)}
                  disabled={helmet.status !== 'available'}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                    helmet.status === 'available'
                      ? 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white hover:from-orange-700 hover:via-red-700 hover:to-pink-700 shadow-lg hover:shadow-2xl hover:scale-105'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {helmet.status === 'available' ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {helmets.length === 0 && (
          <div className="text-center py-20">
            <Shield className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <p className="text-gray-500 text-2xl font-semibold">No helmets available at the moment.</p>
            <p className="text-gray-400 mt-3 text-lg">Please check back later.</p>
          </div>
        )}
      </div>

      {showBookingModal && selectedHelmet && (
        <BookingModal
          helmet={selectedHelmet}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedHelmet(null);
          }}
        />
      )}
    </div>
  );
};

export default HelmetCard;