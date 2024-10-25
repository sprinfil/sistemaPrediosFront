import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const GuestLayout = () => {
  const[token, setToken] = useState(true);

  if (token) {
    return <Navigate to="dashboard" />
  }

  return (
    <>
      <main className=''>
        <Outlet />
      </main>
    </>
  )
}
