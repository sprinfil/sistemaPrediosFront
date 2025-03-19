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
import { icons } from "@/constants/icons"
import { useEmpleados } from "@/lib/EmpleadosHook";

export function ModalImportarHeEmpleados({
  endpoint,
  title,
  updateData
}) {
  const {
    excelEmpleadosRef,
    loadingImportacion,
    handleImportarEmpleados,
    buttonCancelarModal
  } = useEmpleados();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="ml-auto"
        >
          Importar
          {icons.importar("")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <input
              ref={excelEmpleadosRef}
              type="file"
              name="file"
              accept=".csv"
              className="w-full"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            ref={buttonCancelarModal}
          >Cancelar</AlertDialogCancel>
          <Button
            disabled={loadingImportacion}
            onClick={() => { handleImportarEmpleados(endpoint, updateData) }}
          >Aceptar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
