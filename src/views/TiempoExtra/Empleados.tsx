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


export const Empleados = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Empleados</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableHeEmpleados />
        </CardContent>

      </Card>

    </>
  )
}
