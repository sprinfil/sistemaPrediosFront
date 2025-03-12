import {
  CaretSortIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import "../../css/animacionesComponentes.css";
// import ConceptosService from '../../lib/Conceptos';

import { Check } from "lucide-react";
import { Loader } from "./Loader";
import clsx from "clsx";

export const ComboBoxSplConceptos = ({
  className,
  setItem,
  placeholder,
  loading,
  items,
  accessName,
  onItemSelected,
}) => {
  const [openList, setOpenList] = useState(false);
  const listRef = useRef();
  const buttonRef = useRef();
  // const [items, setItems] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);
  const [selectedItem, setSelectedItem] = useState();
  const [search, setSearch] = useState("");
  const inputSearchRef = useRef();

  // const fetch = async () => {
  //   setLoading(true);
  //   // let data = await ConceptosService.get_all();
  //   setItems(data);
  //   setFilteredItems(data);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   fetch();
  // }, []);

  useEffect(() => { setFilteredItems(items) }, [items]);

  useEffect(() => {
    if (!openList) {
      setSearch("");
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.classList.add("hidden");
        }
      }, 100);
    } else {
      if (listRef.current) {
        listRef.current.classList.remove("hidden");
        inputSearchRef?.current.focus();
      }
    }
  }, [openList]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        listRef.current &&
        !listRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenList(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    filterData(search);
  }, [search]);

  const filterData = (search) => {
    if (!search) {
      setFilteredItems(items);
      return;
    }

    setFilteredItems(
      items.filter((item) =>
        item?.[accessName ?? "nombre"]?.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  useEffect(() => {
    setItem ? setItem(selectedItem) : "";
  }, [selectedItem]);

  const handleItemClick = (item: Item) => {
    setSelectedItem((prev) => (prev?.id === item.id ? null : item));
    setOpenList(false);
    // Ejecutar el callback si existe
    if (onItemSelected) {
      onItemSelected(item);
    }
  };

  return (
    <>
      {/* Boton inicial */}
      <div className={clsx("relative", className)}>
        <div
          ref={buttonRef}
          onClick={() => {
            setOpenList((prev) => {
              return !prev;
            });
          }}
          className={
            "select-none flex justify-between border border-border rounded-sm py-2.5 w-full px-4 cursor-pointer transition-all hover:bg-muted"
          }
        >
          <p className="font-semibold">
            {selectedItem != null ? selectedItem?.[accessName ?? "nombre"] : placeholder}
          </p>
          <CaretSortIcon className="h-5 w-5" />
        </div>

        <div
          ref={listRef}
          className={`
            ${openList ? "visible-animate" : "hidden-animate"}
            absolute mt-1 h-[300px] border border-border w-full bg-background rounded-md 
            overflow-auto 
            `}
        >
          {/* Input búsqueda */}
          <div className="h-[40px] bg-background border-b  border-border px-2 flex items-center sticky top-0 z-20">
            <MagnifyingGlassIcon className="mr-3 w-5 h-5 " />
            <input
              ref={inputSearchRef}
              value={search}
              onChange={(e) => {
                setSearch(e?.currentTarget?.value);
              }}
              placeholder={placeholder}
              type="text"
              className="bg-background h-full outline-none w-full"
            />
          </div>

          <div className="px-2 w-full mt-1">
            {loading ? (
              <>
                <Loader />
              </>
            ) : (
              <>
                {filteredItems?.length > 0 ? (
                  filteredItems?.map((item, index) => (
                    <div
                      // onClick={() => {
                      //   setSelectedItem((prev) => {
                      //     if (prev?.id == item?.id) {
                      //       return null;
                      //     } else {
                      //       return item; 
                      //     }
                      //   });
                      //   setOpenList(false);
                      // }}
                      onClick={() => handleItemClick(item)}
                      key={index}
                      className={`${selectedItem?.id == item?.id ? "bg-muted" : ""
                        } my-2 px-10 dark:text-white text-black black:text-white rounded-md h-[40px] w-full py-3 transition-all hover:bg-muted cursor-pointer select-none flex items-center`}
                    >
                      {selectedItem?.id == item?.id && (
                        <CheckIcon className="mr-2" />
                      )}
                      {item?.[accessName ?? "nombre"]}
                    </div>
                  ))
                ) : (
                  <>
                    <p className="w-full text-center mt-5">Sin datos.</p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
