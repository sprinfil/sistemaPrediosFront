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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { importarPredios } from "@/lib/PredioService";
import { useRef, useState } from "react";
import { Loader } from "./Loader";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

export function ModalImportarPrediosGeoJson() {
  const { toast } = useToast();
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const cancelarButton = useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          console.log("Datos del archivo JSON:", jsonData);
          setFileContent(jsonData);
        } catch (error) {
          console.error("Error al parsear el archivo JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="border-none">Importar Predios</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Importar Predios</AlertDialogTitle>
          <AlertDialogDescription>
            Importar un archivo geojson para importar los predios
          </AlertDialogDescription>
          <input type="file" accept=".json,.geojson" onChange={handleFileChange} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => { setFileContent(null); }}
            ref={cancelarButton}
          >Cancelar</AlertDialogCancel>
          <Button
            disabled={fileContent == null || loading}
            onClick={async () => {
              try {
                await importarPredios(setLoading, fileContent);
                cancelarButton?.current?.click();
              }
              catch (e) {
                toast({
                  title: 'Ocurrio un error',
                  description: e?.response?.data?.data?.message,
                  action: <ToastAction altText="Intenar de nuevo">Intenar de nuevo</ToastAction>,
                })
              }
            }}
          >
            {loading ? <><Loader /></> : <></>}
            Aceptar e importar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
