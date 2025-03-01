import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
const Staff = () => {
  return (
    <div className='flex'>
    <Navbar/>
    <main className='flex-1 ml-60 p-8'>
      <Outlet />
    </main>

</div>
  )
}

export default Staff