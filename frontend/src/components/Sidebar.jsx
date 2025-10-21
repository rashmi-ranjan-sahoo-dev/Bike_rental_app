import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bike, Shield, CalendarCheck, LogIn, LogOut, UserPlus, Menu, X } from "lucide-react";
import logo from "../assets/motorbike.png";
import { useContext, useState } from "react";
import { ContextApp } from "../ContextAPI/ContextApp";

export default function Sidebar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(ContextApp);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("userToken");
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const links = [
    { to: "/bikes", label: "Bikes", icon: <Bike size={20} /> },
    { to: "/helmets", label: "Helmets", icon: <Shield size={20} /> },
    { to: "/orders", label: "Bookings", icon: <CalendarCheck size={20} /> },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col shadow-xl z-50 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo & App Name */}
        <div className="flex items-center justify-center h-20 border-b border-gray-700 px-4">
          <img
            src={logo}
            alt="Easy Bike Logo"
            className="w-10 h-10 sm:w-12 sm:h-12 mr-2 sm:mr-3 rounded-full bg-white object-cover"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-500">Easy Bike</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-lg transition-all duration-200 font-medium ${
                location.pathname === link.to
                  ? "bg-emerald-600 shadow-lg transform scale-105"
                  : "hover:bg-gray-800 hover:translate-x-1"
              }`}
            >
              {link.icon}
              <span className="text-sm sm:text-base">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="p-3 sm:p-4 border-t border-gray-700 space-y-2">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-2.5 sm:p-3 w-full bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/user/signup"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-2.5 sm:p-3 w-full bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <UserPlus size={20} />
                <span>Sign Up</span>
              </Link>
              <Link
                to="/user/signin"
                onClick={handleLinkClick}
                className="flex items-center gap-3 p-2.5 sm:p-3 w-full bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <LogIn size={20} />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}