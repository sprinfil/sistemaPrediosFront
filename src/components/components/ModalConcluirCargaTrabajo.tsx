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

export function ModalConcluirCargaTrabajo({ cargaTrabajo, setCargaTrabajo, setData }) {
  const [loading, setLoading] = useState(false);
  const cancelarButton = useRef();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-primary">Concluir <FaRegCheckCircle /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Concluir Carga de trabajo?</AlertDialogTitle>
          <AlertDialogDescription>
            La carga de trabajo se va a concluir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelarButton}>Cancelar</AlertDialogCancel>
          <Button
            onClick={async () => {
              try {
                await updateCargaTrabajoEstatus(setLoading, cargaTrabajo?.id, 1, setCargaTrabajo, setData);
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
