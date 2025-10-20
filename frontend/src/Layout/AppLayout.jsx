// src/AppLayout.jsx
import BikeCard from "../components/BikeCard";
// import Navbar from "../components/Navbar";
// import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { ContextApp } from "../ContextAPI/ContextApp";
import HelmetCard from "../components/HelmetCard";

export default function AppLayout() {

  const {bikeOn,setBikeOn } = useContext(ContextApp)
  console.log(bikeOn) 
  setBikeOn(true);
  return (
    <div className="flex">
      {/* <Navbar/> */}
                         {/* ml-64 */}
      <main className=" flex-1 p-6 bg-gray-100 min-h-screen">
        {/* {bikeOn ? <BikeCard/> : <Outlet /> } */}
        <HelmetCard/>
      </main>
    </div>
  );
}
