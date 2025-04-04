import axiosClient from "@/axios-client"
import { catchErrors } from "./ToolService";

export const getEmpleados = async (setLoading: Function, values: Object, setData: Function) => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/he-empleados/by-name", { params: { ...values } });
      setData(response?.data?.data);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
};

export const getGrupos = async (setLoading: Function, values: Object, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get("/he-grupos/by-name",{ params: { ...values } });
    setData(response?.data?.data);
  } catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
};

export const crearSolicitudEmpleados = async(setLoading:Function, values:Object, setData:Function) => {
  try {
    setLoading(true)
    const response = await axiosClient.post("/he-solicitudes", values);
    setData(response?.data?.data); 
  } catch (e) {
    throw e;
  } finally{
    setLoading(false)
  }
}

export const crearSolicitudGrupos = async(GrupoId:any, setLoading:Function, values:Object, setData:Function) => {
  try {
    setLoading(true)
    const response = await axiosClient.post('/he-solicitudes/group/' + GrupoId, values);
    setData(response?.data?.data); 
  } catch (e) {
    throw e;
  } finally{
    setLoading(false)
  }
}

export async function editarSolicitud( SolicitudId: any,setLoading: Function,values: Object,setData: Function) {
  try {
    setLoading(true);
    const response = await axiosClient.post('/he-solicitudes/update/' + SolicitudId, values);
    setData(response?.data?.data); 
    console.log(response?.data?.data)
  }
  catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
}

export async function SolicitudCambiarEstado(SolicitudId: number,setLoading: Function,values: Object,setData: Function)
{
  try {
    setLoading(true);
    const response = await axiosClient.patch('/he-solicitudes/change-status/' + SolicitudId, values);
    setData(prev => {
      return prev.map(solicitud => {
        if (solicitud?.id == SolicitudId) {
          return response?.data?.data
        } else {
          return solicitud;
        }
      })
    })
  }
  catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
}

export async function SolicitudCambiarEtapa(SolicitudId: number,setLoading: Function,values: Object,setData: Function)
{
  try {
    setLoading(true);
    const response = await axiosClient.patch('/he-solicitudes/change-step/'+SolicitudId, values);
    setData(prev => {
      return prev.map(solicitud => {
        if (solicitud?.id == SolicitudId) {
          return response?.data?.data
        } else {
          return solicitud;
        }
      })
    })
  }
  catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
}

export async function CambiarEstado(SolicitudId: number,setLoading: Function,values: Object,setData: Function)
{
  try {
    setLoading(true);
    const response = await axiosClient.patch('/he-solicitudes/change-status/' + SolicitudId, values);
    setData(response?.data?.data)
  }
  catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
}

export async function CambiarEtapa(SolicitudId: number,setLoading: Function,values: Object,setData: Function)
{
  try {
    setLoading(true);
    const response = await axiosClient.patch('/he-solicitudes/change-step/'+SolicitudId, values);
    setData(response?.data?.data)
  }
  catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
}



export const getEmpleadosArray = async (setLoading: Function,ids:Object,toast: any) => 
  {
    try {
      setLoading(true);
      const response = await axiosClient.post('/he-empleados/by-ids', { ids: ids });
      return response?.data?.data;
    } catch (e) {
      catchErrors(e, toast);
      throw e;
    }
    finally {
      setLoading(false);
    }
  }


