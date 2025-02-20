import axiosClient from "@/axios-client"
import { Polygon } from "@react-google-maps/api";
import axios from "axios";

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

//CON PAGINACION
export const getPredios = async (setLoading: Function, setData: Function) => {
  try {
    setLoading(true);

    let url = '/predios';

    do {
      const response = await axiosClient.get(url);

      setData(prev => {
        return [...prev, ...response?.data?.data];
      });

      url = response?.data?.next_page_url;

    } while (url != null);

  } catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
};

export const showPredio = async (id: number, setLoading: Function, setPredio: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get('/predios/' + id);
    setPredio(response?.data?.data);
  } catch (e) {
    throw e
  }
  finally {
    setLoading(false);
  }
}

export const getPrediosByDistance = async (setLoading: Function, setData: Function, coordinates: Object) => {
  try {
    setLoading(true);
    setData([]);
    let url = '/predios/by-distance';

    do {
      const response = await axiosClient.post(url, coordinates);

      setData(prev => {
        return [...prev, ...response?.data?.data];
      });

      url = response?.data?.next_page_url;

    } while (url != null);

  } catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
}

export const getCargasTrabajoSinRelaciones = async (setLoading: Function, setCargasTrabajo: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get("/getAllPrediosCargaTrabajoWithoutRelationShip");
    setCargasTrabajo(response?.data?.data);
  } catch (e) {
    throw e;
  }
  finally {
    setLoading(false)
  }
}

//predios por libro
export const PrediosCargaTrabajo = async (setLoading: Function, id: number, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get("/predios-carga-trabajos/"+id+"/predios");
    setData(response?.data?.data);
  }
  catch (e) {
    throw e;
  }
  finally {
    setLoading(false);
  }
}

