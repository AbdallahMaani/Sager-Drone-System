import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useDrones() {
  const [drones, setDrones] = useState([]);

  useEffect(() => {
    // جرب polling (متوافق مع السيرفر)
    const socket = io("http://localhost:9013", { transports: ["polling"] });

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("message", (data) => {
      console.log("📡 Drone data:", data);
      const feature = data.features[0];
      const coords = feature.geometry.coordinates;
      const props = feature.properties;

      const drone = {
        id: props.serial,
        registration: props.registration,
        name: props.Name,
        altitude: props.altitude,
        yaw: props.yaw,
        lat: coords[1],
        lng: coords[0],
      };

      setDrones((prev) => [...prev, drone]);
    });

    return () => socket.disconnect();
  }, []);

  return drones;
}
