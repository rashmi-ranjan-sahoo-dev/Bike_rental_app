import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";

export default function AppLayout() {
  return (
    <div className="flex">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="w-full lg:ml-64 flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}