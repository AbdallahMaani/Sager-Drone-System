import React, { useState, useRef, useEffect, useCallback } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import droneIcon from './../Assets/drone.svg';

const MAPBOX_TOKEN = "pk.eyJ1IjoiYW0tMmsiLCJhIjoiY21lcGhmeWNnMGpvcjJtcXZoOWN0dHpxdiJ9.4GWQhCQG6s_dhnxRSo4_BA";

export default function DroneMap({ drones, onDroneClick, selectedDroneId }) {
  const mapRef = useRef();
  const [popupInfo, setPopupInfo] = useState(null);
  const [now, setNow] = useState(Date.now());
  const hasFlownRef = useRef(false); // Flag to track if flyTo has been executed

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Memoized flyTo function to avoid re-creation on every render
  const flyToSelected = useCallback(() => {
    if (!selectedDroneId || !mapRef.current?.getMap || hasFlownRef.current) return;
    const selected = drones.find(d => d.id === selectedDroneId);
    if (!selected) return;

    const map = mapRef.current.getMap();
    map.flyTo({
      center: [selected.lng, selected.lat],
      zoom: 14,
      speed: 1.3,
      curve: 1,
      essential: true
    });
    hasFlownRef.current = true; // Set flag after flying
  }, [selectedDroneId, drones]);

  // Trigger flyTo only when selectedDroneId changes
  useEffect(() => {
    flyToSelected();
  }, [flyToSelected]);

  // Reset hasFlownRef when selectedDroneId changes to allow re-fly for new selection
  useEffect(() => {
    hasFlownRef.current = false; // Reset flag when a new drone is selected
  }, [selectedDroneId]);

  // Generate GeoJSON for drone paths
  const getDronePaths = () => {
    const features = drones
      .filter(drone => drone.path && drone.path.length > 1)
      .map(drone => {
        const regPart = drone.registration.split('-')[1] || '';
        const color = regPart[0]?.toUpperCase() === "B" ? "green" : "red";
        
        return {
          type: 'Feature',
          properties: {
            registration: drone.registration,
            color: color
          },
          geometry: {
            type: 'LineString',
            coordinates: drone.path
          }
        };
      });

    return {
      type: 'FeatureCollection',
      features: features
    };
  };

  const dronePaths = getDronePaths();

  // Calculate arrow position based on yaw
  const getArrowPosition = (yaw) => {
    const radius = 20; // Distance from dot center to arrow base (in pixels)
    const angleRad = (yaw - 90) * (Math.PI / 180); // Convert yaw to radians, adjust -90° for 0° pointing up
    const xOffset = radius * Math.cos(angleRad);
    const yOffset = radius * Math.sin(angleRad);
    return { x: xOffset, y: yOffset };
  };

  return (
    <div className="map-container">
      <Map
        ref={mapRef}
        initialViewState={{ latitude: 31.9487, longitude: 35.9313, zoom: 10 }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
        className="mapbox-map"
      >
        {/* Drone paths layer */}
        {dronePaths.features.length > 0 && (
          <Source id="drone-paths" type="geojson" data={dronePaths}>
            <Layer
              id="path-line"
              type="line"
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 2,
                'line-opacity': 0.7
              }}
            />
          </Source>
        )}

        {drones.map(drone => {
          const regPart = drone.registration.split('-')[1] || '';
          const color = regPart[0]?.toUpperCase() === "B" ? "green" : "red";
          const { x: xOffset, y: yOffset } = getArrowPosition(drone.yaw);

          return (
            <Marker
              key={drone.id}
              longitude={drone.lng}
              latitude={drone.lat}
              anchor="center"
            >
              <div
                style={{
                  position: 'relative',
                  width: 27,
                  height: 27,
                  borderRadius: "50%",
                  backgroundColor: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: selectedDroneId === drone.id ? "3px solid yellow" : "none",
                  cursor: "pointer"
                }}
                onMouseEnter={() => setPopupInfo(drone)}
                onMouseLeave={() => setPopupInfo(null)}
                onClick={() => onDroneClick?.(drone)}
                title={`Yaw: ${drone.yaw}°`}
              >
                {/* Drone Icon as Background */}
                <img
                  src={droneIcon}
                  alt="Drone Icon"
                  style={{
                    width: '70%',
                    height: '70%',
                    transform: `rotate(${drone.yaw}deg)`,
                    filter: `hue-rotate(${color === 'green' ? '120deg' : '0deg'})`,
                  }} //
                />
                {/* Arrow extending outward based on yaw */}
                <div
                  style={{
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderBottom: `15px solid ${color}`, // Match dot color
                    transform: `rotate(${drone.yaw}deg)`, // Rotate to match yaw
                    left: '50%',
                    top: '50%',
                    marginLeft: '-12px', // Center the arrow base horizontally
                    marginTop: '-10px', // Adjust for arrow height
                    transformOrigin: 'center', // Rotate from the base
                    pointerEvents: 'none',
                    // Dynamic positioning based on yaw
                    transform: `translate(${xOffset}px, ${yOffset}px) rotate(${drone.yaw}deg)`,
                  }} // Arrow styling
                />
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
              <div>Flight time: {formatDuration(now - (popupInfo.firstSeen || now))}</div>
              <div>Path points: {popupInfo.path ? popupInfo.path.length : 0}</div>
            </div>
          </Popup>
        )} {/* show popup on hover */}
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
  return `${pad(h)}:${pad(m)}:${pad(s)}`; //   Turn Milliseconds into  HH:MM:SS format
}