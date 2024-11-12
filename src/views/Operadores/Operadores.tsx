import { DataTableOperadores } from '@/components/components/DataTableOperadores'
import { Loader } from '@/components/components/Loader';
import { getOperadores } from '@/lib/OperadorService'
import ZustandPrincipal from '@/Zustand/ZustandPrincipal';
import React, { useState } from 'react'

export const Operadores = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = ZustandPrincipal();

  getOperadores(setLoading, setData);

  return (
    <>
      {user?.roles?.some(role => role.name === "master") ?
        <>
          <div>Operadores</div>
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
        </>
        :
        <>
          <p>Buen Intento</p>
        </>
      }

    </>

  )
}
