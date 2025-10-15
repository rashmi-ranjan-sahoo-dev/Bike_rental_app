import React from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { API } from '../../api/api'
import axios from "axios"
import app_logo from "../../assets/motorbike.png"

const AdminSignup = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handelChange = (e) =>{
      setFormData({...formData ,[e.target.name] : e.target.value});
      }

      const handleSubmit = async (e) =>{
        e.preventDefualt();

        try{

            const res = await axios.post(`${API}/admin/signup`,formData);

            setMessage(res.data.message || "Signup Successful!💐..")

            navigate(`/admin}/signin`);
        } catch (error) {
      setMessage(error.response?.data?.message || "Signup Failed");
    }
      }
  return (
    <div className=' h-screen flex items-center justify-center flex-col'>
    <div className='h-fit w-fit border p-10 rounded-2xl  '>
        <div className='text-center' >
            <img
             src={app_logo} 
             alt="app-logo"
             className='h-20 w-20  border rounded-full relative left-30 bottom-3' />
            <span className='font-bold pb-5 text-2xl '>Welcome to <span className=' text-green-600 '>Easy Bike</span></span>
            <p className='font-semibold text-xl'>Create an account!</p>
        </div>
        <div>
            <form action="" onSubmit={handleSubmit}>
                <p>Name</p>
                <input className='w-80 border rounded text-center' type="text" name='name' placeholder='Name' onChange={handelChange} />
                <p>Email</p>
                <input className='w-80 border rounded text-center'  type="email" name='email' placeholder='Email' onChange={handelChange} />
                <p>Password</p>
                <input className='w-80 border rounded text-center'  type="password" name='password' placeholder='Password' onChange={handelChange} />
                <br />
                <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-5 relative left-30 cursor-pointer' type='submit'>Singup</button>
                <p className='mt-2 text-sm font-semibold text-green-600'>{message}</p>
            </form>
        </div>
    </div>
    </div>
  )
}

export default AdminSignup
