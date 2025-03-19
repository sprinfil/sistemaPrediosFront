"use client"

import * as React from "react"
import {ColumnDef,ColumnFiltersState,SortingState,VisibilityState,flexRender,getCoreRowModel,getFilteredRowModel,
  getPaginationRowModel,getSortedRowModel,useReactTable,} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import { BsPencilSquare } from "react-icons/bs"
import { useState } from "react"

const data: Payment[] = [
  {
    id: "m5gr84i9",
    clave:"151545",
    nombre:"el mike",
    descripcion: "cosa loca",
    horas: 2,
    hora_inicio: 11.5,
    hora_fin: 13.5,
    fecha: "13/12/2025",
    prima_dominical:"Si",
    dias_festivos:"No",
  },
  {
    id: "3u1reuv4",
    clave:"323234",
    nombre:"estuvo",
    descripcion: "cosa 2",
    horas: 3,
    hora_inicio: 9.5,
    hora_fin: 12.5,
    fecha: "14/12/2025",
    prima_dominical:"No",
    dias_festivos:"Si",
  },
  {
    id: "derv1ws0",
    clave:"u49892e",
    nombre:"aqui",
    descripcion: "cosa 3",
    horas: 1,
    hora_inicio: 9.5,
    hora_fin: 10.5,
    fecha: "15/12/2025",
    prima_dominical:"Si",
    dias_festivos:"No",
  },
  {
    id: "5kma53ae",
    clave:"cjndic",
    nombre:"que pedo",
    descripcion: "cosa 4",
    horas: 2,
    hora_inicio: 8.5,
    hora_fin: 10.5,
    fecha: "16/12/2025",
    prima_dominical:"No",
    dias_festivos:"Si",
  },
  {
    id: "kcmod",
    clave:"como estas",
    nombre:"el mike",
    descripcion: "cosa 5",
    horas: 5,
    hora_inicio: 11.5,
    hora_fin: 16.5,
    fecha: "17/12/2025",
    prima_dominical:"Si",
    dias_festivos:"No",
  },
]

export type Payment = {
  id: string
  clave:string
  nombre:string
  descripcion: string
  horas: number
  hora_inicio: number
  hora_fin:number
  fecha:string
  prima_dominical:string
  dias_festivos:string
}

export function DataTableSolicitud() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "clave",
      header: "Folio",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("clave")}</div>
      ),
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nombre")}</div>
      ),
    },
    {
      accessorKey: "descripcion",
      header: "descripcion",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("descripcion")}</div>
      ),
    },
    {
      accessorKey: "fecha",
      header: "fecha",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fecha")}</div>
      ),
    },
    {
      accessorKey: "prima_dominical",
      header: "prima_dominical",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("prima_dominical")}</div>
      ),
    },
    {
      accessorKey: "dias_festivos",
      header: "dias_festivos",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("dias_festivos")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex w-full gap-2">
            <Button variant={"outline"}>
              Editar <BsPencilSquare />
            </Button>
          </div>
        )
      },
    },
  ]

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
    <div className="ml-10 mr-10 mb-5">
      <div className="flex items-center py-4">
        <Input
          placeholder="Folio..."
          value={(table.getColumn("clave")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("clave")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
    </div>
  )
}