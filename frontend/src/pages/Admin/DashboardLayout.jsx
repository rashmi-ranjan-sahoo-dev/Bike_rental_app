import React from 'react'
import AdminSidbar from '../../components/AdminSidbar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className='flex h-screen bg-gray-100'>
      <AdminSidbar/>
      <main className='flex-1 p-6 overflow-auto'>
          <Outlet/>
      </main>
    </div>
  )
}

export default DashboardLayout
