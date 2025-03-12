import { DataTableActualizarSolicitudTiempoExtra } from "@/components/components/DataTableActualizarSolicitudTiempoExtra"
import { DatosCrearSolicitud } from "@/components/components/DatosCrearSolicitud"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"

export const Solicitud = () => {
    return (
        <Tabs defaultValue="vistaCrear" className="w-full">
          <TabsList className="grid w-[25%] grid-cols-4">
            <TabsTrigger value="vistaCrear">Crear</TabsTrigger>
            <TabsTrigger value="vistaActualizar">Actualizar</TabsTrigger>
          </TabsList>
          <TabsContent value="vistaCrear">
            <Card>
                <CardHeader>
                    <CardDescription>Solicitudes</CardDescription>
                </CardHeader>
                <DatosCrearSolicitud/>
            </Card>
          </TabsContent>
          <TabsContent value="vistaActualizar">
            <Card>
                <DataTableActualizarSolicitudTiempoExtra/>
            </Card>
          </TabsContent>
        </Tabs>
    )
}
