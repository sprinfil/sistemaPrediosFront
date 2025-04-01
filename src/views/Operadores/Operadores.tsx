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
import { fetchRoles } from '@/lib/RolesService';
import { fetchData } from '@/lib/ToolService';
import { toast } from '@/hooks/use-toast';


export const Operadores = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = ZustandPrincipal();
  getOperadores(setLoading, setData);
  const [areas, setAreas] = React.useState([]);
  const [loadingAreas, setLoadingAreas] = React.useState(false);
  const [roles, setRoles] = React.useState([]);
  const [loadingRoles, setLoadingRoles] = React.useState();

  const fetchAreas = async () => {
    const response = await fetchData(setLoadingAreas, toast, {}, "/he-areas");
    setAreas(response?.data);
  }

  React.useEffect(() => {
    fetchAreas();
    fetchRoles(setLoadingRoles, setRoles);
  }, [])

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
                  loading || loadingAreas || loadingRoles ?
                    <>
                      <div className='w-full flex items-center justify-center'>
                        <Loader />
                      </div>
                    </>
                    :
                    <>
                      <DataTableOperadores
                        data={data}
                        setData={setData}
                        areas={areas}
                        loadingAreas={loadingAreas}
                        roles={roles}
                        loadingRoles={loadingRoles}
                      />
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
