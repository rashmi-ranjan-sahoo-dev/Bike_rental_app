import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for icons (install via: npm i lucide-react)

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/signin");
  };

  return (
    <div className="relative">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center bg-blue-700 text-white p-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-blue-700 text-white flex flex-col justify-between transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div>
          {/* Desktop Header */}
          <h1 className="hidden md:block text-2xl font-bold text-center py-4 border-b border-blue-500">
            Admin Panel
          </h1>
          <nav className="mt-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/dashboard/bikes"
                  className="block px-4 py-2 hover:bg-blue-800"
                  onClick={() => setIsOpen(false)}
                >
                  🚲 Bikes
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard/helmets"
                  className="block px-4 py-2 hover:bg-blue-800"
                  onClick={() => setIsOpen(false)}
                >
                  🪖 Helmets
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard/bookings"
                  className="block px-4 py-2 hover:bg-blue-800"
                  onClick={() => setIsOpen(false)}
                >
                  📦 Bookings
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 p-3 mx-3 mb-4 rounded"
        >
          Logout
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
        ></div>
      )}
    </div>
  );
};

export default AdminSidebar;
