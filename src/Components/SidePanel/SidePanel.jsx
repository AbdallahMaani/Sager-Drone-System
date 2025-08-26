import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './SidePanel.css';

const getStatusColor = (registration) => {
  const regPart = registration.split('-')[1] || '';
  return regPart[0]?.toUpperCase() === "B" ? "green" : "red";
};

function SidePanel({ drones, onDroneClick, selectedDroneId, visible, setVisible }) {
  const droneListRef = useRef(null);
  const itemRefs = useRef({});
  const hasScrolledRef = useRef(false); // Track whether we already scrolled to the selected drone

  // Auto-show on wider screens; keep user's choice on small screens
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 770) setVisible(true);
      else setVisible(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setVisible]);

  // Scroll selected drone into view inside the side panel **only once per selection**
  useEffect(() => {
    hasScrolledRef.current = false; // Reset scroll flag when selection changes
  }, [selectedDroneId]);

  useEffect(() => {
    if (!selectedDroneId || !visible || hasScrolledRef.current) return;

    const container = droneListRef.current;
    const el = itemRefs.current[selectedDroneId];
    if (el && container) {
      const containerHeight = container.clientHeight;
      const elOffsetTop = el.offsetTop;
      const elHeight = el.clientHeight;

      container.scrollTo({
        top: elOffsetTop - containerHeight / 2 + elHeight / 2,
        behavior: 'smooth'
      });

      hasScrolledRef.current = true; // mark as scrolled for this selection
    }
  }, [selectedDroneId, visible, drones]);

  // Only render the "Show Panel" button when panel is hidden
  if (!visible) {
    return (
      <button
        className="show-panel-btn fixed-btn"
        onClick={() => setVisible(true)}
      >
        Show Side Panel
      </button>
    );
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

      <div className="drone-list" ref={droneListRef} style={{ overflowY: 'auto', maxHeight: 'calc(100% - 100px)' }}>
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
                    <span className="label">Serial #</span><br /><span className="value">{d.serial}</span>
                  </div>
                  <div className="drone-registration">
                    <span className="label">Registration #</span><br /><span className="value">{d.registration}</span>
                  </div>
                  <div className="drone-pilot">
                    <span className="label">Pilot</span><br /><span className="value">{d.pilot}</span>
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
