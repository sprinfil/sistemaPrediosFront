import { DataTableOperadores } from '@/components/components/DataTableOperadores'
import { Loader } from '@/components/components/Loader';
import { getOperadores } from '@/lib/OperadorService'
import ZustandPrincipal from '@/Zustand/ZustandPrincipal';
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export const Operadores = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = ZustandPrincipal();

  getOperadores(setLoading, setData);

  return (
    <>
      {user?.roles?.some(role => role.name === "master") ?
        <>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle>Usuarios del sistema</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className='h-full'>
              <div className='mt-2'>
                {
                  loading ?
                    <>
                      <div className='w-full flex items-center justify-center'>
                        <Loader />
                      </div>
                    </>
                    :
                    <>
                      <DataTableOperadores data={data} setData={setData} />
                    </>
                }
              </div>
            </CardContent>

          </Card>

        </>
        :
        <>
          <p>Buen Intento</p>
        </>
      }

    </>

  )
}
