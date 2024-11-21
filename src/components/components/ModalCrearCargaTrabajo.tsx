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
import { useEffect, useRef, useState } from "react";
import { crearCargaTrabajo, formatearDatos } from "@/lib/PrediosCargaTrabajosService";
import ZustandPrincipal from "@/Zustand/ZustandPrincipal";
import { Loader } from "./Loader";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";



export function ModalCrearCargaTrabajo({ setData }) {
  const { toast } = useToast();
  const [fileData, setFileData] = useState([]);
  const [selectedOperador, setSelectedOperador] = useState(null);
  const [loading, setLoading] = useState(false);
  const cancelarButton = useRef();

  const { user } = ZustandPrincipal();

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
        console.log(jsonData)
        // Filtrar y modificar la primera columna según las reglas
        const modifiedData = jsonData
          .filter(row => {
            const firstColValue = row[Object.keys(row)[0]];
            // Filtra solo los registros donde la longitud de al menos 7
            return firstColValue.toString().length >= 7;
          })
          .map(row => {
            const firstColKey = Object.keys(row)[0];
            const firstColValue = row[firstColKey].toString();
            // Si la longitud es 7, agrega un 0 al principio
            if (firstColValue.length === 7) {
              row[firstColKey] = "0" + firstColValue;
            }
            return row;
          });

        console.log(modifiedData);
        setFileData(modifiedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => { }, [fileData])

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

          <div className="flex gap-4 p-2">
            <ComboBoxOperadores setOperador={setSelectedOperador} />
            {
              selectedOperador?.id != null ?
                <>
                  <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                </> : <></>
            }
          </div>
          <div className="mt-4 overflow-auto max-h-[45vh]">
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
            <AlertDialogCancel ref={cancelarButton} onClick={() => {
              setFileData([]);
              setSelectedOperador(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <Button disabled={fileData.length == 0 || loading}
              onClick={async () => {
                try {
                  await crearCargaTrabajo(fileData, selectedOperador, user?.id, setLoading, setData);
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
              Continuar</Button>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );


}
