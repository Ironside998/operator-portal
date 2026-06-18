// pages/DcBusPage.jsx
// DC Bus detail page.
// Left panel: live bus voltage and total current.
// Right panel: historical chart with selectable parameters and time span.

import React from "react";
import HistoricalChart from "../components/HistoricalChart";
import { mockDcBusLive, mockDcBusHistory } from "../mock/mockData";

const DCBUS_PARAMS = [
  { key: "voltage", label: "Voltage (V)"  },
  { key: "current", label: "Current (A)"  },
];

function voltageStatus(v) {
  if (v >= 47 && v <= 49.5) return { label: "Nominal",       color: "#22c55e" };
  if (v >= 45 && v < 47)    return { label: "Low — monitor", color: "#f59e0b" };
  if (v > 49.5 && v <= 52)  return { label: "High — monitor",color: "#f59e0b" };
  return                            { label: "Out of range",  color: "#ef4444" };
}

export default function DcBusPage() {
  const status = voltageStatus(mockDcBusLive.voltage_v);
  const power_kw = (
    (mockDcBusLive.voltage_v * mockDcBusLive.total_current_a) /
    1000
  ).toFixed(2);

  return (
    <div className="page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>DC Bus</h2>
          <p style={styles.subtitle}>
            DC distribution bus · Live data every 10 s
          </p>
        </div>
        <div
          style={{
            ...styles.statusBadge,
            backgroundColor: `${status.color}14`,
            borderColor: `${status.color}44`,
          }}
        >
          <span
            style={{
              ...styles.statusDot,
              backgroundColor: status.color,
              boxShadow: `0 0 6px ${status.color}`,
            }}
          />
          <span style={{ ...styles.statusLabel, color: status.color }}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="subsystem-layout">
        {/* ── Left: Live data panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Live readings */}
          <div className="card">
            <p className="section-title">Live Readings</p>

            <div className="live-row">
              <span className="live-label">Bus Voltage</span>
              <span
                className="live-value"
                style={{ color: status.color }}
              >
                {mockDcBusLive.voltage_v} V
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">Total Current</span>
              <span className="live-value" style={{ color: "#3b82f6" }}>
                {mockDcBusLive.total_current_a} A
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">Apparent Power</span>
              <span className="live-value" style={{ color: "#a855f7" }}>
                {power_kw} kW
              </span>
            </div>
          </div>

          {/* Voltage reference bands */}
          <div className="card">
            <p className="section-title">Voltage Reference Bands</p>

            {[
              { range: "> 52 V",       label: "Over-voltage fault", color: "#ef4444" },
              { range: "49.5 – 52 V",  label: "High — monitor",     color: "#f59e0b" },
              { range: "47 – 49.5 V",  label: "Nominal operating",  color: "#22c55e" },
              { range: "45 – 47 V",    label: "Low — monitor",      color: "#f59e0b" },
              { range: "< 45 V",       label: "Under-voltage fault", color: "#ef4444" },
            ].map((band) => (
              <div key={band.range} style={styles.bandRow}>
                <div style={styles.bandLeft}>
                  <span
                    style={{
                      ...styles.bandDot,
                      backgroundColor: band.color,
                    }}
                  />
                  <span style={styles.bandRange}>{band.range}</span>
                </div>
                <span style={{ ...styles.bandLabel, color: band.color }}>
                  {band.label}
                </span>
              </div>
            ))}

            {/* Current voltage marker */}
            <div style={styles.currentMarker}>
              <span style={styles.currentMarkerLabel}>Current reading</span>
              <span
                style={{
                  ...styles.currentMarkerValue,
                  color: status.color,
                }}
              >
                {mockDcBusLive.voltage_v} V
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Historical chart ── */}
        <HistoricalChart
          title="Historical Data"
          data={mockDcBusHistory}
          parameters={DCBUS_PARAMS}
        />
      </div>
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
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid",
    borderRadius: 10,
    padding: "10px 18px",
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: 600,
  },
  bandRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #1e2a45",
  },
  bandLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  bandDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  bandRange: {
    fontSize: 13,
    color: "#e2e8f0",
    fontFamily: "monospace",
  },
  bandLabel: {
    fontSize: 12,
    fontWeight: 500,
  },
  currentMarker: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#0a0d14",
    border: "1px solid #1e2a45",
    borderRadius: 8,
    padding: "10px 14px",
  },
  currentMarkerLabel: {
    fontSize: 12,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  currentMarkerValue: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "monospace",
  },
};