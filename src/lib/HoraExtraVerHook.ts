import { useNavigate, useParams } from "react-router-dom";
import { fetchData } from "./ToolService";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { CambiarEstado, CambiarEtapa} from "./Solicitudes";

export const useHoraExtraVerHook = () => {
    const params = useParams();
    const solicitudId = params?.solicitudId;

    const [loadingArea, setLoadingArea] = useState(false);
    const [solicitud, setSolicitud] = useState({});

    const fetchSolicitud = async () => {
        const response = await fetchData(setLoadingArea, toast, {}, "/he-solicitudes/" + solicitudId);
        setSolicitud(response?.data);
    }

    const CambioEstados = async(SolicitudID:number, values:any)=>{
        const requestData = {
          status: values
        };
        await CambiarEstado(SolicitudID,setLoadingArea,requestData,setSolicitud)
    }
    
    const CambioEtapa = async(SolicitudID:number, values:any)=>{
        const requestData = {
          step: values
        };
        await CambiarEtapa(SolicitudID,setLoadingArea,requestData,setSolicitud)
    }
    

    useEffect(() => {
        fetchSolicitud();
    }, [])

    return {
        solicitudId,
        fetchSolicitud,
        solicitud,
        setSolicitud,
        loadingArea,
        CambioEstados,
        CambioEtapa
    }
}

export const useSolicitudVerHook = () => {
    const params = useParams();
    const solicitudId = params?.solicitudId;

    const [loadingArea, setLoadingArea] = useState(false);
    const [solicitud, setSolicitud] = useState({});
    const [datoForm,setDatosForm] = useState({});

    const fetchSolicitud = async () => {
        const response = await fetchData(setLoadingArea, toast, {}, "/he-solicitudes/" + solicitudId);
        setSolicitud(response?.data);
    }

    useEffect(() => {
        fetchSolicitud();
    }, [])

    return {
        solicitudId,
        fetchSolicitud,
        solicitud,
        setSolicitud,
        loadingArea,
        datoForm,
        setDatosForm
    }
}