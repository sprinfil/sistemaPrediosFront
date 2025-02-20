import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover";
import { FaMagnifyingGlass } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
dayjs.locale("es");
import { getSearch } from "@/lib/Reportes";
  
export const PopoverReporteValvula= ({ dataValvula,setDataValvula, dvalvula,setDvalvula }) => {
    const [loadingi, setLoadingi] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (searchTerm.trim() !== "") {
          getSearch(setLoadingi, { nombre: searchTerm }, setDataValvula);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
      <Popover>
        <PopoverTrigger className="ml-1">
          <Button variant={"outline"} onClick={() => setDvalvula(null)}>
            {dvalvula?.nombre ?? "Valvula"} <FaMagnifyingGlass/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" min-w-[500px]">
          <div className="min-h-[200px]">
            <Input
              placeholder="Nombre de la valvula "
              onChange={(e) => setSearchTerm(e.target.value)}
              // onChange={(e) => {
              //   getSearch(setLoadingi, {nombre: e.target.value},setDataValvula);
              // }}
            />
            <div className="h-[200px] overflow-auto w-full  mt-2">
              {dataValvula?.map((dvalvula, index) => {
                return (
                <>
                <Button
                    onClick={() => {
                        setDvalvula(dvalvula);
                        setDataValvula([]);
                        //console.log("Regreso",dvalvula?.id)
                    }}
                    variant={"outline"}
                    key={index}
                    className="flex items-center gap-2 w-full justify-start my-1 font-normal"
                >
                    <p key={index}>
                        {dvalvula?.nombre ?? "--"}{" "}
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
  