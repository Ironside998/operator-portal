// components/AlarmRow.jsx
// A single row in the alarm panel or alarm history page.
// Shows timestamp, subsystem, severity badge, description,
// and acknowledged status. Clicking the row opens the AlarmModal.

import React from "react";

function formatTimestamp(iso) {
  const date = new Date(iso);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AlarmRow({ alarm, onClick }) {
  return (
    <div
      className={`alarm-row ${alarm.acknowledged ? "acknowledged" : ""}`}
      onClick={() => onClick(alarm)}
    >
      {/* Timestamp */}
      <span style={styles.timestamp}>{formatTimestamp(alarm.timestamp)}</span>

      {/* Subsystem */}
      <span style={styles.subsystem}>{alarm.subsystem}</span>

      {/* Severity badge */}
      <span className={`severity-badge ${alarm.severity}`}>
        {alarm.severity}
      </span>

      {/* Description */}
      <span style={styles.description}>{alarm.description}</span>

      {/* Acknowledged indicator */}
      <span style={styles.ackStatus}>
        {alarm.acknowledged ? (
          <span style={styles.ackBadge}>✓ Ack'd</span>
        ) : (
          <span style={styles.unackBadge}>● Active</span>
        )}
      </span>
    </div>
  );
}

const styles = {
  timestamp: {
    fontSize: 12,
    color: "#94a3b8",
    whiteSpace: "nowrap",
  },
  subsystem: {
    fontSize: 13,
    color: "#e2e8f0",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  description: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 1.4,
  },
  ackStatus: {
    display: "flex",
    justifyContent: "flex-end",
  },
  ackBadge: {
    fontSize: 11,
    color: "#475569",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  unackBadge: {
    fontSize: 11,
    color: "#ef4444",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
};