// pages/WecsPage.jsx
// Wind Energy Conversion System (WECS) detail page.
// Left panel: live generator voltage, current, power, and wind speed.
// Right panel: historical chart with selectable parameters and time span.

import React from "react";
import HistoricalChart from "../components/HistoricalChart";
import { mockWecsLive, mockWecsHistory } from "../mock/mockData";

const WECS_PARAMS = [
  { key: "power",      label: "Power (kW)"      },
  { key: "wind_speed", label: "Wind Speed (m/s)" },
  { key: "voltage",    label: "Voltage (V)"      },
  { key: "current",    label: "Current (A)"      },
];

function windDescription(speed) {
  if (speed < 3)  return { label: "Calm — below cut-in",   color: "#475569" };
  if (speed < 6)  return { label: "Light breeze",           color: "#3b82f6" };
  if (speed < 10) return { label: "Moderate wind",          color: "#22c55e" };
  if (speed < 14) return { label: "Strong wind",            color: "#f59e0b" };
  return            { label: "Near cut-out — monitor",      color: "#ef4444" };
}

export default function WecsPage() {
  const wind = windDescription(mockWecsLive.wind_speed_ms);
  const efficiency = (
    (mockWecsLive.generator_power_kw / 3.0) * 100
  ).toFixed(1);

  return (
    <div className="page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Wind System — WECS</h2>
          <p style={styles.subtitle}>
            Wind Energy Conversion System · Live data every 10 s
          </p>
        </div>
        <div style={styles.windBadge}>
          <span style={styles.windValue}>{mockWecsLive.wind_speed_ms}</span>
          <span style={styles.windUnit}>m/s</span>
        </div>
      </div>

      <div className="subsystem-layout">
        {/* ── Left: Live data panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Wind speed status */}
          <div
            className="card"
            style={{
              borderColor: `${wind.color}44`,
              backgroundColor: `${wind.color}0d`,
            }}
          >
            <p className="section-title">Wind Condition</p>
            <div style={styles.windRow}>
              <span style={styles.windSpeedLarge}>
                {mockWecsLive.wind_speed_ms}
                <span style={styles.windSpeedUnit}> m/s</span>
              </span>
              <span style={{ ...styles.windLabel, color: wind.color }}>
                {wind.label}
              </span>
            </div>
          </div>

          {/* Live readings */}
          <div className="card">
            <p className="section-title">Generator Live Readings</p>

            <div className="live-row">
              <span className="live-label">Generator Voltage</span>
              <span className="live-value" style={{ color: "#06b6d4" }}>
                {mockWecsLive.generator_voltage_v} V
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">Generator Current</span>
              <span className="live-value" style={{ color: "#3b82f6" }}>
                {mockWecsLive.generator_current_a} A
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">Generator Power</span>
              <span className="live-value" style={{ color: "#22c55e" }}>
                {mockWecsLive.generator_power_kw} kW
              </span>
            </div>
          </div>

          {/* Capacity utilisation */}
          <div className="card">
            <p className="section-title">Capacity Utilisation</p>

            <div style={styles.effRow}>
              <span style={styles.effValue}>{efficiency}%</span>
              <span style={styles.effLabel}>of rated 3.0 kW</span>
            </div>

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
              <span style={styles.ratedValue}>3.0 kW</span>
            </div>
            <div style={styles.ratedRow}>
              <span style={styles.ratedLabel}>Cut-in Speed</span>
              <span style={styles.ratedValue}>3.0 m/s</span>
            </div>
            <div style={styles.ratedRow}>
              <span style={styles.ratedLabel}>Cut-out Speed</span>
              <span style={styles.ratedValue}>14.0 m/s</span>
            </div>
          </div>
        </div>

        {/* ── Right: Historical chart ── */}
        <HistoricalChart
          title="Historical Data"
          data={mockWecsHistory}
          parameters={WECS_PARAMS}
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
  windBadge: {
    display: "flex",
    alignItems: "baseline",
    gap: 6,
    backgroundColor: "rgba(6,182,212,0.1)",
    border: "1px solid rgba(6,182,212,0.25)",
    borderRadius: 10,
    padding: "10px 20px",
  },
  windValue: {
    fontSize: 28,
    fontWeight: 700,
    color: "#06b6d4",
    lineHeight: 1,
  },
  windUnit: {
    fontSize: 14,
    color: "#94a3b8",
  },
  windRow: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  windSpeedLarge: {
    fontSize: 36,
    fontWeight: 700,
    color: "#e2e8f0",
    lineHeight: 1,
  },
  windSpeedUnit: {
    fontSize: 16,
    fontWeight: 400,
    color: "#94a3b8",
  },
  windLabel: {
    fontSize: 13,
    fontWeight: 600,
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
};