import axiosClient from "@/axios-client"

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
    const response = await axiosClient.post("/he-solicitudes/", values);
    setData(response?.data?.data); 
  } catch (e) {
    throw e;
  } finally{
    setLoading(false)
  }
}

export const crearSolicitudGrupos = async(GrupoId:number, setLoading:Function, values:Object, setData:Function) => {
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

export async function editarSolicitud( SolicitudId: number,setLoading: Function,values: Object,setData: Function) {
  try {
    setLoading(true);
    const response = await axiosClient.put('/he-solicitudes/' + SolicitudId, values);
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

