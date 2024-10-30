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
import { useState } from "react";

export function ModalImportarPrediosGeoJson() {
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          // console.log("Datos del archivo JSON:", jsonData);
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
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
