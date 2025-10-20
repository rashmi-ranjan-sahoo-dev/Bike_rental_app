import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/api";
import axios from "axios";
import app_logo from "../../assets/motorbike.png";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/user/signup`, formData);
      setMessage(res.data.message || "Signup Successful 🎉");

      // redirect to signin after success
      setTimeout(() => navigate("/user/signin"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup Failed ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <div className="h-fit w-fit border p-10 rounded-2xl">
        <div className="text-center">
          <img
            src={app_logo}
            alt="app-logo"
            className="h-20 w-20 border rounded-full mx-auto mb-2"
          />
          <span className="font-bold pb-5 text-2xl">
            Welcome to <span className="text-green-600">Easy Bike</span>
          </span>
          <p className="font-semibold text-xl">Create an account!</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <p>Name</p>
          <input
            className="w-80 border rounded text-center p-1"
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />
          <p>Email</p>
          <input
            className="w-80 border rounded text-center p-1"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <p>Password</p>
          <input
            className="w-80 border rounded text-center p-1"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <p>Phone</p>
          <input
            className="w-80 border rounded text-center p-1"
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
          />
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-5 cursor-pointer"
            type="submit"
          >
            Signup
          </button>
          <p className="mt-2 text-sm font-semibold text-green-600">{message}</p>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
