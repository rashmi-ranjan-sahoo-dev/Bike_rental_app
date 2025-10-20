/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cartItem, setCartItem] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const storedItem = JSON.parse(localStorage.getItem("cartItem"));
    setCartItem(storedItem);
  }, []);

  // 🧮 Calculate total price
  useEffect(() => {
    if (cartItem && pickupDate && dropDate) {
      const start = new Date(pickupDate);
      const end = new Date(dropDate);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const days = diffDays > 0 ? diffDays : 1;

      setTotalPrice(days * (cartItem.pricePerDay || 0));
    }
  }, [pickupDate, dropDate, cartItem]);

  const handleConfirmBooking = async () => {
    if (!pickupDate || !pickupTime || !dropDate || !dropTime) {
      alert("Please fill all date and time fields");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const bookingData = {
        pickupDate,
        pickupTime,
        dropDate,
        dropTime,
        totalPrice,
      };

      if (cartItem.type === "bike") bookingData.bike = cartItem._id;
      if (cartItem.type === "helmet") bookingData.helmet = cartItem._id;

      const response = await axios.post(`${API}/user`, bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Booking confirmed successfully!");
      localStorage.removeItem("cartItem");
      navigate("/orders");
    } catch (error) {
      alert("Booking failed: " + error.response?.data?.message);
    }
  };

  if (!cartItem) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">🛒 Booking Summary</h2>

      <div className="flex flex-col items-center">
        <img
          src={cartItem.imageUrl}
          alt={cartItem.model}
          className="w-full h-64 object-cover rounded"
        />
        <h3 className="text-xl font-semibold mt-4">{cartItem.model}</h3>
        <p className="text-gray-600 mt-1">Type: {cartItem.type}</p>
        <p className="text-gray-600">Price/Day: ₹{cartItem.pricePerDay}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium">Pickup Date</label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Pickup Time</label>
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Drop Date</label>
          <input
            type="date"
            value={dropDate}
            onChange={(e) => setDropDate(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Drop Time</label>
          <input
            type="time"
            value={dropTime}
            onChange={(e) => setDropTime(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>
      </div>

      <div className="mt-6 text-lg font-semibold text-center">
        Total Price: ₹{totalPrice}
      </div>

      <button
        onClick={handleConfirmBooking}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Confirm Booking
      </button>
    </div>
  );
}
