import { useEffect, useState } from "react";
import { API } from "../../api/api";
import axios from "axios";

import React from 'react'

const Bookings = () => {

    const [bookings, setBookings] = useState([])

    async function fetchBookings() {
         
        let res = await axios.get(`${API}/admin/bookings`);

        setBookings(res.data.bookings);
    }

    useEffect(() =>{
         fetchBookings();
    },[])


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-blue-600 text-white">
            <tr>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Bike</th>
                <th className="p-2 text-left">Helmet</th>
            </tr>
        </thead>
        <tbody>{bookings.map((b) =>(
            <tr key={b._id} className="border-t hover: bg-gray-50">
                <td className="p-2">{b.user?.name}</td>
                <td className="p-2">{b.bike?.model}</td>
                <td className="p-2">{b.helmet?.model || "N/A"}</td>
            </tr>
        ))}</tbody>
      </table>
    </div>
  )
}

export default Bookings
