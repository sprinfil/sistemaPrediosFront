import { DataTableSolicitud } from "@/components/components/DataTableSolicitud"
import { DataTableSolicitudesEmpleado } from "@/components/components/DataTableSolicitudesEmpleado"
import { DatosCrearSolicitudEmpleados } from "@/components/components/DatosCrearSolicitudEmpleados"
import DatosSolicitudes from "@/components/components/DatosSolicitudes"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import { useState } from "react"
import {Accordion,AccordionContent,AccordionItem,AccordionTrigger,} from "@/components/ui/accordion"
import { DatosCrearSolicitudGrupos } from "@/components/components/DatosCrearSolicitudGrupos"


export const Solicitud = () => {
  return (
    <Tabs defaultValue="vistaActualizar" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="vistaActualizar">Solicitudes</TabsTrigger>
        <TabsTrigger value="vistaCrear">Crear</TabsTrigger>
      </TabsList>
      <TabsContent value="vistaCrear">
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>Crear</CardTitle>
          </CardHeader>
          <Accordion type="single" collapsible className="w-[95%] ml-auto mr-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>Empleados</AccordionTrigger>
              <AccordionContent>
                <DatosCrearSolicitudEmpleados/>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Grupos</AccordionTrigger>
              <AccordionContent>
                <DatosCrearSolicitudGrupos/>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </TabsContent>
      <TabsContent value="vistaActualizar">
        <DatosSolicitudes/>
      </TabsContent>
    </Tabs>
  )
}
