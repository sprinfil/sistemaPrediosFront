import { useEffect, useRef, useState } from "react"
import { catchErrors, fetchData } from "./ToolService";
import { toast } from "@/hooks/use-toast";
import axiosClient from "@/axios-client";

export const useEmpleados = () => {
  /*
    Importacion
  */
  const excelEmpleadosRef = useRef();
  const [loadingImportacion, setLoadingImportacion] = useState(false);
  const buttonCancelarModal = useRef();

  const handleImportarEmpleados = async (endpoint, updateData) => {
    try {
      if (excelEmpleadosRef.current.files.length === 0) return;
      const formData = new FormData();

      formData.append('file', excelEmpleadosRef.current.files[0]);
      setLoadingImportacion(true);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axiosClient.post(endpoint, formData, config);
      buttonCancelarModal?.current?.click();
      if (updateData) {
        updateData();
      }
      return response?.data;
    } catch (e) {
      catchErrors(e, toast);
      throw e;
    } finally {
      setLoadingImportacion(false);
    }
  }

  /*
    Get empleados
  */
  const [empleados, setEmpleados] = useState([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);

  const getEmpleados = async () => {
    const response = await fetchData(setLoadingEmpleados, toast, {}, "/he-empleados");
    setEmpleados(response?.data);
  }

  useEffect(() => {
    getEmpleados();
  }, [])

  return {
    excelEmpleadosRef,
    loadingImportacion,
    handleImportarEmpleados,
    buttonCancelarModal,
    empleados,
    setEmpleados,
    loadingEmpleados,
    setLoadingEmpleados,
    getEmpleados
  }
}