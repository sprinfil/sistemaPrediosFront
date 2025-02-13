import React, { useEffect, useRef, useState } from "react";
import { initMapa, parseCoordinates } from "@/lib/MapaService";
import { mapContainerStyle, center } from "@/lib/MapaService";
import { MenuBarMapa } from "@/components/components/MenuBarMapa";
import {
  getCargasTrabajoSinRelaciones,
  getPredios,
  getPrediosByDistance,
} from "@/lib/PredioService";
import { Loader } from "@/components/components/Loader";
import { getValvulas } from "@/lib/ValvulasService";
import { ModalVerPredio } from "@/components/components/ModalVerPredio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModalImportarPrediosGeoJson } from "@/components/components/ModalImportarPrediosGeoJson";
import { ComboBoxSplConceptos } from "@/components/components/ComboBoxSplConceptos";

export const Mapa = () => {
  const [cargasTrabajo, setCargasTrabajo] = useState([]);
  const [loadingCargasTrabajo, setLoadingCargasTrabajo] = useState(false);
  const [predios, setPredios] = useState([]);
  const [valvulas, setValvulas] = useState([]);
  const [loadingPredios, setLoadingPredios] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const triggerModalRef = useRef();
  const [selectedPredio, setSelectedPredio] = useState(null);
  const [map, setMap] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [coordinates, setCoorinates] = useState({
    localizacion: {
      latitude: 0,
      longitude: 0,
      distance: 500,
    },
  });

  useEffect(() => {
    init();
  }, [coordinates]);

  useEffect(() => {
    if (!loadingPredios) {
      initMapa(
        predios,
        valvulas,
        setSelectedPredio,
        map,
        setMap,
        setCoorinates,
        setPolygons
      );
    }
  }, [loadingPredios]);

  const init = async () => {
    await getPrediosByDistance(setLoadingPredios, setPredios, coordinates);
    // await getValvulas(setLoadingPredios, setValvulas);
    setLoaded(true);
  };

  useEffect(() => {
    if (selectedPredio != null) {
      triggerModalRef?.current?.click();
    }
  }, [selectedPredio]);

  useEffect(() => {
    getCargasTrabajoSinRelaciones(setLoadingCargasTrabajo, setCargasTrabajo);
  }, []);

  return (
    <div>
      <p>Mapa Predios</p>
      <div className="mb-4">
        <Card className="mt-3 flex items-center gap-2 border-none">
          <ModalImportarPrediosGeoJson />
          <Button
            onClick={() => {
              polygons.forEach((polygon) => polygon.setMap(null));
            }}
          >
            Limpiar
          </Button>
          <ComboBoxSplConceptos
            className={"w-[500px] z-50"}
            placeholder={"Buscar carga de trabajo ..."}
            loading={loadingCargasTrabajo}
            items={cargasTrabajo}
            accessName={"nombre_carga"}
          />
        </Card>
        <ModalVerPredio
          predioId={selectedPredio}
          setPredioId={setSelectedPredio}
          trigger={<Button ref={triggerModalRef} className="hidden"></Button>}
        />
      </div>
      {loadingPredios && (
        <div className="absolute z-20">
          <Loader />
        </div>
      )}
      <div id="map" style={mapContainerStyle}></div>
    </div>
  );
};
