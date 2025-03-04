import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import { DatosFechaReporteTiempo } from "@/components/components/DatosFechaReporteTiempo"
import { DatosFechaVisitasUsuario } from "@/components/components/DatosFechaVisitasUsuario"
import { DatosFechaReporteVisitas } from "@/components/components/DatosFechaReporteVisitas"
import { DatosFechaReporteRecoridos } from "@/components/components/DatosFechaReporteRecoridos"

export const Reportes = () => {
    return (
        <Tabs defaultValue="visitasValvulas" className="w-full">
          <TabsList className="grid w-[50%] grid-cols-4">
            <TabsTrigger value="visitasValvulas">Valvulas</TabsTrigger>
            <TabsTrigger value="visitasTime">Tiempo</TabsTrigger>
            <TabsTrigger value="visitasporDia">Visitas</TabsTrigger>
            <TabsTrigger value="recorridosDias">Recoridos</TabsTrigger>
          </TabsList>
          <TabsContent value="visitasValvulas">
            <Card>
              <DatosFechaVisitasUsuario/>
            </Card>
          </TabsContent>
          <TabsContent value="visitasTime">
            <Card>
              <DatosFechaReporteTiempo/>
            </Card>
          </TabsContent>
          <TabsContent value="visitasporDia">
            <Card>
              <DatosFechaReporteVisitas/>
            </Card>
          </TabsContent>
          <TabsContent value="recorridosDias">
            <Card>
              <DatosFechaReporteRecoridos/>
            </Card>
          </TabsContent>
        </Tabs>
    )
}
