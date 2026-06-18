// components/SystemSchematic.jsx
// Renders the microgrid topology as a row of connected StatusBlocks.
// Shows PV, WECS, BESS, DC Bus, Inverter, and AC Loads
// each with their live colour-coded status.

import React from "react";
import StatusBlock from "./StatusBlock";
import { mockSubsystemStatus } from "../mock/mockData";

const subsystems = [
  { key: "pv",       icon: "☀️"  },
  { key: "wecs",     icon: "🌬️"  },
  { key: "bess",     icon: "🔋"  },
  { key: "dc_bus",   icon: "⚡"  },
  { key: "inverter", icon: "🔄"  },
  { key: "ac_loads", icon: "🏠"  },
];

// Arrow connector between blocks
function Arrow() {
  return (
    <div style={styles.arrowWrapper}>
      <div style={styles.arrowLine} />
      <div style={styles.arrowHead} />
    </div>
  );
}

export default function SystemSchematic() {
  return (
    <div className="card" style={{ padding: "20px 24px" }}>
      <p className="section-title">System Topology</p>
      <div style={styles.schematic}>
        {subsystems.map((sys, idx) => {
          const data = mockSubsystemStatus[sys.key];
          return (
            <React.Fragment key={sys.key}>
              <StatusBlock
                label={data.label}
                status={data.status}
                icon={sys.icon}
              />
              {idx < subsystems.length - 1 && <Arrow />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {[
          { status: "normal",  color: "#22c55e", label: "Normal"  },
          { status: "warning", color: "#f59e0b", label: "Warning" },
          { status: "fault",   color: "#ef4444", label: "Fault"   },
          { status: "offline", color: "#475569", label: "Offline" },
        ].map((item) => (
          <div key={item.status} style={styles.legendItem}>
            <span
              style={{
                ...styles.legendDot,
                backgroundColor: item.color,
                boxShadow: `0 0 5px ${item.color}`,
              }}
            />
            <span style={styles.legendLabel}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  schematic: {
    display: "flex",
    alignItems: "center",
    gap: 0,
    overflowX: "auto",
    paddingBottom: 8,
  },
  arrowWrapper: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    width: 28,
  },
  arrowLine: {
    height: 2,
    flex: 1,
    backgroundColor: "#2d3d5a",
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderTop: "5px solid transparent",
    borderBottom: "5px solid transparent",
    borderLeft: "7px solid #2d3d5a",
    flexShrink: 0,
  },
  legend: {
    display: "flex",
    gap: 20,
    marginTop: 16,
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  legendLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
};