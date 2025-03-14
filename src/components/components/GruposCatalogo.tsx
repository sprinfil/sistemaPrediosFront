import { DataTableProveedores } from "@/components/components/DataTableProveedores";
import { toast } from "@/hooks/use-toast";
import { createData, fetchData, updateData } from "@/lib/CatalogoService";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { icons } from "@/constants/icons";
import { Loader } from "@/components/components/Loader";
import { DataTableProductos } from "@/components/components/DataTableProductos";
import { Textarea } from "@/components/ui/textarea";
import { DataTableHeGrupos } from "@/components/components/DataTableHeGrupos";

export const GruposCatalogo = () => {
  const [accion, setAccion] = useState("listado");
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const API_ENDPOINT = "/products";

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (accion == "listado") {
      fetch();
    }
  }, [accion]);

  const fetch = async () => {
    const data = await fetchData(setLoadingData, API_ENDPOINT, toast);
    setData(data);
  };

  return (
    <>
      {accion == "listado" && (
        <DataTableHeGrupos
          data={data}
          loading={loadingData}
          setData={setData}
          setLoading={setLoadingData}
          setAccion={setAccion}
          setSelectedData={setSelectedData}
          API_ENDPOINT={API_ENDPOINT}
        />
      )}
      {(accion == "crear" || accion == "ver") && (
        <Formulario
          setAccion={setAccion}
          setSelectedData={setSelectedData}
          accion={accion}
          API_ENDPOINT={API_ENDPOINT}
          selectedData={selectedData}
        />
      )}
    </>
  );
};

const Formulario = ({
  setAccion,
  setSelectedData,
  accion,
  API_ENDPOINT,
  selectedData,
}) => {
  const [loading, setLoading] = useState(false);
  const formSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (accion == "crear") {
      const data = await createData(setLoading, values, API_ENDPOINT, toast);
      setSelectedData(data);
      setAccion("ver");
    }
    if (accion == "ver") {
      const data = await updateData(
        setLoading,
        values,
        API_ENDPOINT + "/" + selectedData?.id,
        toast
      );
      setSelectedData(data);
    }
  }

  useEffect(() => {
    if (selectedData) {
      for (const key in selectedData) {
        if (selectedData.hasOwnProperty(key)) {
          form.setValue(key, selectedData[key]);
        }
      }
    }
  }, [selectedData]);

  return (
    <>
      <Card>
        <CardContent className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripcion</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descripcion" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="mr-3"
                variant={"outline"}
                onClick={() => setAccion("listado")}
              >
                Cancelar
              </Button>
              <Button disabled={loading} type="submit">
                Aceptar {icons.guardar("")}
                {loading && <Loader />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
