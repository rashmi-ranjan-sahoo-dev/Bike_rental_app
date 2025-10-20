import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Bike, Shield, Package, Search, Filter } from 'lucide-react';
import { API } from '../api/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API}/user/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateDuration = (pickup, drop) => {
    const start = new Date(pickup);
    const end = new Date(drop);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredOrders = orders
    .filter(order => filter === 'all' || order.paymentStatus === filter)
    .filter(order => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchLower) ||
        order.bike?.model?.toLowerCase().includes(searchLower) ||
        order.helmet?.model?.toLowerCase().includes(searchLower)
      );
    });

  const totalSpent = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
                My Orders
              </h1>
              <p className="text-gray-600 text-lg">Track and manage all your bookings in one place</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-5 border-2 border-green-100">
                <Package className="w-8 h-8 text-green-600 mb-2" />
                <p className="text-3xl font-bold text-green-600">{orders.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-5 border-2 border-blue-100">
                <div className="text-2xl font-bold text-blue-600 mb-1">₹{totalSpent}</div>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        {orders.length > 0 && (
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-2">
              <div className="flex items-center gap-3 px-4 py-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or item name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Filter by Status:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Orders <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-sm">{orders.length}</span>
                </button>
                <button
                  onClick={() => setFilter('paid')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    filter === 'paid'
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Paid <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-sm">{orders.filter(o => o.paymentStatus === 'paid').length}</span>
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    filter === 'pending'
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-1" />
                  Pending <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-sm">{orders.filter(o => o.paymentStatus === 'pending').length}</span>
                </button>
                <button
                  onClick={() => setFilter('failed')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    filter === 'failed'
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <XCircle className="w-4 h-4 inline mr-1" />
                  Failed <span className="ml-2 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-sm">{orders.filter(o => o.paymentStatus === 'failed').length}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">
              {searchQuery ? 'No Matching Orders Found' : filter === 'all' ? 'No Orders Yet' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Orders`}
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : filter === 'all' 
                ? 'Start booking bikes and helmets to see your orders here!' 
                : `You don't have any ${filter} orders at the moment.`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all shadow-lg"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-sm text-gray-600 font-medium">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            
            {filteredOrders.map((order, index) => (
              <div 
                key={order._id} 
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
                style={{ animation: 'fadeIn 0.5s ease-in', animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left Section */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start gap-4 mb-5">
                      {/* Icon */}
                      <div className={`${order.bike ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-orange-500 to-red-600'} p-4 rounded-2xl shadow-lg`}>
                        {order.bike ? (
                          <Bike className="w-10 h-10 text-white" />
                        ) : (
                          <Shield className="w-10 h-10 text-white" />
                        )}
                      </div>
                      
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">
                              {order.bike?.model || order.helmet?.model || 'Item'}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded-lg inline-block">
                              #{order._id.slice(-12).toUpperCase()}
                            </p>
                          </div>
                          <span className={`${getStatusColor(order.paymentStatus)} px-5 py-2 rounded-full text-white text-sm font-bold shadow-lg`}>
                            {order.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {order.bike && order.bike.type && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                              {order.bike.type}
                            </span>
                          )}
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                            {calculateDuration(order.pickupDate, order.dropDate)} {calculateDuration(order.pickupDate, order.dropDate) === 1 ? 'Day' : 'Days'}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            Booked: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Date Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-5 rounded-2xl border-2 border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-green-500 p-1.5 rounded-lg">
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Pickup Date</span>
                        </div>
                        <p className="font-bold text-gray-800 text-xl mb-1">
                          {new Date(order.pickupDate).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="font-semibold">{order.pickupTime}</span>
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-pink-100 p-5 rounded-2xl border-2 border-red-200">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="bg-red-500 p-1.5 rounded-lg">
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Drop-off Date</span>
                        </div>
                        <p className="font-bold text-gray-800 text-xl mb-1">
                          {new Date(order.dropDate).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-red-600" />
                          <span className="font-semibold">{order.dropTime}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Price */}
                  <div className="lg:w-80 bg-gradient-to-br from-green-500 to-teal-600 p-6 flex flex-col justify-center items-center text-white">
                    <p className="text-sm opacity-90 mb-2 uppercase tracking-wide font-semibold">Total Amount</p>
                    <p className="text-5xl font-bold mb-3">₹{order.totalPrice}</p>
                    <p className="text-xs opacity-80 mb-5">All charges included</p>
                    
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="w-full py-3 bg-white text-green-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-screen overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Order Details</h2>
                  <p className="text-green-100">Complete information about your booking</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center transition-all text-3xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Order ID */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Order ID</h3>
                <p className="text-xl font-mono bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-xl border-2 border-gray-300">
                  {selectedOrder._id}
                </p>
              </div>

              {/* Item Details */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Item Details</h3>
                <div className={`${selectedOrder.bike ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-300' : 'bg-gradient-to-br from-orange-100 to-red-100 border-orange-300'} p-6 rounded-2xl border-2`}>
                  <div className="flex items-center gap-4 mb-3">
                    {selectedOrder.bike ? (
                      <Bike className="w-12 h-12 text-blue-600" />
                    ) : (
                      <Shield className="w-12 h-12 text-orange-600" />
                    )}
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {selectedOrder.bike?.model || selectedOrder.helmet?.model}
                      </p>
                      <p className="text-gray-600">
                        {selectedOrder.bike ? `Type: ${selectedOrder.bike.type}` : 'Safety Helmet'}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.bike && (
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-white bg-opacity-70 rounded-lg text-sm font-semibold">
                        ₹{selectedOrder.bike.pricePerHour}/hour
                      </span>
                      <span className="px-3 py-1 bg-white bg-opacity-70 rounded-lg text-sm font-semibold">
                        ₹{selectedOrder.bike.pricePerDay}/day
                      </span>
                      <span className="px-3 py-1 bg-white bg-opacity-70 rounded-lg text-sm font-semibold">
                        ₹{selectedOrder.bike.pricePerWeek}/week
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Pickup</h3>
                  <div className="bg-green-50 p-5 rounded-2xl border-2 border-green-200">
                    <p className="font-bold text-gray-800 text-lg mb-1">
                      {new Date(selectedOrder.pickupDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-600 font-semibold">at {selectedOrder.pickupTime}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Drop-off</h3>
                  <div className="bg-red-50 p-5 rounded-2xl border-2 border-red-200">
                    <p className="font-bold text-gray-800 text-lg mb-1">
                      {new Date(selectedOrder.dropDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-600 font-semibold">at {selectedOrder.dropTime}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Payment Information</h3>
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border-2 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 font-semibold">Total Amount:</span>
                    <span className="text-4xl font-bold text-green-600">₹{selectedOrder.totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">Payment Status:</span>
                    <span className={`${getStatusBadgeColor(selectedOrder.paymentStatus)} px-4 py-2 rounded-full text-sm font-bold`}>
                      {selectedOrder.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Date */}
              <div className="bg-gray-100 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-600">
                  Booking created on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;