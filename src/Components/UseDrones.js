import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function useDrones() {
  // Store drones by registration number to track paths
  const [drones, setDrones] = useState([]);
  // Store paths by registration number
  const pathsByRegistration = useRef({});

  useEffect(() => {
    const socket = io("https://sager-backend.onrender.com/", { transports: ["polling"] }); // Use polling to avoid CORS issues
    socket.on("connect", () => console.log("Connected to backend:", socket.id)); // Log connection for debugging

    socket.on("message", (data) => { // backend sends drone data via "message" event
      setDrones((prevDrones) => {  // Update drones state with incoming data
        const newDrones = [...prevDrones]; 
        
        data.features.forEach((f) => { // Iterate over each drone feature
          const registration = f.properties.registration; // Unique identifier for the drone
          const lng = f.geometry.coordinates[0]; 
          const lat = f.geometry.coordinates[1]; 
          
          // Check if we already have this drone
          const existingIndex = newDrones.findIndex(d => d.registration === registration);
          
          if (existingIndex >= 0) {
            // Update existing drone
            const existingDrone = newDrones[existingIndex]; 
            
            // Add to path if position changed
            if (existingDrone.lng !== lng || existingDrone.lat !== lat) { // Only update path if the drone has moved
              pathsByRegistration.current[registration] = [ 
                ...(pathsByRegistration.current[registration] || []), 
                [lng, lat]
              ];
            }
            
            newDrones[existingIndex] = { // Update drone info
              ...existingDrone,
              lng,
              lat,
              altitude: f.properties.altitude,
              yaw: Number(f.properties.yaw ?? 0),
              lastSeen: Date.now(),
              path: pathsByRegistration.current[registration] || [[lng, lat]]
            };
          } else {
            // Add new drone
            pathsByRegistration.current[registration] = [[lng, lat]];
            
            newDrones.push({
              id: registration,
              serial: f.properties.serial,
              registration,
              name: f.properties.Name,
              altitude: f.properties.altitude,
              pilot: f.properties.pilot,
              organization: f.properties.organization,
              yaw: Number(f.properties.yaw ?? 0),
              lng,
              lat,
              firstSeen: Date.now(),
              lastSeen: Date.now(),
              path: [[lng, lat]]
            });
          }
        });
        
        return newDrones; 
      });
    });

    return () => socket.disconnect(); // Cleanup on unmount
  }, []);

  return drones;
}