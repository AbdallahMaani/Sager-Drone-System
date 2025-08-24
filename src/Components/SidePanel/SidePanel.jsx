import './SidePanel.css';

function getStatusColor(registration) {
  return registration.startsWith("B") ? "green" : "red";
}

function SidePanel({ drones, onDroneClick, selectedDroneId }) {
  return (
    <div className="side-panel">
      <div className="panel-header">
        <div className="title">DRONE FLYING</div>
      </div>

      <div className="panel-header">
        <span className="tab active">Drones</span>
        <span className="tab">Flights History</span>
      </div>

      <div className="drone-list">
        {drones.length === 0 ? (
          <div className="drone-list-placeholder">No drones detected yet...</div>
        ) : (
          <ul>
            {drones.map(d => (
              <li
                key={d.id}
                onClick={() => onDroneClick(d)}
                style={{
                  backgroundColor: selectedDroneId === d.id ? "#333" : "transparent",
                  cursor: "pointer"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: getStatusColor(d.registration),
                    marginRight: 8,
                    verticalAlign: "middle"
                  }}
                  title={getStatusColor(d.registration) === "green" ? "Can fly" : "Cannot fly"}
                />
                <strong>{d.registration}</strong> – {d.altitude}m<br />
                <span style={{ fontSize: "12px", color: "#aaa" }}>
                  Serial: {d.serial}<br />
                  Pilot: {d.pilot}<br />
                  Organization: {d.organization}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SidePanel;
