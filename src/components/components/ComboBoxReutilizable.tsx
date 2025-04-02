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
import LoaderHorizontal from "./LoaderHorizontal"

export function ComboBoxReutilizable({
  items = [],
  loading = false,
  setItem,
  placeholder = "Buscar calles ...",
  defaultValue = null,
  accesorKey = "nombre",
  setAllObject = null,

}) {
  const [frameworks, setFrameworks] = React.useState([]);
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  React.useEffect(() => { setFrameworks(items); }, [items])
  React.useEffect(() => {
    if (setItem) {
      setItem(value);
    }
  }, [value])

  React.useEffect(() => {
    if (defaultValue != null) {
      setValue(defaultValue)
    }
  }, [defaultValue])

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
            ? frameworks.find((framework) => framework.id === value)?.[accesorKey]
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 h-[300px] overflow-auto">
        {
          loading ?
            <>
              <LoaderHorizontal styles={"w-full"} />
            </>
            :
            <>
              <Command>
                <CommandInput placeholder={placeholder} />
                <CommandList>
                  <CommandEmpty>Sin resultados</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.id}
                        value={framework.id}
                        onSelect={(currentValue) => {
                          setValue(framework.id === value ? "" : framework.id)
                          setOpen(false)
                          if (setAllObject) {
                            setAllObject(framework.id === value ? "" : framework)
                          }
                        }}
                      >
                        {framework?.[accesorKey]}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === framework.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </>
        }

      </PopoverContent>
    </Popover>
  )
}
