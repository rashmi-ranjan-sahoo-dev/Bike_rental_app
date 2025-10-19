import { useEffect, useState } from "react";
import { API } from "../../api/api";
import axios from "axios";
import React from 'react'

const Bookings = () => {

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const token = localStorage.getItem("adminToken");

    async function fetchBookings() {
        try {
            setLoading(true);
            setError(null);
            
            const res = await axios.get(`${API}/admin/bookings`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBookings(res.data.bookings || []);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() =>{
         fetchBookings();
    },[])


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      
      {loading && (
        <div className="text-center py-4">Loading bookings...</div>
      )}
      
      {error && (
        <div className="text-red-600 text-center py-4">{error}</div>
      )}
      
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-blue-600 text-white">
                <tr>
                    <th className="p-2 text-left">User</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Bike</th>
                    <th className="p-2 text-left">Bike Type</th>
                    <th className="p-2 text-left">Helmet</th>
                    <th className="p-2 text-left">Start Date</th>
                    <th className="p-2 text-left">End Date</th>
                    <th className="p-2 text-left">Total Price</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map((b) =>(
                    <tr key={b._id} className="border-t hover:bg-gray-50">
                        <td className="p-2">{b.user?.name || "N/A"}</td>
                        <td className="p-2">{b.user?.email || "N/A"}</td>
                        <td className="p-2">{b.bike?.model || "N/A"}</td>
                        <td className="p-2">{b.bike?.type || "N/A"}</td>
                        <td className="p-2">{b.helmet?.model || "N/A"}</td>
                        <td className="p-2">{b.startDate ? new Date(b.startDate).toLocaleDateString() : "N/A"}</td>
                        <td className="p-2">{b.endDate ? new Date(b.endDate).toLocaleDateString() : "N/A"}</td>
                        <td className="p-2">₹{b.totalPrice || "N/A"}</td>
                    </tr>
                ))}
                {bookings.length === 0 && !loading && (
                    <tr>
                        <td colSpan="8" className="p-4 text-center text-gray-500">No bookings found</td>
                    </tr>
                )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Bookings
