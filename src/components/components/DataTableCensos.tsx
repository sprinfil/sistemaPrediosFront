"use client"
import * as React from "react"
import {flexRender} from "@tanstack/react-table"
import {Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue,} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Loader } from "./Loader";
import { useCensos } from "@/lib/CensosHook"
import { ModalCrearCargaTrabajoCensos } from "./ModalCrearCargaTrabajoCensos"

export function DataTableCensos() {
    const {
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
    } = useCensos();

    return (
        <div className="w-full">
        {
            loading ?
            <div className="w-full justify-center flex">
                <Loader />
            </div>
            :
            <>
                <div className="flex items-center py-4 gap-3">
                <Input
                    placeholder="Operador"
                    value={(table.getColumn("Operador")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                    table.getColumn("Operador")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <Select
                    value={estadoFiltro}
                    onValueChange={(value) => {
                    setEstadoFiltro(value);
                    table.getColumn("estado")?.setFilterValue(value === "cualquiera" ? "" : value);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Estado</SelectLabel>
                        <SelectItem value="cualquiera">Cualquiera</SelectItem>
                        <SelectItem value="0">En Proceso</SelectItem>
                        <SelectItem value="1">Concluida</SelectItem>
                        <SelectItem value="2">Cancelada</SelectItem>
                    </SelectGroup>
                    </SelectContent>
                </Select>

                <ModalCrearCargaTrabajoCensos setData={setData} />
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
