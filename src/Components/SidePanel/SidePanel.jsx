import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './SidePanel.css';

const getStatusColor = (registration) => {
  const regPart = registration.split('-')[1] || '';
  return regPart[0]?.toUpperCase() === "B" ? "green" : "red";
};

function SidePanel({ drones, onDroneClick, selectedDroneId }) {
  const [visible, setVisible] = useState(true);
  const listRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    if (!selectedDroneId) return;
    const el = itemRefs.current[selectedDroneId];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [selectedDroneId, drones]);

  if (!visible) {
    return <button className="show-panel-btn" onClick={() => setVisible(true)}>Show Side Panel</button>;
  }

  return (
    <div className="side-panel">
      <div className="panel-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="title">DRONE FLYING</div>
        <button className="close-panel-btn" onClick={() => setVisible(false)} title="Close Panel">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="panel-header">
        <span className="tab active">Drones</span>
        <span className="tab">Flights History</span>
      </div>
      <div className="drone-list" ref={listRef}>
        {drones.length === 0 ? (
          <div className="drone-list-placeholder">No drones detected yet...</div>
        ) : (
          <ul>
            {drones.map(d => (
              <li
                key={d.id}
                ref={(el) => { if (el) itemRefs.current[d.id] = el; }}
                onClick={() => onDroneClick(d)}
                className={selectedDroneId === d.id ? "selected" : ""}
              >
                <div className="drone-info-grid">
                  <div className="drone-title"><strong>{d.name}</strong></div>
                  <div className="drone-status">
                    <span
                      className="drone-status-dot"
                      style={{ background: getStatusColor(d.registration) }}
                      title={getStatusColor(d.registration) === "green" ? "Can fly" : "Cannot fly"}
                    />
                  </div>
                  <div className="drone-serial">
                    <span className="label">Serial #</span><span className="value">{d.serial}</span>
                  </div>
                  <div className="drone-registration">
                    <span className="label">Registration #</span><span className="value">{d.registration}</span>
                  </div>
                  <div className="drone-pilot">
                    <span className="label">Pilot</span><span className="value">{d.pilot}</span>
                  </div>
                  <div className="drone-organization">
                    <span className="label">Organization</span><span className="value">{d.organization}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SidePanel;