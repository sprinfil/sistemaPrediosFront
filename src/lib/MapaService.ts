import { useEffect } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import valvulaCaja from '../assets/cajaValvula.png'
import celularImg from '../assets/celular.png';

export const mapContainerStyle = {
  width: "100%",
  height: "75vh",
};

export const StylesRecorridosMap = {
  width: "100%",
  height: "92vh",
};


export const center = {
  lat: 24.1426,
  lng: -110.3128,
};

export const parseCoordinates = (polygonData) => {
  return polygonData.polygon.coordinates[0].map(([lng, lat]) => ({ lat, lng }));
};


export const initMapa = async (predios, valvulas, setSelectedPredio, existingMap = null, setMap, setCoordinates, setPolygons) => {

  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    version: 'weekly',
  });
  let map;
  if (!existingMap) {
    await loader.load();
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 14,
    });
    setMap(map);
  } else {
    map = existingMap;
  }

  // Variables para guardar polígonos y marcadores
  let polygons = [];
  let markers = [];

  // Función para agregar polígonos de predios al mapa
  const addPolygons = () => {
    // Limpiar polígonos previos si existen
    polygons.forEach(polygon => polygon.setMap(null));
    polygons = [];

    predios?.forEach((predio) => {

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
    setPolygons(prev => {
      return [...prev, ...polygons];
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

  // map.addListener("zoom_changed", () => {
  //   const currentZoom = map.getZoom();

  //   if (currentZoom >= 20) {

  //     addPolygons();
  //     addMarkers();

  //   } else {
  //     polygons.forEach(polygon => polygon.setMap(null));
  //     markers.forEach(marker => marker.setMap(null));
  //   }
  // });
  // Agregar evento de click al mapa

  map.addListener("click", (event) => {

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setCoordinates(
      {
        localizacion: {
          latitude: lat,
          longitude: lng,
          distance: 500
        }
      }
    )

    // alert(`Coordenadas: Latitud ${lat}, Longitud ${lng}`);
  });

  addPolygons();
  // addMarkers();
};
export const initMapaValvulas = async (valvulas, existingMap = null, setMap, setCoordinates, setSelectedValvulaId) => {

  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    version: 'weekly',
  });

  let map;

  if (!existingMap) {
    await loader.load();
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 14,
    });
    setMap(map);
  } else {
    map = existingMap;
  }

  let markers = [];

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
        icon: {
          url: valvulaCaja, // URL del ícono
          scaledSize: new window.google.maps.Size(60, 60), // Tamaño del ícono
        },
      });

      marker.addListener("click", () => {
        setSelectedValvulaId(valvula?.id)
      });

      markers.push(marker);
    });
  };

  // map.addListener("zoom_changed", () => {
  //   const currentZoom = map.getZoom();

  //   if (currentZoom >= 20) {

  //     addPolygons();
  //     addMarkers();

  //   } else {
  //     polygons.forEach(polygon => polygon.setMap(null));
  //     markers.forEach(marker => marker.setMap(null));
  //   }
  // });
  // Agregar evento de click al mapa

  map?.addListener("click", (event) => {

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setCoordinates(
      {
        localizacion: {
          latitude: lat,
          longitude: lng,
          distance: 500
        }
      }
    )

    // alert(`Coordenadas: Latitud ${lat}, Longitud ${lng}`);
  });
  addMarkers();
};

export const initMapaRecorridos = async (existingMap = null, setMap: Function) => {

  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    version: 'weekly',
  });

  let map;

  if (!existingMap) {
    await loader.load();
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 14,
    });
    setMap(map);
  } else {
    map = existingMap;
  }
}

export const showRecorrido = async (map, bitacoras, setValvulasMarkers, valvulasMarkers, recorridoLine, setRecorridoLine, capturasMarkers, setCapturasMarkers) => {
  if (map) {


    setValvulasMarkers([]);
    setCapturasMarkers([]);
    let markers = valvulasMarkers;
    let capturasMarkersTemp = capturasMarkers;
    recorridoLine?.setMap(null);

    // console.log(bitacoras)

    markers.forEach(marker => marker.setMap(null));
    capturasMarkersTemp.forEach(marker => marker.setMap(null));

    markers = [];
    capturasMarkersTemp = [];

    if (bitacoras.length > 0) {
      const firstPosition = {
        lat: bitacoras[0].valvula.posicion.coordinates[1],
        lng: bitacoras[0].valvula.posicion.coordinates[0],
      };
      map.setCenter(firstPosition);
      map.setZoom(17);
    }
    const pathCoordinates = [];

    bitacoras.forEach((bitacora, index) => {


      const position = {
        lat: bitacora?.valvula?.posicion?.coordinates[1],
        lng: bitacora?.valvula?.posicion?.coordinates[0],
      };

      const capturaPosition = {
        lat: bitacora?.posicion_captura?.coordinates[1],
        lng: bitacora?.posicion_captura?.coordinates[0],
      }

      pathCoordinates.push(position);


      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="min-width: 200px">
            <h3>Información de la Válvula</h3>
            <p><strong>Nombre:</strong> ${bitacora?.valvula?.nombre || "N/A"}</p>
            <p><strong>Ubicación:</strong> (${position.lat}, ${position.lng})</p>
          </div>
        `,
      });



      const marker = new window.google.maps.Marker({
        position: position,
        map: map,
        icon: {
          url: valvulaCaja,
          scaledSize: new window.google.maps.Size(70, 70),
        },
        label: {
          text: `${index + 1}`,
          color: "yellow",
          fontSize: "35px",
          fontWeight: "bold",
        },
      });

      const markerCaptura = new window.google.maps.Marker({
        position: capturaPosition,
        map: map,
        icon: {
          url: celularImg, // URL del ícono
          scaledSize: new window.google.maps.Size(60, 60),
        },
        label: {
          text: `${index + 1}`,
          color: "yellow",
          fontSize: "35px",
          fontWeight: "bold",
        },
      });

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });


      markerCaptura.addListener("click", () => {
        // setSelectedValvulaId(valvula?.id)
      });

      markers.push(marker);
      capturasMarkersTemp.push(markerCaptura);
    });


    const recorridoPath = new window.google.maps.Polyline({
      path: pathCoordinates, // Coordenadas para conectar
      geodesic: true, // Hace que la línea siga el contorno del mapa
      strokeColor: "#FF0000", // Color de la línea
      strokeOpacity: 1.0, // Opacidad de la línea
      strokeWeight: 2, // Grosor de la línea
    });


    recorridoPath.setMap(map);

    setRecorridoLine(recorridoPath);
    setValvulasMarkers(markers);
    setCapturasMarkers(capturasMarkersTemp);

  } else {
    alert('No hay mapa');
  }
}
