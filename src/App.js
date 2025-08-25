import { useState, useMemo } from "react";
import Header from './Components/Header/Header.jsx';
import DashboardBar from './Components/DashboardBar/DashboardBar.jsx';
import SidePanel from './Components/SidePanel/SidePanel.jsx';
import Counter from './Components/Counter/Counter.jsx';
import DroneMap from './Components/DronesMap/DroneMap.jsx';
import DashboardPage from './Components/DashboardPage/DashboardPage.jsx';
import useDrones from './Components/UseDrones.js';
import './App.css';

function App() {
  const drones = useDrones();
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [activePage, setActivePage] = useState("map");
  const [sidePanelVisible, setSidePanelVisible] = useState(() => (typeof window !== 'undefined' ? window.innerWidth > 770 : true));

  const handleDroneClick = (drone) => {
    setSelectedDrone(drone);
    setActivePage("map");
    setSidePanelVisible(true); // <-- Show side panel when a drone is clicked
  };

  const greenDronesCount = useMemo(() => 
    drones.filter(d => {
      const regPart = d.registration.split('-')[1] || '';
      return regPart[0]?.toUpperCase() === "B";
    }).length, [drones]);

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <DashboardBar activePage={activePage} setActivePage={setActivePage} />
        <SidePanel 
          drones={drones} 
          onDroneClick={handleDroneClick} 
          selectedDroneId={selectedDrone?.id}
          visible={sidePanelVisible}
          setVisible={setSidePanelVisible}
        />
        {activePage === "map" ? (
          <DroneMap 
            drones={drones} 
            onDroneClick={handleDroneClick} 
            selectedDroneId={selectedDrone?.id}
          />
        ) : (
          <DashboardPage drones={drones} />
        )}
      </div>
      <Counter count={greenDronesCount} />
    </div>
  );
}

export default App;