import { Input } from "../ui/input"
import { PopoverHorasExtrasEmpleado } from "./PopoverHorasExtraEmpleados"
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { icons } from "@/constants/icons";
import { Loader } from "lucide-react"
import { crearSolicitudEmpleados } from "@/lib/Solicitudes"

export const DatosCrearSolicitudEmpleados = ({}) => {
    const [dataEmpleados, setDataEmpleados] = useState<any[]>([]);
    const [empleados, setEmpleados] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const isTimeAfter = (startTime: string, endTime: string) => {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        if (startHour < endHour) return true;
        if (startHour === endHour && startMinute < endMinute) return true;
        return false;
    };
    const formSchema = z.object({
        horas: z.string()
            .min(1, { message: "Las horas son obligatorias" })
            .refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" })
            .refine((val) => Number(val) > 0, { message: "Las horas deben ser mayores a 0" })
            .refine((val) => Number(val) <= 24, { message: "Las horas no pueden ser más de 24" }),
        horainicial: z.string()
            .min(1, { message: "La hora inicial es obligatoria" }),
        horafinal: z.string()
            .min(1, { message: "La hora final es obligatoria" }),
        fecha: z.string()
            .min(1, { message: "La fecha es obligatoria" }),
        descripcion: z.string()
            .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
            .max(500, { message: "La descripción no puede exceder los 500 caracteres" }),
        primadominical: z.boolean().default(false),
        diafestivo: z.boolean().default(false),       
        archivo: z.any().optional(),
    }).refine((data) => {
        if (data.horainicial && data.horafinal) {
            return isTimeAfter(data.horainicial, data.horafinal);
        }
        return true;
    }, {
        message: "La hora final debe ser posterior a la hora inicial",
        path: ["horafinal"]
    });

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            horas: "",
            horainicial: "",
            horafinal: "",
            fecha: "",
            descripcion: "",
            primadominical: false,
            diafestivo: false,
        },
    });

    async function onSubmit(values: FormValues) {
        setLoading(true);
        try {
            if (!dataEmpleados || dataEmpleados.length === 0) {
                throw new Error("Debe seleccionar al menos un empleado");
            }
            // const obtenerIdUsuarioActual = () => {
            //     const { user } = useAuth();
            //     return user?.id;
            // };
            // const idUsuarioActual = obtenerIdUsuarioActual(); 

            const empleadosIds = dataEmpleados.map(empleado => empleado.id);
            const requestData = {
                //id_user_solicitante:  idUsuarioActual,
                id_he_empleado_trabajador: empleadosIds,
                description: values.descripcion,
                prima_dominici: values.primadominical ? 1 : 0,
                dias_fesivos: values.diafestivo ? 1 : 0,
                horas: values.horas,
                hora_inio: values.horainicial,
                hora_fin: values.horafinal,
                fecha: values.fecha,
                estapa: "Pendiente", 
                estado: "Espera",
            };
            await crearSolicitudEmpleados(
                setLoading,
                requestData,
                (responseData: any) => {                    
                    toast({
                        title: "Solicitud creada",
                        description: "La solicitud de horas extras se ha creado correctamente",
                        action: <ToastAction altText="Aceptar">Aceptar</ToastAction>
                    });
                    form.reset();
                    setDataEmpleados([]);
                    setEmpleados(null);
                }
            );
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Ocurrió un error al crear la solicitud",
                variant: "destructive",
                action: <ToastAction altText="Aceptar">Aceptar</ToastAction>
            });
        } finally {
            setLoading(false);
        }
    }

    return (
    <>
      <div className="ml-10 mr-10">
        <div className="w-full space-x-4 flex mb-5">
          <PopoverHorasExtrasEmpleado 
            dataEmpleados={dataEmpleados} 
            setDataEmpleados={setDataEmpleados} 
            empleados={empleados} 
            setEmpleados={setEmpleados} 
          />
          {dataEmpleados.length === 0 && 
            <p className="text-red-500 text-sm">Debe seleccionar al menos un empleado</p>
          }
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
                        <Input placeholder="0" {...field} type="number" min="1" max="24"/>
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
                        <Input 
                            placeholder="" 
                            type="date" 
                            {...field}
                        />
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
                        <FormLabel>Hora inicial</FormLabel>
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
                        <FormLabel>Hora final</FormLabel>
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
                    <FormItem className="col-span-2">
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                        <Textarea
                            placeholder="Descripción ..."
                            className="resize-none"
                            {...field}
                            maxLength={500}
                        />
                        </FormControl>
                        <FormDescription>
                            {field.value?.length || 0}/500 caracteres
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="archivo"
                    render={({ field: { value, onChange, ...field } }) => (
                    <FormItem className="col-span-2">
                        <FormLabel>Evidencia (opcional)</FormLabel>
                        <FormControl>
                        <Input 
                            type="file" 
                            accept=".jpg,.jpeg,.png,.pdf" 
                            onChange={(e) => onChange(e.target.files)}
                            {...field}
                        />
                        </FormControl>
                        <FormDescription>
                            Puede subir evidencia de las horas extras (JPG, PNG o PDF)
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="primadominical"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                        <Checkbox 
                            id="primadominical"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Prima dominical</FormLabel>
                            <FormDescription>
                                Marcar si las horas extras fueron realizadas en domingo
                            </FormDescription>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="diafestivo"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                        <Checkbox 
                            id="diafestivo"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Día Festivo</FormLabel>
                            <FormDescription>
                                Marcar si las horas extras fueron realizadas en un día festivo
                            </FormDescription>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="col-span-2 flex justify-end mt-4">
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        Agregar solicitud {icons.agregar("")}
                    </Button>
                </div>
            </form>
        </Form>
      </div>
    </>
  )
}