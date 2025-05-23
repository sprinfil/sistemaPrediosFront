import {Table,TableBody,TableCaption,TableCell,TableFooter,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IoEyeOutline } from "react-icons/io5"


export function TableCensosCargaTrabajoDetalles({cargaTrabajo, handlePeticionGetEncuestaRespuesta, setColumnCount}) {
    return (
    <div className="mt-5 overflow-auto h-[60vh]">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead></TableHead>
            <TableHead>Codigo</TableHead>
            {/* <TableHead>Cuenta</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Orden</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Clave Catastral</TableHead>
            <TableHead>Medidor</TableHead> */}
            </TableRow>
        </TableHeader>
        <TableBody>
            {cargaTrabajo?.tomas?.map((detalle) => (
            <TableRow className={`${detalle?.asignado == 1 ? "bg-green-100 hover:bg-green-100" : ""}`} key={detalle?.id}>
                <TableCell>
                    <Button variant="outline" 
                    onClick={()=>{
                    handlePeticionGetEncuestaRespuesta(detalle?.id);
                    setColumnCount(3);}}
                    >Ver <IoEyeOutline /></Button></TableCell>
                <TableCell>{detalle?.codigo_toma}</TableCell>
                {/* <TableCell>{detalle?.usuario}</TableCell>
                <TableCell>{detalle?.orden}</TableCell>
                <TableCell>{detalle?.direccion}</TableCell>
                <TableCell>{detalle?.clave_catastral}</TableCell>
                <TableCell>{detalle?.no_medidor}</TableCell> */}
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>

    )
}
