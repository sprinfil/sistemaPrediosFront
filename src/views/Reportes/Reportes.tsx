import { Button } from "@/components/ui/button"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import * as React from "react"
import { Car, Check, ChevronsUpDown, SearchIcon } from "lucide-react"
import { DataTableVisitasUsuario } from "@/components/components/DataTableVisitasUsuario"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { indexValvulas } from "@/lib/Reportes"
import { DatosFechaReporteTiempo } from "@/components/components/DatosFechaReporteTiempo"
import { DatosFechaVisitasUsuario } from "@/components/components/DatosFechaVisitasUsuario"

export const Reportes = () => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [loading,setLoading]= React.useState(false);
    const [data, setData] = React.useState([]);
    const [params, setParams] = React.useState({});

    React.useEffect(() => {
      setLoading(true);
      try {
        indexValvulas(setLoading, params, setData);
      } catch (e) {
        setLoading(false);
        toast({
          title: "Error",
          description: "No se encuentran los trámites",
          action: <ToastAction altText="Aceptar">Aceptar</ToastAction>,
          variant: "destructive",
        });
      }
    }, []);

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
