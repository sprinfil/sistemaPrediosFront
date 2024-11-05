import React, { useEffect, useState } from 'react';
import { initMapa, parseCoordinates } from '@/lib/MapaService';
import { mapContainerStyle, center } from '@/lib/MapaService';
import { MenuBarMapa } from '@/components/components/MenuBarMapa';
import { getPredios } from '@/lib/PredioService';
import { Loader } from '@/components/components/Loader';
import { getValvulas } from '@/lib/ValvulasService';

export const Mapa = () => {
  const [predios, setPredios] = useState([]);
  const [valvulas, setValvulas] = useState([]);
  const [loadingPredios, setLoadingPredios] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    initMapa(predios, valvulas);
  }, [loaded])

  const init = async () => {
    await getPredios(setLoadingPredios, setPredios);
    await getValvulas(setLoadingPredios, setValvulas);
    setLoaded(true);
  }

  return (
    <div>
      <p>Mapa</p>
      <div className="mb-4">
        <MenuBarMapa />
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
