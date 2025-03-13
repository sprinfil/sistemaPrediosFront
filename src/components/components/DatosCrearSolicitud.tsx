import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "../ui/input"
import { PopoverHorasExtrasEmpleado } from "./PopoverHorasExtraEmpleados"
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { set } from "zod"
import { PopoverHorasExtrasGrupo } from "./PopoverHorasExtrasGrupo"

export const DatosCrearSolicitud = ({dataEmpleados,setDataEmpleados, horasEmpleados,setHorasEmpleados}) =>{
    return (
        <>
        <div className="ml-10 mr-10">
            <div className="w-full flex mb-5">
                <PopoverHorasExtrasEmpleado dataEmpleados={dataEmpleados} setDataEmpleados={setDataEmpleados} horasEmpleados={horasEmpleados} setHorasEmpleados={setHorasEmpleados}/>
                <div className="ml-20"></div>
                <PopoverHorasExtrasGrupo dataEmpleados={dataEmpleados} setDataEmpleados={setDataEmpleados} horasEmpleados={horasEmpleados} setHorasEmpleados={setHorasEmpleados}/>
            </div>
            <div className="w-full grid grid-cols-3 gap-4 mb-5">
                <div className="grid gap-1.5">
                    <Label>Horas</Label>
                    <Input type="number" id="hora" placeholder="0" className="w-[75%]"/>
                </div>
                <div className="w-full grid gap-1.5">
                    <Label className="">Horario</Label>
                    <div className="w-full grid grid-cols-2">
                        <Input type="time" id="hora inicio" className="w-[75%]"/>
                        <Input type="time" id="hora fin" className="w-[75%]"/>
                    </div>
                </div>
                <div className="grid w-full gap-1.5">
                    <Label>Fecha</Label>
                    <Input type="date" id="fecha" className="w-[50%]"/>
                </div>
            </div>
            <div className="grid grid-cols-2 space-x-8 mb-5">
                <div>
                    <Label>Descripción</Label>
                    <Input />
                </div>
                <div className="flex space-x-8 space-y-auto">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="primadominical"/>
                        <Label>Prima dominical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="diasfestivos"/>
                        <Label>Día festivo</Label>
                    </div>
                </div>
            </div>
            <div className="w-full mb-5 grid justify-center">
                <Button>Agregar</Button>
            </div>
        </div>
        </>
    )
}