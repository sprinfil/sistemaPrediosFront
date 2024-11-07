import { useEffect } from "react";
import { Loader } from '@googlemaps/js-api-loader';

export const mapContainerStyle = {
  width: "100%",
  height: "75vh",
};
export const center = {
  lat: 24.1426,
  lng: -110.3128,
};

export const parseCoordinates = (polygonData) => {
  return polygonData.polygon.coordinates[0].map(([lng, lat]) => ({ lat, lng }));
};


export const initMapa = async (predios, valvulas, setSelectedPredio) => {

  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    version: 'weekly',
  });

  await loader.load();

  const map = new window.google.maps.Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
  });

  // Variables para guardar polígonos y marcadores
  let polygons = [];
  let markers = [];

  // Función para agregar polígonos de predios al mapa
  const addPolygons = () => {
    // Limpiar polígonos previos si existen
    polygons.forEach(polygon => polygon.setMap(null));
    polygons = [];

    predios.forEach((predio) => {

      let color = 'lightblue';

      if (predio?.numero_asignaciones == 1) {
        color = 'green';
      }
      if (predio?.numero_asignaciones == 2) {
        color = 'orange';
      }
      if (predio?.numero_asignaciones >= 3) {
        color = 'red';
      }

      const polygon = new window.google.maps.Polygon({
        paths: parseCoordinates(predio),
        map: map,
        fillColor: color,
        fillOpacity: 0.4,
        strokeColor: 'black',
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });

      polygon.addListener("click", () => {
        // alert(`Polígono clickeado: ${predio.id}`);
        setSelectedPredio(predio?.id);
      });

      polygons.push(polygon);
    });
  };

  // Función para agregar markers de válvulas al mapa
  const addMarkers = () => {
    // Limpiar markers previos si existen
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    valvulas.forEach((valvula) => {
      const position = {
        lat: valvula.posicion.coordinates[1],
        lng: valvula.posicion.coordinates[0],
      };

      const marker = new window.google.maps.Marker({
        position: position,
        map: map,
      });

      markers.push(marker);
    });
  };

  map.addListener("zoom_changed", () => {
    const currentZoom = map.getZoom();

    if (currentZoom >= 15) {

      addPolygons();
      addMarkers();
    } else {
      polygons.forEach(polygon => polygon.setMap(null));
      markers.forEach(marker => marker.setMap(null));
    }
  });
};