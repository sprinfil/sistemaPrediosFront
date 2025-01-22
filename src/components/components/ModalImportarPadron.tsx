import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import * as XLSX from "xlsx";

const ModalImportarPadron = () => {
  const [data, setData] = useState([]); // State to hold Excel data

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert sheet to JSON
      setData(sheetData); // Set data in state
    };
    reader.readAsBinaryString(file);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="ml-auto">
        <Button className="ml-auto">Importar padrón</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-[90%]">
        <AlertDialogHeader>
          <AlertDialogCancel className="rounded-full px-3 text-red-500 hover:text-red-600 ml-auto">
            <RxCross2 />
          </AlertDialogCancel>
        </AlertDialogHeader>

        <div className="h-[80vh]">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          <div className="overflow-auto mt-4">
            {data.length > 0 ? (
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((key) => (
                      <th
                        key={key}
                        className="border border-gray-300 px-4 py-2 text-left"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td
                          key={i}
                          className="border border-gray-300 px-4 py-2"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500 mt-4">
                No hay datos para mostrar.
              </p>
            )}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalImportarPadron;