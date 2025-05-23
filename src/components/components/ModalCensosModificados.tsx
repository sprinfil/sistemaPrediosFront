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
import { Loader } from "./Loader";
import { useCensosModificados } from "@/lib/CensosHook";
  
interface ModalCensosModificadosProps {
  cargaTrabajo: any;
  setData: (data: any) => void;
  modificacion: "0" | "1" | "2";
}
  
export function ModalCensosModificados({ cargaTrabajo, setData, modificacion }: ModalCensosModificadosProps) {
  const{
    loading,
    cancelarButton,
    currentConfig,
    handleUpdateCensosCargadeTrabajo
  }= useCensosModificados(modificacion, cargaTrabajo, setData);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          className={currentConfig.buttonColor}
        >
          {currentConfig.icon} {currentConfig.buttonText}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{currentConfig.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {currentConfig.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelarButton}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpdateCensosCargadeTrabajo}
            className={currentConfig.buttonColor}
          >
            {loading ? <Loader /> : <>Aceptar</>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}