import axiosClient from "@/axios-client"

export const importarPredios = async (setLoading: Function, values: Object) => {
  try {
    setLoading(true);
    const response = await axiosClient.post('/predios/importar', values);
  }
  catch (e) {
    throw e
  }
  finally {
    setLoading(false);
  }
}

export const getPredios = async (setLoading: Function, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get('/predios');
    setData(response?.data?.data);
  }
  catch (e) {
    throw e
  }
  finally {
    setLoading(false);
  }
}
