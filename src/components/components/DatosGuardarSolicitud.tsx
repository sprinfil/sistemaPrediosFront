import { Label } from "@radix-ui/react-dropdown-menu"
import { Button } from "../ui/button"
import { DataTableSolicitud } from "./DataTableSolicitud"

export const DatosGuardarSolicitud = () =>{
    return (
        <>
        <div className="mb-5">
            <div className="grid justify-center">
                <Label>Empleado: JUAN EL BAILADOR</Label>
            </div>
            <DataTableSolicitud/>
            <div className="flex space-x-8 justify-center">
                <Button>Guardar</Button>
            </div>
        </div>
        
        </>
    )
}