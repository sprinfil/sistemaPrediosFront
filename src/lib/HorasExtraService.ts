import { useEffect, useState } from "react"
import { fetchData } from "./ToolService"
import { toast } from "@/hooks/use-toast"

export const useLogicSolicitudes = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [params, setParams] = useState({});
  const [solicitudes, setSolicitudes] = useState(false);

  const fetch = async () => {
    const data = await fetchData(setLoadingData, toast, params, "/he-solicitudes");
    setSolicitudes(data?.data);
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
    setSolicitudes
  }


}