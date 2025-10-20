import React from 'react'
import UserSignin from "./pages/Authentication/UserSignin"
import UserSignup from "./pages/Authentication/UserSignup"
import AdminSignin from "./pages/Authentication/AdminSignin"
import AdminSignup from "./pages/Authentication/AdminSignup"
import DashboardLayout from "./pages/Admin/DashboardLayout"
import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import Bikes from './pages/Admin/Bikes'
import Helmets from './pages/Admin/Helmet'
import Bookings from './pages/Admin/Bookings'
import BikesCard from './pages/BikeCard'
import HelmetCard from './pages/HelmetCard'
import AppLayout from './Layout/AppLayout'
import OrdersPage from './pages/OrdersPage'

const App = () => {
  return (
   <BrowserRouter>
   <Routes>
    {/* ---------- AUTH ROUTES ---------- */}
    <Route path='/admin/signup' element={<AdminSignup/>}></Route>
    <Route path='/admin/signin' element={<AdminSignin/>}></Route>
    <Route path='/user/signup' element={<UserSignup/>}></Route>
    <Route path='/user/signin' element={<UserSignin/>}></Route>

    {/* ---------- USER SIDE LAYOUT ---------- */}
    <Route path='/' element= {<AppLayout/>}>
    <Route index element = {<BikesCard/>}></Route> {/* Default route */}
    <Route path='/bikes' element= {<BikesCard/>}></Route>
    <Route path='/helmets' element= {<HelmetCard/>}></Route>
    <Route path='/orders' element = {<OrdersPage/>}></Route>
    </Route>


    <Route path="/admin/dashboard" element={<DashboardLayout/>}>
    <Route path="bikes" element = {<Bikes/>}></Route>
    <Route path="helmets" element = {<Helmets/>}></Route>
    <Route path='bookings' element = {<Bookings/>}> </Route>
    </Route>
   </Routes>
   </BrowserRouter>
  )
}

export default App
