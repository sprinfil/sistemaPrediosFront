import { Card } from '@/components/ui/card'
import React, { useState } from 'react'
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
import { ToastAction } from "@/components/ui/toast"
import { Loader } from '@/components/components/Loader'
import { FaUserCircle } from "react-icons/fa";
import { LoaderSecondary } from '@/components/components/LoaderSecondary'
import { login } from '@/lib/AuthService'
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast'

export const Login = () => {
  const navigate = useNavigate();
  const { token, setToken,setUser } = ZustandPrincipal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login(setLoading, values?.username, values?.password, setToken, setUser);
    } catch (e) {
      toast({
        title: 'Ocurrio un error',
        description: e?.response?.data?.data?.message,
        action: <ToastAction altText="Intenar de nuevo">Intenar de nuevo</ToastAction>,
      })
    }
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

            <Button type="submit" className='ml-auto' disabled={loading}>
              {
                loading ?
                  <><LoaderSecondary /></>
                  :
                  <></>
              }
              Iniciar Sesión
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}
