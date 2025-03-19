import { DataTableSolicitudes } from '@/components/components/DataTableSolicitudes'
import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaRegBuilding } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { icons } from '@/constants/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useLogicSolicitudes } from '@/lib/HorasExtraService';

const HorasExtras = () => {
  const {
    fetch,
    loadingData,
    setLoadingData,
    params,
    setParams,
    solicitudes,
    setSolicitudes
  } = useLogicSolicitudes();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Horas extra</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className='cursor-pointer'>Seleccionar solicitud</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>

          <Filtros
            fetchData={fetch}
            params={params}
            setParams={setParams}
          />
          <DataTableSolicitudes
            data={solicitudes}
            loading={loadingData}
            setData={setSolicitudes}
            setLoading={setLoadingData}
          />
        </CardContent>
      </Card>
    </div>
  )
}

const Filtros = ({ fetchData, params, setParams }) => {
  const tableCellStyles = "py-1";

  return (
    <>
      <Accordion type="multiple" collapsible defaultValue={["parametros"]}>
        <AccordionItem value="parametros">
          <AccordionTrigger>Búsqueda</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle></CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className={tableCellStyles}>
                        Clave
                      </TableCell>
                      <TableCell className={tableCellStyles}>
                        <Input
                          placeholder="Clave"
                          value={params?.clave}
                          onChange={(e) => {
                            setParams((prev) => {
                              return {
                                ...prev,
                                clave: e.target.value,
                              };
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={tableCellStyles}>
                        Empleado
                      </TableCell>
                      <TableCell className={tableCellStyles}>
                        <Input
                          placeholder="Empleado"
                          value={params?.empleado}
                          onChange={(e) => {
                            setParams((prev) => {
                              return {
                                ...prev,
                                empleado: e.target.value,
                              };
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Button
                  className="ml-auto mt-3"
                  onClick={() => {
                    fetchData();
                  }}
                >
                  Buscar {icons.buscar("")}
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default HorasExtras;