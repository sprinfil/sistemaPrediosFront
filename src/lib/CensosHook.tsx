"use client"
import * as React from "react"
import {ColumnDef,ColumnFiltersState,SortingState,VisibilityState,flexRender,getCoreRowModel,
  getFilteredRowModel,getPaginationRowModel,getSortedRowModel,useReactTable,} from "@tanstack/react-table"
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { ModalEditarCargaDeTrabajo } from "@/components/components/ModalEditarCargaDeTrabajo";
import { getCensosCargasdeTrabajo, getEncuestas } from "./CensosService";
import { useEffect } from "react";
import { ModalCensosModificados } from "@/components/components/ModalCensosModificados";

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
                    {/* <ModalEditarCargaDeTrabajo setData={setData} cargaTrabajoId={data?.id} /> */}
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

export const useCensosConfigurador = () => {
    
    return{

    }
}