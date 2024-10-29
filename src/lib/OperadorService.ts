import axiosClient from "@/axios-client";
import axios from "axios";
import { useEffect } from "react";

export function getOperadores(setloading: Function, setData: Function) {
  useEffect(() => {
    const fectOperadores = async () => {
      try {
        setloading(true);
        const response = await axiosClient.get('/users');
        setData(response?.data?.data);
      }
      catch (e) {
        throw e;
      }
      finally {
        setloading(false);
      }
    }
    fectOperadores();
  }, [])
}

export async function crearOperador(
  setLoading: Function,
  values: Object,
  setData: Function
) {
  try {
    setLoading(true);
    const response = await axiosClient.post('/users', values);
    setData(prev => {
      return [response?.data?.data, ...prev];
    })
  }
  catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
}

export async function editarOperador(
  operadorId: number,
  setLoading: Function,
  values: Object,
  setData: Function
) {
  try {
    setLoading(true);
    const response = await axiosClient.put('/users/' + operadorId, values);
    // setData(prev => {
    //   return [response?.data, ...prev];
    // })
  }
  catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
}

