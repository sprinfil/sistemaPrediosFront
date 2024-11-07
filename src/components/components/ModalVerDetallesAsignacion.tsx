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
import { IoEyeOutline } from "react-icons/io5";
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
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

export function ModalVerDetallesAsignacion({ asignacion }) {
  const lat = 19.432608;
  const lng = -99.133209;
  const zoom = 18;
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Detalles de asignación<IoEyeOutline /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-[70%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Detalles de asginación</AlertDialogTitle>
          <div className=" min-h-[70vh] flex gap-2">
            <div>
              <p>Posicion de asignación</p>
              <iframe
                width="600"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapUrl}
              />
            </div>

            <div className="">
              <p>Detalles</p>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Bateria</TableCell>
                    <TableCell>{asignacion?.porcentaje_bateria} % </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Operador</TableCell>
                    <TableCell>{asignacion?.detalle_carga_trabajo?.carga_trabajo?.operador_asignado?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nombre de la carga de trabajo</TableCell>
                    <TableCell>{asignacion?.detalle_carga_trabajo?.carga_trabajo?.nombre_carga}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Asignado por</TableCell>
                    <TableCell>{asignacion?.detalle_carga_trabajo?.carga_trabajo?.asignado_por?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fecha de asignación</TableCell>
                    <TableCell>{dayjs(asignacion?.created_at).format('D [de] MMMM [del] YYYY')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Aceptar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
