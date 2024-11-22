import axiosClient from "@/axios-client"
import { useEffect } from "react";

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

export const getBitacorasByOperador = async (setLoading: Function, setData: Function, setLinks:Function) => {
  const getData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/valvulas/bitacoras/by-operador")
      setData(response?.data?.data);
      setLinks(response?.data?.pagination)
    }
    catch (e) {
      throw e;
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getData();
  }, [])
}

export const getPage = async (setLoading: Function, setData: Function, setLinks:Function, link:String) => {
    try {
      setData([]);
      setLoading(true);
      const response = await axiosClient.get(link)
      setData(response?.data?.data);
      setLinks(response?.data?.pagination)
    }
    catch (e) {
      throw e;
    }
    finally {
      setLoading(false);
    }
}