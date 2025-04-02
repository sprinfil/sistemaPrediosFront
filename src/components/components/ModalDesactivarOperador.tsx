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
import { editarOperador, operadorCambiarEstatus } from "@/lib/OperadorService";
import { ToastAction } from "@radix-ui/react-toast";
import { useRef, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { Loader } from "./Loader";
import { ImSwitch } from "react-icons/im";

export function ModalDesactivarOperador({ operadorId, setData, status }) {
  const cancelarRef = useRef();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className={`${status == 0 ? "text-green-500 hover:text-green-800" : "text-red-500 hover:text-red-800"}`}>
          {status == 0 ? <><ImSwitch className="text-red-500" /></> : <ImSwitch className="text-green-500" />}
          {/* <MdOutlineCancel /> */}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿{status == 0 ? 'Activar' : 'Desactivar'} Operador?</AlertDialogTitle>
          <AlertDialogDescription>

          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelarRef}>Cancelar</AlertDialogCancel>
          <Button
            disabled={loading}
            onClick={async () => {
              let statusTemp = status == 0 ? 1 : 0;
              try {
                await operadorCambiarEstatus(operadorId, setLoading, { status: statusTemp }, setData);
              } catch (e) {
                toast({
                  title: "error",
                  description: "ocurrio un error",
                  action: <ToastAction altText="Aceptar">Aceptar</ToastAction>
                })
              }
            }}
          >
            {loading ? <Loader /> : <></>}
            Aceptar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
