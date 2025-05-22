import axiosClient from "@/axios-client";

export const getCensosCargasdeTrabajo = async () => {
  const response = await axiosClient.get("/encuestas-cargas-trabajos");
  return response.data?.data
}

export const crearCargaTrabajoCensos = async (requestBody) => {
  const response = await axiosClient.post('/encuestas-cargas-trabajos/bulk', requestBody);
  return response
};

export const getEncuestas = async () => {
  const response = await axiosClient.get('/encuestas');
  return response?.data?.data
}

export const updateCensosCargadeTrabajo = async (cargaTrabajo: { encuesta_id: number, operador_id: number, estado: string, id:number }, modificacion: string) => 
{
  const response = await axiosClient.put(`/encuestas-cargas-trabajos/${cargaTrabajo.id}`, { 
    encuesta_id: cargaTrabajo.encuesta_id,
    operador_id: cargaTrabajo.operador_id,
    estado: modificacion,
  });
  return response
}