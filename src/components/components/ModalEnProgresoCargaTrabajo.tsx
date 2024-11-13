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
import { FaArrowRotateRight } from "react-icons/fa6";

export function ModalEnProgresoCargaTrabajo({ cargaTrabajo, setCargaTrabajo, setData }) {
  const [loading, setLoading] = useState(false);
  const cancelarButton = useRef();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-blue-500"> En Progreso <FaArrowRotateRight  /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Poner en Progreso?</AlertDialogTitle>
          <AlertDialogDescription>
            La carga de trabajo se pondra en progreso.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelarButton}>Cancelar</AlertDialogCancel>
          <Button
            onClick={async () => {
              try {
                await updateCargaTrabajoEstatus(setLoading, cargaTrabajo?.id, 0, setCargaTrabajo, setData);
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
