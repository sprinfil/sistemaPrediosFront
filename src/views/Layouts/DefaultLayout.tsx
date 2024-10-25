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
        <main>
          <SidebarTrigger/>
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  )
}
