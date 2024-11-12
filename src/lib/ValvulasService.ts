import axiosClient from "@/axios-client"

export const importarValvulas = async (setLoading: Function, values: Object) => {
  try {
    setLoading(true);
    const response = await axiosClient.post('/valvulas', values);
  }
  catch (e) {
    throw e
  }
  finally {
    setLoading(false);
  }
}

export const getValvulas = async (setLoading: Function, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get('/valvulas');
    setData(response?.data?.data);
  }
  catch (e) {
    throw e
  }
  finally {
    setLoading(false);
  }
}

export const getValvulaById = async (setLoading: Function, setValvula: Function, valvulaId: number) => {
  try {
    setLoading(true);
    const response = await axiosClient.get('/valvulas/' + valvulaId);
    setValvula(response?.data?.data);
  }
  catch (e) {
    throw e;
  }
  finally {
    setLoading(false);
  }
}
