import ZustandPrincipal from '@/Zustand/ZustandPrincipal';
import React, { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const GuestLayout = () => {
  const {token} = ZustandPrincipal(); 

  if (localStorage.getItem("TOKEN")) {
    return <Navigate to="dashboard" />
  }

  return (
    <>
      <main className='h-full w-full'>
        <Outlet />
      </main>
    </>
  )
}
