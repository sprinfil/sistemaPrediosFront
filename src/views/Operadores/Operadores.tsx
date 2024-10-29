import { DataTableOperadores } from '@/components/components/DataTableOperadores'
import { Loader } from '@/components/components/Loader';
import { getOperadores } from '@/lib/OperadorService'
import React, { useState } from 'react'

export const Operadores = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  getOperadores(setLoading, setData);

  return (
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

  )
}
