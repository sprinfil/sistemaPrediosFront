import { AppSidebar } from '@/components/components/AppSideBar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ZustandPrincipal from '@/Zustand/ZustandPrincipal';
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export const DefaultLayout = () => {
  const { token } = ZustandPrincipal();

  if (!localStorage.getItem("TOKEN")) {
    return <Navigate to="login" />
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar/>
        <main className='w-full p-2'>
          <SidebarTrigger/>
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  )
}
