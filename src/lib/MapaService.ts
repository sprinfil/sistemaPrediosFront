import { useEffect } from "react";

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