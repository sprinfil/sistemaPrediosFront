import React, { useEffect } from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { initMapa } from '@/lib/MapaService';
import { mapContainerStyle, center } from '@/lib/MapaService';
import { MenuBarMapa } from '@/components/components/MenuBarMapa';

export const Mapa = () => {


  return (
    <div>
      <p>Mapa</p>
      <div className='mb-4'>
        <MenuBarMapa />
      </div>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
        >
        </GoogleMap>
      </LoadScript>

    </div>
  )
}
