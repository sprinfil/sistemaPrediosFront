import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { EyeIcon } from "lucide-react";
import { Trash2Icon } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { IoHomeOutline } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";
import { FaRegSave } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BiImport } from "react-icons/bi";

export const icons = {
  ver: (styles) => <EyeIcon className={styles} />,
  eliminar: (styles) => <Trash2Icon className={styles} />,
  editar: (styles) => <Pencil2Icon className={styles} />,
  agregar: (styles) => <FiPlusCircle className={styles} />,

  confirmar: (styles) => <FaCheck className={styles} />,
  cancelar: (styles) => <RxCross2 className={styles} />,

  home: (styles) => <IoHomeOutline className={styles} />,
  guardar: (styles) => <FaRegSave className={styles} />,
  buscar: (styles) => <FaMagnifyingGlass className={styles} />,

  importar: (styles) => <BiImport className={styles} />,

};
