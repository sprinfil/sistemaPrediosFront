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

const HorasExtras = () => {
  const fetchData = () => {

  }
  const [params, setParams] = useState({});

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
            fetchData={fetchData}
            params={params}
            setParams={setParams}
          />
          <DataTableSolicitudes />
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
                        Localización
                      </TableCell>
                      <TableCell className={tableCellStyles}>
                        <Input
                          placeholder="Localización"
                          value={params?.localizacion}
                          onChange={(e) => {
                            setParams((prev) => {
                              return {
                                ...prev,
                                localizacion: e.target.value,
                              };
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={tableCellStyles}>
                        Nombre del cliente
                      </TableCell>
                      <TableCell className={tableCellStyles}>
                        <Input
                          placeholder="Nombre del cliente"
                          value={params?.customer}
                          onChange={(e) => {
                            setParams((prev) => {
                              return {
                                ...prev,
                                customer: e.target.value,
                              };
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={tableCellStyles}>
                        Fecha de inicio
                      </TableCell>
                      <TableCell className={tableCellStyles}>
                        <input
                          value={params?.start_date}
                          onChange={(e) => {
                            setParams((prev) => {
                              return {
                                ...prev,
                                start_date: e.target.value,
                              };
                            });
                          }}
                          type="date"
                          className="w-full border brder-border p-2 rounded-md"
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