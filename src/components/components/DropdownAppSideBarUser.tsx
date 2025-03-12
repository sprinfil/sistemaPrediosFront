import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";

import { SidebarMenuButton } from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MdOutlineExitToApp } from "react-icons/md";
import ZustandPrincipal from "@/Zustand/ZustandPrincipal";

export const DropdownAppSideBarUser = () => {
  const { user } = ZustandPrincipal();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="h-[60px]">
        <SidebarMenuButton>
          <Avatar>
            <AvatarImage />
            <AvatarFallback>  {user?.name[0]}</AvatarFallback>
          </Avatar>{" "}
          {user?.name}
          <span className="">({user?.username})</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem
          className="cursor-pointer  hover:bg-muted"
          onClick={() => {
            localStorage.setItem("TOKEN", "");
            navigate("/login");
          }}
        >
          <div className="h-[40px] flex gap-2 items-center text-red-500 cursor-pointer">
            <MdOutlineExitToApp />
            Cerrar Sesión
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
