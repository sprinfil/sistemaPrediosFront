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
  SidebarMenuSubItem
} from "@/components/ui/sidebar"
import { Calendar, ChevronUp, Home, icons, Inbox, LineChartIcon, } from "lucide-react"
import { MdOutlineExitToApp } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaUser } from "react-icons/fa";
import { Navigate, useNavigate } from 'react-router-dom';
import { FaUserTie } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { GiValve } from "react-icons/gi";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import ZustandPrincipal from "@/Zustand/ZustandPrincipal";

export function AppSidebar() {
  const navigate = useNavigate();
  const { user } = ZustandPrincipal();

  const items = [
    {
      title: "Home",
      url: "/",
      icon: <IoHome />
    },
    // {
    //   title: "Mapa",
    //   url: "/mapa",
    //   icon: <FaMapMarkedAlt />
    // },
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
      icon: <LineChartIcon/>
    },
    // {
    //   title: "Padrón de tomas",
    //   url: "/padronTomas",
    //   icon: <GiValve />
    // },
    // {
    //   title: "Operadores",
    //   url: "/operadores",
    //   icon: <FaUserTie />
    // },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sapa ops</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      {/* <a href={item.url}>
                        {item.icon}
                        <span>{item.title}</span>
                      </a> */}
                      <div onClick={() => navigate(item.url)} className="cursor-pointer">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              <Collapsible className="group/collapsible">

                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton><FaMapMarkedAlt /> Mapas <IoIosArrowDown className="ml-auto" /></SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem onClick={() => navigate("/mapa")}>
                        <SidebarMenuButton><FaMapMarkedAlt />Mapa Predios</SidebarMenuButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem onClick={() => navigate("/mapaValvulas")}>
                        <SidebarMenuButton><FaMapMarkedAlt />Mapa Valvulas</SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>

                </SidebarMenuItem>
              </Collapsible>

              {
                user?.roles?.some(role => role.name === "master") ?
                  <>
                    <SidebarMenuItem onClick={() => navigate("/operadores")} >
                      <SidebarMenuButton asChild  >
                        <div>
                          <FaUserTie />
                          <span>Operadores</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                  :
                  <>

                  </>
              }


            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>





      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <FaUser /> {user?.name} ({user?.username})
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                {/* <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem> */}

                <DropdownMenuItem onClick={() => {
                  localStorage.setItem("TOKEN", "");
                  navigate("/login");
                }}>
                  <div className="h-[40px] flex gap-2 items-center text-red-500 cursor-pointer">
                    <MdOutlineExitToApp />
                    Sign out</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
