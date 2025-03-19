import { useEffect, useState } from "react";
import { fetchData } from "./ToolService";
import { toast } from "@/hooks/use-toast";

export const useAreas = () => {
    const [areas, setAreas] = useState();
    const [loadingAreas, setLoadingAreas] = useState(false);

    const fetchAreas = async () => {
        const response = await fetchData(setLoadingAreas, toast, {}, "/he-areas")
        setAreas(response?.data);
    }

    useEffect(() => {
        fetchAreas();
    }, [])



    return {
        areas,
        setAreas,
        loadingAreas,
        setLoadingAreas,
        fetchAreas
    }
}