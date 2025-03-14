import axiosClient from "@/axios-client";
import { catchErrors } from "./ToolService";

export const fetchData = async (setLoading: Function, endpoint: string, toast: any) => {
  try {
    setLoading(true);
    const response = await axiosClient.get(endpoint);
    return response?.data?.data;
  } catch (e) {
    catchErrors(e, toast);
    throw e;
  }
  finally {
    setLoading(false);
  }
}

export const createData = async (
  setLoading: Function,
  values: Object,
  endpoint: string,
  toast: any
) => {
  try {
    setLoading(true);
    const response = await axiosClient.post(endpoint, values);
    return response?.data?.data;
  } catch (e) {
    catchErrors(e, toast);
    throw e;
  }
  finally {
    setLoading(false);
  }
}

export const updateData = async (
  setLoading: Function,
  values: Object,
  endpoint: string,
  toast: any
) => {
  try {
    setLoading(true);
    const response = await axiosClient.put(endpoint, values);
    return response?.data?.data;
  } catch (e) {
    catchErrors(e, toast);
    throw e;
  }
  finally {
    setLoading(false);
  }
}

export const deleteData = async (
  setLoading: Function,
  endpoint: string,
  toast: any
) => {
  try {
    setLoading(true);
    const response = await axiosClient.delete(endpoint);
    return response?.data?.data;
  } catch (e) {
    catchErrors(e, toast);
    throw e;
  }
  finally {
    setLoading(false);
  }
}