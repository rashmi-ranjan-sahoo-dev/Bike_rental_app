import React, { useState } from "react";
import app_logo from "../../assets/motorbike.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/api";

const UserSignin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/user/signin`, formData);

      localStorage.setItem("userToken", res.data.token);
      setMessage(res.data.message || "Signin Successful! 💐");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Signin error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Signin Failed ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <div className="h-fit w-fit border p-10 rounded-2xl">
        <div className="text-center">
          <img
            src={app_logo}
            alt="app-logo"
            className="h-20 w-20 border rounded-full mx-auto mb-3"
          />
          <span className="font-bold text-2xl">
            Welcome to <span className="text-green-600">Easy Bike</span>
          </span>
        </div>
        <form onSubmit={handleSubmit} className="mt-5">
          <p>Email</p>
          <input
            className="w-80 border rounded text-center mb-2"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <p>Password</p>
          <input
            className="w-80 border rounded text-center"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-5 hover:cursor-pointer"
            type="submit"
          >
            Signin
          </button>
          <p className="mt-2 text-sm font-semibold text-green-600">{message}</p>
        </form>
      </div>
    </div>
  );
};

export default UserSignin;
