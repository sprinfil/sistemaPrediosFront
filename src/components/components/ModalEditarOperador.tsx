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
import { crearOperador, editarOperador } from "@/lib/OperadorService"
import { useEffect, useRef, useState } from "react"
import { ToastAction } from "@/components/ui/toast"
import { Loader } from "./Loader"
import { LoaderSecondary } from "./LoaderSecondary"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { fetchRoles, getRoles } from "@/lib/RolesService"
import { ComboBoxReutilizable } from "./ComboBoxReutilizable"

export function ModalEditarOperador({ trigger, setData, operador }) {

  const [loading, setLoading] = useState();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState();
  const [selectedRoles, setSelectedRoles] = useState(operador?.roles.map(rol => rol?.name));
  const [modulos, setModulos] = useState([{ name: "Horas Extra" }, { name: "Predios y valvulas" }, { name: "administracion" }])
  const [selectedModulos, setSelectedModulos] = useState(operador?.modulos?.map(modulo => modulo?.name))
  const { toast } = useToast();
  const cancelarButton = useRef();
  // useEffect(() => {
  //   fetchRoles(setLoadingRoles, setRoles);
  // }, []);

  const formSchema = z
    .object({
      username: z.string().min(2, {
        message: "Username tiene que tener al menos 2 caracteres.",
      }),
      name: z.string().min(2, {
        message: "El nombre completo tiene que tener al menos 2 caracteres.",
      }),
      password: z.string().optional(),
      password_confirmation: z.string().optional(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Las contraseñas no coinciden",
      path: ["password_confirmation"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: operador?.name,
      username: operador?.username,
    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const addRoles = selectedRoles;
    const removeRoles = roles
      .filter(rol => !selectedRoles.includes(rol.name))
      .map(rol => rol.name);

    let valuesTemp = {
      ...values,
      email: `email${Date.now()}@hotmail.com`,
      add_roles: addRoles,
      remove_roles: removeRoles
    };

    try {
      await editarOperador(operador?.id, setLoading, valuesTemp, setData);
      // form.reset({
      //   username: '',
      //   name: '',
      //   password: '',
      //   password_confirmation: '',
      // });
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
      <AlertDialogTrigger asChild onClick={() => { fetchRoles(setLoadingRoles, setRoles); setSelectedRoles(operador?.roles.map(rol => rol?.name)); }}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="gap-1 select-none px-3 space-y-2 flex flex-col  w-full max-h-[80vh] overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Información principal
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="">
                      <p></p>
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
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Roles
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="">
                      {
                        loadingRoles ?
                          <>
                            <div className="flex h-full items-center justify-center">
                              <Loader />
                            </div>
                          </>
                          :
                          <>
                            {
                              roles?.map(rol => (
                                <Card className="py-1 px-2 flex items-center my-1">
                                  <p>{rol?.name}</p>
                                  <Checkbox className="ml-auto w-7 h-7"
                                    defaultChecked={selectedRoles.includes(rol?.name)}
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
                  </CardContent>
                </Card>

                {/* <Card>
                  <CardHeader>
                    <CardTitle>
                      Módulos del sistema
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="">
                      {
                        loadingRoles ?
                          <>
                            <div className="flex h-full items-center justify-center">
                              <Loader />
                            </div>
                          </>
                          :
                          <>
                            {
                              modulos?.map(modulo => (
                                <Card className="py-1 px-2 flex items-center my-1">
                                  <p>{modulo?.name}</p>
                                  <Checkbox className="ml-auto w-7 h-7"
                                    defaultChecked={selectedModulos?.includes(modulo?.name)}
                                    onClick={() => {
                                      setSelectedModulos(prev => {
                                        if (prev.includes(modulo?.name)) {
                                          return prev.filter(item => item !== modulo?.name);
                                        } else {
                                          return [...prev, modulo?.name];
                                        }
                                      });
                                    }} />
                                </Card>
                              ))
                            }
                          </>
                      }

                    </div>
                  </CardContent>
                </Card> */}


              </div>


              <div className="flex gap-3 ml-auto items-center">
                <AlertDialogCancel ref={cancelarButton} onClick={() => { setSelectedRoles([]) }}>Cancelar</AlertDialogCancel>
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
