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
import { BsPencilSquare } from "react-icons/bs";
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
import { CiCirclePlus } from "react-icons/ci";
import { ModalCrearOperador } from "./ModalCrearOperador"
import { ModalEditarOperador } from "./ModalEditarOperador";
import { ModalDesactivarOperador } from "./ModalDesactivarOperador";
import { icons } from "@/constants/icons";
import { fetchData } from "@/lib/ToolService";
import { toast } from "@/hooks/use-toast";
import { fetchRoles } from "@/lib/RolesService";


export type Operador = {
  id: number,
  nombre_completo: string,
  username: string,
  rol: string,
  estado: string
}



export function DataTableOperadores({ data, setData, areas, loadingAreas, roles, loadingRoles }) {


  const columns: ColumnDef<Operador>[] = [
    {
      accessorKey: "name",
      header: "Nombre Completo",
    },
    {
      accessorKey: "username",
      header: "Nombre de Usuario"
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => {
        const data = row.original?.roles;
        let roles = "";
        data?.map((rol) => {
          roles += rol.name + ' ';
        })
        return (
          <div>{roles}</div>
        )
      }
    },
    {
      accessorKey: "role",
      header: "Area",
      cell: ({ row }) => {
        const data = row.original;

        return (
          <div>{data?.area?.nombre}</div>
        )
      }
    },
    // {
    //   accessorKey: "status",
    //   header: "Nombre de Usuario"
    // },
    // {
    //   accessorKey: "estado",
    //   header: "Estado",
    //   cell: ({ cell }) => {
    //     const operador: Operador = cell.row.original;
    //     if (operador.estado == "activo") {
    //       return (
    //         <div className="bg-green-500 p-1 flex items-center justify-center rounded-md text-white">
    //           <p>activo</p>
    //         </div>
    //       )
    //     } else {
    //       return (
    //         <div className="bg-red-500 p-1 flex items-center justify-center rounded-md text-white">
    //           <p>inactivo</p>
    //         </div>
    //       )
    //     }
    //   }
    // },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const operador = row.original
        return (
          <>
            <div className="flex gap-2 items-center">
              <ModalEditarOperador
                trigger={
                  <Button variant={"outline"} disabled={(loadingAreas || loadingRoles)}>
                    {icons.ver("")}
                  </Button>
                }
                operador={operador}
                setData={setData}
                loadingAreas={loadingAreas}
                areas={areas}
                roles={roles}
                loadingRoles={loadingRoles}
              />

              <ModalDesactivarOperador operadorId={operador?.id} setData={setData} status={operador?.status} />

            </div>

          </>
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
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Nombre Completo..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-[200px]"
        />
        <Input
          placeholder="Username"
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="w-[200px]"
        />
        <div className="ml-auto">
          <ModalCrearOperador
            setData={setData}
            trigger={
              <Button>
                Agregar Operador
                <PlusCircle />
              </Button>
            }
          />
        </div>
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
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
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
