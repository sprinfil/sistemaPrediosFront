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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function ModalCrearOperador({ trigger }) {
  const formSchema = z
    .object({
      username: z.string().min(2, {
        message: "Username tiene que tener al menos 2 caracteres.",
      }),
      nombre_completo: z.string().min(2, {
        message: "El nombre completo tiene que tener al menos 2 caracteres.",
      }),
      password: z.string().min(2, {
        message: "La contraseña debe tener al menos 2 caracteres.",
      }),
      password_confirmation: z.string().min(2, {
        message: "Se debe confirmar la contraseña",
      }),
      rol: z.string().min(1, {
        message: "Se debe seleccionar un rol",
      }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: "Las contraseñas no coinciden",
      path: ["password_confirmation"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_completo: "",
    },
  })


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Crear Nuevo Operador</AlertDialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="select-none px-3 space-y-2 flex flex-col w-full max-h-[80vh] overflow-auto">
              <FormField
                control={form.control}
                name="nombre_completo"
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
              <FormField
                control={form.control}
                name="rol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un Rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Operador Valvulas</SelectItem>
                        <SelectItem value="2">Operador Predios</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Rol del operador
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 ml-auto items-center">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <Button type="submit">Aceptar</Button>
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
