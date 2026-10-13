import { useEffect, useRef } from "react";
import { type MappedPlace } from "@/content/roy";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapController({
  activePlace,
  focusRequest,
  markers,
}: {
  activePlace: MappedPlace;
  focusRequest: number;
  markers: React.RefObject<Map<string, L.Marker>>;
}) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo([activePlace.latitude, activePlace.longitude], 14, {
      animate: true,
      duration: 1.5
    });
    if (focusRequest > 0) {
      markers.current.get(activePlace.id)?.openPopup();
    }
  }, [activePlace, focusRequest, map, markers]);
  
  return null;
}

export default function MapComponent({ 
  places, 
  activePlace, 
  focusRequest,
  onPlaceSelect 
}: { 
  places: MappedPlace[], 
  activePlace: MappedPlace, 
  focusRequest: number,
  onPlaceSelect: (place: MappedPlace) => void 
}) {
  const markers = useRef(new Map<string, L.Marker>());

  return (
    <MapContainer 
      center={[places[0].latitude, places[0].longitude]} 
      zoom={12} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', zIndex: 1 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapController activePlace={activePlace} focusRequest={focusRequest} markers={markers} />
      {places.map((place) => (
        <Marker 
          key={place.id} 
          ref={(marker) => {
            if (marker) markers.current.set(place.id, marker);
            else markers.current.delete(place.id);
          }}
          position={[place.latitude, place.longitude]}
          eventHandlers={{ click: () => onPlaceSelect(place) }}
        >
          <Popup>
            <div className="text-right" dir="rtl">
              <strong className="block text-lg"><bdi>{place.name}</bdi></strong>
              {place.year && <span className="text-sm text-muted-foreground"><bdi>{place.year}</bdi></span>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}