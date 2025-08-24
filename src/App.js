import { useState } from "react";
import Header from './Components/Header/Header.jsx';
import DashboardBar from './Components/DashboardBar/DashboardBar.jsx';
import SidePanel from './Components/SidePanel/SidePanel.jsx';
import Counter from './Components/Counter/Counter.jsx';
import DroneMap from './Components/DronesMap/DroneMap.jsx';
import useDrones from './Components/UseDrones.js';
import './App.css';

function App() {
  const drones = useDrones();
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [activePage, setActivePage] = useState("map"); // "map" or "dashboard"

  const greenDronesCount = drones.filter(d => {
    const regPart = d.registration.split('-')[1] || '';
    return regPart[0]?.toUpperCase() === "B";
  }).length;

  const redDronesCount = drones.filter(d => {
    const regPart = d.registration.split('-')[1] || '';
    return regPart[0]?.toUpperCase() !== "B";
  }).length;

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <DashboardBar
          activePage={activePage}
          setActivePage={setActivePage}
        />
        <SidePanel
          drones={drones}
          onDroneClick={setSelectedDrone}
          selectedDroneId={selectedDrone?.id}
        />
        {activePage === "map" ? (
          <DroneMap
            drones={drones}
            onDroneClick={setSelectedDrone}
            selectedDroneId={selectedDrone?.id}
          />
        ) : (
          <div className="dashboard-static">
            Dashboard Page (Static Content)
          </div>
        )}
      </div>
      <Counter count={redDronesCount} />
    </div>
  );
}

export default App;
