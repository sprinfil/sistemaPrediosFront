import axiosClient from "@/axios-client";
import dayjs from "dayjs";
dayjs.locale("es");

export const catchErrors = (e, toast) => {
  let texto = 'Algo salio mal';
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

  toast({
    title: "Error",
    description: texto,
    variant: "destructive"
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
  }
  finally {
    setLoading(false);
  }
}

export const formatearFecha = (fecha) => {
  return dayjs(fecha).format("DD [de] MMMM [del] YYYY")
}