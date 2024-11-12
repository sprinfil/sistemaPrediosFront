import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from '@/hooks/use-toast'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { crearOperador } from "@/lib/OperadorService"
import { useEffect, useRef, useState } from "react"
import { ToastAction } from "@/components/ui/toast"
import { Loader } from "./Loader"
import { LoaderSecondary } from "./LoaderSecondary"
import { Card } from "../ui/card"
import { fetchRoles, getRoles } from "@/lib/RolesService"

export function ModalCrearOperador({ trigger, setData }) {

  const [loading, setLoading] = useState();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { toast } = useToast();
  const cancelarButton = useRef();
  useEffect(() => {
    fetchRoles(setLoadingRoles, setRoles);
  }, []);

  const formSchema = z
    .object({
      username: z.string().min(2, {
        message: "Username tiene que tener al menos 2 caracteres.",
      }),
      name: z.string().min(2, {
        message: "El nombre completo tiene que tener al menos 2 caracteres.",
      }),
      password: z.string().min(2, {
        message: "La contraseña debe tener al menos 2 caracteres.",
      }),
      password_confirmation: z.string().min(2, {
        message: "Se debe confirmar la contraseña",
      }),
      // role: z.string().min(1, {
      //   message: "Se debe seleccionar un rol",
      // }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Las contraseñas no coinciden",
      path: ["password_confirmation"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    let valuesTemp = {
      ...values,
      email: `email${Date.now()}@hotmail.com`,
      roles: selectedRoles,
    };

    try {
      await crearOperador(setLoading, valuesTemp, setData);
      form.reset({
        username: '',
        name: '',
        password: '',
        password_confirmation: '',
        // role: ''
      });
      cancelarButton?.current?.click();
    }
    catch (e) {
      let data = e?.response?.data?.data
      let mensaje = "";
      for (const key in data) {
        if (data[key].length > 0) {
          mensaje += `${data[key][0]}\n`;
        }
      }
      toast({
        title: 'Ocurrio un error',
        description: mensaje,
        action: <ToastAction altText="Intenar de nuevo">Intenar de nuevo</ToastAction>,
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-[70%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear Nuevo Operador</AlertDialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4 select-none px-3 space-y-2 flex flex-col  w-full max-h-[80vh] overflow-auto">
              <div className="flex gap-4 w-full">
                <div className="w-[45%]">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre Completo" {...field} />
                        </FormControl>
                        <FormDescription>
                          Nombre Completo del operador
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormDescription>
                          Username para ingresar al sistema.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Contraseña" {...field} />
                        </FormControl>
                        <FormDescription>
                          Contraseña para ingresar al sistema
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repetir contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Repetir contraseña" {...field} />
                        </FormControl>
                        <FormDescription>
                          Repetir contraseña.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-[45%]">
                  {
                    loadingRoles ?
                      <>
                        <div className="flex h-full items-center justify-center">
                          <Loader />
                        </div>
                      </>
                      :
                      <>
                        <p className="mb-2">Roles</p>
                        {
                          roles?.map(rol => (
                            <Card className="py-1 px-2 flex items-center my-1">
                              <p>{rol?.name}</p>
                              <Checkbox className="ml-auto w-7 h-7"
                                onClick={() => {
                                  setSelectedRoles(prev => {
                                    if (prev.includes(rol?.name)) {
                                      return prev.filter(item => item !== rol?.name);
                                    } else {
                                      return [...prev, rol?.name];
                                    }
                                  });
                                }} />
                            </Card>
                          ))
                        }
                      </>
                  }

                </div>
              </div>

              <div className="flex gap-3 ml-auto items-center">
                <AlertDialogCancel ref={cancelarButton}>Cancelar</AlertDialogCancel>
                <Button type="submit"
                  disabled={loading}
                >
                  {loading ?
                    <>
                      <LoaderSecondary />
                    </>
                    :
                    <>
                    </>}
                  Aceptar
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogHeader>
        <AlertDialogFooter>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
