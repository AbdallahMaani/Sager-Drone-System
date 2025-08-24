import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useDrones() {
  const [drones, setDrones] = useState({});

  useEffect(() => {
    const socket = io("http://localhost:9013", { transports: ["polling"] });
    socket.on("connect", () => console.log("✅ Connected to backend:", socket.id));
    socket.on("message", (data) => {
      setDrones(prev => {
        const updated = { ...prev };
        data.features.forEach(f => {
          const serial = f.properties.serial;
          updated[serial] = {
            id: serial,
            serial,
            registration: f.properties.registration,
            name: f.properties.Name,
            altitude: f.properties.altitude,
            pilot: f.properties.pilot,
            organization: f.properties.organization,
            yaw: Number(f.properties.yaw ?? 0),
            lng: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1],
            firstSeen: prev[serial]?.firstSeen ?? Date.now(),
            lastSeen: Date.now(),
          };
        });
        return updated;
      });
    });
    return () => socket.disconnect();
  }, []);

  return Object.values(drones);
}