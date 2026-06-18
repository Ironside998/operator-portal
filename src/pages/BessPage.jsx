// pages/BessPage.jsx
// Battery Energy Storage System (BESS) detail page.
// Left panel: live data including SOC, voltage, current, temperature,
// BHS state and 72-hour prediction.
// Right panel: historical chart with selectable parameters and time span.

import React from "react";
import HistoricalChart from "../components/HistoricalChart";
import { mockBessLive, mockBessHistory } from "../mock/mockData";

const BESS_PARAMS = [
  { key: "soc",     label: "SOC (%)"       },
  { key: "voltage", label: "Voltage (V)"   },
  { key: "current", label: "Current (A)"   },
  { key: "temp",    label: "Temperature (°C)" },
];

const trendArrow = {
  up:     { symbol: "↑", color: "#f59e0b" },
  stable: { symbol: "→", color: "#22c55e" },
  down:   { symbol: "↓", color: "#3b82f6" },
};

export default function BessPage() {
  const trend = trendArrow[mockBessLive.bhs_trend] ?? trendArrow.stable;
  const isCharging = mockBessLive.current_a > 0;

  return (
    <div className="page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Battery — BESS</h2>
          <p style={styles.subtitle}>
            Battery Energy Storage System · Live data every 10 s
          </p>
        </div>
        <div style={styles.socBadge}>
          <span style={styles.socValue}>{mockBessLive.soc_pct}%</span>
          <span style={styles.socLabel}>SOC</span>
        </div>
      </div>

      <div className="subsystem-layout">
        {/* ── Left: Live data panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Live readings */}
          <div className="card">
            <p className="section-title">Live Readings</p>

            <div className="live-row">
              <span className="live-label">Bank Voltage</span>
              <span className="live-value" style={{ color: "#06b6d4" }}>
                {mockBessLive.bank_voltage_v} V
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">Current</span>
              <span
                className="live-value"
                style={{ color: isCharging ? "#22c55e" : "#f59e0b" }}
              >
                {mockBessLive.current_a} A
                <span style={styles.currentTag}>
                  {isCharging ? " ▲ Charging" : " ▼ Discharging"}
                </span>
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">State of Charge</span>
              <span className="live-value">
                {mockBessLive.soc_pct}%
              </span>
            </div>

            {/* SOC bar */}
            <div style={styles.socBarWrapper}>
              <div
                style={{
                  ...styles.socBarFill,
                  width: `${mockBessLive.soc_pct}%`,
                  backgroundColor:
                    mockBessLive.soc_pct > 50
                      ? "#22c55e"
                      : mockBessLive.soc_pct > 20
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              />
            </div>

            <div className="live-row">
              <span className="live-label">Cell Temperature</span>
              <span
                className="live-value"
                style={{
                  color:
                    mockBessLive.cell_temp_c > 37
                      ? "#f59e0b"
                      : "#e2e8f0",
                }}
              >
                {mockBessLive.cell_temp_c} °C
              </span>
            </div>
          </div>

          {/* BHS panel */}
          <div className="card">
            <p className="section-title">Battery Health State (BHS)</p>

            <div className="live-row">
              <span className="live-label">Current BHS</span>
              <span
                className="live-value"
                style={{ color: "#a855f7", fontFamily: "monospace" }}
              >
                {mockBessLive.bhs_current}
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">BHS Trend</span>
              <span
                className="live-value"
                style={{ color: trend.color, fontSize: 18 }}
              >
                {trend.symbol}
              </span>
            </div>

            <div style={styles.bhsPrediction}>
              <span style={styles.bhsPredLabel}>72-hr Prediction</span>
              <span style={styles.bhsPredValue}>
                {mockBessLive.bhs_prediction_72h}
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Historical chart ── */}
        <HistoricalChart
          title="Historical Data"
          data={mockBessHistory}
          parameters={BESS_PARAMS}
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
  socBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(168,85,247,0.1)",
    border: "1px solid rgba(168,85,247,0.25)",
    borderRadius: 10,
    padding: "10px 20px",
  },
  socValue: {
    fontSize: 28,
    fontWeight: 700,
    color: "#a855f7",
    lineHeight: 1,
  },
  socLabel: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  currentTag: {
    fontSize: 11,
    fontWeight: 600,
    marginLeft: 4,
  },
  socBarWrapper: {
    height: 8,
    backgroundColor: "#0a0d14",
    borderRadius: 4,
    overflow: "hidden",
    margin: "2px 0 10px",
    border: "1px solid #1e2a45",
  },
  socBarFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.6s ease",
  },
  bhsPrediction: {
    backgroundColor: "#0a0d14",
    border: "1px solid #1e2a45",
    borderRadius: 8,
    padding: "12px 14px",
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  bhsPredLabel: {
    fontSize: 11,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  bhsPredValue: {
    fontSize: 13,
    color: "#e2e8f0",
    fontWeight: 500,
  },
};