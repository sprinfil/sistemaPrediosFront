"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getOperadores } from "@/lib/OperadorService"
import { Loader } from "./Loader"

export function ComboBoxOperadores({setOperador, defualtOperador}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defualtOperador ?? "")
  const [frameworks, setFrameworks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  getOperadores(setLoading, setFrameworks);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.id === value)?.name
            : "Buscar operador"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar Operador" />
          <CommandList>
            {
              !loading && frameworks.length == 0 ? <><CommandEmpty>No se encontraron operadores.</CommandEmpty></> : <></>
            }
            <CommandGroup> 
              {
                loading ?
                  <div className="w-full flex items-center justify-center">
                    <Loader></Loader>
                  </div>
                  :
                  <>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.id}
                        value={framework.id}
                        onSelect={(currentValue) => {
                          setValue(framework.id == value ? "" : framework.id)
                          setOpen(false)
                          setOperador(framework.id == value ? {} : framework);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === framework.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {framework.name}
                      </CommandItem>
                    ))}
                  </>
              }

            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
