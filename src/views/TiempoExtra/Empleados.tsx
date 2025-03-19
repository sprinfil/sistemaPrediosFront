import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTableHeEmpleados } from '@/components/components/DataTableHeEmpleados'
import { useEmpleados } from '@/lib/EmpleadosHook'


export const Empleados = () => {

  const {
    empleados,
    setEmpleados,
    loadingEmpleados,
    setLoadingEmpleados,
    getEmpleados
  } = useEmpleados();
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Empleados</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableHeEmpleados
            data={empleados}
            loading={loadingEmpleados}
            updateData={getEmpleados}
          />
        </CardContent>

      </Card>

    </>
  )
}
