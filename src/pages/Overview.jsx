// pages/Overview.jsx
// Operator homepage — the most important page for routine awareness.
// Top section: system schematic + KPI row.
// Bottom section: live alarm panel with acknowledge capability.

import React, { useState } from "react";
import SystemSchematic from "../components/SystemSchematic";
import KpiCard from "../components/KpiCard";
import AlarmRow from "../components/AlarmRow";
import AlarmModal from "../components/AlarmModal";
import { mockSystemKpis, mockAlarms } from "../mock/mockData";

export default function Overview() {
  const [alarms, setAlarms] = useState(mockAlarms);
  const [selectedAlarm, setSelectedAlarm] = useState(null);

  const activeAlarms = alarms.filter((a) => !a.acknowledged);
  const recentAlarms = [...alarms].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  ).slice(0, 6);

  const handleAcknowledge = (id, note) => {
    setAlarms((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              acknowledged: true,
              acknowledged_by: "operator1",
              acknowledged_at: new Date().toISOString(),
              note: note || undefined,
            }
          : a
      )
    );
  };

  return (
    <div className="page">
      {/* Page header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>System Overview</h2>
          <p style={styles.subtitle}>
            Live data · Updates every 10 seconds
          </p>
        </div>
        <div style={styles.alarmSummary}>
          <span style={styles.alarmDot} />
          <span style={styles.alarmCount}>
            {activeAlarms.length} active alarm
            {activeAlarms.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* System schematic */}
      <SystemSchematic />

      {/* KPI row */}
      <div style={{ marginTop: 20 }}>
        <p className="section-title">Key Performance Indicators</p>
        <div className="kpi-grid">
          <KpiCard
            label="DC Bus Voltage"
            value={mockSystemKpis.dc_bus_voltage_v}
            unit="V"
            accentColor="#06b6d4"
          />
          <KpiCard
            label="AC Bus Voltage"
            value={mockSystemKpis.ac_bus_voltage_v}
            unit="V"
            accentColor="#3b82f6"
          />
          <KpiCard
            label="AC Frequency"
            value={mockSystemKpis.ac_bus_frequency_hz}
            unit="Hz"
            accentColor="#a855f7"
          />
          <KpiCard
            label="Total Generation"
            value={mockSystemKpis.total_generation_kw}
            unit="kW"
            accentColor="#22c55e"
          />
          <KpiCard
            label="Total Load"
            value={mockSystemKpis.total_load_kw}
            unit="kW"
            accentColor="#f59e0b"
          />
          <KpiCard
            label="Battery SOC"
            value={`${mockSystemKpis.battery_soc_pct}%`}
            accentColor={
              mockSystemKpis.battery_soc_pct > 50
                ? "#22c55e"
                : mockSystemKpis.battery_soc_pct > 20
                ? "#f59e0b"
                : "#ef4444"
            }
          />
        </div>
      </div>

      {/* Alarm panel */}
      <div style={{ marginTop: 28 }}>
        <div style={styles.alarmHeader}>
          <p className="section-title" style={{ marginBottom: 0 }}>
            Recent Alarms
          </p>
          <a href="/alarms" style={styles.allAlarmsLink}>
            All Alarms →
          </a>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Column headers */}
          <div style={styles.columnHeaders}>
            <span>Timestamp</span>
            <span>Subsystem</span>
            <span>Severity</span>
            <span>Description</span>
            <span style={{ textAlign: "right" }}>Status</span>
          </div>

          {recentAlarms.length === 0 ? (
            <div style={styles.noAlarms}>
              ✅ No alarms in the last 24 hours
            </div>
          ) : (
            recentAlarms.map((alarm) => (
              <AlarmRow
                key={alarm.id}
                alarm={alarm}
                onClick={setSelectedAlarm}
              />
            ))
          )}
        </div>
      </div>

      {/* Alarm modal */}
      {selectedAlarm && (
        <AlarmModal
          alarm={alarms.find((a) => a.id === selectedAlarm.id)}
          onClose={() => setSelectedAlarm(null)}
          onAcknowledge={handleAcknowledge}
        />
      )}
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#e2e8f0",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
  },
  alarmSummary: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 20,
    padding: "5px 14px",
  },
  alarmDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#ef4444",
    boxShadow: "0 0 6px #ef4444",
  },
  alarmCount: {
    fontSize: 13,
    fontWeight: 600,
    color: "#ef4444",
  },
  alarmHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  allAlarmsLink: {
    fontSize: 13,
    color: "#3b82f6",
    fontWeight: 500,
  },
  columnHeaders: {
    display: "grid",
    gridTemplateColumns: "140px 110px 90px 1fr auto",
    gap: 12,
    padding: "8px 16px",
    backgroundColor: "#0a0d14",
    borderBottom: "1px solid #1e2a45",
    fontSize: 11,
    fontWeight: 600,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  noAlarms: {
    padding: "24px 16px",
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
  },
};