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
import { BsPencilSquare } from "react-icons/bs";
import { IoEyeOutline } from "react-icons/io5";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CargaTrabajoForm } from "./CargaTrabajoForm";
import { useState } from "react";
import { getCargaTrabajoByid } from "@/lib/PrediosCargaTrabajosService";
import { Loader } from "./Loader";
import { TableCargaTrabajoDetalles } from "./TableCargaTrabajoDetalles";
import { ModalConcluirCargaTrabajo } from "./ModalConcluirCargaTrabajo";
import { ModalCancelarCargaTrabajo } from "./ModalCancelarCargaTrabajo";


export function ModalEditarCargaDeTrabajo({ setData, cargaTrabajoId }) {
  const [cargaTrabajo, setCargaTrabajo] = useState({});
  const [loading, setLoading] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline"
          onClick={async () => {
            try {
              await getCargaTrabajoByid(cargaTrabajoId, setCargaTrabajo, setLoading);
            } catch (e) {
              //TODO: Poner el error
            }
          }}
        >Ver <IoEyeOutline /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="h-[90vh] min-w-[90%]">
        {
          loading ?
            <div className="h-full w-full flex items-center justify-center">
              <Loader />
            </div> :
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{cargaTrabajo?.nombre_carga}</AlertDialogTitle>
                {
                  cargaTrabajo?.status == 1 ?
                    <>
                      <div className="p-2 bg-green-500 rounded-md flex items-center justify-center text-white w-full">
                        <p>CONCLUIDA</p>
                      </div>
                    </> : <></>
                }
                {
                  cargaTrabajo?.status == 2 ?
                    <>
                      <div className="p-2 bg-red-500 rounded-md flex items-center justify-center text-white w-full">
                        <p>CANCELADA</p>
                      </div>
                    </> : <></>
                }
                {
                  cargaTrabajo?.status == 0 ?
                    <>
                      <div className=" flex gap-2  py-3">
                        <ModalConcluirCargaTrabajo cargaTrabajo={cargaTrabajo} setCargaTrabajo={setCargaTrabajo} setData={setData} />
                        <ModalCancelarCargaTrabajo cargaTrabajo={cargaTrabajo} setCargaTrabajo={setCargaTrabajo} setData={setData} />
                      </div>
                    </> : <></>
                }


                <div className="grid md:grid-cols-2 gap-4 ">
                  <div className={`${cargaTrabajo?.status != 0 ? "pointer-events-none" : ""}`}>
                    <CargaTrabajoForm cargaTrabajo={cargaTrabajo} setCargaTrabajo={setCargaTrabajo} setData={setData} />
                  </div>
                  <div>
                    <TableCargaTrabajoDetalles cargaTrabajo={cargaTrabajo} />
                  </div>

                </div>

                <div className="items-center md:flex  absolute bottom-3 right-4">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>

              </AlertDialogFooter>
            </>
        }

      </AlertDialogContent>
    </AlertDialog>
  )
}
