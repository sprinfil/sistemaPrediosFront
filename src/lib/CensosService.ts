import axiosClient from "@/axios-client";
import { useEffect } from "react";

export const getCensosCargasdeTrabajo = async () => {
  const response = await axiosClient.get("/encuestas-cargas-trabajos");
  return response.data?.data
}

export const crearCargaTrabajoCensos = async (fileInfo, operadorSeleccionado, encuestaSeleccionada, asignedById, setLoading, setData) => {
  try {
    if (!Array.isArray(fileInfo) || fileInfo.length === 0) {
      return;
    }
    setLoading(true);

    const carga_trabajo_tomas = fileInfo.map((row) => {
      const campos = Object.values(row);
      return {
        cuenta: campos[0].toString(),
        usuario: campos[1].toString(),
        orden: campos[2].toString(),
        direccion: campos[3].toString(),
        clave_catastral: campos[4] ? campos[4].toString() : "n/a",
        no_medidor: campos[5] ? campos[5].toString() : "0"
      };
    });

    const requestBody = {
      encuesta_id: encuestaSeleccionada.id,
      operador_id: operadorSeleccionado.id,
      carga_trabajo_tomas: carga_trabajo_tomas
    };

    const response = await axiosClient.post('/encuestas-cargas-trabajos/bulk', requestBody);

    setData(prev => {
      const data = {
        ...response?.data,
        numero_detalles: carga_trabajo_tomas.length,
      };
      //console.log("response",response?.data)
      return [data, ...prev];
    });
    return response;
  } catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
};

export const getEncuestas = async () => {
  const response = await axiosClient.get('/encuestas');
  return response?.data?.data
}

export const updateCensosCargadeTrabajo = async (setLoading: Function,cargaTrabajo: { encuesta_id: number, operador_id: number, estado: string, id:number }, modificacion: string,setData: Function) => 
{
  try {
    setLoading(true);
    const response = await axiosClient.put(`/encuestas-cargas-trabajos/${cargaTrabajo.id}`, { 
      encuesta_id: cargaTrabajo.encuesta_id,
      operador_id: cargaTrabajo.operador_id,
      estado: modificacion,
    });
    setData(prev => {
      return prev.map(carga => {
        if (cargaTrabajo.id == carga?.id) {
          return response?.data?.data;
        } else {
          return carga;
        }
      });
    });
  }
  catch (e) {
    throw e;
  }
  finally {
    setLoading(false);
  }
}