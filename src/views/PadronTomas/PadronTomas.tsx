import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTablePadronTomas } from '@/components/components/DataTablePadronTomas'

export const PadronTomas = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Padrón de tomas</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <DataTablePadronTomas />
        </CardContent>
      </Card>
    </div>
  )
}
