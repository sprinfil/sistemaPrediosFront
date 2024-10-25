import React from 'react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"


export const MenuBarMapa = () => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Opciones</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Importar Predios GeoJson</MenubarItem>
          <MenubarItem>Importar Válvulas</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>

  )
}
