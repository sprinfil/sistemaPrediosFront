import { useEffect, useState } from "react"
import { fetchData } from "./ToolService"
import { toast } from "@/hooks/use-toast"
import { SolicitudCambiarEstado, SolicitudCambiarEtapa } from "./Solicitudes";

export const useLogicSolicitudes = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [params, setParams] = useState({});
  const [solicitudes, setSolicitudes] = useState(false);
  const [meta, setMeta] = useState({});

  const fetch = async () => {
    const data = await fetchData(setLoadingData, toast, params, "/he-solicitudes");
    setSolicitudes(data?.data);
    setMeta(data?.meta);
  }

  const CambioEstados = async (SolicitudID: number, values: any) => {
    const requestData = {
      status: values
    };
    await SolicitudCambiarEstado(SolicitudID, setLoadingData, requestData, setSolicitudes)
  }

  const CambioEtapa = async (SolicitudID: number, values: any) => {
    const requestData = {
      step: values
    };
    await SolicitudCambiarEtapa(SolicitudID, setLoadingData, requestData, setSolicitudes)
  }

  useEffect(() => {
    fetch();
  }, [])

  return {
    fetch,
    loadingData,
    setLoadingData,
    params,
    setParams,
    solicitudes,
    setSolicitudes,
    CambioEstados,
    CambioEtapa,
    meta,
    setMeta,
    toast
  }


}