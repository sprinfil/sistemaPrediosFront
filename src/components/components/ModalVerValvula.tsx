import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import { getValvulaById } from "@/lib/ValvulasService";
import { ToastAction } from "@radix-ui/react-toast";
import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "../ui/card";
import { IoEyeOutline } from "react-icons/io5";
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export function ModalVerValvula({ verValvulaButton, setSelectedValvulaId, selectedValvulaId }) {
  const [loading, setLoading] = useState(false);
  const [valvula, setValvula] = useState({});
  const [selectedBitacora, setSelectedBitacora] = useState(null);
  const { toast } = useToast();
  const [mapUrl, setMapUrl] = useState('')

  useEffect(()=>{
    let lat = selectedBitacora?.posicion_captura?.coordinates[0];
    let lng = selectedBitacora?.posicion_captura?.coordinates[1];
    const zoom = 18;
    setMapUrl(`https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`)
  },[selectedBitacora])

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={
        async () => {
          try {

            await getValvulaById(setLoading, setValvula, selectedValvulaId);

          } catch (e) {

            toast({
              title: 'Error',
              description: 'Ocurrio un error al buscar la valvula',
              action: <ToastAction altText="Aceptar">Acepar</ToastAction>
            })

          }
        }} asChild>
        <Button ref={verValvulaButton} variant="outline" className="hidden">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-[90%]">
        {
          loading ? <div className="w-full h-[70vh] flex items-center justify-center"><Loader /></div> :
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Valvula {valvula?.nombre}</AlertDialogTitle>
                <div className="h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="max-h-[70vh] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Operador</TableHead>
                          <TableHead>Fecha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {
                          valvula?.bitacoras?.map(bitacora => (
                            <TableRow className="cursor-pointer" onClick={() => { setSelectedBitacora(bitacora) }}>
                              <TableCell>{bitacora?.operador?.name}</TableCell>
                              <TableCell>{dayjs(bitacora?.created_at).format('D [de] MMMM [del] YYYY')}</TableCell>
                              <TableCell><IoEyeOutline /></TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </Card>

                  <div className="">
                    <Card className="h-full">
                      {
                        selectedBitacora != null
                          ?
                          <>
                            <iframe
                              width="100%"
                              height="450"
                              style={{ border: 0 }}
                              loading="lazy"
                              allowFullScreen
                              src={mapUrl}
                            />
                            <div className="mt-3 w-full">
                              <div className="grid grid-cols-2 gap-2  px-2">
                                <div className="flex items-start flex-col font-bold">
                                  <p>OPERADOR</p>
                                  <p>FECHA</p>
                                </div>
                                <div className="flex items-start flex-col ">
                                  <p>{selectedBitacora?.operador?.name}</p>
                                  <p>{ dayjs(selectedBitacora?.created_at).format('D [de] MMMM [del] YYYY')}</p>
                                </div>
                              </div>

                            </div>
                          </> :
                          <div className="w-full h-full flex items-center justify-center">Selecciona una bitacora</div>
                      }
                    </Card>
                  </div>

                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => { setSelectedValvulaId(null); setSelectedBitacora(null); }}>Aceptar</AlertDialogCancel>
              </AlertDialogFooter>
            </>
        }

      </AlertDialogContent>
    </AlertDialog>
  )
}
