import ZustandPrincipal from '@/Zustand/ZustandPrincipal'
import { Card } from '@/components/ui/card'
import React from 'react'


export const DashBoard = () => {
  const {user} = ZustandPrincipal();

  return (
    <div className=''>
      <p>Bienvenido {user?.name} ({user?.username})</p>
    </div>
  )
}
