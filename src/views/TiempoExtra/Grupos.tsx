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
import { DataTableHeGrupos } from '@/components/components/DataTableHeGrupos';
import { GruposCatalogo } from '@/components/components/GruposCatalogo';

export const Grupos = () => {

  const fetchData = () => {

  }

  const [params, setParams] = useState({});

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Grupos</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <GruposCatalogo />
        </CardContent>
      </Card>
    </div>
  )
}

