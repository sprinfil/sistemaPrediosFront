import DatosSolicitudes from "@/components/components/DatosSolicitudes"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import { DatosCrearSolicitud } from "@/components/components/DatosCrearSolicitud"


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
          <DatosCrearSolicitud/>
        </Card>
      </TabsContent>
      <TabsContent value="vistaActualizar">
        <DatosSolicitudes/>
      </TabsContent>
    </Tabs>
  )
}
