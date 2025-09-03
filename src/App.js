import { useState } from "react";
import Header from './Components/Header/Header.jsx';
import DashboardBar from './Components/DashboardBar/DashboardBar.jsx';
import SidePanel from './Components/SidePanel/SidePanel.jsx';
import Counter from './Components/Counter/Counter.jsx';
import DroneMap from './Components/DronesMap/DroneMap.jsx';
import DashboardPage from './Components/DashboardPage/DashboardPage.jsx';
import useDrones from './Components/UseDrones.js';
import './App.css';

function App() {
  const drones = useDrones(); // Custom hook to manage drone data
  const [selectedDrone, setSelectedDrone] = useState(null); // Currently selected drone
  const [activePage, setActivePage] = useState("map"); // View active page "Drones map" or "The Dashboard"
  const [sidePanelVisible, setSidePanelVisible] = useState(() => (typeof window !== 'undefined' ? window.innerWidth > 770 : true)); // Side panel visibility based on screen width

  // Show side panel when a drone is clicked on the map
  const handleDroneClick = (drone) => {
    setSelectedDrone(drone);
    setSidePanelVisible(true);
    setActivePage("map"); // Always navigate to map view after click on a drone (if the user was on the dashboard page)
  };

  const greenDronesCount = drones.filter(d => { //useMemo removed
    const regPart = d.registration.split('-')[1] || '';
    return regPart[0]?.toUpperCase() === "B";
  }).length; //check of the regesrtion number starts with B after the ( - ) to highlight the drone as green color

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <DashboardBar activePage={activePage} setActivePage={setActivePage} /> {/* Toggle between map and dashboard views */}
        <SidePanel
          drones={drones} // Pass all drones to side panel for listing
          onDroneClick={handleDroneClick} // Handle drone selection from side panel
          selectedDroneId={selectedDrone?.id} // Highlight selected drone in side panel
          visible={sidePanelVisible} // Control side panel visibility
          setVisible={setSidePanelVisible} // Allow side panel to be toggled
        />
        {activePage === "map" && (
          <DroneMap // Main map component displaying drones
            drones={drones} // Pass all drones to map for rendering
            onDroneClick={handleDroneClick} // Handle drone selection from map
            selectedDroneId={selectedDrone?.id} 
          />
        )}
        {activePage !== "map" && <DashboardPage drones={drones} />}  {/* Dashboard view showing stats */}
      </div>
      <Counter count={greenDronesCount} /> {/* Floating counter for green drones */}
    </div>
  );
}

export default App;