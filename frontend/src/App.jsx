import React from 'react'
import AdminSignup from './components/Authentication/AdminSignup'
import AdminSignin from './components/Authentication/AdminSignin'
import { BrowserRouter, Routes, Route, } from 'react-router-dom'

const App = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/admin/signup' element={<AdminSignup/>}></Route>
    <Route path='/admin/signin' element={<AdminSignin/>}></Route>
   </Routes>
   </BrowserRouter>
  )
}

export default App
