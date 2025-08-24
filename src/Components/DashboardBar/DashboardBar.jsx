// src/components/Sidebar.jsx
import './DashboardBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

function DashboardBar() {
  return (
    <aside className="dashboardbar">
      <ul>
        <li>
          <span className="icon">
            <FontAwesomeIcon icon={faGaugeHigh} />
          </span>
          <div>DAHSBOARD</div>
        </li>
        <li className="active">
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