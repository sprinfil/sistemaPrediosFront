import axiosClient from "@/axios-client";
import dayjs from "dayjs";
dayjs.locale("es");

export const catchErrors = (e, toast) => {
  let texto = 'Algo salio mal';
  let variant = "destructive"

  if (e?.response?.status == 422) {
    texto = "";
    let errores = e?.response?.data?.errors;
    for (const key in errores) {
      if (errores.hasOwnProperty(key)) {
        const mensaje = errores[key].join(' ').replace(/\./g, ' ');
        texto += `${key}: ${mensaje} `;
      }
    }
  }

  if (e?.response?.status == 500) {
    if (e?.response?.data?.errors.length > 0) {
      texto = e?.response?.data?.errors
    } else {
      texto = e?.response?.data?.data?.message;
    }
  }

  if (e?.response?.status == 403) {
    texto = "No tienes permisos para realizar esta acción";
    variant = ""
  }

  toast({
    title: "Error",
    description: texto,
    variant: variant
  })

}

export const formatearDinero = (valor) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(valor);
};

export const fetchData = async (setLoading: Function, toast: any, params: any, endpoint: any) => {
  try {
    setLoading(true);
    const response = await axiosClient.get(endpoint, { params: params });
    return response?.data;
  } catch (e) {
    catchErrors(e, toast);
    throw e;
  }
  finally {
    setLoading(false);
  }
}

export const putData = async (setLoading: Function, toast: any, params: any, endpoint: any) => {
  try {
    setLoading(true);
    const response = await axiosClient.put(endpoint, params);
    return response?.data;
  } catch (e) {
    catchErrors(e, toast);
    throw e;
  }
  finally {
    setLoading(false);
  }
}

export const postData = async (setLoading: Function, toast: any, params: any, endpoint: any) => {
  try {
    setLoading(true);
    const response = await axiosClient.post(endpoint, params);
    return response?.data;
  } catch (e) {
    catchErrors(e, toast);
    throw e;
  }
  finally {
    setLoading(false);
  }
}

export const deleteData = async (setLoading: Function, toast: any, endpoint: any) => {
  try {
    setLoading(true);
    const response = await axiosClient.delete(endpoint);
    return response?.data;
  } catch (e) {
    catchErrors(e, toast);
    throw e;
  }
  finally {
    setLoading(false);
  }
}

export const formatearFecha = (fecha) => {
  return dayjs(fecha).format("DD [de] MMMM [del] YYYY")
}

export const useLog = (data) => {
  if (import.meta.env.ACTIVE_LOGS == true) {
    console.log(data);
  }
}

