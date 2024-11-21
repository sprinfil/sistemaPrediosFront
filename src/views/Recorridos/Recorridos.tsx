
import { DataTableRecorridos } from '@/components/components/DataTableRecorridos'
import { DoubleContainer, Seccion1, Seccion2 } from '@/components/components/DoubleContainer'
import { initMapaRecorridos, mapContainerStyle, StylesRecorridosMap } from '@/lib/MapaService'
import React, { useEffect, useState } from 'react'

export const Recorridos = () => {
  const [map, setMap] = useState(null);
  const [valvulasMarkers, setValvulasMarkers] = useState([]);
  const [recorrdioLine, setRecorridoLine] = useState(null);

  useEffect(() => {
    initMapaRecorridos(map, setMap);
  }, [])

  return (
    <div className='w-full h-[93vh] '>
      <p className='ml-1'>Recorridos (Cajas de Válvulas)</p>
      <DoubleContainer>
        <Seccion1>
          <DataTableRecorridos map={map} setValvulasMarkers={setValvulasMarkers} valvulasMarkers={valvulasMarkers} recorrdioLine={recorrdioLine} setRecorridoLine={setRecorridoLine}/>
        </Seccion1>
        <Seccion2>
          <div id="map" style={StylesRecorridosMap}></div>
        </Seccion2>
      </DoubleContainer>
    </div>
  )
}
