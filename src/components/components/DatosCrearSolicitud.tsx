import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { icons } from "@/constants/icons";
import { Loader, XCircle } from "lucide-react"
import { crearSolicitudEmpleados } from "@/lib/Solicitudes"
import ZustandPrincipal from "@/Zustand/ZustandPrincipal"
import { fetchData } from "@/lib/CatalogoService"
import { ComboBoxReutilizable } from "./ComboBoxReutilizable"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { ChevronDown, ChevronUp, X } from "lucide-react"

export const DatosCrearSolicitud = ({ }) => {
    const [dataEmpleados, setDataEmpleados] = useState<any[]>([]);
    const [empleados, setEmpleados] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { user } = ZustandPrincipal();
    const [empleadosData, setEmpleadosData] = useState([]);
    const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState<number[]>([]);
    const [grupoData, setGrupoData] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [calculatedHours, setCalculatedHours] = useState<string>("0");

    const fetchEmpleados = async () => {
        const response = await fetchData(
            setLoading,
            "/he-empleados",
            toast
        );
        setEmpleadosData(response);
    };

    const fetchGrupo = async () => {
        const response = await fetchData(
            setLoading,
            "/he-grupos",
            toast
        );
        setGrupoData(response);
    };

    useEffect(() => {
        fetchGrupo();
        fetchEmpleados();
    }, []);

    const isTimeAfter = (startTime: string, endTime: string) => {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        if (startHour < endHour) return true;
        if (startHour === endHour && startMinute < endMinute) return true;
        return false;
    };

    const calculateHours = (horaInicial: string, horaFinal: string): string => {
        if (!horaInicial || !horaFinal) return "0";
        const [startHour, startMinute] = horaInicial.split(':').map(Number);
        const [endHour, endMinute] = horaFinal.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        let diffMinutes = endTotalMinutes - startTotalMinutes;
        if (diffMinutes < 0) {
            diffMinutes += 24 * 60;
        }
        const diffHours = Math.ceil(diffMinutes / 60);
        return diffHours.toString();
    };

    const formSchema = z.object({
        grupo: z.any().optional(),
        empleado: z.any().optional(),
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
            .min(1, { message: "La descripción debe tener al menos 1 caracteres" })
            .max(500, { message: "La descripción no puede exceder los 500 caracteres" }),
        primadominical: z.boolean().default(false),
        diafestivo: z.boolean().default(false),
        archivos: z.any().optional(),
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
            grupo: 1,
            empleado: 1,
            horas: "0",
            horainicial: "",
            horafinal: "",
            fecha: "",
            descripcion: "",
            primadominical: false,
            diafestivo: false,
            archivos: undefined,
        },
    });

    useEffect(() => {
        const horaInicial = form.watch("horainicial");
        const horaFinal = form.watch("horafinal");

        if (horaInicial && horaFinal) {
            const hours = calculateHours(horaInicial, horaFinal);
            setCalculatedHours(hours);
            form.setValue("horas", hours);
        }
    }, [form.watch("horainicial"), form.watch("horafinal")]);

    const handleAgregarGrupo = () => {
        const grupoId = form.getValues('grupo');
        const grupoids = grupoData.find((grupo) => grupo.id === grupoId);
        if (grupoids && grupoids.empleados && grupoids.empleados.length > 0) {
            const empleadosDelGrupo = grupoids.empleados.map((empleado) => empleado.id);
            setEmpleadosSeleccionados(prev => {
                const todosIds = [...prev, ...empleadosDelGrupo];
                return [...new Set(todosIds)];
            });
        } else {
            toast({
                title: "Error",
                description: "Seleccione un grupo válido o no hay empleados en este grupo.",
                variant: "destructive"
            });
        }
    }

    const handleAgregarEmpleado = () => {
        const empleadoSeleccionado = form.getValues('empleado');
        if (empleadoSeleccionado && !empleadosSeleccionados.includes(empleadoSeleccionado)) {
            setEmpleadosSeleccionados(prev => [...prev, empleadoSeleccionado]);
        } else {
            toast({
                title: "Error",
                description: "Seleccione un empleado válido o ya agregado.",
                variant: "destructive"
            });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        const newFiles = Array.from(files);
        const validFiles = newFiles.filter(file => {
            const fileType = file.type;
            return fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'application/pdf';
        });
        if (validFiles.length !== newFiles.length) {
            toast({
                title: "Archivo no válido",
                description: "Solo se permiten archivos JPG, PNG o PDF",
                variant: "destructive",
            });
        }
        setSelectedFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    async function onSubmit(values: FormValues) {
        setLoading(true);
        try {
            const empleadosIds = empleadosSeleccionados;
            const formData = new FormData();
            formData.append('id_user_solicitante', user?.id.toString());
            formData.append('descripcion', values.descripcion);
            formData.append('prima_dominical', values.primadominical ? '1' : '');
            formData.append('dias_festivos', values.diafestivo ? '1' : '');
            formData.append('horas', values.horas);
            formData.append('hora_inicio', values.horainicial);
            formData.append('hora_fin', values.horafinal);
            formData.append('fecha', values.fecha);
            empleadosIds.forEach((id, index) => {
                formData.append(`empleados[${index}]`, id.toString());
            });
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file, index) => {
                    formData.append(`archivos[${index}]`, file);
                });
            }

            await crearSolicitudEmpleados(
                setLoading,
                formData,
                (responseData: any) => {
                    toast({
                        title: "Solicitud creada",
                        description: "La solicitud de horas extras se ha creado correctamente",
                        action: <ToastAction altText="Aceptar">Aceptar</ToastAction>
                    });
                    form.reset();
                    setDataEmpleados([]);
                    setEmpleados(null);
                    setSelectedFiles([]);
                    setCalculatedHours("0");
                    setEmpleadosSeleccionados([]);
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
            <div className="ml-10 mr-10 mb-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="grupo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grupo</FormLabel>
                                    <FormControl>
                                        <>
                                            <br />
                                            <ComboBoxReutilizable
                                                loading={loading}
                                                placeholder="Grupo"
                                                items={grupoData}
                                                accesorKey="nombre"
                                                defaultValue={null}
                                                setItem={(value) => {
                                                    form.setValue("grupo", value);
                                                }}
                                            />
                                            <Button type="button" variant={"outline"} className="ml-5" onClick={handleAgregarGrupo}>
                                                {icons.agregar("text-black")}
                                            </Button>
                                        </>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="empleado"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Empleados</FormLabel>
                                    <FormControl>
                                        <>
                                            <br />
                                            <ComboBoxReutilizable
                                                loading={loading}
                                                placeholder="Empleado"
                                                items={empleadosData}
                                                accesorKey="nombre"
                                                defaultValue={null}
                                                setItem={(value) => {
                                                    form.setValue("empleado", value);
                                                }}
                                            />
                                            <Button type="button" variant={"outline"} className="ml-5" onClick={handleAgregarEmpleado}>
                                                {icons.agregar("text-black")}
                                            </Button>
                                        </>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="col-span-2 mb-4">
                            <Collapsible className="w-full border rounded-md">
                                <div className="flex items-center justify-between px-4 py-2 border-b">
                                    <h3 className="font-medium">Empleados seleccionados ({empleadosSeleccionados.length})</h3>
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm" className="p-1">
                                            {open ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent>
                                    <div className="p-4">
                                        {empleadosSeleccionados.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Nombre</TableHead>
                                                        <TableHead className="w-[100px]">Quitar</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {empleadosSeleccionados.map((id) => {
                                                        const empleado = empleadosData.find(e => e.id === id);
                                                        return (
                                                            <TableRow key={id}>
                                                                <TableCell>{empleado ? empleado.nombre : "Empleado no encontrado"}</TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => {
                                                                            setEmpleadosSeleccionados(
                                                                                empleadosSeleccionados.filter((empId) => empId !== id)
                                                                            );
                                                                        }}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <p className="text-center text-muted-foreground">
                                                No hay empleados seleccionados
                                            </p>
                                        )}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </div>
                        <FormField
                            control={form.control}
                            name="horainicial"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hora inicial</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="time" />
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
                                        <Input {...field} type="time" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="horas"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Horas (calculado automáticamente)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0" {...field} type="number" min="1" max="24" readOnly disabled
                                            className="bg-gray-100" value={calculatedHours} />
                                    </FormControl>
                                    <FormDescription>
                                        Horas calculadas automáticamente
                                    </FormDescription>
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
                            name="archivos"
                            render={({ field: { onChange, ...field } }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Evidencias (opcional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            multiple
                                            onChange={handleFileChange}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Puede subir múltiples evidencias de las horas extras (JPG, PNG o PDF)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {selectedFiles.length > 0 && (
                            <div className="col-span-2 mt-2">
                                <p className="text-sm font-medium mb-2">Archivos seleccionados ({selectedFiles.length}):</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center bg-gray-100 rounded-md p-2">
                                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 ml-1"
                                                onClick={() => removeFile(index)}
                                                type="button"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                                        <FormLabel>Prima</FormLabel>
                                        <FormDescription>
                                            Marcar si las horas extras fueron realizadas en dia de descanso
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