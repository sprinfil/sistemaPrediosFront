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
import { ModalImportarPrediosGeoJson } from './ModalImportarPrediosGeoJson'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { ModalImportarValvulas } from './ModalImportarValvulas'


export const MenuBarMapa = () => {
  return (
    <>
      <Card>
        <ModalImportarPrediosGeoJson />
        <ModalImportarValvulas />
      </Card>
    </>
  )
}
