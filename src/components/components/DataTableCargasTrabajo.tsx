"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CiCirclePlus } from "react-icons/ci"
import { ModalCrearCargaTrabajo } from "./ModalCrearCargaTrabajo"
import { getPrediosCargaTrabajos } from "@/lib/PrediosCargaTrabajosService"
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Loader } from "./Loader"
import { ModalEditarCargaDeTrabajo, ModalVerCargaDeTrabajo } from "./ModalEditarCargaDeTrabajo"
import { ModalCancelarCargaTrabajo } from "./ModalCancelarCargaTrabajo"
import { ModalConcluirCargaTrabajo } from "./ModalConcluirCargaTrabajo"


export function DataTableCargasTrabajo() {
  const [data, setData] = React.useState([]);

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
      accessorKey: "operador_asignado.name",
      header: "Operador",
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
          fechaFormateada = dayjs(fechaAsignacion).format('D [de] MMMM [del] YYYY');
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
          styles = "p-2 bg-orange-500 rounded-md flex items-center justify-center text-white"
          text = "CONCLUIDA"
        }
        if (status == 2) {
          styles = "p-2 bg-red-500 rounded-md flex items-center justify-center text-white"
          text = "CANCELADA"
        }
        return (
          <div className={styles}>{text}</div>
        )
      }
    },
    {
      header: "Progreso",
      cell: ({ row }) => {
        const progreso = row.original.numero_detalles_asignados;
        console.log(row.original)
        const pendientes = row.original.numero_detalles;

        return (
          <>
            <p>{progreso} / {pendientes}</p>
          </>
        )
      }
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
          </div>
        )
      },
    },
  ]
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [loading, setLoading] = React.useState(false);


  getPrediosCargaTrabajos(setLoading, setData);

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


  return (
    <div className="w-full">
      {
        loading ?
          <div className="w-full justify-center flex">
            <Loader />
          </div>
          :
          <>
            <div className="flex items-center py-4">
              <Input
                placeholder="Operador"
                value={(table.getColumn("operador_asignado")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("operador_asignado")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <ModalCrearCargaTrabajo setData={setData} />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
      }

    </div>
  )
}
