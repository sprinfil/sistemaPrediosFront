import axiosClient from "@/axios-client"
import { useEffect } from "react";

export const indexValvulas = async (setLoading: Function, params: Object, setData: Function) => {
    try {
      setLoading(true);
      //const response = await axiosClient.get("/valvulas", { params: { ...params } });
      //setData(response?.data?.data);
      //console.log("", response?.data?.data)
    }
    catch (e) {
      throw e;
    }
    finally {
      setLoading(false);
    }
}

export const getAllVisitas = async (setLoading: Function, values: Object, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.post("/valvulas/get-all-visitas", values);
    setData(response?.data?.data); 
    //console.log("vnsonvui", response?.data?.data) 
  } catch (e) {
    console.log(e)
    throw e;
  } finally {
    setLoading(false);
  }
};

export const getUsuariosVisitas = async (setLoading: Function, values: Object, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.post("/valvulas/get-visitas", values);
    setData(response?.data?.data); 
    console.log("getvisitas", response?.data?.data) 
  } catch (e) {
    console.log(e)
    throw e;
  } finally {
    setLoading(false);
  }
};