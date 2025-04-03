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
import { useAreas } from '@/lib/AreasHook'


export const Areas = () => {

  const {
    areas,
    loadingAreas,
    setAreas,
    setLoadingAreas,
    fetchAreas
  } = useAreas();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Areas</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableHeAreas
            data={areas}
            loading={loadingAreas}
            fetchAreas={fetchAreas}
          />
        </CardContent>

      </Card>

    </>
  )
}
