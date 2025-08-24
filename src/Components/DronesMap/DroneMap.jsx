import React, { useState, useRef, useEffect } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = "pk.eyJ1IjoiYW0tMmsiLCJhIjoiY21lcGhmeWNnMGpvcjJtcXZoOWN0dHpxdiJ9.4GWQhCQG6s_dhnxRSo4_BA";

export default function DroneMap({ drones, onDroneClick, selectedDroneId }) {
  const mapRef = useRef();
  const [popupInfo, setPopupInfo] = useState(null);
  const [paths, setPaths] = useState({});

  useEffect(() => {
    const newPaths = { ...paths };
    drones.forEach(d => {
      if (!newPaths[d.id]) newPaths[d.id] = [];
      newPaths[d.id].push([d.lng, d.lat]);
    });
    setPaths(newPaths);
  }, [drones]);

  return (
    <div className="map-container">
      <Map
        ref={mapRef}
        initialViewState={{ latitude: 0, longitude: 0, zoom: 2 }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
        className="mapbox-map"
      >
        {drones.map(drone => {
          const color = drone.registration.startsWith("B") ? "green" : "red";
          return (
            <Marker
              key={drone.id}
              longitude={drone.lng}
              latitude={drone.lat}
              anchor="center"
              onClick={() => {
                setPopupInfo(drone);
                if (onDroneClick) onDroneClick(drone);
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: color,
                  borderRadius: "50%",
                  transform: `rotate(${drone.yaw}deg)`,
                  border: selectedDroneId === drone.id ? "2px solid yellow" : "none",
                  cursor: "pointer"
                }}
              />
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            closeOnClick={true}
          >
            <div>
              <strong>{popupInfo.registration}</strong>
              <div>Altitude: {popupInfo.altitude}m</div>
              <div>Name: {popupInfo.name}</div>
            </div>
          </Popup>
        )}

        {Object.keys(paths).map(droneId => {
          const coords = paths[droneId];
          if (coords.length < 2) return null;
          const color = drones.find(d => d.id === droneId)?.registration.startsWith("B") ? "green" : "red";
          const geojson = { type: "Feature", geometry: { type: "LineString", coordinates: coords } };

          return (
            <Source key={droneId} id={`path-${droneId}`} type="geojson" data={geojson}>
              <Layer
                id={`line-${droneId}`}
                type="line"
                paint={{ "line-color": color, "line-width": 2 }}
              />
            </Source>
          );
        })}
      </Map>
    </div>
  );
}
