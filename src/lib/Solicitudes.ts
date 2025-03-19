import axiosClient from "@/axios-client"

export const getEmpleados = async (setLoading: Function, values: Object, setData: Function) => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/he-empleados/by-name", values);
      setData(response?.data?.data); 
      console.log("getEmpleados", response?.data?.data)
      //console.log("empleados", values) 
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
};

export const getGrupos = async (setLoading: Function, values: Object, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get("/he-grupos/by-name", values);
    setData(response?.data?.data); 
    //console.log("getGrupos", response?.data?.data)
    //console.log("grupos", values) 
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
export const crearSolicitudGrupos = async(setLoading:Function, values:Object, setData:Function) => {
  try {
    setLoading(true)
    const response = await axiosClient.post("/he-solicitudes/group/{id}", values); //agregar el id
    setData(response?.data?.data); 
  } catch (e) {
    throw e;
  } finally{
    setLoading(false)
  }
}