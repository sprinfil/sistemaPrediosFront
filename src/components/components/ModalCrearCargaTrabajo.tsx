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
import { PlusCircle } from "lucide-react";
import { ComboBoxOperadores } from "./ComboBoxOperadores";
import * as XLSX from "xlsx";
import { useState } from "react";

export function ModalCrearCargaTrabajo() {
  const [fileData, setFileData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setFileData(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="ml-auto">Nueva Carga <PlusCircle /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-[70%] h-[80vh]">
        <AlertDialogHeader className="flex flex-col relative overflow-auto">
          <AlertDialogTitle>Crear Nueva Carga de trabajo</AlertDialogTitle>
          <AlertDialogDescription>
            Importa un archivo de cargas de trabajo
          </AlertDialogDescription>
          <div className="flex gap-4">
            <ComboBoxOperadores />
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          </div>
          <div className="mt-4 overflow-auto max-h-[50vh]">
            {fileData.length > 0 ? (
              <table className="min-w-full border">
                <thead>
                  <tr>
                    {Object.keys(fileData[0]).map((key) => (
                      <th key={key} className="border px-2 py-1 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fileData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="border px-2 py-1">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No se ha cargado ningún archivo.</p>
            )}
          </div>
          <div className="right-2 bottom-2 absolute flex gap-3">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction>Continuar</AlertDialogAction>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
