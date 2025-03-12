import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "../ui/input"
import { PopoverHorasExtras } from "./PopoverHorasExtraEmpleados"

export const DatosCrearSolicitud = () =>{
    return (
        <>
        <div className="w-full mb-5">
            {/* <PopoverHorasExtras dataEmpleados={} setDataEmpleados={} horasEmpleados={} setHorasEmpleados={}/> */}
            <div className="grid ml-[9%] mr-[11%]">
                <Label>Empleado</Label>
                <Input className="w-full"/>
            </div>
        </div>
        <div className="w-full grid grid-cols-3 gap-4 mb-5">
            <div className="grid w-full justify-center gap-1.5">
                <Label>Horas</Label>
                <Input type="number" id="hora" placeholder="0" className="w-full"/>
            </div>
            <div className="w-full grid justify-center">
                <Label className="">Horario</Label>
                <div className="w-full grid grid-cols-2">
                    <Input type="time" id="hora inicio" className="w-full"/>
                    <Input type="time" id="hora fin" className="w-full"/>
                </div>
            </div>
            <div className="grid w-full justify-center gap-1.5">
                <Label>Fecha</Label>
                <Input type="date" id="fecha" className="w-full"/>
            </div>
        </div>
        <div className="w-full">

        </div>
        </>
    )
}