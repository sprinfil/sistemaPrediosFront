import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "../ui/input"
import { PopoverHorasExtrasEmpleado } from "./PopoverHorasExtraEmpleados"
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { set } from "zod"
import { PopoverHorasExtrasGrupo } from "./PopoverHorasExtrasGrupo"
import { Textarea } from "../ui/textarea"

export const DatosCrearSolicitud = ({dataEmpleados,setDataEmpleados, horasEmpleados,setHorasEmpleados}) =>{
    return (
        <>
        <div className="ml-10 mr-10">
            <div className="w-full space-x-4 flex mb-5">
                <PopoverHorasExtrasEmpleado dataEmpleados={dataEmpleados} setDataEmpleados={setDataEmpleados} horasEmpleados={horasEmpleados} setHorasEmpleados={setHorasEmpleados}/>
                <PopoverHorasExtrasGrupo dataEmpleados={dataEmpleados} setDataEmpleados={setDataEmpleados} horasEmpleados={horasEmpleados} setHorasEmpleados={setHorasEmpleados}/>
            </div>
            <div className="w-full flex space-x-4 mb-5">
                <div className="w-full grid gap-1.5">
                    <Label className="">Horario</Label>
                    <div className="w-full flex space-x-4">
                        <Input type="time" id="hora inicio" className="w-[50%]"/>
                        <div className="">a</div>
                        <Input type="time" id="hora fin" className="w-[50%]"/>
                    </div>
                </div>
                <div className="grid w-full gap-1.5">
                    <Label>Fecha</Label>
                    <Input type="date" id="fecha" className="w-[25%]"/>
                </div>                
            </div>
            <div className="mb-5">
                <div className="flex space-x-8">
                    <div>
                        <Label>Horas</Label>
                        <Input type="number" id="hora" placeholder="0" className="w-50"/>
                    </div>
                    <div className="mt-4">
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
            </div>
            <div>
                <Label>Descripción</Label>
                <Textarea placeholder="Descripción..." />
            </div>
            <div className="w-full mt-5 mb-5 grid justify-end">
                <Button>Agregar</Button>
            </div>
        </div>
        </>
    )
}