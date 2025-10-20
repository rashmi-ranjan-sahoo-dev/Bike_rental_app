import { Link, useLocation } from "react-router-dom";
import { Bike, Shield, CalendarCheck, LogIn, LogOut } from "lucide-react";



export default function Sidebar() {
  const location = useLocation();

  // Optional: authentication state
  const isLoggedIn = localStorage.getItem("token");

  const links = [
    { to: "/bikes", label: "Bikes", icon: <Bike size={18} /> },
    { to: "/helmets", label: "Helmets", icon: <Shield size={18} /> },
    { to: "/orders", label: "Bookings", icon: <CalendarCheck size={18} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      {/* Logo & App Name */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <img
          src="/logo.png"
          alt="App Logo"
          className="w-10 h-10 mr-2 rounded-full"
        />
        <h1 className="text-xl font-bold">Easy Bike</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              location.pathname === link.to
                ? "bg-blue-600"
                : "hover:bg-gray-800"
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Auth Section */}
      <div className="p-4 border-t border-gray-700">
        {isLoggedIn ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="flex items-center gap-3 p-3 w-full bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        ) : (
          <div >
          <Link
            to="user/signup"
            className="flex items-center gap-3 p-3 w-full bg-blue-600 hover:bg-blue-700 rounded-lg transition mb-5"
          >
            <LogIn size={18} />
            <span>Signup</span>
          </Link>
           <Link
            to="user/signin"
            className="flex items-center gap-3 p-3 w-full bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            <LogIn size={18} />
            <span>Signin</span>
          </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
