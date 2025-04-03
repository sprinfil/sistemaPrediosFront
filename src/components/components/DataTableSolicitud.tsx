"use client";
import * as React from "react";
import {
  ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { icons } from "@/constants/icons";
import LoaderHorizontal from "./LoaderHorizontal";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { formatearFecha } from "@/lib/ToolService";
import { editarSolicitud } from "@/lib/Solicitudes";
import ZustandPrincipal from "@/Zustand/ZustandPrincipal";

export function DataTableSolicitud({
  data = [],
  loading,
  setData,
  setLoading,
  setAccion,
  setSelectedData,
  API_ENDPOINT,
  userID,
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const navigate = useNavigate();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false);
  const [currentSolicitud, setCurrentSolicitud] = React.useState(null);
  const [motivoRechazo, setMotivoRechazo] = React.useState("");
  const { user } = ZustandPrincipal();
  const handleConfirmarSolicitud = async (solicitud) => {
    try {
      let nuevoEstado = 'aprobada';
      if (solicitud.id_user_solicitante !== userID) {
        if (solicitud.etapa === 'solicitud') {
          nuevoEstado = 'aprobada';
        } else if (solicitud.etapa === 'pago') {
          nuevoEstado = 'pagado';
        }
      } else {
        if (solicitud.etapa === 'trabajando') {
          nuevoEstado = 'terminado';
        }
      }
      const values = {
        nuevo_estado: nuevoEstado
      };
      await editarSolicitud(
        solicitud.id,
        setLoading,
        values,
        (responseData) => {
          //console.log(responseData)
          const updatedData = data.map(item =>
            item.id === solicitud.id ? { ...item, estado: nuevoEstado } : item
          );
          setData(updatedData);
          toast({
            title: "Éxito",
            description: `Solicitud ${nuevoEstado} correctamente`,
          });
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la solicitud",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleOpenRejectDialog = (solicitud) => {
    setCurrentSolicitud(solicitud);
    setMotivoRechazo("");
    setIsRejectDialogOpen(true);
  };

  const handleRechazarSolicitud = async () => {
    if (!motivoRechazo.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar un motivo de rechazo",
        variant: "destructive",
      });
      return;
    }
    try {
      let nuevoEstado = 'rechazado';
      if (currentSolicitud.id_user_solicitante !== userID) {
        if (currentSolicitud.etapa === 'solicitud') {
          nuevoEstado = 'rechazado';
        } else if (currentSolicitud.etapa === 'pago') {
          nuevoEstado = 'rechazado';
        }
      }
      else {
        if (currentSolicitud.etapa === 'solicitud') {
          nuevoEstado = 'cancelado';
        } else if (currentSolicitud.etapa === 'trabajando') {
          nuevoEstado = 'cancelado';
        }
      }
      const values = {
        nuevo_estado: nuevoEstado,
        motivo: motivoRechazo
      };
      await editarSolicitud(
        currentSolicitud.id,
        setLoading,
        values,
        (responseData) => {
          //console.log(responseData)
          const updatedData = data.map(item =>
            item.id === currentSolicitud.id ? { ...item, estado: responseData.estado, motivo: motivoRechazo } : item
          );
          setData(updatedData);
          setIsRejectDialogOpen(false);
          toast({
            title: "Éxito",
            description: "Solicitud rechazado correctamente",
          });
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la solicitud",
        variant: "destructive",
      });
      console.error(error);
    }
  };

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
      header: "Prima",
      cell: ({ row }) => {
        const data = row.original;
        const primaDominical = data.prima_dominical;
        if (primaDominical !== null) {
          return <div>SI</div>;
        } else {
          return <div>NO</div>;
        }
      },
    },
    {
      accessorKey: "status",
      header: "Dia festivo",
      cell: ({ row }) => {
        const data = row.original;
        const dia = data?.dias_festivos
        if (dia !== null) {
          return <div>SI</div>;
        } else {
          return <div>NO</div>;
        }
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
        const data = row.original;

        const userDif = data.id_user_solicitante != userID;
        const soli = data.etapa === "solicitud";
        const paga = data.etapa === "pago";
        const traba = data.etapa === "trabajando";
        return (
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              onClick={() => { navigate("/solicitud/solicitudes/" + data?.id) }}
            >{icons.ver("")}</Button>


            {
              user?.all_permissions?.find(permisot => permisot == "CambiarEtapaSolicitudes") &&
              <Button
                size="sm"
                variant={"outline"}
                onClick={() => handleConfirmarSolicitud(data)}
              //disabled={(!userDif && (soli || paga))}
              >{icons.confirmar("")}</Button>
            }

            {/* <Button
              size="sm"
              variant={"outline"}
              onClick={() => handleConfirmarSolicitud(data)}
            //disabled={(!userDif && (soli || paga))}
            >{icons.confirmar("")}</Button> */}

            {
              user?.all_permissions?.find(permisot => permisot == "EliminarSolicitudes") &&
              <Button
                size="sm"
                variant={"outline"}
                onClick={() => handleOpenRejectDialog(data)}
              //disabled={(!userDif && paga)||(userDif && traba)}
              >{icons.cancelar("")}</Button>
            }

            {/* <Button
              size="sm"
              variant={"outline"}
              onClick={() => handleOpenRejectDialog(data)}
            //disabled={(!userDif && paga)||(userDif && traba)}
            >{icons.cancelar("")}</Button> */}
          </div>
        );
      },
    }
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
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              Indique el motivo del rechazo / cancelación de esta solicitud.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="motivo"
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Motivo de rechazo"
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRechazarSolicitud}>
              Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}