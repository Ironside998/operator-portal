// pages/PvPage.jsx
// PV Array detail page.
// Left panel: live DC voltage, current, power, and panel temperature.
// Right panel: historical chart with selectable parameters and time span.

import React from "react";
import HistoricalChart from "../components/HistoricalChart";
import { mockPvLive, mockPvHistory } from "../mock/mockData";

const PV_PARAMS = [
  { key: "power",   label: "Power (kW)"       },
  { key: "voltage", label: "Voltage (V)"      },
  { key: "current", label: "Current (A)"      },
  { key: "temp",    label: "Panel Temp (°C)"  },
];

export default function PvPage() {
  const efficiency = (
    (mockPvLive.dc_power_kw / 4.5) *
    100
  ).toFixed(1);

  return (
    <div className="page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>PV Array System</h2>
          <p style={styles.subtitle}>
            Photovoltaic generation · Live data every 10 s
          </p>
        </div>
        <div style={styles.powerBadge}>
          <span style={styles.powerValue}>{mockPvLive.dc_power_kw}</span>
          <span style={styles.powerUnit}>kW</span>
        </div>
      </div>

      <div className="subsystem-layout">
        {/* ── Left: Live data panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Live readings */}
          <div className="card">
            <p className="section-title">Live Readings</p>

            <div className="live-row">
              <span className="live-label">DC Voltage</span>
              <span className="live-value" style={{ color: "#f59e0b" }}>
                {mockPvLive.dc_voltage_v} V
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">DC Current</span>
              <span className="live-value" style={{ color: "#3b82f6" }}>
                {mockPvLive.dc_current_a} A
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">DC Power</span>
              <span className="live-value" style={{ color: "#22c55e" }}>
                {mockPvLive.dc_power_kw} kW
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">Panel Temperature</span>
              <span
                className="live-value"
                style={{
                  color:
                    mockPvLive.panel_temp_c > 55
                      ? "#ef4444"
                      : mockPvLive.panel_temp_c > 45
                      ? "#f59e0b"
                      : "#e2e8f0",
                }}
              >
                {mockPvLive.panel_temp_c} °C
              </span>
            </div>
          </div>

          {/* Capacity utilisation */}
          <div className="card">
            <p className="section-title">Capacity Utilisation</p>

            <div style={styles.effRow}>
              <span style={styles.effValue}>{efficiency}%</span>
              <span style={styles.effLabel}>of rated 4.5 kW</span>
            </div>

            {/* Utilisation bar */}
            <div style={styles.barWrapper}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${efficiency}%`,
                  backgroundColor:
                    parseFloat(efficiency) > 70
                      ? "#22c55e"
                      : parseFloat(efficiency) > 40
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              />
            </div>

            <div style={styles.ratedRow}>
              <span style={styles.ratedLabel}>Rated Capacity</span>
              <span style={styles.ratedValue}>4.5 kW</span>
            </div>

            <div style={styles.ratedRow}>
              <span style={styles.ratedLabel}>Current Output</span>
              <span style={styles.ratedValue}>{mockPvLive.dc_power_kw} kW</span>
            </div>
          </div>

          {/* Tip panel */}
          <div style={styles.tipPanel}>
            <span style={styles.tipIcon}>💡</span>
            <p style={styles.tipText}>
              Overlay PV power against solar irradiance in the historical chart
              to detect soiling or shading events.
            </p>
          </div>
        </div>

        {/* ── Right: Historical chart ── */}
        <HistoricalChart
          title="Historical Data"
          data={mockPvHistory}
          parameters={PV_PARAMS}
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
  powerBadge: {
    display: "flex",
    alignItems: "baseline",
    gap: 6,
    backgroundColor: "rgba(245,158,11,0.1)",
    border: "1px solid rgba(245,158,11,0.25)",
    borderRadius: 10,
    padding: "10px 20px",
  },
  powerValue: {
    fontSize: 28,
    fontWeight: 700,
    color: "#f59e0b",
    lineHeight: 1,
  },
  powerUnit: {
    fontSize: 14,
    color: "#94a3b8",
  },
  effRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 10,
  },
  effValue: {
    fontSize: 32,
    fontWeight: 700,
    color: "#22c55e",
  },
  effLabel: {
    fontSize: 13,
    color: "#94a3b8",
  },
  barWrapper: {
    height: 8,
    backgroundColor: "#0a0d14",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 14,
    border: "1px solid #1e2a45",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.6s ease",
  },
  ratedRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #1e2a45",
  },
  ratedLabel: {
    fontSize: 13,
    color: "#94a3b8",
  },
  ratedValue: {
    fontSize: 13,
    fontWeight: 600,
    color: "#e2e8f0",
  },
  tipPanel: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: "#161b2e",
    border: "1px solid #1e2a45",
    borderRadius: 8,
    padding: "12px 14px",
  },
  tipIcon: {
    fontSize: 16,
    flexShrink: 0,
  },
  tipText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 1.5,
  },
};