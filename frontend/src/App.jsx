import React from 'react'
import UserSignin from "./pages/Authentication/UserSignin"
import UserSignup from "./pages/Authentication/UserSignup"
import AdminSignin from "./pages/Authentication/AdminSignin"
import AdminSignup from "./pages/Authentication/AdminSignup"
import { BrowserRouter, Routes, Route, } from 'react-router-dom'

const App = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/admin/signup' element={<AdminSignup/>}></Route>
    <Route path='/admin/signin' element={<AdminSignin/>}></Route>
    <Route path='/user/signup' element={<UserSignup/>}></Route>
    <Route path='/user/signin' element={<UserSignin/>}></Route>
   </Routes>
   </BrowserRouter>
  )
}

export default App
