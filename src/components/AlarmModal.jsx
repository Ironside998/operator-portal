// components/AlarmModal.jsx
// Modal overlay shown when an operator clicks an alarm row.
// Displays full alarm details including raw data values.
// For CRITICAL alarms, requires a mandatory note before acknowledging.
// For non-critical alarms, allows one-click acknowledgment.

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function formatTimestamp(iso) {
  const date = new Date(iso);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AlarmModal({ alarm, onClose, onAcknowledge }) {
  const { auth } = useAuth();
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");

  if (!alarm) return null;

  const isCritical = alarm.severity === "CRITICAL";

  const handleAcknowledge = () => {
    if (isCritical && note.trim().length < 10) {
      setNoteError(
        "A note of at least 10 characters is required for CRITICAL alarms."
      );
      return;
    }
    onAcknowledge(alarm.id, note.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span className={`severity-badge ${alarm.severity}`}>
              {alarm.severity}
            </span>
            <span style={styles.subsystem}>{alarm.subsystem}</span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Timestamp */}
        <p style={styles.timestamp}>{formatTimestamp(alarm.timestamp)}</p>

        {/* Description */}
        <div style={styles.section}>
          <p className="section-title">Description</p>
          <p style={styles.description}>{alarm.description}</p>
        </div>

        {/* Raw data */}
        <div style={styles.section}>
          <p className="section-title">Raw Data at Alarm Time</p>
          <div style={styles.rawDataGrid}>
            {Object.entries(alarm.raw_data).map(([key, val]) => (
              <div key={key} style={styles.rawDataRow}>
                <span style={styles.rawKey}>
                  {key.replace(/_/g, " ").toUpperCase()}
                </span>
                <span style={styles.rawVal}>{String(val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acknowledgment section */}
        {alarm.acknowledged ? (
          <div style={styles.alreadyAck}>
            <span style={{ color: "#22c55e", fontWeight: 600 }}>
              ✓ Acknowledged
            </span>
            <span style={styles.ackMeta}>
              by {alarm.acknowledged_by} at{" "}
              {formatTimestamp(alarm.acknowledged_at)}
            </span>
          </div>
        ) : (
          <div style={styles.ackSection}>
            {isCritical && (
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label>
                  Action Note{" "}
                  <span style={{ color: "#ef4444" }}>
                    * required for CRITICAL
                  </span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    setNoteError("");
                  }}
                  placeholder="Describe the action taken or planned (min. 10 characters)…"
                  rows={3}
                />
                {noteError && (
                  <span className="error-msg">{noteError}</span>
                )}
              </div>
            )}

            <div style={styles.ackFooter}>
              <span style={styles.ackAs}>
                Acknowledging as{" "}
                <strong style={{ color: "#e2e8f0" }}>
                  {auth?.username ?? "operator"}
                </strong>
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className={`btn ${isCritical ? "btn-danger" : "btn-amber"}`}
                  onClick={handleAcknowledge}
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  subsystem: {
    fontSize: 16,
    fontWeight: 700,
    color: "#e2e8f0",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: 16,
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: "#e2e8f0",
    lineHeight: 1.6,
  },
  rawDataGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    backgroundColor: "#0a0d14",
    borderRadius: 8,
    padding: "12px 14px",
    border: "1px solid #1e2a45",
  },
  rawDataRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  rawKey: {
    fontSize: 11,
    color: "#475569",
    fontWeight: 600,
    letterSpacing: "0.04em",
  },
  rawVal: {
    fontSize: 13,
    color: "#e2e8f0",
    fontWeight: 600,
    fontFamily: "monospace",
  },
  alreadyAck: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    backgroundColor: "rgba(34,197,94,0.08)",
    border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: 8,
    padding: "12px 16px",
  },
  ackMeta: {
    fontSize: 12,
    color: "#475569",
  },
  ackSection: {
    borderTop: "1px solid #1e2a45",
    paddingTop: 16,
  },
  ackFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },
  ackAs: {
    fontSize: 12,
    color: "#475569",
  },
};