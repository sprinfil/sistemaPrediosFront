import { DatosCrearEditarSolicitud } from "@/components/components/DatosCrearEditarSolicitud"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"

export const EditarSolicitud = () => {
    
    return (
        <Card className="mb-2">
            <CardHeader>
                <CardTitle>Solicitudes</CardTitle>
                <Breadcrumb>
                    <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink className='cursor-pointer'>Solicitud </BreadcrumbLink>
                        <BreadcrumbSeparator/>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Editar</BreadcrumbPage>
                    </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </CardHeader>
            <DatosCrearEditarSolicitud />
        </Card>
    )
}
