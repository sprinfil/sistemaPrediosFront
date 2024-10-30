import axiosClient from "@/axios-client"
import { useEffect } from "react";

export const fetchRoles = async (setLoading: Function, setRoles: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get('/roles');
    setRoles(response?.data?.data);
  }
  catch (e) {
    throw e
  }
  finally {
    setLoading(false);
  }
}


