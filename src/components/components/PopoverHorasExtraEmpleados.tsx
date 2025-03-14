import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover";
import { FaMagnifyingGlass } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import dayjs from "dayjs";
import { icons } from "@/constants/icons";
dayjs.locale("es");
  
export const PopoverHorasExtrasEmpleado= ({ dataEmpleados,setDataEmpleados, horasEmpleados,setHorasEmpleados }) => {
    const [loadingi, setLoadingi] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (searchTerm.trim() !== "") {
          //getSearch(setLoadingi, { nombre: searchTerm }, setDataValvula);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
      <Popover>
        <PopoverTrigger className="ml-1">
          <Button variant={"outline"} onClick={() => setHorasEmpleados(null)}>
            {horasEmpleados?.nombre ?? "Empleados"} {icons.buscar("")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" min-w-[500px]">
          <div className="min-h-[200px]">
            <Input
              placeholder="Nombre del empleados"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="h-[200px] overflow-auto w-full  mt-2">
              {dataEmpleados?.map((horasEmpleados, index) => {
                return (
                <>
                <Button
                    onClick={() => {
                        setHorasEmpleados(horasEmpleados);
                        setDataEmpleados([]);
                    }}
                    variant={"outline"}
                    key={index}
                    className="flex items-center gap-2 w-full justify-start my-1 font-normal"
                >
                    <p key={index}>
                        {horasEmpleados?.nombre ?? "--"}{" "}
                    </p>
                </Button>
                </>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
};
  