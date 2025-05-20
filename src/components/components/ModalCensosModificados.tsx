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
  import { useRef, useState } from "react";
  import { Loader } from "./Loader";
  import { MdOutlineCancel } from "react-icons/md";
  import { FaCheckCircle } from "react-icons/fa";
  import { updateCensosCargadeTrabajo } from "@/lib/CensosService";
import { FaArrowRotateRight } from "react-icons/fa6";
  
  interface ModalCensosModificadosProps {
    cargaTrabajo: any;
    setData: (data: any) => void;
    modificacion: "0" | "1" | "2";
  }
  
  export function ModalCensosModificados({ cargaTrabajo, setData, modificacion }: ModalCensosModificadosProps) {
    const [loading, setLoading] = useState(false);
    const cancelarButton = useRef<HTMLButtonElement>(null);
  
    const config = {
      "0": {
        title: "¿Poner en proceso la carga de trabajo?",
        description: "La carga de trabajo se pondrá en progreso.",
        buttonColor: "bg-white hover:bg-gray-50 text-blue-700 border border-gray-300",
        textColor: "text-blue-500",
        buttonText: "En Proceso",
        icon: <FaArrowRotateRight className="ml-2" />
      },
      "1": {
        title: "¿Concluir carga de trabajo?",
        description: "La carga de trabajo se va a concluir.",
        buttonColor: "bg-white hover:bg-gray-50 text-green-500 border border-gray-300",
        textColor: "text-green-500",
        buttonText: "Concluir",
        icon: <FaCheckCircle className="ml-2" />
      },
      "2": {
        title: "¿Cancelar carga de trabajo?",
        description: "La carga de trabajo se va a cancelar y no aparecerá al operador.",
        buttonColor: "bg-white hover:bg-gray-50 text-red-500 border border-gray-300",
        textColor: "text-red-500",
        buttonText: "Cancelar",
        icon: <MdOutlineCancel className="ml-2" />
      }
    };
    const currentConfig = config[modificacion];
  
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
              onClick={async () => {
                try {
                  await updateCensosCargadeTrabajo(
                    setLoading, 
                    cargaTrabajo, 
                    modificacion, 
                    setData
                  );
                  cancelarButton.current?.click();
                } catch (e) {
                  //TODO:MOSTRAR ERROR
                }
              }}
              className={currentConfig.buttonColor}
            >
              {loading ? <Loader /> : <>Aceptar</>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }