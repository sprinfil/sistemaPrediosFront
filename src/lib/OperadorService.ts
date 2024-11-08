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
    setData(prev => {
      return prev.map(operador => {
        if (operador?.id == operadorId) {
          return response?.data?.data
        } else {
          return operador;
        }
      })
    })
    // console.log(response?.data?.data)
  }
  catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
}

export async function operadorCambiarEstatus(
  operadorId: number,
  setLoading: Function,
  values: Object,
  setData: Function
) {
  try {
    setLoading(true);
    const response = await axiosClient.patch('/users/' + operadorId, values);
    setData(prev => {
      return prev.map(operador => {
        if (operador?.id == operadorId) {
          return response?.data?.data
        } else {
          return operador;
        }
      })
    })
    // console.log(response?.data?.data)
  }
  catch (e) {
    throw e;
  } finally {
    setLoading(false);
  }
}

