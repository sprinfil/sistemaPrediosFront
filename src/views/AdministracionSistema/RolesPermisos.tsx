import { DataTableProveedores } from "@/components/components/DataTableProveedores";
import { toast } from "@/hooks/use-toast";
import {
  createData,
  deleteData,
  fetchData,
  updateData,
} from "@/lib/CatalogoService";
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
import { FaLeftLong, FaLeftRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { ModalReutilizable } from "@/components/components/ModalRetuilizable";
import { ComboBoxReutilizable } from "@/components/components/ComboBoxReutilizable";
import { ProductosProveedores } from "@/components/components/ProductosProveedores";
import { DataTableRolesPermisos } from "@/components/components/DataTableRolesPermisos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export const RolesPermisos = () => {
  const [accion, setAccion] = useState("listado");
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const API_ENDPOINT = "/roles";
  const [addPermissons, setAddPermissons] = useState([]);
  const [removePermissions, setRemovePermissions] = useState([]);

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
      <Card>
        <CardHeader>
          <CardTitle>
            Roles y permisos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {accion == "listado" && (
            <DataTableRolesPermisos
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
              addPermissions={addPermissons}
              setAddPermissions={setAddPermissons}
              removePermissions={removePermissions}
              setRemovePermissions={setRemovePermissions}
            />
          )}
        </CardContent>
      </Card>

    </>
  );
};

const Formulario = ({
  setAccion,
  setSelectedData,
  accion,
  API_ENDPOINT,
  selectedData,
  addPermissions,
  setAddPermissions,
  removePermissions,
  setRemovePermissions
}) => {
  const [loading, setLoading] = useState(false);
  const formSchema = z.object({
    name: z.string().optional(),

  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const { handleSubmit, trigger } = form;
  const [editando, setEditando] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (accion == "crear") {
      const data = await createData(setLoading, values, API_ENDPOINT, toast);
      setSelectedData(data);
      setAccion("ver");
    }
    if (accion == "ver") {
      let valest = {
        ...values,
        add_permissions: addPermissions,
        remove_permissions: removePermissions
      }
      const data = await updateData(
        setLoading,
        valest,
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

  return (
    <>
      {accion == "ver" && (
        <>
          <div className="w-full flex items-center gap-3 mb-3">
            <Button
              onClick={() => {
                setAccion("listado");
                setAddPermissions([]);
                setRemovePermissions([]);
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          <Permisos
            selectedData={selectedData}
            addPermissions={addPermissions}
            setAddPermissions={setAddPermissions}
            removePermissions={removePermissions}
            setRemovePermissions={setRemovePermissions}
            editando={editando}
          />
        </div>
      )}
    </>
  );
};

const Permisos = ({ selectedData, addPermissions, setAddPermissions, removePermissions, setRemovePermissions, editando }) => {
  return (
    <>
      <Card>

        <CardContent>
          <Tabs defaultValue="horasExtra" className="w-full mt-3">
            <TabsList>
              <TabsTrigger value="administracion">Administración del sistema</TabsTrigger>
              <TabsTrigger value="horasExtra">Horas Extra</TabsTrigger>
              <TabsTrigger value="valvulasPredios">Válvulas y predios</TabsTrigger>
            </TabsList>
            <TabsContent value="horasExtra">
              <PermisosHorasExtra
                selectedData={selectedData}
                addPermissions={addPermissions}
                setAddPermissions={setAddPermissions}
                removePermissions={removePermissions}
                setRemovePermissions={setRemovePermissions}
                editando={editando}
              />
            </TabsContent>
            <TabsContent value="valvulasPredios">
              <PermisosValvulasPredios
                selectedData={selectedData}
                addPermissions={addPermissions}
                setAddPermissions={setAddPermissions}
                removePermissions={removePermissions}
                setRemovePermissions={setRemovePermissions}
                editando={editando}
              />
            </TabsContent>
            <TabsContent value="administracion">
              <PermisosAdministracion
                selectedData={selectedData}
                addPermissions={addPermissions}
                setAddPermissions={setAddPermissions}
                removePermissions={removePermissions}
                setRemovePermissions={setRemovePermissions}
                editando={editando}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}
const PermisosHorasExtra = ({
  selectedData,
  addPermissions,
  setAddPermissions,
  removePermissions,
  setRemovePermissions,
  editando
}) => {
  const tdStyles = "flex items-center"
  const trStyles = "flex items-center "

  const estructuraPermisos =
    [
      {
        title: "Módulo",
        permisos:
          [
            {
              titulo: "Activar / Desactivar Horas Extra",
              permission: "MostrarModuloHorasExtra"
            },
          ]
      },
      // {
      //   title: "Opciones del menu",
      //   permisos:
      //     [
      //       {
      //         titulo: "Solicitudes",
      //         permission: "MenuVerSolicitudes"
      //       },
      //       {
      //         titulo: "Horas extra",
      //         permission: "MenuVerHorasExtra"
      //       },
      //       {
      //         titulo: "Grupos",
      //         permission: "MenuVerGrupos"
      //       }
      //     ]
      // },
      {
        title: "Solicitudes",
        permisos:
          [
            {
              titulo: "Crear",
              permission: "CrearSolicitudes"
            },
            {
              titulo: "Editar",
              permission: "EditarSolicitudes"
            },
            {
              titulo: "Eliminar",
              permission: "EliminarSolicitudes"
            },
            {
              titulo: "Consultar",
              permission: "ConsultarSolicitudes"
            },
            {
              titulo: "Cambiar etapa",
              permission: "CambiarEtapaSolicitudes"
            },
            {
              titulo: "Subir documentación",
              permission: "SubirDocumentacionSolicitudes"
            }
          ]
      },
      {
        title: "Grupos",
        permisos:
          [
            {
              titulo: "Crear",
              permission: "storeGrupo"
            },
            {
              titulo: "Editar",
              permission: "updateGrupo"
            },
            {
              titulo: "Eliminar",
              permission: "deleteGrupo"
            },
            {
              titulo: "Consultar",
              permission: "indexGrupo"
            },
          ]
      },
    ]

  const AgregarQuitarPermiso = (nombre) => {
    if (selectedData?.permissions?.some(permisot => permisot?.name == nombre)) {
      setRemovePermissions(prev => {
        if (prev?.find(permisot => permisot == nombre)) {
          return prev?.filter(permisot => permisot != nombre)
        } else {
          return [
            ...prev,
            nombre
          ]
        }
      })
    } else {
      setAddPermissions(prev => {
        if (prev?.find(permisot => permisot == nombre)) {
          return prev?.filter(permisot => permisot != nombre)
        } else {
          return [
            ...prev,
            nombre
          ]
        }
      })
    }
  }


  return (
    <>
      <Accordion type="multiple" collapsible defaultValue={["item-0"]}>
        {
          estructuraPermisos?.map((estructura, index) => {

            return (
              <AccordionItem value={"item-" + index} key={index}>
                <AccordionTrigger>{estructura?.title}</AccordionTrigger>
                <AccordionContent>
                  <table className={`${editando ? "" : "pointer-events-none"}`}>
                    {
                      estructura?.permisos?.map((permiso, index) => (
                        <tr className={trStyles} key={index}>
                          <td className={tdStyles + " w-[500px]"}>{permiso?.titulo}</td>
                          <td className={tdStyles}>
                            <input
                              onClick={() => {
                                AgregarQuitarPermiso(permiso?.permission);
                              }}
                              defaultChecked={selectedData?.permissions?.some(permisot => permisot?.name == permiso?.permission)}
                              className="w-5 h-5"
                              type="checkbox"
                            />
                          </td>
                        </tr>
                      ))
                    }
                  </table>
                </AccordionContent>
              </AccordionItem>
            )
          })
        }
      </Accordion>
    </>
  )
}
const PermisosValvulasPredios = ({
  selectedData,
  addPermissions,
  setAddPermissions,
  removePermissions,
  setRemovePermissions,
  editando
}) => {
  const tdStyles = "flex items-center"
  const trStyles = "flex items-center "

  const estructuraPermisos =
    [
      {
        title: "Módulo",
        permisos:
          [
            {
              titulo: "Activar / Desactivar Válvulas y predios",
              permission: "MostrarModuloValvulasPredios"
            },
          ]
      },
    ]

  const AgregarQuitarPermiso = (nombre) => {
    if (selectedData?.permissions?.some(permisot => permisot?.name == nombre)) {
      setRemovePermissions(prev => {
        if (prev?.find(permisot => permisot == nombre)) {
          return prev?.filter(permisot => permisot != nombre)
        } else {
          return [
            ...prev,
            nombre
          ]
        }
      })
    } else {
      setAddPermissions(prev => {
        if (prev?.find(permisot => permisot == nombre)) {
          return prev?.filter(permisot => permisot != nombre)
        } else {
          return [
            ...prev,
            nombre
          ]
        }
      })
    }
  }


  return (
    <>
      <Accordion type="multiple" collapsible defaultValue={["item-0"]}>
        {
          estructuraPermisos?.map((estructura, index) => {

            return (
              <AccordionItem value={"item-" + index} key={index}>
                <AccordionTrigger>{estructura?.title}</AccordionTrigger>
                <AccordionContent>
                  <table className={`${editando ? "" : "pointer-events-none"}`}>
                    {
                      estructura?.permisos?.map((permiso, index) => (
                        <tr className={trStyles} key={index}>
                          <td className={tdStyles + " w-[500px]"}>{permiso?.titulo}</td>
                          <td className={tdStyles}>
                            <input
                              onClick={() => {
                                AgregarQuitarPermiso(permiso?.permission);
                              }}
                              defaultChecked={selectedData?.permissions?.some(permisot => permisot?.name == permiso?.permission)}
                              className="w-5 h-5"
                              type="checkbox"
                            />
                          </td>
                        </tr>
                      ))
                    }
                  </table>
                </AccordionContent>
              </AccordionItem>
            )
          })
        }
      </Accordion>
    </>
  )
}
const PermisosAdministracion = ({
  selectedData,
  addPermissions,
  setAddPermissions,
  removePermissions,
  setRemovePermissions,
  editando
}) => {
  const tdStyles = "flex items-center"
  const trStyles = "flex items-center "

  const estructuraPermisos =
    [
      {
        title: "Módulo",
        permisos:
          [
            {
              titulo: "Activar / Desactivar Administración del sistema",
              permission: "MostrarModuloAdministracion"
            },
          ]
      },
    ]

  const AgregarQuitarPermiso = (nombre) => {
    if (selectedData?.permissions?.some(permisot => permisot?.name == nombre)) {
      setRemovePermissions(prev => {
        if (prev?.find(permisot => permisot == nombre)) {
          return prev?.filter(permisot => permisot != nombre)
        } else {
          return [
            ...prev,
            nombre
          ]
        }
      })
    } else {
      setAddPermissions(prev => {
        if (prev?.find(permisot => permisot == nombre)) {
          return prev?.filter(permisot => permisot != nombre)
        } else {
          return [
            ...prev,
            nombre
          ]
        }
      })
    }
  }


  return (
    <>
      <Accordion type="multiple" collapsible defaultValue={["item-0"]}>
        {
          estructuraPermisos?.map((estructura, index) => {

            return (
              <AccordionItem value={"item-" + index} key={index}>
                <AccordionTrigger>{estructura?.title}</AccordionTrigger>
                <AccordionContent>
                  <table className={`${editando ? "" : "pointer-events-none"}`}>
                    {
                      estructura?.permisos?.map((permiso, index) => (
                        <tr className={trStyles} key={index}>
                          <td className={tdStyles + " w-[500px]"}>{permiso?.titulo}</td>
                          <td className={tdStyles}>
                            <input
                              onClick={() => {
                                AgregarQuitarPermiso(permiso?.permission);
                              }}
                              defaultChecked={selectedData?.permissions?.some(permisot => permisot?.name == permiso?.permission)}
                              className="w-5 h-5"
                              type="checkbox"
                            />
                          </td>
                        </tr>
                      ))
                    }
                  </table>
                </AccordionContent>
              </AccordionItem>
            )
          })
        }
      </Accordion>
    </>
  )
}