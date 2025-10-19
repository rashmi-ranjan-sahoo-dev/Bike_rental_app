import React, { useState } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import bike_logo from "../assets/motorbike.png"

const Header = () => {

    const [pickupDate, setPickupDate] = useState(null);
    const [dropDate, setDropDate] = useState(null);


  return (
   <header className='w-full bg-white shadow-md px-4 py-3 flex flex-wrap items-center justify-between gap-4'>
    <div className='flex items-center gap-2'>
      <img 
      src={bike_logo} 
      alt="Bike Rental" 
      className='w-10 h-10 object-contain'/>
      <h1 className='text-xl font-bold text-gray-800'>Easy<span className='text-green-600'>Bike</span></h1>
    </div>
    <div className='flex flex-wrap items-center gap-4'>
        <div className='flex flex-col'>
            <label className='text-sm text-gray-500'>City</label>
            <select className='border rounded-lg px-2 py-1 text-sm'>
                <option value="Bhubaneswar">Bhubaneswar</option>
                <option value="Cuttack">Cuttack</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
            </select>
        </div>

        <div className='flex flex-col'>
            <label className='text-sm text-gray-500'>Pickup Date & Time</label>
            <DatePicker
            selected={pickupDate}
            onChange={(date) => setPickupDate(date)}
            showTimeSelect
            timeFormat='HH:mm'
            timeIntervals={30}
            dateFormat="MMM d, yyyy h:mm aa"
            placeholderText='Select date & time'
            className='border rounded-lg px-2 py-1 text-sm w-52' 
            />
        </div>

         <div className="flex flex-col">
          <label className="text-sm text-gray-500">Drop Date & Time</label>
          <DatePicker
            selected={dropDate}
            onChange={(date) => setDropDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMM d, yyyy h:mm aa"
            placeholderText="Select date & time"
            className="border rounded-lg px-2 py-1 text-sm w-52"
          />
        </div>

         {/* Search Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Search
        </button>
    </div>

   </header>
  )
}

export default Header
