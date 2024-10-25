import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const DefaultLayout = () => {
    const[token, setToken] = useState(false);

  if (!token) {
    return <Navigate to="login" />
  }

  return (
    <>
      <main className=''>
        <Outlet />
      </main>
    </>
  )
}
