import { Button } from "@/components/ui/button";
import { PlusCircle, SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Loader } from "./Loader";
import dayjs from "dayjs";
import { getUsuariosVisitas } from "@/lib/Reportes";
import { DataTableVisitasUsuario } from "./DataTableVisitasUsuario";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
})

export function DatosFechaVisitasUsuario() {
    const [loading, setLoading] = useState(false);
    const [data,setData]=useState([]);
    const { toast } = useToast();

    const formSchema = z.object({
      fechaInicio: z.string().nonempty("La fecha inicial es obligatoria"),
      fechaFin: z
        .string()
        .nonempty("La fecha final es obligatoria")
        .refine(
          (value, context) => {
            const fechaInicio = dayjs(context?.parent?.fechaInicio).startOf("day").hour(8);
            const fechaFin = dayjs(value).startOf("day").hour(15);
            return fechaFin.isAfter(fechaInicio);
          },
          { message: "La fecha final debe ser mayor que la inicial" }
        ),
    });
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        fechaInicio: "",
        fechaFin: "",
      },
    });
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
          const fechaInicioConHora = `${values.fechaInicio} 08:00:00`;
          const fechaFinConHora = `${values.fechaFin} 17:00:00`;
          await getUsuariosVisitas(setLoading, {
            id_valvula: 496,
            date_from: fechaInicioConHora,
            date_to: fechaFinConHora,
        }, setData);
      } catch (e) {
        toast({
          title: "Error",
          description: "Ocurrió un error al buscar en esas fechas",
          variant: "destructive",
          action: <ToastAction altText="Aceptar">Aceptar</ToastAction>,
        });
      }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="w-full flex gap-4">
            <FormField
              name="fechaInicio"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col ml-1">
                  <FormLabel className="ml-[25%] text-sm font-medium text-gray-700">Fecha inicial</FormLabel>
                    <FormControl>
                        <input type="date" {...field} className="input" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}/>
            <FormField
              name="fechaFin"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col ml-11">
                  <FormLabel className="ml-[25%]  text-sm font-medium text-gray-700 items-center">Fecha final</FormLabel>
                    <FormControl>
                      <input type="date" {...field} className="input" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}/>
            <div>
              <Button className="w-50 mt-2 ml-5" type="submit" disabled={loading} >
                {loading && <Loader />}
                  Buscar <SearchIcon/>
              </Button>
            </div>
          </div>
        </form>
        <DataTableVisitasUsuario data={data} setData={setData}/>
      </Form>
    )
}
