import { DataTableSolicitudes } from '@/components/components/DataTableSolicitudes'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const HorasExtras = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Horas extra</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableSolicitudes />
        </CardContent>
      </Card>
    </div>
  )
}

export default HorasExtras;