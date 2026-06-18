// pages/AcBusPage.jsx
// AC Bus detail page.
// Left panel: live bus voltage, frequency, and total current.
// Right panel: historical chart with selectable parameters and time span.

import React from "react";
import HistoricalChart from "../components/HistoricalChart";
import { mockAcBusLive, mockAcBusHistory } from "../mock/mockData";

const ACBUS_PARAMS = [
  { key: "voltage",   label: "Voltage (V)"    },
  { key: "frequency", label: "Frequency (Hz)" },
  { key: "current",   label: "Current (A)"    },
];

function voltageStatus(v) {
  if (v >= 220 && v <= 240) return { label: "Nominal",        color: "#22c55e" };
  if (v >= 210 && v < 220)  return { label: "Low — monitor",  color: "#f59e0b" };
  if (v > 240 && v <= 253)  return { label: "High — monitor", color: "#f59e0b" };
  return                           { label: "Out of range",   color: "#ef4444" };
}

function frequencyStatus(f) {
  if (f >= 49.8 && f <= 50.2) return { label: "Nominal",        color: "#22c55e" };
  if (f >= 49.5 && f < 49.8)  return { label: "Low — monitor",  color: "#f59e0b" };
  if (f > 50.2 && f <= 50.5)  return { label: "High — monitor", color: "#f59e0b" };
  return                             { label: "Out of range",   color: "#ef4444" };
}

export default function AcBusPage() {
  const vStatus = voltageStatus(mockAcBusLive.voltage_v);
  const fStatus = frequencyStatus(mockAcBusLive.frequency_hz);
  const power_kw = (
    (mockAcBusLive.voltage_v * mockAcBusLive.total_current_a) /
    1000
  ).toFixed(2);

  return (
    <div className="page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>AC Bus</h2>
          <p style={styles.subtitle}>
            AC distribution bus · Live data every 10 s
          </p>
        </div>
        <div style={styles.badgeRow}>
          <div
            style={{
              ...styles.statusBadge,
              backgroundColor: `${vStatus.color}14`,
              borderColor: `${vStatus.color}44`,
            }}
          >
            <span
              style={{
                ...styles.statusDot,
                backgroundColor: vStatus.color,
                boxShadow: `0 0 6px ${vStatus.color}`,
              }}
            />
            <span style={{ ...styles.statusLabel, color: vStatus.color }}>
              V: {vStatus.label}
            </span>
          </div>
          <div
            style={{
              ...styles.statusBadge,
              backgroundColor: `${fStatus.color}14`,
              borderColor: `${fStatus.color}44`,
            }}
          >
            <span
              style={{
                ...styles.statusDot,
                backgroundColor: fStatus.color,
                boxShadow: `0 0 6px ${fStatus.color}`,
              }}
            />
            <span style={{ ...styles.statusLabel, color: fStatus.color }}>
              Hz: {fStatus.label}
            </span>
          </div>
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
                style={{ color: vStatus.color }}
              >
                {mockAcBusLive.voltage_v} V
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">Frequency</span>
              <span
                className="live-value"
                style={{ color: fStatus.color }}
              >
                {mockAcBusLive.frequency_hz} Hz
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">Total Current</span>
              <span className="live-value" style={{ color: "#3b82f6" }}>
                {mockAcBusLive.total_current_a} A
              </span>
            </div>

            <div className="live-row">
              <span className="live-label">Apparent Power</span>
              <span className="live-value" style={{ color: "#a855f7" }}>
                {power_kw} kW
              </span>
            </div>
          </div>

          {/* Reference bands — Voltage */}
          <div className="card">
            <p className="section-title">Voltage Reference Bands</p>
            {[
              { range: "> 253 V",    label: "Over-voltage fault",  color: "#ef4444" },
              { range: "240–253 V",  label: "High — monitor",      color: "#f59e0b" },
              { range: "220–240 V",  label: "Nominal operating",   color: "#22c55e" },
              { range: "210–220 V",  label: "Low — monitor",       color: "#f59e0b" },
              { range: "< 210 V",    label: "Under-voltage fault", color: "#ef4444" },
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
            <div style={styles.currentMarker}>
              <span style={styles.currentMarkerLabel}>Current reading</span>
              <span style={{ ...styles.currentMarkerValue, color: vStatus.color }}>
                {mockAcBusLive.voltage_v} V
              </span>
            </div>
          </div>

          {/* Reference bands — Frequency */}
          <div className="card">
            <p className="section-title">Frequency Reference Bands</p>
            {[
              { range: "> 50.5 Hz",       label: "Over-frequency fault",  color: "#ef4444" },
              { range: "50.2–50.5 Hz",    label: "High — monitor",        color: "#f59e0b" },
              { range: "49.8–50.2 Hz",    label: "Nominal operating",     color: "#22c55e" },
              { range: "49.5–49.8 Hz",    label: "Low — monitor",         color: "#f59e0b" },
              { range: "< 49.5 Hz",       label: "Under-frequency fault", color: "#ef4444" },
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
            <div style={styles.currentMarker}>
              <span style={styles.currentMarkerLabel}>Current reading</span>
              <span style={{ ...styles.currentMarkerValue, color: fStatus.color }}>
                {mockAcBusLive.frequency_hz} Hz
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Historical chart ── */}
        <HistoricalChart
          title="Historical Data"
          data={mockAcBusHistory}
          parameters={ACBUS_PARAMS}
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
  badgeRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid",
    borderRadius: 10,
    padding: "8px 14px",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: 600,
  },
  bandRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px 0",
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
    fontSize: 12,
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
    marginTop: 10,
    backgroundColor: "#0a0d14",
    border: "1px solid #1e2a45",
    borderRadius: 8,
    padding: "9px 14px",
  },
  currentMarkerLabel: {
    fontSize: 11,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  currentMarkerValue: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "monospace",
  },
};