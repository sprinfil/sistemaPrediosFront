import React, { useEffect, useRef, useState } from 'react';
import { initMapa, parseCoordinates } from '@/lib/MapaService';
import { mapContainerStyle, center } from '@/lib/MapaService';
import { MenuBarMapa } from '@/components/components/MenuBarMapa';
import { getPredios } from '@/lib/PredioService';
import { Loader } from '@/components/components/Loader';
import { getValvulas } from '@/lib/ValvulasService';
import { ModalVerPredio } from '@/components/components/ModalVerPredio';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ModalImportarPrediosGeoJson } from '@/components/components/ModalImportarPrediosGeoJson';
import { ModalImportarValvulas } from '@/components/components/ModalImportarValvulas';

export const MapaValvulas = () => {
  const [predios, setPredios] = useState([]);
  const [valvulas, setValvulas] = useState([]);
  const [loadingPredios, setLoadingPredios] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const triggerModalRef = useRef();
  const [selectedPredio, setSelectedPredio] = useState(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    initMapa(predios, valvulas, setSelectedPredio);
  }, [loaded])

  const init = async () => {
    //await getPredios(setLoadingPredios, setPredios);
    await getValvulas(setLoadingPredios, setValvulas);
    setLoaded(true);
  }

  useEffect(() => {
    if (selectedPredio != null) {
      triggerModalRef?.current?.click();
    }
  }, [selectedPredio])

  return (
    <div>
      <p>Mapa Valvulas</p>
      <div className="mb-4">
        <Card className='mt-3'>
          <ModalImportarValvulas />
        </Card>
        <ModalVerPredio predioId={selectedPredio} setPredioId={setSelectedPredio} trigger={<Button ref={triggerModalRef} className='hidden'></Button>} />
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
