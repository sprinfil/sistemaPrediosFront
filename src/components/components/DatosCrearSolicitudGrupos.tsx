import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "../ui/input"
import { PopoverHorasExtrasEmpleado } from "./PopoverHorasExtraEmpleados"
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PopoverHorasExtrasGrupo } from "./PopoverHorasExtrasGrupo"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast"

export const DatosCrearSolicitudGrupos = ({}) => {
    const [dataEmpleados,setDataEmpleados]=useState([]);
    const [empleados,setEmpleados]=useState([]);

    const formSchema = z.object({
        horas: z.string().min(1, {
          message: "El tramite debe tener al menos 2 caracteres",
        }),
        horainicial: z.string().min(2, {
          message: "El tiempo debe tener al menos 2 caracteres",
        }),
        horafinal: z.string().min(2, {
          message: "El requisitos debe tener al menos 2 caracteres",
        }),
        fecha: z.string().min(2, {
          message: "El costo debe tener al menos 2 numeros",
        }),
        descripcion: z.string().min(1, {
          message: "El codigo debe tener algun valor",
        }),
        primadominical: z.string().min(1, {
            message: "El codigo debe tener algun valor",
        }),
        diafestivo: z.string().min(1, {
            message: "El codigo debe tener algun valor",
        }),
        archivo: z.string().min(1, {
            message: "El codigo debe tener algun valor",
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            horas:"",
            horainicial:"",
            horafinal:"",
            fecha:"",
            descripcion:"",
            primadominical:"",
            diafestivo:"",
            archivo:"",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
        } catch (e) {
          toast({
            title: "Error",
            description: "Ocurrio un error al crear la solicitud",
            variant: "destructive",
            action: <ToastAction altText="Aceptar">Aceptar</ToastAction>
          })
        }
    }

    return (
    <>
      <div className="ml-10 mr-10">
        <div className="w-full space-x-4 flex mb-5">
          <PopoverHorasExtrasGrupo dataEmpleados={dataEmpleados} setDataEmpleados={setDataEmpleados} horasEmpleados={empleados} setHorasEmpleados={setEmpleados} />
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="horas"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Horas</FormLabel>
                        <FormControl>
                        <Input placeholder="0" {...field} type="number"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fecha</FormLabel>
                        <FormControl>
                        <Input placeholder="" type="date" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="horainicial"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Horario</FormLabel>
                        <FormControl>
                        <Input {...field} type="time"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="horafinal"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel> _</FormLabel>
                        <FormControl>
                        <Input {...field} type="time"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Descripción ..."
                            className="resize-none"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="archivo"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Evidencia</FormLabel>
                        <FormControl>
                        <Input type="file" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="primadominical"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Checkbox />
                        </FormControl>
                        <FormLabel className="ml-2">Prima dominical</FormLabel>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="diafestivo"
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                        <Checkbox />
                        </FormControl>
                        <FormLabel className="ml-2">Día Festivo</FormLabel>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </form>
        </Form>
        <div className="w-full mt-5 mb-5 grid justify-end">
          <Button>Agregar</Button>
        </div>
      </div>
    </>
  )
}