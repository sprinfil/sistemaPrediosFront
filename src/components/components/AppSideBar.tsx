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
import { Calendar, ChevronUp, Home, icons, Inbox, } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaUserTie } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
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
      title: "Cargas de trabajo",
      url: "/cargasTrabajo",
      icon: <FaClipboardList />
    },
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
                      <a href={item.url}>
                        {item.icon}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              {
                user?.roles?.some(role => role.name === "master") ?
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a href={'/operadores'}>
                          <FaUserTie />
                          <span>Operadores</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                  :
                  <>

                  </>
              }


              <Collapsible className="group/collapsible">

                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton><FaMapMarkedAlt /> Mapas <IoIosArrowDown className="ml-auto" /></SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <a href="/mapa">
                        <SidebarMenuSubItem>
                          <SidebarMenuButton><FaMapMarkedAlt />Mapa Predios</SidebarMenuButton>
                        </SidebarMenuSubItem>
                      </a>
                      <a href="/mapaValvulas">
                        <SidebarMenuSubItem>
                          <SidebarMenuButton><FaMapMarkedAlt />Mapa Valvulas</SidebarMenuButton>
                        </SidebarMenuSubItem>
                      </a>
                    </SidebarMenuSub>
                  </CollapsibleContent>

                </SidebarMenuItem>
              </Collapsible>


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
                  <FaUser /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  localStorage.setItem("TOKEN", "");
                  navigate("/login");
                }}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
