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
import { toast } from "@/hooks/use-toast";
import { showPredio } from "@/lib/PredioService";
import { useState } from "react";
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
import { Loader } from "./Loader";
import { ModalVerDetallesAsignacion } from "./ModalVerDetallesAsignacion";

export function ModalVerPredio({ trigger, predioId, setPredioId }) {
  const [predio, setPredio] = useState({});
  const [loading, setLoading] = useState({});

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={async () => {
        try {
          showPredio(predioId, setLoading, setPredio);
        }
        catch (e) {
          //TODO: MOSTRAR ERROR
        }
      }} asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-[90%] min-h-[80vh]">
        <AlertDialogHeader>
          {
            loading ?
              <>
                <div className="w-full flex items-center justify-center min-w-[90%] min-h-[80vh]">
                  <Loader />
                </div>
              </>
              :
              <>
                <AlertDialogTitle>Predio C.C. {predio?.clave_catastral}</AlertDialogTitle>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className=" max-h-[80vh] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead colSpan={2}  className="text-center">Información del predio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-bold">Clave Catastral</TableCell>
                          <TableCell>{predio?.clave_catastral ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">GID</TableCell>
                          <TableCell>{predio?.gid ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Condición</TableCell>
                          <TableCell>{predio?.condicion ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Tipo Predio</TableCell>
                          <TableCell>{predio?.tipo_predi ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Activo</TableCell>
                          <TableCell>{predio?.activo ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Propietario</TableCell>
                          <TableCell>{predio?.propietari ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Ubicación</TableCell>
                          <TableCell>{predio?.ubicacion ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Superficie Construida</TableCell>
                          <TableCell>{predio?.sup_cons ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Superficie Terreno</TableCell>
                          <TableCell>{predio?.sup_terr ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Valor Catastral</TableCell>
                          <TableCell>{predio?.vc ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Valor Total</TableCell>
                          <TableCell>{predio?.vt ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Tasa</TableCell>
                          <TableCell>{predio?.tasa ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Manzana</TableCell>
                          <TableCell>{predio?.manzana ?? "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">Área</TableCell>
                          <TableCell>{predio?.area ?? "N/A"}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className="max-h-[80vh] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead colSpan={4} className="text-center">Información de tomas</TableHead>
                        </TableRow>
                        <TableRow>
                          <TableHead>Cuenta</TableHead>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Dirección</TableHead>
                          <TableHead>Medidor</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {
                          predio?.asignaciones?.map(asignacion => {
                            return (
                              <TableRow>
                                <TableCell>{asignacion?.detalle_carga_trabajo?.cuenta}</TableCell>
                                <TableCell>{asignacion?.detalle_carga_trabajo?.usuario}</TableCell>
                                <TableCell>{asignacion?.detalle_carga_trabajo?.direccion}</TableCell>
                                <TableCell>{asignacion?.detalle_carga_trabajo?.no_medidor}</TableCell>
                                <TableCell><ModalVerDetallesAsignacion asignacion={asignacion}/></TableCell>
                              </TableRow>
                            )
                          })
                        }

                      </TableBody>
                    </Table>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => { setPredioId(null); }}>Aceptar</AlertDialogCancel>
                </AlertDialogFooter>
              </>

          }
        </AlertDialogHeader>

      </AlertDialogContent>
    </AlertDialog>
  )
}