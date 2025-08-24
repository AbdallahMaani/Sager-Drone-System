import React, { useEffect, useState } from "react";
import "./DashboardPage.css";

function DashboardPage({ drones }) {
  const totalDrones = drones.length;

  const isGreenReg = (registration) => {
    const regPart = (registration || "").split("-")[1] || "";
    return regPart[0]?.toUpperCase() === "B";
  };

  const greenDrones = drones.filter((d) => isGreenReg(d.registration)).length;
  const redDrones = totalDrones - greenDrones;

  // Counter animation state
  const [counters, setCounters] = useState({
    total: 0,
    green: 0,
    red: 0,
  });

  // Animate counters whenever values change
  useEffect(() => {
    const animateCounter = (key, target) => {
      let start = counters[key];
      let end = target;
      let duration = 600;
      let frameRate = 30;
      let steps = Math.ceil(duration / (1000 / frameRate));
      let stepValue = (end - start) / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setCounters((prev) => ({
          ...prev,
          [key]: Math.round(start + stepValue * currentStep),
        }));
        if (currentStep >= steps) {
          clearInterval(interval);
          setCounters((prev) => ({ ...prev, [key]: end }));
        }
      }, 1000 / frameRate);
    };

    animateCounter("total", totalDrones);
    animateCounter("green", greenDrones);
    animateCounter("red", redDrones);
  }, [totalDrones, greenDrones, redDrones]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Drone Analytics</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card total">
          <h3>Total Drones</h3>
          <p className="count">{counters.total}</p>
        </div>
        <div className="card green">
          <h3>Green (Can Fly)</h3>
          <p className="count">{counters.green}</p>
        </div>
        <div className="card red">
          <h3>Red (Restricted)</h3>
          <p className="count">{counters.red}</p>
        </div>
      </div>

      {/* Progress bars */}
      <div className="progress-section">
        <h3>Fleet Distribution</h3>
        <div className="progress-bar">
          <span
            className="green-bar"
            style={{ width: `${(greenDrones / (totalDrones || 1)) * 100}%` }}
          />
          <span
            className="red-bar"
            style={{ width: `${(redDrones / (totalDrones || 1)) * 100}%` }}
          />
        </div>
        <div className="progress-labels">
          <span className="green-label">Green {greenDrones}</span>
          <span className="red-label">Red {redDrones}</span>
        </div>
      </div>

      {/* Recent Drones */}
      <div className="recent-drones">
        <h3>Recent Drones</h3>
        <ul>
          {drones.slice(0, 6).map((d) => (
            <li key={d.id} className="drone-item">
              <span
                className={`status-dot ${
                  isGreenReg(d.registration) ? "green" : "red"
                }`}
              />
              <strong>{d.registration}</strong> – Pilot: {d.pilot}
              <span className="altitude"> (Alt: {d.altitude}m)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;
