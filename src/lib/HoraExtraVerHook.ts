import { useNavigate, useParams } from "react-router-dom";
import { fetchData } from "./ToolService";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useHoraExtraVerHook = () => {
    const params = useParams();
    const solicitudId = params?.solicitudId;

    const [loadingArea, setLoadingArea] = useState(false);
    const [solicitud, setSolicitud] = useState({});

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
        loadingArea
    }
}