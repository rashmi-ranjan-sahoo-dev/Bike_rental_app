
import BikeCard from "../pages/BikeCard";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";


export default function AppLayout() {

  return (
    <div className="flex">
      <Sidebar></Sidebar>
                         {/* ml-64 */}
      <main className=" ml-64 flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet/>
      </main>
    </div>
  );
}
