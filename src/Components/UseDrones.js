import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useDrones() {
  const [drones, setDrones] = useState({}); // Store drones by serial

  useEffect(() => {
    const socket = io("http://localhost:9013", { transports: ["polling"] });

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("message", (data) => {
      // Update or add drones by serial
      setDrones((prev) => {
        const updated = { ...prev };
        data.features.forEach((f) => {
          const serial = f.properties.serial;
          const prevDrone = prev[serial];
          updated[serial] = {
            id: serial,
            serial: serial,
            registration: f.properties.registration,
            name: f.properties.Name,
            altitude: f.properties.altitude,
            pilot: f.properties.pilot,
            organization: f.properties.organization,
            yaw: Number(f.properties.yaw ?? 0),
            lng: f.geometry.coordinates[0],
            lat: f.geometry.coordinates[1],
            // Track when the drone was first seen to compute flight time
            firstSeen: prevDrone?.firstSeen ?? Date.now(),
            lastSeen: Date.now(),
          };
        });
        return updated;
      });
    });

    return () => socket.disconnect();
  }, []);

  // Return as array for rendering
  return Object.values(drones);
}
