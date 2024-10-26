import { Card } from '@/components/ui/card'
import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
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
import ZustandPrincipal from '@/Zustand/ZustandPrincipal'
import { Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Loader } from '@/components/components/Loader'
import { FaUserCircle } from "react-icons/fa";

export const Login = () => {
  const navigate = useNavigate();
  const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(2).max(50)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    //TODO: IMPLEMENTAR SERVICIO DE INICIO DE SESION


    localStorage.setItem("TOKEN", "TOKEN_PRUEBA");
    navigate("/");
  }


  return (
    <div className='h-[100vh] w-full flex items-center justify-center'>
      <Card className='w-[600px]  p-5 shadow-md shadow-green-800'>
        <div className='w-full items-center  flex justify-center'>
          <FaUserCircle className='w-[100px] h-[100px] text-primary' />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full flex flex-col">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>
                    Username.
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Loader /> */}
            <Button type="submit" className='ml-auto'>Iniciar Sesión</Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}
