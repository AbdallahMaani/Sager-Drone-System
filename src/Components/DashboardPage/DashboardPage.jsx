import React, { useEffect, useState } from "react";
import "./DashboardPage.css";
import Logo from './../Assets/SagerLogo.png';


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

  // Helper to format duration
  function formatDuration(ms) {
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / 60000) % 60;
    const hr = Math.floor(ms / 3600000);
    return `${hr}h ${min}m ${sec}s`;
  }

  // Find oldest drone
  const now = Date.now();
  const oldestDrone = drones.reduce((oldest, d) => {
    if (!d.firstSeen) return oldest;
    if (!oldest || d.firstSeen < oldest.firstSeen) return d;
    return oldest;
  }, null);

  // Find drone with most path points
  const mostPointsDrone = drones.reduce((max, d) => {
    const points = d.path ? d.path.length : 0;
    if (!max || points > (max.path ? max.path.length : 0)) return d;
    return max;
  }, null);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Live Sager Drone Analytics</h2>
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

      {/* Top Altitude Drones */}
      <div className="recent-drones">
        <h3>Highest Altitude Drones</h3>
        <ul>
          {[...drones]
            .sort((a, b) => (Number(b.altitude) || 0) - (Number(a.altitude) || 0))
            .slice(0, 6)
            .map((d) => (
              <li key={d.id} className="drone-item">
                <span
                  className={`status-dot ${isGreenReg(d.registration) ? "green" : "red"}`}
                />
                <strong>{d.registration}</strong> – Pilot: {d.pilot}
                <span className="altitude"> (Alt: {d.altitude}m)</span>
              </li>
            ))}
        </ul>
      </div>

      {/* Special Stats - styled like Highest Altitude Drones */}
      <div className="recent-drones">
        <h3>Special Stats</h3>
        <ul>
          <li className="drone-item">
            <span
              className={`status-dot ${oldestDrone && isGreenReg(oldestDrone.registration) ? "green" : "red"}`}
            />
            <strong>
              {oldestDrone ? oldestDrone.registration : "N/A"}
            </strong>
            {" – "}
            <span>
              Oldest Flight Time:{" "}
              {oldestDrone
                ? formatDuration(now - oldestDrone.firstSeen)
                : "N/A"}
            </span>
          </li>
          <li className="drone-item">
            <span
              className={`status-dot ${mostPointsDrone && isGreenReg(mostPointsDrone.registration) ? "green" : "red"}`}
            />
            <strong>
              {mostPointsDrone ? mostPointsDrone.registration : "N/A"}
            </strong>
            {" – "}
            <span>
              Most Distance (Points):{" "}
              {mostPointsDrone
                ? `${mostPointsDrone.path.length} points`
                : "N/A"}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;
