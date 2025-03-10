import { Input } from "../ui/input"

export const DatosCrearSolicitud = () =>{
    return (
        <div className="w-full mt-[5%] mb-[1%] grid grid-cols-3 gap-4">
            <Input
                placeholder="Cosa 1"
                className="w-[50%] ml-[5%]"
            />
            <Input
                placeholder="Cosa 2"
                className="w-[50%] ml-[5%]"
            />
        </div>
    )
}