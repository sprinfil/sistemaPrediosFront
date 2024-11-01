import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { getStatus, updateCargaTrabajo } from "@/lib/PrediosCargaTrabajosService";
import { ModalConcluirCargaTrabajo } from "./ModalConcluirCargaTrabajo";
import { ModalCancelarCargaTrabajo } from "./ModalCancelarCargaTrabajo";
import { ComboBoxOperadores } from "./ComboBoxOperadores";
import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { IoIosSave } from "react-icons/io";
dayjs.extend(localizedFormat);
dayjs.locale('es');

const formSchema = z.object({
  nombre_carga: z.string().min(2).max(50),
  user_id: z.number(),
  fecha_asignacion: z.string().min(2).max(50),
  fecha_finalizacion: z.string().min(2).max(50),
  status: z.string(),
});

export function CargaTrabajoForm({ cargaTrabajo, setCargaTrabajo, setData }) {
  const [operadorSeleccionado, setOperadorSeleccionado] = useState(cargaTrabajo?.operador_asignado ?? {});
  const [loading, setLoading] = useState(false);
  let status = getStatus(cargaTrabajo?.status);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_carga: cargaTrabajo?.nombre_carga,
      user_id: operadorSeleccionado?.id ?? 0,
      fecha_asignacion: cargaTrabajo?.created_at
        ? dayjs(cargaTrabajo.created_at).format('D [de] MMMM [del] YYYY')
        : "",
      fecha_finalizacion: cargaTrabajo?.fecha_finalizacion
        ? dayjs(cargaTrabajo.fecha_finalizacion).format('D [de] MMMM [del] YYYY')
        : 'NO FINALIZADA',
      status: status,
    },
  });

  useEffect(() => { form.setValue('user_id', operadorSeleccionado?.id) }, [operadorSeleccionado])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let data =
    {
      user_id: values.user_id,
      nombre_carga: values.nombre_carga
    }
    try {
      await updateCargaTrabajo(setLoading, data, cargaTrabajo?.id, setCargaTrabajo, setData);
      toast({
        title: 'Exito',
        description: 'Cambios Guardados',
        action: <ToastAction altText="Aceptar">Aceptar</ToastAction>
      })
    }
    catch (e) {
      toast({
        title: 'Exito',
        description: e?.response?.data?.data?.message,
        action: <ToastAction altText="Aceptar">Aceptar</ToastAction>
      })
    }

  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="nombre_carga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la carga</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la carga" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operador Asignado</FormLabel>
                <FormControl>
                  <div>
                    <ComboBoxOperadores defualtOperador={operadorSeleccionado?.id} setOperador={setOperadorSeleccionado} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField

            control={form.control}
            name="fecha_asignacion"

            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de asignación</FormLabel>
                <FormControl>
                  <Input className="pointer-events-none" type="text"  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_finalizacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de finalización</FormLabel>
                <FormControl>
                  <Input className="pointer-events-none" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Estado" className="pointer-events-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {
            cargaTrabajo?.status == 0 ?
              <>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  <IoIosSave />
                  Guardar
                  {loading ? <><Loader /> </> : <></>}
                </Button>
              </> : <></>
          }

        </form>
      </Form>
    </>

  );
}
