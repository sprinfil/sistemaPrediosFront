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
import { DataTableHeAreas } from '@/components/components/DataTableHeAreas'


export const Areas = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Areas</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableHeAreas />
        </CardContent>

      </Card>

    </>
  )
}
