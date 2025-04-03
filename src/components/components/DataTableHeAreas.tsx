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
import { ModalImportarHeEmpleados } from "./ModalImportarHeEmpleados";
import { useAreas } from "@/lib/AreasHook";

export function DataTableHeAreas({
  data = [],
  loading,
  setData,
  setLoading,
  setAccion,
  setSelectedData,
  API_ENDPOINT,
  fetchAreas
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
      accessorKey: "codigo_jerarquia",
      header: "Codigo jerarquia",
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 justify-end">
            {/* <Button
              disabled={loading}
              onClick={() => {
                setSelectedData(row?.original);
                setAccion("ver");
              }}
            >
              {icons.ver("")}
            </Button>
            <ModalEliminarReutilizable
              trigger={
                <Button disabled={loading}>
                  {icons.eliminar("text-red-500")}
                </Button>
              }
              onConfirm={async () => {
                await deleteData(
                  setLoading,
                  API_ENDPOINT + "/" + row.original.id,
                  toast
                );
                setData((prev) => {
                  return prev?.filter((data) => data?.id !== row.original.id);
                });
              }}
              message={"¿Eliminar Registro?"}
            /> */}
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
        <Input
          placeholder="Nombre"
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <ModalImportarHeEmpleados
          title={"Importar areas"}
          endpoint={"/he-areas/import"}
          updateData={fetchAreas}
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
