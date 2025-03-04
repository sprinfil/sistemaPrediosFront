import axiosClient from "@/axios-client"
import { useEffect } from "react";

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
    //console.log("getvisitas", response?.data?.data)
    console.log("values del get visitas", values) 
  } catch (e) {
    console.log(e)
    throw e;
  } finally {
    setLoading(false);
  }
};

export const getSearch = async (setLoading: Function, values: Object, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.post("/valvulas/search", values);
    setData(response?.data?.data); 
    //console.log("getSearch", response?.data?.data) 
  } catch (e) {
    console.log(e)
    throw e;
  } finally {
    setLoading(false);
  }
};

export const getReportsVisitas = async (setLoading: Function, values: Object, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get("/reports/1", { params: { ...values } });
    setData(response?.data?.data);
  } catch (e) {
    console.log(e)
    throw e;
  } finally {
    setLoading(false);
  }
};

export const getReportsRecorridos = async (setLoading: Function, values: Object, setData: Function) => {
  try {
    setLoading(true);
    const response = await axiosClient.get("/reports/2", { params: { ...values } });
    setData(response?.data?.data);
  } catch (e) {
    console.log(e)
    throw e;
  } finally {
    setLoading(false);
  }
};