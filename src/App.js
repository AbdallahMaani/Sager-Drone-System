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

  const redDronesCount = drones.filter(d => !d.registration.startsWith("B")).length;

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <DashboardBar />
        <SidePanel
          drones={drones}
          onDroneClick={setSelectedDrone}
          selectedDroneId={selectedDrone?.id}
        />
        <DroneMap
          drones={drones}
          onDroneClick={setSelectedDrone}
          selectedDroneId={selectedDrone?.id}
        />
      </div>
      <Counter count={redDronesCount} />
    </div>
  );
}

export default App;
