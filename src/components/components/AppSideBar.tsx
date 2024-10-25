import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
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

export function AppSidebar() {
  const navigate = useNavigate();

  const items = [
    {
      title: "Home",
      url: "/",
      icon: <IoHome />
    },
    {
      title: "Mapa",
      url: "/mapa",
      icon: <FaMapMarkedAlt />
    },
    {
      title: "Cargas de trabajo",
      url: "/cargasTrabajo",
      icon: <FaClipboardList />
    },
    {
      title: "Operadores",
      url: "/operadores",
      icon: <FaUserTie />
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sistema de Predios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
