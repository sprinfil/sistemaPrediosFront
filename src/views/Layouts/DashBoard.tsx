import ZustandPrincipal from '@/Zustand/ZustandPrincipal'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import logo from "../../assets/logo.jpg"

export const DashBoard = () => {
  const { user } = ZustandPrincipal();

  return (
    <div className=''>
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardContent className='h-[90vh] w-full'>
          <div className='flex flex-col w-full h-full items-center justify-center'>

            <img src={logo} alt="" />
      
          </div>
        </CardContent>

      </Card>



    </div>
  )
}
