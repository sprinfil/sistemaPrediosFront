import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,
  AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger,} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { IoEyeOutline } from "react-icons/io5";
import { Loader } from "./Loader";
import { ModalCensosModificados } from "./ModalCensosModificados";
import { TableCensosCargaTrabajoDetalles } from "./TableCensosCargaTrabajoDetalle";
import { CargaTrabajoCensos } from "./CargaTrabajoCensos";
import { useGetCensosCDTByid } from "@/lib/CensosHook";
import DatosCensosRespuesta from "./DatosCensosRespuesta";


export function ModalEditarCensosCDT({ setData, cargaTrabajoId }) {
    const{
        cargaTrabajo,
        setCargaTrabajo,
        loading,
        handlePeticionGetCensosCDTByid,
        encuestaRespuesta,
        setEncuestaRespuesta,
        handlePeticionGetEncuestaRespuesta,
        columnCount,
        setColumnCount
    }=useGetCensosCDTByid(setData, cargaTrabajoId);
    return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
        <Button variant="outline"
            onClick={handlePeticionGetCensosCDTByid}
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
                <AlertDialogTitle>{cargaTrabajo?.encuesta?.titulo}</AlertDialogTitle>
                {
                    cargaTrabajo?.estado == "1" ?
                    <>
                        <div className="p-2 bg-green-500 rounded-md flex items-center justify-center text-white w-full">
                        <p>CONCLUIDA</p>
                        </div>
                    </> : <></>
                }
                {
                    cargaTrabajo?.estado == "2" ?
                    <>
                        <div className="p-2 bg-red-500 rounded-md flex items-center justify-center text-white w-full">
                        <p>CANCELADA</p>
                        </div>
                    </> : <></>
                }
                {
                    cargaTrabajo?.estado == "0" ?
                    <>
                        <div className=" flex gap-2  py-3">
                        <ModalCensosModificados setData={setData} cargaTrabajo={{id:cargaTrabajo?.id,encuesta_id:cargaTrabajo?.encuesta_id,operador_id:cargaTrabajo?.operador_id,
                        estado:cargaTrabajo?.estado}} modificacion={"2"}/>
                        <ModalCensosModificados setData={setData} cargaTrabajo={{
                        id: cargaTrabajo?.id,encuesta_id: cargaTrabajo?.encuesta_id,operador_id: cargaTrabajo?.operador_id,
                        estado: cargaTrabajo?.estado}} modificacion={"1"}/>
                        </div>
                    </> : <></>
                }
                {/* ${columnCount} */}
                <div className={`grid md:grid-cols-${columnCount} gap-4`}> 
                    <div className={`${cargaTrabajo?.estado != "0" ? "pointer-events-none" : ""}`}>
                        <CargaTrabajoCensos cargaTrabajo={cargaTrabajo} setCargaTrabajo={setCargaTrabajo} setData={setData} />
                    </div>
                    <div>
                        <TableCensosCargaTrabajoDetalles cargaTrabajo={cargaTrabajo} handlePeticionGetEncuestaRespuesta={handlePeticionGetEncuestaRespuesta} setColumnCount={setColumnCount}/>
                    </div>
                    <div style={{ display: columnCount !== 3 ? 'none' : 'block' }} className="overflow-auto max-h-[70vh] sticky top-0">
                        <DatosCensosRespuesta encuestaRespuesta={encuestaRespuesta}/>
                    </div>
                </div>

                <div className="items-center md:flex absolute bottom-3 right-4 mt-4">
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
