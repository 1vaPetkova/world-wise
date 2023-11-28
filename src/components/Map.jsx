import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import Button from "./Button";

const DEFAULT_POSITION = [42.69751, 23.32415];
function Map() {
  const [mapPosition, setMapPosition] = useState(DEFAULT_POSITION);
  const { cities } = useCities();
  const {
    isLoading: isLoadingPosition,
    position: geolocation,
    getPosition,
  } = useGeolocation();
  const { lat, lng } = useUrlPosition();

  useEffect(
    function () {
      if (lat && lng) {
        setMapPosition([parseFloat(lat), parseFloat(lng)]);
      }
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geolocation && geolocation.lat && geolocation.lng) {
        setMapPosition([geolocation.lat, geolocation.lng]);
      }
    },
    [geolocation]
  );

  return (
    <div className={styles.mapContainer}>
      {geolocation.lat !== mapPosition.at(0) &&
        geolocation.lng !== mapPosition.at(1) && (
          <Button type="position" onClick={getPosition}>
            {isLoadingPosition ? "Loading..." : "Use your position"}
          </Button>
        )}
      <MapContainer
        center={mapPosition}
        zoom={8}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return <></>;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
