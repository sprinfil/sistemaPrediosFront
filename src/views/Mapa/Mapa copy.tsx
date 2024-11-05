import React, { useEffect, useState } from 'react'
import { GoogleMap, InfoWindow, LoadScript, Polygon, Marker } from '@react-google-maps/api';
import { initMapa, parseCoordinates } from '@/lib/MapaService';
import { mapContainerStyle, center } from '@/lib/MapaService';
import { MenuBarMapa } from '@/components/components/MenuBarMapa';
import { getPredios } from '@/lib/PredioService';
import { Loader } from '@/components/components/Loader';
export const Mapa = () => {
  const [predios, setPredios] = useState([]);
  const [loadingPredios, setLoadingPredios] = useState(false)
  useEffect(() => { getPredios(setLoadingPredios, setPredios) }, [])

  return (
    <div>
      <p>Mapa</p>
      <div className='mb-4'>
        <MenuBarMapa />
      </div>
      {
        loadingPredios ? <>
          <div className='absolute z-20'>
            <Loader />
          </div></> : <></>
      }

      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
        >


          {predios?.map((predio) => {
            return (
              <>
                <Polygon
                  key={predio.id}
                  paths={parseCoordinates(predio)}
                  options={{
                    fillColor: 'lightblue',
                    fillOpacity: 0.4,
                    strokeColor: 'blue',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    clickable: false,
                    draggable: false,
                    editable: false,
                    geodesic: false,
                    zIndex: 1,
                  }}
                />
                <Marker position={{ lat: 24.14249654133997, lng: -110.31265270036448 }} />
              </>
            )
          }
          )}


        </GoogleMap>
      </LoadScript>

    </div>
  )
}
