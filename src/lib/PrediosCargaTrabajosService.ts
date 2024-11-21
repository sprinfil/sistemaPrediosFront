import axiosClient from "@/axios-client";
import { useEffect } from "react";

export const crearCargaTrabajo = async (fileInfo, operadorSeleccionado, asignedById, setLoading, setData) => {
  try {
    // console.log(fileInfo)
    if (!Array.isArray(fileInfo) || fileInfo.length === 0) {
      return;
    }
    setLoading(true)
    const nombre = Object.keys(fileInfo[0])[0];
    const predioCargaTrabajo =
    {
      user_id: operadorSeleccionado?.id,
      asigned_by: asignedById,
      nombre_carga: nombre,
      status: 0
    }

    const response = await axiosClient.post('/predios-carga-trabajos', predioCargaTrabajo);

    const carga_trabajo_id = response?.data?.data?.id;
    const predioCargaTrabajoDetalles: any[] = [];

    fileInfo?.map((row, index) => {
     
        let campos: any[] = [];
        Object.values(row).map((value, i) => {
          campos.push(value);
        })

        let cargaTrabajoDetalleTemp =
        {
          id_carga_trabajo: carga_trabajo_id,
          cuenta: campos[0],
          usuario: campos[1],
          orden: campos[2],
          direccion: campos[3],
          clave_catastral: campos[4].toString().length > 1 ? campos[4].toString() : 'n/a',
          no_medidor: campos[5] == " " ? 0 : campos[5],
        }
        predioCargaTrabajoDetalles.push(cargaTrabajoDetalleTemp);
      
    })

    // console.log(nombre);
    // console.log(predioCargaTrabajoDetalles);
    const responsePrediosCargaTrabajosDetalles = await axiosClient.post('/predios-carga-trabajos-detalles/bulk',
      {
        predios_carga_trabajo_detalles: predioCargaTrabajoDetalles
      });

    setData(prev => {
      let data =
      {
        ...response?.data?.data,
        numero_detalles: predioCargaTrabajoDetalles?.length,
      }
      return [data, ...prev];
    })

  } catch (e) {

    throw e;

  } finally {
    setLoading(false)
  }
};

export const getPrediosCargaTrabajos = async (setLoading: Function, setData: Function) => {
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/predios-carga-trabajos/alone");
        setData(response?.data?.data);
      }
      catch (e) {
        throw e;
      }
      finally {
        setLoading(false);
      }
    }
    fetch();
  }, [])
}

export const getCargaTrabajoByid = async (id: number, setCargaTrabajo: Function, setLoading: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get('/predios-carga-trabajos/' + id);
    setCargaTrabajo(response?.data?.data);
  }
  catch (e) {
    throw e;
  }
  finally {
    setLoading(false);
  }
}

export const getStatus = (status) => {
  if (status === 0) {
    return "EN PROCESO";
  }
  if (status === 1) {
    return "CONCLUIDA";
  }
  if (status === 2) {
    return "CANCELADA";
  }
  return "DESCONOCIDO";
};

export const updateCargaTrabajo = async (setLoading: Function, values: Object, cargaTrabajoId: Number, setCargaTrabajo: Function, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.put('/predios-carga-trabajos/' + cargaTrabajoId, values);
    setCargaTrabajo(response?.data?.data);
    setData(prev => {
      return prev.map(carga => {
        if (cargaTrabajoId == carga?.id) {
          return response?.data?.data;
        } else {
          return carga
        }
      })
    })
  }
  catch (e) {
    throw e;
  }
  finally {
    setLoading(false);
  }
}

export const updateCargaTrabajoEstatus = async (setLoading: Function, cargaTrabajoId: number, status: number, setCargaTrabajo: Function, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.patch('/predios-carga-trabajos/' + cargaTrabajoId, { status: status });
    // setCargaTrabajo(response?.data?.data);
    setData(prev => {
      return prev.map(carga => {
        if (cargaTrabajoId == carga?.id) {
          return response?.data?.data;
        } else {
          return carga
        }
      })
    })
  }
  catch (e) {
    throw e;
  }
  finally {
    setLoading(false);
  }
}