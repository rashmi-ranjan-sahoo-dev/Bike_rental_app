import React from 'react'
import app_logo from "../../assets/motorbike.png";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../api/api';

const AdminSignin = () => {
     const [formData, setFormData] = useState({
            name: "",
            email: "",
        })
    
        const [message, setMessage] = useState("");
    
        const navigate = useNavigate();
    
        const handelChange = (e) =>{
          setFormData({...formData ,[e.target.name] : e.target.value});
          }
    
          const handleSubmit = async (e) =>{
            e.preventDefualt();
    
            try{
    
                const res = await axios.post(`${API}/admin/signin`,formData);

                localStorage.setItem("amdin",res.data.token);
    
                setMessage(res.data.message || "Signin Successful!💐..")
    
                navigate(`/`);
            } catch (error) {
          setMessage(error.response?.data?.message || "Signin Failed");
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
            </div>
            <div>
                <form action="" onSubmit={handleSubmit}>
                    <p>Email</p>
                    <input className='w-80 border rounded text-center'  type="email" name='email' placeholder='Email' onChange={handelChange} />
                    <p>Password</p>
                    <input className='w-80 border rounded text-center'  type="password" name='password' placeholder='Password' onChange={handelChange} />
                    <br />
                    <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-5 relative left-30 cursor-pointer' type='submit'>Singin</button>
                    <p className='mt-2 text-sm font-semibold text-green-600'>{message}</p>
                </form>
            </div>
        </div>
        </div>
  )
}

export default AdminSignin
