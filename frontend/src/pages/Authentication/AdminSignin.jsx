import app_logo from "../../assets/motorbike.png";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/api";

const AdminSignin = () => {
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
      const res = await axios.post(`${API}/admin/signin`, formData);

      // ✅ Store JWT token in localStorage
      localStorage.setItem("adminToken", res.data.token);

      setMessage(res.data.message || "Signin Successful! 💐");

      // ✅ Redirect to dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Signin Failed ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col bg-gray-50">
      <div className="h-fit w-fit border p-10 rounded-2xl shadow-lg bg-white">
        <div className="text-center mb-5">
          <img
            src={app_logo}
            alt="app-logo"
            className="h-20 w-20 mx-auto border rounded-full mb-3"
          />
          <span className="font-bold text-2xl">
            Welcome Back to <span className="text-green-600">Easy Bike</span>
          </span>
          <p className="font-semibold text-lg mt-1">Admin Signin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-center">
          <div>
            <p className="text-left font-medium">Email</p>
            <input
              className="w-80 border rounded text-center p-2"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          <div>
            <p className="text-left font-medium">Password</p>
            <input
              className="w-80 border rounded text-center p-2"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-5"
          >
            Signin
          </button>

          {message && (
            <p className="mt-3 text-sm font-semibold text-green-600">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminSignin;
