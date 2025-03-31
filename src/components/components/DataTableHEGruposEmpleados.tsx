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

export function DataTableHeGruposEmpleados({
  data = [],
  loading,
  setData,
  setLoading,
  setSelectedData,
  updateData,
  API_ENDPOINT,
  empleadosSeleccionados,
  setEmpleadosSeleccionados,
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
        accessorKey: "nombre",
        header: "Nombre",
        cell: ({ row }) => {
            const data = row?.original;
            return (<>
              <div>{data?.nombre}</div>
            </>)
        }
      },
    {
        accessorKey: "plaza",
        header: "Plaza",
        cell: ({ row }) => {
            return (<>
              <div>{row?.original?.plaza}</div>
            </>)
        }
      },
    {
      accessorKey: "puesto",
      header: "Puesto",
      cell: ({ row }) => {
        return (<>
            <div>{row?.original?.puesto}</div>
        </>)
      }
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const data = row?.original
        return (
          <div className="flex items-center gap-2 justify-end">
            <Button
              disabled={loading}
              variant={"outline"}
              className=""
              onClick={() => {
                const updatedEmpleadosSeleccionados = empleadosSeleccionados.filter((empleado) => empleado !== data?.id);
                setEmpleadosSeleccionados(prev=>{return prev.filter((empleado) => empleado !== data?.id)});
              }}
            >
              {icons.eliminar("")}
            </Button>
          </div>
        );
      },
    },
  ];
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
          placeholder="Nombre"
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <ModalImportarHeEmpleados
          title={"Importar empleados"}
          endpoint={"/he-empleados/import"}
          updateData={updateData}
        /> */}
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
