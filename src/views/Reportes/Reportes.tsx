import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import { DatosFechaReporteTiempo } from "@/components/components/DatosFechaReporteTiempo"
import { DatosFechaVisitasUsuario } from "@/components/components/DatosFechaVisitasUsuario"

export const Reportes = () => {
    return (
        <Tabs defaultValue="visitasValvulas" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visitasValvulas">Valvulas</TabsTrigger>
            <TabsTrigger value="visitasTime">Tiempo</TabsTrigger>
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
        </Tabs>
    )
}
