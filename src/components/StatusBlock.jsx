// components/StatusBlock.jsx
// A single subsystem block in the system schematic.
// Shows the subsystem name and a colour-coded status indicator.
// status: "normal" | "warning" | "fault" | "offline"

import React from "react";

const statusColors = {
  normal:  { bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.35)",  text: "#22c55e", label: "Normal"  },
  warning: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.35)", text: "#f59e0b", label: "Warning" },
  fault:   { bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.35)",  text: "#ef4444", label: "Fault"   },
  offline: { bg: "rgba(71,85,105,0.1)",  border: "rgba(71,85,105,0.35)",  text: "#475569", label: "Offline" },
};

export default function StatusBlock({ label, status, icon }) {
  const colors = statusColors[status] ?? statusColors.offline;

  return (
    <div style={{ ...styles.block, backgroundColor: colors.bg, borderColor: colors.border }}>
      {/* Icon */}
      {icon && <span style={styles.icon}>{icon}</span>}

      {/* Label */}
      <span style={styles.label}>{label}</span>

      {/* Status row */}
      <div style={styles.statusRow}>
        <span
          style={{
            ...styles.dot,
            backgroundColor: colors.text,
            boxShadow: `0 0 6px ${colors.text}`,
          }}
        />
        <span style={{ ...styles.statusText, color: colors.text }}>
          {colors.label}
        </span>
      </div>
    </div>
  );
}

const styles = {
  block: {
    border: "1px solid",
    borderRadius: 10,
    padding: "14px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    minWidth: 100,
    flex: 1,
    transition: "opacity 0.2s",
  },
  icon: {
    fontSize: 22,
    lineHeight: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#e2e8f0",
    textAlign: "center",
    lineHeight: 1.3,
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
};