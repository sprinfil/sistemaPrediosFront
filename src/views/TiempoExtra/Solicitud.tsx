import { DataTableSolicitud } from "@/components/components/DataTableSolicitud"
import { DataTableSolicitudesEmpleado } from "@/components/components/DataTableSolicitudesEmpleado"
import { DatosCrearSolicitud } from "@/components/components/DatosCrearSolicitud"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import { useState } from "react"

export const Solicitud = () => {
    const [dataEmpleados,setDataEmpleados]=useState([]);
    const [empleados,setEmpleados]=useState([]);
    
    return (
        <Tabs defaultValue="vistaCrear" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="vistaCrear">Crear</TabsTrigger>
            <TabsTrigger value="vistaActualizar">Solicitudes</TabsTrigger>
          </TabsList>
          <TabsContent value="vistaCrear">
            <Card className="mb-2">
                <CardHeader>
                    <CardTitle>Crear</CardTitle>
                </CardHeader>
                <DatosCrearSolicitud dataEmpleados={dataEmpleados} setDataEmpleados={setDataEmpleados} horasEmpleados={empleados} setHorasEmpleados={setEmpleados}/>
            </Card>
          </TabsContent>
          <TabsContent value="vistaActualizar">
            <Card className="mb-5">
                <CardHeader>
                    <CardTitle>Solicitudes</CardTitle>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink className='cursor-pointer'>Empleados </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                            <BreadcrumbPage></BreadcrumbPage>
                        </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </CardHeader>
                <DataTableSolicitudesEmpleado />
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <DataTableSolicitud/>
            </Card>
          </TabsContent>
        </Tabs>
    )
}
