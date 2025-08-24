import React, { useState, useRef, useEffect } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = "pk.eyJ1IjoiYW0tMmsiLCJhIjoiY21lcGhmeWNnMGpvcjJtcXZoOWN0dHpxdiJ9.4GWQhCQG6s_dhnxRSo4_BA";

export default function DroneMap({ drones, onDroneClick, selectedDroneId }) {
  const mapRef = useRef();
  const [popupInfo, setPopupInfo] = useState(null);
  const [paths, setPaths] = useState({});
  const [now, setNow] = useState(Date.now()); // update each second for live flight time

  useEffect(() => {
    const newPaths = { ...paths };
    drones.forEach(d => {
      if (!newPaths[d.id]) newPaths[d.id] = [];
      newPaths[d.id].push([d.lng, d.lat]);
    });
    setPaths(newPaths);
  }, [drones]);

  // update timestamp every second to recompute flight time in popup
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // when a drone is selected from the side panel, pan/zoom to it
  useEffect(() => {
    if (!selectedDroneId || !mapRef.current) return;
    const selected = drones.find(d => d.id === selectedDroneId);
    if (!selected) return;

    const map = mapRef.current.getMap ? mapRef.current.getMap() : mapRef.current;
    if (!map) return;

    const fly = map.flyTo || map.easeTo;
    if (fly) {
      fly.call(map, {
        center: [selected.lng, selected.lat],
        zoom: 14,
        speed: 1.2,
        curve: 1.4,
        essential: true
      });
    }
  }, [selectedDroneId]);

  return (
    <div className="map-container">
      <Map
        ref={mapRef}
        initialViewState={{ latitude: 31.9487, longitude: 35.9313, zoom: 10 }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
        className="mapbox-map"
      >
        {drones.map(drone => {
          const regPart = drone.registration.split('-')[1] || '';
          const color = regPart[0]?.toUpperCase() === "B" ? "green" : "red";
          return (
            <Marker
              key={drone.id}
              longitude={drone.lng}
              latitude={drone.lat}
              anchor="center"
            >
              <div
                onMouseEnter={() => setPopupInfo(drone)}
                onMouseLeave={() => setPopupInfo(null)}
                onClick={() => { if (onDroneClick) onDroneClick(drone); }}
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: color,
                  borderRadius: "50%",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: selectedDroneId === drone.id ? "3px solid yellow" : "none",
                  cursor: "pointer"
                }}
                title={`Yaw: ${drone.yaw}°`}
              >
                {/* Inner arrow indicating yaw */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  style={{ transform: `rotate(${drone.yaw}deg)` }}
                >
                  <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3 L12 17" />
                    <path d="M8 7 L12 3 L16 7" />
                  </g>
                </svg>
              </div>
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
          >
            <div>
              <strong>{popupInfo.registration}</strong>
              <div>Altitude: {popupInfo.altitude} m</div>
              <div>Flight time: {formatDuration(Math.max(0, (now - (popupInfo.firstSeen || now))))}</div>
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

function pad(n) { return n.toString().padStart(2, '0'); }
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
