// src/components/Sidebar.jsx
import './DashboardBar.css';
import locationIcon from './../Assets/location-svgrepo-com-2.svg';
import dashboardIcon from './../Assets/dashboard-svgrepo-com-2.svg';

function DashboardBar({ activePage, setActivePage }) {
  return (
    <aside className="dashboardbar">
      <ul>
        <li
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => setActivePage("dashboard")} //set the active page to dashboard when clicked
        >
          <span className="icon">
            <img src={dashboardIcon} alt="Dashboard" style={{ width: 22, height: 22 }} />
          </span>
          <div>DASHBOARD</div>
        </li>
        
        <li
          className={activePage === "map" ? "active" : ""}
          onClick={() => setActivePage("map")} // set the active page to map when clicked
        >
          <span className="icon">
            <img src={locationIcon} alt="Map" style={{ width: 22, height: 22 }} />
          </span>
          <div>MAP</div>
        </li>
      </ul>
    </aside>
  );
}

export default DashboardBar;