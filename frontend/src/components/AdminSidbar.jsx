import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminSidbar = () => {

    const navigate = useNavigate();

    const handelLogout = () => {
        localStorage.removeItem("adminToken")
        navigate("admin/signin");
    }


  return (
    <div className='w=64 bg-blue-700 text-white h-screen flex flex-col justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-center py-4 border-b border-blue-500'>Admin Panel</h1>
        <nav className='mt-4'>
           <ul className='space-y-2'>
            <li>
                <Link to = "/admin/dashboard/bikes" className= "block px-4 py-2 hover:bg-blue-800">🚲 Bikes</Link>
            </li>
            <li>
                <Link to = "/admin/dashboard/helmets" className= "block px-4 py-2 hover:bg-blue-800">🪖 Helmets</Link>
            </li>
            <li>
                <Link to = "/admin/dashboard/bookings" className= "block px-4 py-2 hover:bg-blue-800">📦 Bookings</Link>
            </li>
           </ul>
        </nav>
      </div>
      <button onClick={handelLogout} className='bg-red-500 hover:bg-red-600 p-3 mx-3 mb-4 rounded'>Logout</button>
    </div>
  )
}

export default AdminSidbar
