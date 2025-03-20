"use client";

import * as React from "react";
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
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { icons } from "@/constants/icons";
import LoaderHorizontal from "./LoaderHorizontal";
import { useNavigate } from "react-router-dom";
import { ModalEliminarReutilizable } from "./ModalEliminarReutilizable";
import { deleteData } from "@/lib/CatalogoService";
import { toast } from "@/hooks/use-toast";
import { formatearFecha } from "@/lib/ToolService";

export function DataTableSolicitudes({
  data = [],
  loading,
  setData,
  setLoading,
  setAccion,
  setSelectedData,
  API_ENDPOINT,
  CambioEstados,
  CambioEtapa
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const navigate = useNavigate();
  const columns = [
    {
      accessorKey: "status",
      header: "Clave",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>{data?.clave}</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Empleado",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>{data?.empleados_trabajador?.nombre}</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Area",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>{data?.empleados_trabajador?.areas?.nombre}</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Solicito",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>{data?.user_solicitante?.name}</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Descripcion",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>{data?.descripcion}</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Horas",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>{data?.horas}</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Fecha",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>{formatearFecha(data?.fecha)}</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Etapa",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>{data?.etapa}</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>{data?.estado}</div>
        </>)
      },
    },
    {
      accessorKey: "status",
      header: "Motivo de cancelación",
      cell: ({ row }) => {
        const data = row.original;
        return (<>
          <div>{data?.motivo}</div>
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
            <div className="flex gap-2 items-center">
              <Button
                onClick={() => { navigate("/horasextra/verSolicitud/" + row.original?.id) }}
              >{icons.ver("")}</Button>
              <Button onClick={()=>{CambioEtapa(row.original?.id, "Pago")}}
              variant={"outline"}>{icons.confirmar("")}</Button>
              <Button onClick={()=>{CambioEstados(row.original?.id, "Rechazado")}}
              variant={"outline"}>{icons.cancelar("")}</Button>
            </div>
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
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Nombre comercial"
          value={(table.getColumn("nombre_comercial")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre_comercial")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => {
            setAccion("crear");
            setSelectedData({});
          }}
        >
          Nuevo {icons.agregar("")}
        </Button> */}
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow className="border-none h-0 p-0">
                <TableCell className="p-0" colSpan={columns.length}>
                  <LoaderHorizontal styles={"w-full"} />
                </TableCell>
              </TableRow>
            )}
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
                  Sin resultados.
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
  );
}
