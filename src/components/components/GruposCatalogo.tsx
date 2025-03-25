import { toast } from "@/hooks/use-toast";
import {createData,deleteData,fetchData,updateData,} from "@/lib/CatalogoService";
import React, { useEffect, useState } from "react";
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { number, z } from "zod";
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { icons } from "@/constants/icons";
import { Loader } from "@/components/components/Loader";
import { FaArrowLeft } from "react-icons/fa";
import { ComboBoxReutilizable } from "@/components/components/ComboBoxReutilizable";
import { DataTableHeGrupos } from "./DataTableHeGrupos";
import { ModalReutilizable } from "./ModalRetuilizable";
import { getEmpleadosArray, getGruposid } from "@/lib/Solicitudes";
import { DataTableHeGruposEmpleados } from "./DataTableHEGruposEmpleados";

export const GruposCatalogo = () => {
  const [accion, setAccion] = useState("listado");
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const API_ENDPOINT = "/he-grupos";

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
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState<number[]>([]);
  const formSchema = z.object({
    nombre: z.string().optional(),
    id_he_area: z.number().optional(),
    empleado: z.number().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const { handleSubmit, trigger } = form;
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (accion === "ver" && selectedData?.empleados) {
      const empeladosids = selectedData.empleados.map((empleado) => empleado.id);
      setEmpleadosSeleccionados(empeladosids);
    }
  }, [selectedData, accion]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (accion == "crear") {
      const data = await createData(setLoading, 
        { ...values, empleados: empleadosSeleccionados }, 
        API_ENDPOINT, 
        toast
      );
      setSelectedData(data);
      setAccion("ver");
    }
    if (accion == "ver") {
      const data = await updateData(
        setLoading,
        { ...values, empleados: empleadosSeleccionados },
        API_ENDPOINT + "/" + selectedData?.id,
        toast
      );
      setSelectedData(data);
      setEditando(false);
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

  const validarEditandoFormStyles = (accion, editando) => {
    let styles = "";

    if (accion == "ver" && !editando) {
      styles = "pointer-events-none";
    }

    return styles;
  };

  const handleSave = async () => {
    const isValid = await trigger();
    if (isValid) {
      handleSubmit(onSubmit)();
    }
  };

  const handleDelete = async () => {
    await deleteData(setLoading, API_ENDPOINT + "/" + selectedData?.id, toast);
    setAccion("listado");
  };

  //METODOS EXTRA
  const [areasData, setAreasData] = useState([]);
  const [empleadosData,setEmpleadosData] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const fetchAreas = async () => {
    const response = await fetchData(
      setLoadingAreas,
      "/he-areas",
      toast
    );
    setAreasData(response);
  };

  const fetchEmpleados = async () => {
    const response = await fetchData(
      setLoadingAreas,
      "/he-empleados",
      toast
    );
    setEmpleadosData(response);
  };

  useEffect(() => {
    fetchAreas();
    fetchEmpleados();
  }, []);

  const handleAgregarEmpleado = () => {
    const empleadoSeleccionado = form.getValues('empleado');
    console.log(empleadoSeleccionado)
    if (empleadoSeleccionado && !empleadosSeleccionados.includes(empleadoSeleccionado)) {
      setEmpleadosSeleccionados(prev => [...prev, empleadoSeleccionado]);
    } else {
      toast({
        title: "Error",
        description: "Seleccione un empleado válido o ya agregado.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {accion == "ver" && (
        <>
          <div className="w-full flex items-center gap-3 mb-3">
            <Button
              onClick={() => {
                setAccion("listado");
              }}
            >
              <FaArrowLeft />
              Volver
            </Button>
            <ModalReutilizable
              trigger={
                <Button
                  disabled={loading}
                  variant={"outline"}
                  className="text-red-500"
                >
                  {icons.eliminar("")}
                </Button>
              }
              title={"¿Estas seguro?"}
              handleConfirm={() => {
                handleDelete();
              }}
            />

            {editando ? (
              <>
                <Button
                  disabled={loading}
                  onClick={() => {
                    handleSave();
                  }}
                >
                  Aceptar y guardar {icons.guardar("")}
                  {loading && <Loader />}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setEditando(true);
                  }}
                  variant={"outline"}
                >
                  {icons.editar("")}
                </Button>
              </>
            )}
          </div>
        </>
      )}
      <Card>
        <CardContent className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={`
                space-y-8 mt-5
                ${validarEditandoFormStyles(accion, editando)}
                `}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Comercial</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre Comercial" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id_he_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <>
                          <br />
                          <ComboBoxReutilizable
                            loading={loadingAreas}
                            placeholder="Area"
                            items={areasData}
                            accesorKey="nombre"
                            defaultValue={selectedData?.id_he_area}
                            setItem={(value) => {
                              form.setValue("id_he_area", value);
                            }}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="empleado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empleados</FormLabel>
                      <FormControl>
                        <>
                          <br />
                          <ComboBoxReutilizable
                            loading={loadingAreas}
                            placeholder="Empleado"
                            items={empleadosData}
                            accesorKey="nombre"
                            defaultValue={selectedData?.id_he_area}
                            setItem={(value) => {
                              form.setValue("empleado", value);
                            }}
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="button"
                  className="w-[33%] mt-auto mb-auto"
                  onClick={handleAgregarEmpleado}
                >
                  Agregar {icons.agregar("")}
                </Button>
                {/* {empleadosSeleccionados.length > 0 && (
                  <div className="col-span-full">
                    <p>Empleados seleccionados: {empleadosSeleccionados.join(', ')}</p>
                  </div>
                )} */}
              </div>

              {accion == "crear" && (
                <>
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
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      {accion == "ver" && (
        <div className="mt-3">
          <Empleados
            selectedData={selectedData}
            setSelectedData={selectedData}
            dataSelected={selectedData?.id}
            empleadosSeleccionados={empleadosSeleccionados}
            setEmpleadosSeleccionados={setEmpleadosSeleccionados}
          />
        </div>
      )}
    </>
  );
};

const Empleados = ({ selectedData,setSelectedData,dataSelected,empleadosSeleccionados,setEmpleadosSeleccionados }) => {
  const [loading, setLoading] = useState(false);
  const [data,setData] = useState([]);
  const API_ENDPOINT = "/he-grupos";
  
  useEffect(()=>{
    if(empleadosSeleccionados.length>0){
      get()
    }
  },[empleadosSeleccionados])

  const get = async () => {
    const data = await getEmpleadosArray(setLoading,empleadosSeleccionados,toast);
    setData(data);
  };

  return (
    <>
      <Card>
        <CardContent>
          <DataTableHeGruposEmpleados
            loading={loading}
            setLoading={setLoading}
            data={data}
            setData={setData}
            setSelectedData={selectedData}
            updateData={null}
            API_ENDPOINT={API_ENDPOINT}
            empleadosSeleccionados={empleadosSeleccionados}
            setEmpleadosSeleccionados={setEmpleadosSeleccionados}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default GruposCatalogo;