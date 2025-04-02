import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarHeader
} from "@/components/ui/sidebar"
import { Calendar, ChevronDown, ChevronsUpDown, ChevronUp, Home, icons, Inbox, LineChartIcon, } from "lucide-react"
import { MdEngineering, MdOutlineExitToApp } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaKey, FaShare, FaUser, FaUsers } from "react-icons/fa";
import { Navigate, useNavigate } from 'react-router-dom';
import { FaUserTie } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoDocumentLockOutline, IoDocumentText, IoHome, IoKeyOutline, IoTimeOutline, IoTimeSharp } from "react-icons/io5";
import { IoIosArrowDown, IoMdTime } from "react-icons/io";
import { GiValve } from "react-icons/gi";
import { HiMiniSquare3Stack3D } from "react-icons/hi2";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IoMapSharp } from "react-icons/io5";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import ZustandPrincipal from "@/Zustand/ZustandPrincipal";
import { BsClipboardFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { FaUserClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import { SideBarMenuCollapsibleIconButton } from "./SideBarMenuCollapsibleIconButton";
import { DropdownAppSideBarUser } from "./DropdownAppSideBarUser";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GearIcon } from "@radix-ui/react-icons";
import { FaGear } from "react-icons/fa6";

export function AppSidebar() {
  const navigate = useNavigate();
  const { user, modulo, setModulo } = ZustandPrincipal();
  const [items, setItems] = useState([]);

  const ValvulasYPrediositems = [
    {
      title: "Home",
      url: "/",
      icon: <IoHome />
    },
    {
      title: "Cargas de trabajo (predios)",
      url: "/cargasTrabajo",
      icon: <FaClipboardList />
    },
    {
      title: "Recorridos (Cajas de Válvulas)",
      url: "/recorridos",
      icon: <FaClipboardList />
    },
    {
      title: "Reportes",
      url: "/reporte",
      icon: <LineChartIcon />
    },
    {
      title: "Mapas",
      icon: <FaMapMarkedAlt />,
      options: [
        { title: "Mapa Predios", url: "/mapa", icon: <FaMapMarkedAlt /> },
        { title: "Mapa Válvulas", url: "/mapaValvulas", icon: <FaMapMarkedAlt /> },
      ],
    },
  ]

  const horasExtraItems = [
    {
      title: "Solicitudes",
      url: "/solicitud",
      icon: <IoDocumentText />
    },
    {
      title: "horas Extra",
      url: "/horasextra",
      icon: <IoTimeSharp />
    },
    {
      title: "Grupos",
      url: "/horasextra/grupos",
      icon: <FaUsers />
    },

  ]


  const administracion = [
    {
      title: "Usuarios",
      url: "/operadores",
      icon: <FaUserTie />
    },
    {
      title: "Roles y permisos",
      url: "/rolesPermisos",
      icon: <FaKey />
    },
    {
      title: "Empleados",
      url: "/horasextra/empleados",
      icon: <FaUsers />
    },
    {
      title: "Áreas",
      url: "/horasextra/areas",
      icon: <HiMiniSquare3Stack3D />
    },
  ]

  useEffect(() => {
    if (modulo == "valulasPredios") {
      setItems(ValvulasYPrediositems);
    }
    if (modulo == "horasExtra") {
      setItems(horasExtraItems);
    }
  }, [])

  useEffect(() => {
    if (modulo == "valulasPredios") {
      setItems(ValvulasYPrediositems);
    }
    if (modulo == "horasExtra") {
      setItems(horasExtraItems);
    }
    if (modulo == "administracion") {
      setItems(administracion);
    }

  }, [modulo])

  return (
    <Sidebar>
      <div className="p-4 w-full ">
        <p className="text-sm text-muted-foreground">Módulo</p>
        <Select
          defaultValue={modulo}
          onValueChange={(value) => {
            setModulo(value);
          }}
        >
          <SelectTrigger className="rounded-md h-[7vh] bg-[#FAFAFA] border-none">
            <SelectValue placeholder="Selecciona un módulo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Módulos</SelectLabel>
              {
                user?.all_permissions?.find(permisot => permisot == "MostrarModuloHorasExtra") &&
                <SelectItem value="horasExtra">Horas extra</SelectItem>
              }
              {
                user?.all_permissions?.find(permisot => permisot == "MostrarModuloValvulasPredios") &&
                <SelectItem value="valulasPredios">Válvulas y predios</SelectItem>
              }
              {
                user?.all_permissions?.find(permisot => permisot == "MostrarModuloAdministracion") &&
                <SelectItem value="administracion">Administración del sistema</SelectItem>
              }
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <div className="w-full flex flex-col items-center">
            {/* <img src={images.logo} alt="" className="w-[100px] h-[100px]" /> */}
          </div>
          <SidebarGroupLabel>MENU</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.options) {
                  // Renderizar Collapsible para elementos con opciones
                  return (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="relative">
                            <span>{item.icon}</span>{" "}
                            <span className="">{item.title}</span>{" "}
                            <SideBarMenuCollapsibleIconButton />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.options.map((option) => (
                              <SidebarMenuSubItem key={option.title}>
                                <SidebarMenuButton
                                  onClick={() => navigate(option.url)}
                                >
                                  <span>{option.icon}</span>{" "}
                                  <span className="">{option.title}</span>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
                if (item?.requiredRol == null) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => navigate(item.url)}
                        className="cursor-pointer select-none"
                      >
                        <div>
                          {item.icon}
                          <span className="">{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                } else {
                  if (user?.roles?.some(role => role.name == item?.requiredRol)) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          onClick={() => navigate(item.url)}
                          className="cursor-pointer select-none"
                        >
                          <div>
                            {item.icon}
                            <span className="">{item.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                }

              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownAppSideBarUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

