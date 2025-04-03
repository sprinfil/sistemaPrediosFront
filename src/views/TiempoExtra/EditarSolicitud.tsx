import React, { useState, useEffect } from 'react'
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card";
import {Breadcrumb,BreadcrumbItem,BreadcrumbLink,BreadcrumbList,BreadcrumbPage,BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useSolicitudVerHook } from '@/lib/HoraExtraVerHook';
import { Skeleton } from '@/components/ui/skeleton';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { Edit, Check, X, Save, ArrowLeft, Loader, CheckCircle, XCircle } from "lucide-react"
import { editarSolicitud } from '@/lib/Solicitudes';
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  empleado: z.string().or(z.array(z.string())).optional(),
  hora_inicio: z.string().min(1, "La hora inicial es obligatoria"),
  hora_fin: z.string().min(1, "La hora final es obligatoria"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  horas: z.string()
    .min(1, { message: "Las horas son obligatorias" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un número" })
    .refine((val) => Number(val) > 0, { message: "Las horas deben ser mayores a 0" })
    .refine((val) => Number(val) <= 24, { message: "Las horas no pueden ser más de 24" }),
  prima_dominical: z.boolean().default(false),
  dias_festivos: z.boolean().default(false),
  descripcion: z.string()
    .min(1, { message: "La descripción debe tener al menos 1 caracteres" })
    .max(500, { message: "La descripción no puede exceder los 500 caracteres" }),
  archivos: z.any().optional(),
  }).refine((data) => {
  const startTime = data.hora_inicio;
  const endTime = data.hora_fin;
  
  if (startTime && endTime) {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    if (startHour < endHour) return true;
    if (startHour === endHour && startMinute < endMinute) return true;
    return false;
  }
  return true;
  }, {
  message: "La hora final debe ser posterior a la hora inicial",
  path: ["hora_fin"]
});

export const EditarSolicitud = () => {
  const navigate = useNavigate();
  const {
    solicitudId,
    fetchArea,
    setSolicitud,
    solicitud,
    loadingArea,
    datoForm,
    setDatosForm,
    userID
  } = useSolicitudVerHook();
  
  const [loading, setLoading] = useState(false);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  useEffect(() => {
    if (solicitud && solicitud.empleados) {
      setEmpleados(solicitud.empleados);
    }
  }, [solicitud]);

  useEffect(() => {
    if (solicitud) {
      if (solicitud.archivos && Array.isArray(solicitud.archivos) && solicitud.archivos.length > 0) {
        const existingFiles = solicitud.archivos.map(archivo => {
          return {
            name: archivo.nombre || archivo.name || 'archivo',
            url: archivo.url || archivo.ruta,
            isExisting: true, 
            id: archivo.id || null
          };
        });
        setSelectedFiles(existingFiles);
      }
    }
  }, [solicitud]);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
      defaultValues: {
        empleado: "",
        archivos:"",
        hora_inicio: solicitud?.hora_inicio || "",
        hora_fin: solicitud?.hora_fin || "",
        fecha: solicitud?.fecha || "",
        horas: solicitud?.horas?.toString() || "",
        prima_dominical: solicitud?.prima_dominical || false,
        dias_festivos: solicitud?.dias_festivos || false,
        descripcion: solicitud?.descripcion || "",
      },
  });
    
  const handleGuardarCambios = async () => {
    setLoading(true);
    try {
      const idSolicitud = solicitud.id;
      const formValues = datoForm;
      const formData = new FormData();
      formData.append('descripcion', formValues.descripcion);
      formData.append('prima_dominical', formValues.prima_dominical ? '1' : '');
      formData.append('dias_festivos', formValues.dias_festivos ? '1' : '');
      formData.append('horas', formValues.horas);
      formData.append('hora_inicio', formValues.hora_inicio);
      formData.append('hora_fin', formValues.hora_fin);
      formData.append('fecha', formValues.fecha);
      const existingFileIds = selectedFiles
        .filter(file => file.isExisting && file.id)
        .map(file => file.id);
      if (existingFileIds.length > 0) {
        formData.append('archivos_existentes', JSON.stringify(existingFileIds));
      }
      selectedFiles
        .filter(file => !file.isExisting)
        .forEach((file, index) => {
          formData.append(`archivos[${index}]`, file);
        });
      await editarSolicitud(
        idSolicitud,
        setLoading, 
        formData,
        setSolicitud
      );
      toast({
        title: "Cambios guardados",
        description: "La solicitud ha sido actualizada correctamente",
        action: <ToastAction altText="Aceptar">Aceptar</ToastAction>
      });
      setCambiosPendientes(false);
      navigate(-1);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al actualizar la solicitud",
        variant: "destructive",
        action: <ToastAction altText="Aceptar">Aceptar</ToastAction>
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfirmarSolicitud = async () => {
    setLoading(true);
    try {
      let nuevoEstado = '';
      // if(solicitud.id_user_solicitante !== userID){
      // }else{
      // }
      if (solicitud.etapa === 'solicitud') {
        nuevoEstado = 'aprobada';
      } else if (solicitud.etapa === 'trabajando') {
        nuevoEstado = 'terminado';
      }else if (solicitud.etapa === 'pago') {
        nuevoEstado = 'pagado';
      } 
      const values = {
        nuevo_estado: nuevoEstado
      };
      await editarSolicitud(
        solicitud.id,
        setLoading,
        values,
        (responseData) => {
          setSolicitud({...solicitud, estado: nuevoEstado});
          toast({
            title: "Éxito",
            description: `Solicitud ${nuevoEstado} correctamente`,
          });
          navigate(-1);
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la solicitud",
        variant: "destructive",
      });
      console.error(error);
      } finally {
        setLoading(false);
      }
  };
    
  const handleRechazarSolicitud = async () => {
    if (!motivoRechazo.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar un motivo de rechazo",
        variant: "destructive",
      });
        return;
    }
    setLoading(true);
    try {
      let nuevoEstado = 'rechazado';
      if(solicitud.id_user_solicitante !== userID){
        if (solicitud.etapa === 'solicitud') {
          nuevoEstado = 'rechazado';
        } else if (solicitud.etapa === 'pago') {
          nuevoEstado = 'rechazado';
        }
      }
      else{
        if (solicitud.etapa === 'solicitud') {
          nuevoEstado = 'cancelado';
        } else if (solicitud.etapa === 'trabajando') {
          nuevoEstado = 'cancelado';
        }
      }
      const values = {
        nuevo_estado: nuevoEstado,
        motivo: motivoRechazo
      };
      await editarSolicitud(
        solicitud.id,
        setLoading,
        values,
        (responseData) => {
          setSolicitud({...solicitud, estado: responseData.estado, motivo: motivoRechazo});
          setIsRejectDialogOpen(false);
          toast({
            title: "Éxito",
            description: "Solicitud rechazada correctamente",
          });
          navigate(-1);
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la solicitud",
        variant: "destructive",
      });
      console.error(error);
      } finally {
        setLoading(false);
      }
  };
    
  return (
    <>
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Editar solicitud</CardTitle>
          <CardDescription>
            Modifique los campos necesarios y guarde los cambios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {
            loadingArea ?
              <div>
                <Skeleton
                  className='w-full h-[70vh]'
                />
              </div>
              :
              <>
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
                  <DatosEditarSolicitud
                    form={form}
                    solicitud={solicitud}
                    setSolicitud={setSolicitud}
                    onCambiosPendientes={(hayCambios) => setCambiosPendientes(hayCambios)}
                    handleGuardarCambios={handleGuardarCambios}
                    loading={loading}
                    cambiosPendientes={cambiosPendientes}
                    setDatosForm={setDatosForm}
                    datoForm={datoForm}
                    handleConfirmarSolicitud={handleConfirmarSolicitud}
                    setIsRejectDialogOpen={setIsRejectDialogOpen}
                    userID={userID}
                    empleados={empleados}
                    setSelectedFiles={setSelectedFiles}
                    selectedFiles={selectedFiles}
                  />
                </div>
              </>
          }
        </CardContent>
      </Card>
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar solicitud</DialogTitle>
            <DialogDescription>
              Indique el motivo del rechazo / cancelación de esta solicitud.
            </DialogDescription>
          </DialogHeader>
          <Textarea 
            placeholder="Motivo de rechazo..." 
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
            className="resize-none" 
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRechazarSolicitud} disabled={loading}>
              {loading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const DatosEditarSolicitud = ({ 
  solicitud, 
  setSolicitud, 
  onCambiosPendientes, 
  handleGuardarCambios, 
  loading, 
  cambiosPendientes, 
  datoForm, 
  setDatosForm,
  handleConfirmarSolicitud,
  setIsRejectDialogOpen,
  userID,
  empleados,
  setSelectedFiles,
  selectedFiles
}) => {
  type FormValues = z.infer<typeof formSchema>;
  const [isEditing, setIsEditing] = useState(false);
  const userDif = solicitud.id_user_solicitante != userID;
  const disponible = solicitud.etapa === 'solicitud';
  
  const getSelectedEmployeeIds = () => {
    if (!solicitud.empleados) return [];
    if (Array.isArray(solicitud.empleados)) {
      return solicitud.empleados.map(emp => emp.id.toString());
    }
    return [];
  };
  
  const handleFileChange = (event) => {
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
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      onCambiosPendientes(true);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    onCambiosPendientes(true);
  };

  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return "";
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    const decimalHours = hours + (minutes / 60);
    return Math.ceil(decimalHours).toString();
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empleado: getSelectedEmployeeIds()[0] || "",
      hora_inicio: solicitud?.hora_inicio || "",
      hora_fin: solicitud?.hora_fin || "",
      fecha: solicitud?.fecha || "",
      horas: solicitud?.horas?.toString() || "",
      prima_dominical: solicitud?.prima_dominical || false,
      dias_festivos: solicitud?.dias_festivos || false,
      descripcion: solicitud?.descripcion || "",
    },
  });
  
  const [valoresOriginales, setValoresOriginales] = useState({
    empleado: getSelectedEmployeeIds()[0] || "",
    hora_inicio: solicitud?.hora_inicio || "",
    hora_fin: solicitud?.hora_fin || "",
    fecha: solicitud?.fecha || "",
    horas: solicitud?.horas?.toString() || "",
    prima_dominical: solicitud?.prima_dominical || false,
    dias_festivos: solicitud?.dias_festivos || false,
    descripcion: solicitud?.descripcion || "",
  });
  
  useEffect(() => {
    if (solicitud) {
      form.reset({
        empleado: getSelectedEmployeeIds()[0] || "",
        hora_inicio: solicitud?.hora_inicio || "",
        hora_fin: solicitud?.hora_fin || "",
        fecha: solicitud?.fecha || "",
        horas: solicitud?.horas?.toString() || "",
        prima_dominical: solicitud?.prima_dominical || false,
        dias_festivos: solicitud?.dias_festivos || false,
        descripcion: solicitud?.descripcion || "",
      });
      setValoresOriginales({
        empleado: getSelectedEmployeeIds()[0] || "",
        hora_inicio: solicitud?.hora_inicio || "",
        hora_fin: solicitud?.hora_fin || "",
        fecha: solicitud?.fecha || "",
        horas: solicitud?.horas?.toString() || "",
        prima_dominical: solicitud?.prima_dominical || false,
        dias_festivos: solicitud?.dias_festivos || false,
        descripcion: solicitud?.descripcion || "",
      });
    }
  }, [solicitud]);
  
  useEffect(() => {
    if (isEditing) {
      const startTime = form.watch('hora_inicio');
      const endTime = form.watch('hora_fin');
      if (startTime && endTime) {
        const calculatedHours = calculateHours(startTime, endTime);
        if (calculatedHours && Number(calculatedHours) > 0) {
          form.setValue('horas', calculatedHours);
        }
      }
    }
  }, [form.watch('hora_inicio'), form.watch('hora_fin'), isEditing]);
  
  useEffect(() => {
    const currentValues = form.getValues();
    const initialFilesLength = solicitud?.archivos?.length || 0;
    const filesHaveChanged = selectedFiles.length !== initialFilesLength || 
      selectedFiles.some(file => !file.isExisting);
    const hasCambiosPendientes = 
      currentValues.empleado !== valoresOriginales.empleado ||
      currentValues.hora_inicio !== valoresOriginales.hora_inicio ||
      currentValues.hora_fin !== valoresOriginales.hora_fin ||
      currentValues.fecha !== valoresOriginales.fecha ||
      currentValues.horas !== valoresOriginales.horas ||
      currentValues.prima_dominical !== valoresOriginales.prima_dominical ||
      currentValues.dias_festivos !== valoresOriginales.dias_festivos ||
      currentValues.descripcion !== valoresOriginales.descripcion ||
      filesHaveChanged;
    onCambiosPendientes(hasCambiosPendientes);
    setDatosForm(currentValues);
  }, [form.watch(), selectedFiles]);
  
  const handleToggleEdit = () => {
    if (isEditing) {
      form.trigger().then(isValid => {
        if (isValid) {
          setValoresOriginales({
            empleado: form.getValues('empleado'),
            hora_inicio: form.getValues('hora_inicio'),
            hora_fin: form.getValues('hora_fin'),
            fecha: form.getValues('fecha'),
            horas: form.getValues('horas'),
            prima_dominical: form.getValues('prima_dominical'),
            dias_festivos: form.getValues('dias_festivos'),
            descripcion: form.getValues('descripcion'),
          });
          const selectedEmployeeId = form.getValues('empleado');
          const selectedEmployee = empleados.find(e => e.id.toString() === selectedEmployeeId);
          if (setSolicitud) {
            setSolicitud({
              ...solicitud,
              empleados_trabajador: selectedEmployee || null,
              hora_inicio: form.getValues('hora_inicio'),
              hora_fin: form.getValues('hora_fin'),
              fecha: form.getValues('fecha'),
              horas: Number(form.getValues('horas')),
              prima_dominical: form.getValues('prima_dominical') ? 1 : null,
              dias_festivos: form.getValues('dias_festivos') ? 1 : null,
              descripcion: form.getValues('descripcion'),
            });
          }
          setIsEditing(false);
        }
      });
    } else {
      setIsEditing(true);
    }
  };
  
  const handleCancelEdit = () => {
    form.reset({
      ...form.getValues(),
      empleado: valoresOriginales.empleado,
      hora_inicio: valoresOriginales.hora_inicio,
      hora_fin: valoresOriginales.hora_fin,
      fecha: valoresOriginales.fecha,
      horas: valoresOriginales.horas,
      prima_dominical: valoresOriginales.prima_dominical,
      dias_festivos: valoresOriginales.dias_festivos,
      descripcion: valoresOriginales.descripcion,
    });
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleConfirmarSolicitud(solicitud)}
            disabled={loading}
          >
            {loading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Aceptar
          </Button>
          <Button 
            variant="destructive"
            onClick={() => setIsRejectDialogOpen(true)}
            disabled={loading}
          >
            <XCircle className="mr-2 h-4 w-4" />
            {userDif ? "Rechazar" : "Cancelar"}
          </Button>
        </div>
        {!isEditing ? (
          <Button 
            onClick={handleToggleEdit}
            variant="outline"
          >
            <Edit className="mr-2 h-4 w-4" /> Editar
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCancelEdit}
            >
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button 
              onClick={handleGuardarCambios}
              disabled={!cambiosPendientes || loading}
            >
              {loading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar cambios
            </Button>
          </div>
        )}
      </div>
      <Form {...form}>
        <form className="w-[95%] space-y-4">
          <div className="w-full mb-3">
            <div className='text-center mb-5'>
              <p className='text-[25px]'>{!disponible ? "Solo se pueden agregar archivos en esta etapa" : ""}</p>
            </div>
            <FormField
              control={form.control}
              name="empleado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2">Empleados Asignados</FormLabel>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50">
                    {solicitud?.empleados && solicitud.empleados.length > 0 ? (
                      solicitud.empleados.map((empleado) => (
                        <Badge key={empleado.id} variant="outline" className="py-1 px-2">
                          {empleado.nombre} - {empleado.puesto}
                        </Badge>
                      ))
                    ) : solicitud?.empleados_trabajador ? (
                      Array.isArray(solicitud.empleados_trabajador) ? (
                        solicitud.empleados_trabajador.map(empleado => (
                          <Badge key={empleado.id} variant="outline" className="py-1 px-2">
                            {empleado.nombre}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="py-1 px-2">
                          {solicitud.empleados_trabajador.nombre}
                        </Badge>
                      )
                    ) : (
                      <span className="text-gray-500">No hay empleados asignados</span>
                    )}
                  </div>
                  <Input 
                    type="hidden" 
                    {...field} 
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex items-end space-x-4 mb-5">
            <div className="w-full space-y-1.5">
              <FormField
                control={form.control}
                name="hora_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora inicial</FormLabel>
                    <FormControl>
                      <Input 
                        type="time"
                        {...field}
                        disabled={!isEditing || !disponible}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-8">a</div>
            <div className="w-full space-y-1.5">
              <FormField
                control={form.control}
                name="hora_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora final</FormLabel>
                    <FormControl>
                      <Input 
                        type="time"
                        {...field}
                        disabled={!isEditing  || !disponible}
                        className={!isEditing ? 'bg-gray-50' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full mb-5">
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      {...field}
                      disabled={!isEditing  || !disponible}
                      className={!isEditing ? 'bg-gray-50' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-5">
            <div className="flex space-x-8">
              <div className="space-y-1.5">
                <FormField
                  control={form.control}
                  name="horas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horas</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0"
                          {...field}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-gray-50 w-32' : 'w-32'}
                          readOnly={isEditing}
                        />
                      </FormControl>
                      <FormDescription>
                        La hora es calculada automáticamente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4 space-y-2">
                <FormField
                  control={form.control}
                  name="prima_dominical"
                  render={({ field }) => (
                    <FormItem className="flex space-x-2 items-center">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isEditing || !disponible}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Prima dominical</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dias_festivos"
                  render={({ field }) => (
                    <FormItem className="flex space-x-2 items-center">
                      <FormControl>
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!isEditing  || !disponible}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Día festivo</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción..." 
                      {...field}
                      disabled={!isEditing  || !disponible}
                      className={!isEditing ? 'bg-gray-50 resize-none' : 'resize-none'}
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
                      disabled={!isEditing}
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
                          disabled={!isEditing}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </form>
      </Form>
    </>
  )
}
