"use client"
import * as React from "react"
import {ColumnDef,ColumnFiltersState,SortingState,VisibilityState,flexRender,getCoreRowModel,
  getFilteredRowModel,getPaginationRowModel,getSortedRowModel,useReactTable,} from "@tanstack/react-table"
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { getCensosCargasdeTrabajo, getCensosCDTByid, getEncuestaRespuesta, getEncuestas } from "./CensosService";
import { useEffect } from "react";
import { ModalCensosModificados } from "@/components/components/ModalCensosModificados";
import { useRef, useState } from "react";
import { Loader } from "./Loader";
import { MdOutlineCancel } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { updateCensosCargadeTrabajo } from "@/lib/CensosService";
import { FaArrowRotateRight } from "react-icons/fa6";
import { PlusCircle } from "lucide-react";
import * as XLSX from "xlsx";
import ZustandPrincipal from "@/Zustand/ZustandPrincipal";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { json } from "react-router-dom";
import { crearCargaTrabajoCensos } from "@/lib/CensosService";
import { ComboBoxOperadoresCensos } from "./ComboBoxOperadoresCensos";
import { ComboBoxEncuestas } from "./ComboBoxEncuestas";
import { ModalEditarCensosCDT } from "@/components/components/ModalEditarCensosCDT";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useCensos = () => {
    const [data, setData] = React.useState([]);
    const [estadoFiltro, setEstadoFiltro] = React.useState("cualquiera");
    const columns = [
        {
            id: 'Titulo',
            header: "titulo",
            accessorKey: "encuesta.titulo",
            cell: ({row}) => {
              const titulo = row.original?.encuesta?.titulo;
              return (
                <p>{titulo}</p>
              )
            },
            filterFn: (row, columnId, filterValue) => {
                const titulo = row.getValue(columnId);
                return titulo ? titulo.toLowerCase().includes(filterValue.toLowerCase()) : false;
            }
        },
        {
            id: 'Operador',
            header: "Operador",
            accessorKey: "operador.name",
            cell: ({row}) => {
                const operador = row.original?.operador?.name;
                return (
                    <p>{operador}</p>
                )
            },
            filterFn: (row, columnId, filterValue) => {
                const operador = row.getValue(columnId);
                return operador ? operador.toLowerCase().includes(filterValue.toLowerCase()) : false;
            }
        },
        {
            accessorKey: "fecha_asignacion",
            header: "Fecha de asignación",
            cell: ({ row }) => {
                dayjs.extend(localizedFormat);
                dayjs.locale('es');
                const data = row?.original;
                const fechaAsignacion = data?.created_at;
                const fechaFormateada = dayjs(fechaAsignacion).format('D [de] MMMM [del] YYYY');
                return (
                <div>{fechaFormateada}</div>
                );
            }
        },
        {
            accessorKey: "fecha_finalizacion",
            header: "Fecha de finalización",
            cell: ({ row }) => {
                dayjs.extend(localizedFormat);
                dayjs.locale('es');
                const data = row?.original;
                const fechaFinalizacion = data?.fecha_finalizacion;
                let fechaFormateada = '';
                if (fechaFinalizacion != null) {
                fechaFormateada = dayjs(fechaFinalizacion).format('D [de] MMMM [del] YYYY');
                } else {
                fechaFormateada = "NO FINALIZADA"
                }
                return (
                <div>{fechaFormateada}</div>
                );
            }
        },
        {
            accessorKey: "estado",
            id: "estado",
            header: "Estado",
            cell: ({ row }) => {
                const status = row?.original?.estado;
                let styles = "";
                let text = "";
                if (status == "0") {
                styles = "p-2 bg-blue-500 rounded-md flex items-center justify-center text-white"
                text = "EN PROCESO"
                }
                if (status == "1") {
                styles = "p-2 bg-green-500 rounded-md flex items-center justify-center text-white"
                text = "CONCLUIDA"
                }
                if (status == "2") {
                styles = "p-2 bg-red-500 rounded-md flex items-center justify-center text-white"
                text = "CANCELADA"
                }
                return (
                <div className={styles}>{text}</div>
                )
            },
            filterFn: (row, columnId, filterValue) => {
                const status = row.getValue(columnId);
                return filterValue === "" || status == Number(filterValue);
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const data = row.original;
                const encuesta_id = data.encuesta_id;
                const operador_id = data.operador_id;
                const estado= data.estado;
                const id= data.id;
                const datosSelect={
                    id,
                    encuesta_id,
                    operador_id,
                    estado
                };
                return (
                <div className="flex gap-2">
                    <ModalEditarCensosCDT setData={setData} cargaTrabajoId={data?.id} />
                    <ModalCensosModificados setData={setData} cargaTrabajo={datosSelect} modificacion={"2"}/>
                    <ModalCensosModificados setData={setData} cargaTrabajo={datosSelect} modificacion={"1"}/>
                    <ModalCensosModificados setData={setData} cargaTrabajo={datosSelect} modificacion={"0"}/>
                </div>
                )
            },
        },
    ]
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [loading, setLoading] = React.useState(false);
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        },
    })

    const fetch = async () => {
        try {
            setLoading(true);
            const response = await getCensosCargasdeTrabajo();
            setData(response);
        }
        catch(e) {
            throw e;
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetch();
    }, [])

    return{
        table,
        data,
        setData,
        estadoFiltro,
        setEstadoFiltro,
        columns,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        columnVisibility,
        setColumnVisibility,
        rowSelection,
        setRowSelection,
        loading,
        setLoading,
    }
}

export const useEncuestas = (setEncuestas, defualtOperador) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(defualtOperador ?? "")
    const [frameworks, setFrameworks] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const fetchEncuestas = async () =>{
        try{
            setLoading(true);
            const response = await getEncuestas()
            setFrameworks(response);
        }
        catch (e) {
            throw e;
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchEncuestas();
    },[])

    return{
        open,
        setOpen,
        value,
        setValue,
        frameworks,
        setFrameworks,
        loading, 
        setLoading
    }
}

export const useCensosModificados = (modificacion:string, cargaTrabajo:any, setData:any) => {
    const [loading, setLoading] = useState(false);
    const cancelarButton = useRef<HTMLButtonElement>(null);
    const config = {
      "0": {
        title: "¿Poner en proceso la carga de trabajo?",
        description: "La carga de trabajo se pondrá en progreso.",
        buttonColor: "bg-white hover:bg-gray-50 text-blue-700 border border-gray-300",
        textColor: "text-blue-500",
        buttonText: "En Proceso",
        icon: <FaArrowRotateRight className="ml-2" />
      },
      "1": {
        title: "¿Concluir carga de trabajo?",
        description: "La carga de trabajo se va a concluir.",
        buttonColor: "bg-white hover:bg-gray-50 text-green-500 border border-gray-300",
        textColor: "text-green-500",
        buttonText: "Concluir",
        icon: <FaCheckCircle className="ml-2" />
      },
      "2": {
        title: "¿Cancelar carga de trabajo?",
        description: "La carga de trabajo se va a cancelar y no aparecerá al operador.",
        buttonColor: "bg-white hover:bg-gray-50 text-red-500 border border-gray-300",
        textColor: "text-red-500",
        buttonText: "Cancelar",
        icon: <MdOutlineCancel className="ml-2" />
      }
    };
    const currentConfig = config[modificacion];
    const handleUpdateCensosCargadeTrabajo = async () => {
        try {
            await handlePeticionCensosCargadeTrabajo(
                setLoading, 
                cargaTrabajo, 
                modificacion, 
                setData
            );
            cancelarButton.current?.click();
        } catch (e) {
            //TODO:MOSTRAR ERROR
        }
    }

    const handlePeticionCensosCargadeTrabajo = async (setLoading: Function,cargaTrabajo: { encuesta_id: number, operador_id: number, estado: string, id:number }, modificacion: string,setData: Function) => {
        try {
            setLoading(true);
            const response = await updateCensosCargadeTrabajo(cargaTrabajo,modificacion)
            setData(prev => {
                return prev.map(carga => {
                    if (cargaTrabajo.id == carga?.id) {
                        return response?.data?.data;
                    } else {
                        return carga;
                    }
                });
            });
        }
        catch (e) {
            throw e;
        }
        finally {
            setLoading(false);
        }
    }
    
    return{
        loading,
        setLoading,
        cancelarButton,
        currentConfig,
        handleUpdateCensosCargadeTrabajo
    }
}

export const useModalCrearCArgaTrabajoCensos= (setData) =>{
    const { toast } = useToast();
    const [fileData, setFileData] = useState([]);
    const [selectedOperador, setSelectedOperador] = useState(null);
    const [selectedEncuestas, setselectedEncuestas] = useState(null)
    const [loading, setLoading] = useState(false);
    const [jsonData, setJsonData] = useState();
    const cancelarButton = useRef();
    const { user } = ZustandPrincipal();
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          setJsonData(jsonData);
          console.log(jsonData)
          const modifiedData = jsonData
            .filter(row => {
              const firstColValue = row[Object.keys(row)[0]];
              return firstColValue.toString().length >= 7;
            })
            .map(row => {
              const firstColKey = Object.keys(row)[0];
              const firstColValue = row[firstColKey].toString();
              if (firstColValue.length === 7) {
                row[firstColKey] = "0" + firstColValue;
              }
              return row;
            });
  
          console.log(modifiedData);
          setFileData(modifiedData);
        };
        reader.readAsArrayBuffer(file);
      }
    };
    useEffect(() => { }, [fileData])
    const handleCrearCargaDeTrabajoCensos=async () => {
        try {
            await handleProcesarCrearCargaDeTrabajoCensos(fileData, selectedOperador, selectedEncuestas, user?.id, setLoading, setData);
            cancelarButton?.current?.click();
        }
        catch (e) {
            toast({
                title: 'Ocurrio un error',
                description: e?.response?.data?.data?.message,
                action: <ToastAction altText="Intenar de nuevo">Intenar de nuevo</ToastAction>,
            })
        }
    }
    const handleProcesarCrearCargaDeTrabajoCensos = async (fileInfo, operadorSeleccionado, encuestaSeleccionada, asignedById, setLoading, setData) => {
        try {
            if (!Array.isArray(fileInfo) || fileInfo.length === 0) {
            return;
            }
            setLoading(true);

            const carga_trabajo_tomas = fileInfo.map((row) => {
            const campos = Object.values(row);
            return {
                cuenta: campos[0].toString(),
                usuario: campos[1].toString(),
                orden: campos[2].toString(),
                direccion: campos[3].toString(),
                clave_catastral: campos[4] ? campos[4].toString() : "n/a",
                no_medidor: campos[5] ? campos[5].toString() : "0"
            };
            });

            const requestBody = {
            encuesta_id: encuestaSeleccionada.id,
            operador_id: operadorSeleccionado.id,
            carga_trabajo_tomas: carga_trabajo_tomas
            };

            const response = await  crearCargaTrabajoCensos(requestBody);

            setData(prev => {
            const data = {
                ...response?.data,
                numero_detalles: carga_trabajo_tomas.length,
            };
            //console.log("response",response?.data)
            return [data, ...prev];
            });
            return response;
        } catch (e) {
            throw e;
        } finally {
            setLoading(false);
        }
    }
    
    return{
        handleFileChange,
        toast,
        fileData,
        setFileData,
        selectedOperador,
        setSelectedOperador,
        selectedEncuestas,
        setselectedEncuestas,
        loading,
        setLoading,
        jsonData,
        setJsonData,
        cancelarButton,
        user,
        handleCrearCargaDeTrabajoCensos
    }
}

export const useCargaTrabajoCensos = (cargaTrabajo, setCargaTrabajo, setData) =>{
    const formSchema = z.object({
        nombre_carga: z.string().min(2).max(50),
        user_id: z.number(),
        fecha_asignacion: z.string().min(2).max(50),
        fecha_finalizacion: z.string().min(2).max(50),
        status: z.string(),
    });
    const getEstatus = (status) => {
        if (status === "0") {
            return "EN PROCESO";
        }
        if (status === "1") {
            return "CONCLUIDA";
        }
        if (status === "2") {
            return "CANCELADA";
        }
        return "DESCONOCIDO";
    };
    const [operadorSeleccionado, setOperadorSeleccionado] = useState(cargaTrabajo?.operador ?? {});
    const [loading, setLoading] = useState(false);
    let status = getEstatus(cargaTrabajo?.estado);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre_carga: cargaTrabajo?.encuesta?.titulo,
            user_id: operadorSeleccionado?.id ?? 0,
            fecha_asignacion: cargaTrabajo?.created_at
            ? dayjs(cargaTrabajo.created_at).format('D [de] MMMM [del] YYYY')
            : "",
            fecha_finalizacion: cargaTrabajo?.completado_at
            ? dayjs(cargaTrabajo.completado_at).format('D [de] MMMM [del] YYYY')
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
    return{
        formSchema,
        operadorSeleccionado,
        setOperadorSeleccionado,
        loading,
        setLoading,
        status,
        toast,
        form,
        onSubmit
    }
}

export const useGetCensosCDTByid = (setData,cargaTrabajoId) => {
    const [cargaTrabajo, setCargaTrabajo] = useState({});
    const [encuestaRespuesta, setEncuestaRespuesta] = useState({});
    const [loading, setLoading] = useState(false);
    const [columnCount, setColumnCount] = useState(2);
    const handlePeticionGetCensosCDTByid = async () =>{
        try {
            await handleGetCensosCDTByid(cargaTrabajoId, setCargaTrabajo, setLoading);
            setColumnCount(2);
        } catch (e) {
            //TODO: Poner el error
        }
    }

    const handleGetCensosCDTByid=async (id:number, setCargaTrabajo:Function,setLoading: Function) => {
        try {
            setLoading(true);
            const response = await getCensosCDTByid(id);
            setCargaTrabajo(response?.data?.data);
        }
        catch (e) {
            throw e;
        }
        finally {
            setLoading(false);
        }
    }

    const handlePeticionGetEncuestaRespuesta = async (cargaTrabajoTomaId:number) =>{
        try {
            await handleGetEncuestaRespuesta(cargaTrabajoTomaId, setEncuestaRespuesta, setLoading);
        } catch (e) {
            //TODO: Poner el error
        }
    }

    const handleGetEncuestaRespuesta=async (cargaTrabajoTomaId:number, setEncuestaRespuesta:Function,setLoading: Function) => {
        try {
            //setLoading(true);
            const response = await getEncuestaRespuesta(cargaTrabajoTomaId);
            setEncuestaRespuesta(response?.data);
        }
        catch (e) {
            throw e;
        }
        finally {
            //setLoading(false);
        }
    }

    return{
        cargaTrabajo,
        setCargaTrabajo,
        loading,
        setLoading,
        handlePeticionGetCensosCDTByid,
        encuestaRespuesta,
        setEncuestaRespuesta,
        handlePeticionGetEncuestaRespuesta,
        columnCount,
        setColumnCount
    }
}

export const useCargaTrabajoRespuesta = () =>{

}

export const useCensosConfigurador = () => {
    
    return{

    }
}