import React, { useEffect, useRef, useState } from 'react';
import { initMapa, initMapaValvulas, parseCoordinates } from '@/lib/MapaService';
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
import { ModalVerValvula } from '@/components/components/ModalVerValvula';

export const MapaValvulas = () => {
  const [predios, setPredios] = useState([]);
  const [valvulas, setValvulas] = useState([]);
  const [loadingPredios, setLoadingPredios] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const triggerModalRef = useRef();
  const [selectedPredio, setSelectedPredio] = useState(null);
  const [map, setMap] = useState(null);
  const verValvulaButton = useRef();
  const [selectedValvulaId, setSelectedValvulaId] = useState(null);
  const [coordinates, setCoordinates] = useState
    (
      {
        localizacion: {
          latitude: 0,
          longitude: 0,
          distance: 500
        }
      }
    )

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    initMapaValvulas(valvulas, map, setMap, setCoordinates, setSelectedValvulaId);
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

  useEffect(()=>{
    if(selectedValvulaId != null){
      verValvulaButton.current.click();
    }
  },[selectedValvulaId])

  return (
    <div>
      <ModalVerValvula verValvulaButton={verValvulaButton} setSelectedValvulaId={setSelectedValvulaId} selectedValvulaId={selectedValvulaId} />
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
