// src/components/Sidebar.jsx
import './DashboardBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

function DashboardBar({ activePage, setActivePage }) {
  return (
    <aside className="dashboardbar">
      <ul>
        <li
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => setActivePage("dashboard")}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faGaugeHigh} />
          </span>
          <div>DASHBOARD</div>
        </li>
        <li
          className={activePage === "map" ? "active" : ""}
          onClick={() => setActivePage("map")}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faMapLocationDot} />
          </span>
          <div>MAP</div>
        </li>
      </ul>
    </aside>
  );
}

export default DashboardBar;