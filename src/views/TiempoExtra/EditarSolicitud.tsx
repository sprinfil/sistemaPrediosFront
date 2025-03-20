import React, { useState, useEffect } from 'react'
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card";
import {Breadcrumb,BreadcrumbItem,BreadcrumbLink,BreadcrumbList,BreadcrumbPage,BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import { useNavigate, useParams } from 'react-router-dom';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { icons } from '@/constants/icons';
import { useHoraExtraVerHook, useSolicitudVerHook } from '@/lib/HoraExtraVerHook';
import { Skeleton } from '@/components/ui/skeleton';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { Edit, Check, X, Save, ArrowLeft, Loader } from "lucide-react"
import { editarSolicitud } from '@/lib/Solicitudes';

export const EditarSolicitud = () => {
  const navigate = useNavigate();
  const {
    solicitudId,
    fetchArea,
    setSolicitud,
    solicitud,
    loadingArea
  } = useSolicitudVerHook();

  const [loading, setLoading] = useState(false);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);

  const handleGuardarCambios = async () => {
    setLoading(true);
    try {
        const idSolicitud = solicitud.id;
        const formValues = form.getValues();

        const requestData = {
            hora_inicio: formValues.hora_inicio,
            hora_fin: formValues.hora_fin,
            fecha: formValues.fecha,
            horas: Number(formValues.horas),
            prima_dominical: formValues.prima_dominical ? 1 : null,
            dias_festivos: formValues.dias_festivos ? 1 : null,
            descripcion: formValues.descripcion,
        };
        console.log("", requestData)
        // await editarSolicitud(
        //     idSolicitud,
        //     setLoading,
        //     requestData,
        //     setSolicitud
        // );
        toast({
            title: "Cambios guardados",
            description: "La solicitud ha sido actualizada correctamente",
            action: <ToastAction altText="Aceptar">Aceptar</ToastAction>
        });
        setCambiosPendientes(false);
        navigate(-1);
    } catch (error: any) {
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
                    solicitud={solicitud}
                    setSolicitud={setSolicitud}
                    onCambiosPendientes={(hayCambios) => setCambiosPendientes(hayCambios)}
                  />
                </div>
              </>
          }
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
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
        </CardFooter>
      </Card>
    </>
  )
}

const formSchema = z.object({
  empleado: z.string().min(1, "El empleado es obligatorio"),
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
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(500, { message: "La descripción no puede exceder los 500 caracteres" }),
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

const DatosEditarSolicitud = ({ solicitud, setSolicitud, onCambiosPendientes }) => {
  type FormValues = z.infer<typeof formSchema>;
  
  const [editableFields, setEditableFields] = useState({
    horario: false,
    fecha: false,
    horas: false,
    descripcion: false
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empleado: solicitud?.empleados_trabajador?.nombre || "",
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
    hora_inicio: solicitud?.hora_inicio || "",
    hora_fin: solicitud?.hora_fin || "",
    fecha: solicitud?.fecha || "",
    horas: solicitud?.horas?.toString() || "",
    prima_dominical: solicitud?.prima_dominical || false,
    dias_festivos: solicitud?.dias_festivos || false,
    descripcion: solicitud?.descripcion || "",
  });
  
  useEffect(() => {
    const currentValues = form.getValues();
    const hasCambiosPendientes = 
      currentValues.hora_inicio !== valoresOriginales.hora_inicio ||
      currentValues.hora_fin !== valoresOriginales.hora_fin ||
      currentValues.fecha !== valoresOriginales.fecha ||
      currentValues.horas !== valoresOriginales.horas ||
      currentValues.prima_dominical !== valoresOriginales.prima_dominical ||
      currentValues.dias_festivos !== valoresOriginales.dias_festivos ||
      currentValues.descripcion !== valoresOriginales.descripcion;
    onCambiosPendientes(hasCambiosPendientes);
  }, [form.watch()]);
  
  const handleEditField = (field) => {
    setEditableFields({
      ...editableFields,
      [field]: true,
    });
  };
  
  const handleCancelEdit = (field) => {
    switch(field) {
      case 'horario':
        form.setValue('hora_inicio', valoresOriginales.hora_inicio);
        form.setValue('hora_fin', valoresOriginales.hora_fin);
        break;
      case 'fecha':
        form.setValue('fecha', valoresOriginales.fecha);
        break;
      case 'horas':
        form.setValue('horas', valoresOriginales.horas);
        form.setValue('prima_dominical', valoresOriginales.prima_dominical);
        form.setValue('dias_festivos', valoresOriginales.dias_festivos);
        break;
      case 'descripcion':
        form.setValue('descripcion', valoresOriginales.descripcion);
        break;
    }
    
    setEditableFields({
      ...editableFields,
      [field]: false,
    });
  };
  
  const handleAcceptEdit = (field) => {
    form.trigger(field === 'horario' ? ['hora_inicio', 'hora_fin'] : field);
    if (field === 'horario' && (form.formState.errors.hora_inicio || form.formState.errors.hora_fin)) {
      return;
    } else if (form.formState.errors[field]) {
      return; 
    }
    
    if (field === 'horario') {
      setValoresOriginales({
        ...valoresOriginales,
        hora_inicio: form.getValues('hora_inicio'),
        hora_fin: form.getValues('hora_fin'),
      });
    } else if (field === 'horas') {
      setValoresOriginales({
        ...valoresOriginales,
        horas: form.getValues('horas'),
        prima_dominical: form.getValues('prima_dominical'),
        dias_festivos: form.getValues('dias_festivos'),
      });
    } else {
      setValoresOriginales({
        ...valoresOriginales,
        [field]: form.getValues(field),
      });
    }
    
    setEditableFields({
      ...editableFields,
      [field]: false,
    });
    
    if (setSolicitud) {
      setSolicitud({
        ...solicitud,
        hora_inicio: form.getValues('hora_inicio'),
        hora_fin: form.getValues('hora_fin'),
        fecha: form.getValues('fecha'),
        horas: Number(form.getValues('horas')),
        prima_dominical: form.getValues('prima_dominical') ? 1: null,
        dias_festivos: form.getValues('dias_festivos') ? 1: null,
        descripcion: form.getValues('descripcion'),
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="w-[95%] space-y-4">
          <div className="w-full mb-3">
            <FormField
              control={form.control}
              name="empleado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empleado</FormLabel>
                  <FormControl>
                    <Input 
                      className='pointer-events-none bg-gray-50' 
                      {...field} 
                      disabled 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex items-end space-x-4 mb-5 relative">
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
                        disabled={!editableFields.horario}
                        className={!editableFields.horario ? 'bg-gray-50' : ''}
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
                        disabled={!editableFields.horario}
                        className={!editableFields.horario ? 'bg-gray-50' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="absolute -right-12 top-8">
              {!editableFields.horario ? (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleEditField('horario')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleCancelEdit('horario')}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleAcceptEdit('horario')}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="w-full mb-5 relative">
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
                      disabled={!editableFields.fecha}
                      className={!editableFields.fecha ? 'bg-gray-50' : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="absolute -right-12 top-8">
              {!editableFields.fecha ? (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleEditField('fecha')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleCancelEdit('fecha')}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleAcceptEdit('fecha')}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="mb-5 relative">
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
                          disabled={!editableFields.horas}
                          className={!editableFields.horas ? 'bg-gray-50 w-32' : 'w-32'}
                        />
                      </FormControl>
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
                          disabled={!editableFields.horas}
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
                          disabled={!editableFields.horas}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Día festivo</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="absolute -right-12 top-8">
              {!editableFields.horas ? (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleEditField('horas')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleCancelEdit('horas')}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleAcceptEdit('horas')}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="relative">
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
                      disabled={!editableFields.descripcion}
                      className={!editableFields.descripcion ? 'bg-gray-50 resize-none' : 'resize-none'}
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
            <div className="absolute -right-12 top-8">
              {!editableFields.descripcion ? (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => handleEditField('descripcion')}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleCancelEdit('descripcion')}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleAcceptEdit('descripcion')}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}