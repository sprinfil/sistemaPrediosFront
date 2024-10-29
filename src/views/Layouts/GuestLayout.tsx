import ZustandPrincipal from '@/Zustand/ZustandPrincipal';
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

export const GuestLayout = () => {
  const { token } = ZustandPrincipal();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("TOKEN")) {
      return navigate('/')
    }
  }, [token])

  return (
    <>
      <main className='h-full w-full'>
        <Outlet />
      </main>
    </>
  )
}
