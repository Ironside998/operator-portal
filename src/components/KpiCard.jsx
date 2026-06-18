// components/KpiCard.jsx
// Displays a single KPI metric in the system overview row.
// Used for DC bus voltage, AC bus voltage, frequency,
// total generation, total load, and battery SOC.

import React from "react";

export default function KpiCard({ label, value, unit, accentColor }) {
  return (
    <div className="kpi-card">
      <span className="kpi-label">{label}</span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span
          className="kpi-value"
          style={accentColor ? { color: accentColor } : {}}
        >
          {value}
        </span>
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>
    </div>
  );
}