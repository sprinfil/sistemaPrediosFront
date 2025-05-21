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
import { Loader } from "./Loader";
import { ComboBoxOperadoresCensos } from "./ComboBoxOperadoresCensos";
import { ComboBoxEncuestas } from "./ComboBoxEncuestas";
import { useModalCrearCArgaTrabajoCensos } from "@/lib/CensosHook";

export function ModalCrearCargaTrabajoCensos({ setData }) {
  const{
    handleFileChange,
    toast,
    fileData,
    setFileData,
    selectedOperador,
    setSelectedOperador,
    selectedEncuestas,
    setselectedEncuestas,
    loading,
    setLoading,
    jsonData,
    setJsonData,
    cancelarButton,
    user,
    handleCrearCargaDeTrabajoCensos
  }=useModalCrearCArgaTrabajoCensos(setData);
  
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
            <ComboBoxOperadoresCensos setOperador={setSelectedOperador} defualtOperador={{}}/>
            <ComboBoxEncuestas setEncuestas={setselectedEncuestas} defualtOperador={{}}/>
            {
              selectedOperador?.id != null && selectedEncuestas?.id !=null ?
              <>
                  <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
              </> : <></>
            }
          </div>
          <div className="mt-4 overflow-auto max-h-[45vh]">

            <p>
              {Array.isArray(jsonData) && jsonData[0] ? (
                Object.keys(jsonData[0]).slice(0, 1).map((key) => (
                  <th key={key} className="border px-2 py-1 text-left">{key}</th>
                ))
              ) : (
                <p></p>
              )}
            </p>


            {fileData.length > 0 ? (
              <table className="min-w-full border">
                <thead>
                  <tr>
                    {Object.values(jsonData[0]).map((key) => (
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
              setselectedEncuestas(null);
              setJsonData([]);
            }}>
              Cancelar
            </AlertDialogCancel>
            <Button disabled={fileData.length == 0 || loading}
              onClick={handleCrearCargaDeTrabajoCensos}
            >
              {loading ? <><Loader /></> : <></>}
              Continuar</Button>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
  