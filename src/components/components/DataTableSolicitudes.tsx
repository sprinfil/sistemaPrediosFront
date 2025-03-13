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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

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
import { icons } from "@/constants/icons"
const data = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
]


/*
    $table->unsignedBigInteger('id_he_empleado_trabajador');
    $table->unsignedBigInteger('id_user_solicitante');
    $table->text('descripcion');
    $table->BigInteger('prima_dominical')->nullable();
    $table->BigInteger('dias_festivos')->nullable();
    $table->BigInteger('faltas')->nullable();
    $table->BigInteger('horas');
    $table->time('hora_inicio');
    $table->time('hora_fin');
    $table->unsignedBigInteger('id_user_revisor')->nullable();
    $table->unsignedBigInteger('id_user_autorizo')->nullable();
    $table->date('fecha');
    $table->string('estapa');
    $table->string('estado');
    $table->string('motivo')->nullable();
*/

/*
  empleado
  solicito
  descripcion
  horas
  fecha
  etapa
  estado
  motivo
  area
*/

export function DataTableSolicitudes() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const columns = [
    {
      accessorKey: "status",
      header: "Empleado",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>Empleado</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Solicito",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>Solicito</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Descripcion",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>Descripcion</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Horas",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>horas</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Fecha",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>Fecha</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Etapa",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>Etapa</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>Estado</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Motivo de cancelación",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>Motivo de cancelación</div>
        </>)
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original

        return (
          <>
            <Button>{icons.ver("")}</Button>
          </>
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
    <div className="ml-1 mr-1">
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div> */}
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
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
