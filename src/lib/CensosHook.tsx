"use client"
import * as React from "react"
import {ColumnDef,ColumnFiltersState,SortingState,VisibilityState,flexRender,getCoreRowModel,
  getFilteredRowModel,getPaginationRowModel,getSortedRowModel,useReactTable,} from "@tanstack/react-table"
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Checkbox } from "@/components/ui/checkbox";
import { ModalEditarCargaDeTrabajo } from "@/components/components/ModalEditarCargaDeTrabajo";
import { ModalCancelarCargaTrabajo } from "@/components/components/ModalCancelarCargaTrabajo";
import { ModalConcluirCargaTrabajo } from "@/components/components/ModalConcluirCargaTrabajo";
import { ModalEnProgresoCargaTrabajo } from "@/components/components/ModalEnProgresoCargaTrabajo";
import { getCensosCargasdeTrabajo } from "./CensosService";
import { useEffect } from "react";

export const useCensos = () => {
    const [data, setData] = React.useState([]);
    const [estadoFiltro, setEstadoFiltro] = React.useState("cualquiera");
    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "nombre_carga",
            header: "Nombre",
        },
        {
            id: 'Operador',
            header: "Operador",
            accessorKey: "operador_asignado.name",
            // cell: ({row}) => {
            //   const operador = row.original?.operador_asignado.name;
            //   return (
            //     <p>{operador}</p>
            //   )
            // },
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
            accessorKey: "status",
            id: "estado",
            header: "Estado",
            cell: ({ row }) => {
                const status = row?.original?.status;
                let styles = "";
                let text = "";
                if (status == 0) {
                styles = "p-2 bg-blue-500 rounded-md flex items-center justify-center text-white"
                text = "EN PROCESO"
                }
                if (status == 1) {
                styles = "p-2 bg-green-500 rounded-md flex items-center justify-center text-white"
                text = "CONCLUIDA"
                }
                if (status == 2) {
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
                const data = row.original

                return (
                <div className="flex gap-2">
                    <ModalEditarCargaDeTrabajo setData={setData} cargaTrabajoId={data?.id} />
                    <ModalCancelarCargaTrabajo cargaTrabajo={data} setData={setData} />
                    <ModalConcluirCargaTrabajo cargaTrabajo={data} setData={setData} />
                    <ModalEnProgresoCargaTrabajo cargaTrabajo={data} setData={setData} />
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
    //getCensosCargasdeTrabajo(setLoading, setData);
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

export const useCensosConfigurador = () => {
    
    return{

    }
}