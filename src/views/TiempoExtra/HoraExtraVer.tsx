import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useNavigate } from 'react-router-dom';
import { PopoverHorasExtrasEmpleado } from '@/components/components/PopoverHorasExtraEmpleados';
import { PopoverHorasExtrasGrupo } from '@/components/components/PopoverHorasExtrasGrupo';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { icons } from '@/constants/icons';


export const HoraExtraVer = () => {
  const navigate = useNavigate();

  return (

    <>
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Horas extra</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className='cursor-pointer'
                  onClick={() => {
                    navigate(-1);
                  }}
                >Seleccionar solicitud</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className='cursor-pointer'>Solicitud</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className='mt-3'>
            <DatosCrearSolicitud />
          </div>


        </CardContent>
      </Card>
    </>
  )
}

const DatosCrearSolicitud = ({ dataEmpleados, setDataEmpleados, horasEmpleados, setHorasEmpleados }) => {
  return (
    <>
      <div className='w-full flex items-center mb-3 gap-3'>
        <Button variant={"outline"} className='text-green-700'>
          Aprobar {icons.confirmar("")}
        </Button>
        <Button variant={"outline"} className='text-red-700'>
          No aprobar
          {icons.cancelar("")}
        </Button>

      </div>
      <div className="">
        <div className="w-full mb-3">
          <p className='mb-2'>Empleado</p>
          <Input
            className='pointer-events-none'
            placeholder='Empleado'
            value={"Francisco Antonio Cota Beltrán"} >
          </Input>
        </div>
        <div className="w-full flex space-x-4 mb-5">
          <div className="w-full grid gap-1.5">
            <Label className="">Horario</Label>
            <div className="w-full flex space-x-4">
              <Input type="time" id="hora inicio" className="" />
              <div className="">a</div>
              <Input type="time" id="hora fin" className="" />
            </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label>Fecha</Label>
            <Input type="date" id="fecha" className="" />
          </div>
        </div>
        <div className="mb-5">
          <div className="flex space-x-8">
            <div className="grid gap-1.5">
              <Label>Horas</Label>
              <Input type="number" id="hora" placeholder="0" className="w-50" />
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="primadominical" />
                <Label>Prima dominical</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="diasfestivos" />
                <Label>Día festivo</Label>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label>Descripción</Label>
          <Textarea placeholder="Descripción..." />
        </div>
        {/* <div className="w-full mt-5 mb-5 grid justify-end">
          <Button>Agregar</Button>
        </div> */}
      </div>
    </>
  )
}
