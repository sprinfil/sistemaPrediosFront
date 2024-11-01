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
import { FaRegCheckCircle } from "react-icons/fa";
import { useRef, useState } from "react";
import { updateCargaTrabajoEstatus, updateEstatus } from "@/lib/PrediosCargaTrabajosService";
import { Loader } from "./Loader";
import { MdOutlineCancel } from "react-icons/md";

export function ModalCancelarCargaTrabajo({ cargaTrabajo, setCargaTrabajo, setData }) {
  const [loading, setLoading] = useState(false);
  const cancelarButton = useRef();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-red-500">Cancelar <MdOutlineCancel /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cancelar Carga de trabajo?</AlertDialogTitle>
          <AlertDialogDescription>
            La carga de trabajo se va a cancelar y no aparecerá al operador.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelarButton}>Cancelar</AlertDialogCancel>
          <Button
            onClick={async () => {
              try {
                await updateCargaTrabajoEstatus(setLoading, cargaTrabajo?.id, 2, setCargaTrabajo, setData);
                cancelarButton.current.click();
              } catch (e) {
                //TODO:MOSTRAR ERROR
              }
            }}
          >
            Aceptar
            {loading ? <Loader /> : <></>}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
