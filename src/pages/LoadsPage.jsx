// pages/LoadsPage.jsx
// Loads detail page.
// Shows a table of all consumers with their live active power,
// daily energy consumption, tariff band, and a visual power bar.

import React from "react";
import { mockLoadsLive, mockTariffINR } from "../mock/mockData";

const MAX_LOAD_KW = 8;

const tariffColors = {
  Peak:      { bg: "rgba(239,68,68,0.1)",   text: "#ef4444",  border: "rgba(239,68,68,0.3)"   },
  Standard:  { bg: "rgba(245,158,11,0.1)",  text: "#f59e0b",  border: "rgba(245,158,11,0.3)"  },
  "Off-Peak":{ bg: "rgba(59,130,246,0.1)",  text: "#3b82f6",  border: "rgba(59,130,246,0.3)"  },
};

function TariffPill({ band }) {
  const colors = tariffColors[band] ?? tariffColors["Standard"];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        textTransform: "uppercase",
      }}
    >
      {band}
    </span>
  );
}

function PowerBar({ value, max }) {
  const pct = Math.min((value / max) * 100, 100);
  const color =
    pct > 85
      ? "#ef4444"
      : pct > 60
      ? "#f59e0b"
      : "#22c55e";

  return (
    <div style={styles.barWrapper}>
      <div
        style={{
          ...styles.barFill,
          width: `${pct}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

export default function LoadsPage() {
  const totalLoad = mockLoadsLive
    .reduce((sum, c) => sum + c.active_power_kw, 0)
    .toFixed(1);

  const totalEnergy = mockLoadsLive
    .reduce((sum, c) => sum + c.energy_today_kwh, 0)
    .toFixed(1);

  const currentRate = mockTariffINR.peak.rate;

  return (
    <div className="page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Loads</h2>
          <p style={styles.subtitle}>
            Per-consumer active power and daily energy · Live data every 10 s
          </p>
        </div>
      </div>

      {/* Summary KPI row */}
      <div style={styles.kpiRow}>
        <div className="kpi-card">
          <span className="kpi-label">Total Active Load</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span className="kpi-value" style={{ color: "#f59e0b" }}>
              {totalLoad}
            </span>
            <span className="kpi-unit">kW</span>
          </div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Total Energy Today</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span className="kpi-value" style={{ color: "#3b82f6" }}>
              {totalEnergy}
            </span>
            <span className="kpi-unit">kWh</span>
          </div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Active Consumers</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span className="kpi-value" style={{ color: "#22c55e" }}>
              {mockLoadsLive.length}
            </span>
          </div>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Current Peak Rate</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span className="kpi-value" style={{ color: "#a855f7" }}>
              ₹{currentRate}
            </span>
            <span className="kpi-unit">/ kWh</span>
          </div>
        </div>
      </div>

      {/* Consumer table */}
      <div style={{ marginTop: 24 }}>
        <p className="section-title">Consumer Metering Points</p>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>

          {/* Table header */}
          <div style={styles.tableHeader}>
            <span>Meter ID</span>
            <span>Consumer</span>
            <span>Active Power</span>
            <span style={{ gridColumn: "span 2" }}>Load Bar</span>
            <span>Energy Today</span>
            <span>Tariff Band</span>
            <span style={{ textAlign: "right" }}>Est. Cost Today</span>
          </div>

          {/* Table rows */}
          {mockLoadsLive.map((consumer) => {
            const bandRate =
              consumer.tariff_band === "Peak"
                ? mockTariffINR.peak.rate
                : consumer.tariff_band === "Standard"
                ? mockTariffINR.standard.rate
                : mockTariffINR.offpeak.rate;

            const estCost = (consumer.energy_today_kwh * bandRate).toFixed(0);
            const isAlert = consumer.active_power_kw > 6;

            return (
              <div
                key={consumer.meter_id}
                style={{
                  ...styles.tableRow,
                  backgroundColor: isAlert
                    ? "rgba(239,68,68,0.05)"
                    : "transparent",
                  borderLeft: isAlert
                    ? "3px solid #ef4444"
                    : "3px solid transparent",
                }}
              >
                <span style={styles.meterId}>{consumer.meter_id}</span>
                <span style={styles.consumerName}>{consumer.consumer}</span>
                <span
                  style={{
                    ...styles.powerValue,
                    color: isAlert ? "#ef4444" : "#e2e8f0",
                  }}
                >
                  {consumer.active_power_kw} kW
                  {isAlert && (
                    <span style={styles.alertTag}> ⚠ High</span>
                  )}
                </span>
                <div style={{ gridColumn: "span 2", padding: "0 4px" }}>
                  <PowerBar value={consumer.active_power_kw} max={MAX_LOAD_KW} />
                </div>
                <span style={styles.energyValue}>
                  {consumer.energy_today_kwh} kWh
                </span>
                <span>
                  <TariffPill band={consumer.tariff_band} />
                </span>
                <span style={styles.costValue}>₹{estCost}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tariff reference */}
      <div style={styles.tariffRef}>
        <p className="section-title" style={{ marginBottom: 10 }}>
          Tariff Reference (INR)
        </p>
        <div style={styles.tariffRow}>
          {Object.entries(mockTariffINR)
            .filter(([k]) => ["peak", "standard", "offpeak"].includes(k))
            .map(([key, t]) => (
              <div key={key} style={styles.tariffItem}>
                <TariffPill band={t.label} />
                <span style={styles.tariffRate}>₹{t.rate} / kWh</span>
                <span style={styles.tariffHours}>{t.hours}</span>
              </div>
            ))}
        </div>
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
  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "90px 110px 110px 1fr 80px 90px 80px",
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
  tableRow: {
    display: "grid",
    gridTemplateColumns: "90px 110px 110px 1fr 80px 90px 80px",
    gap: 12,
    padding: "12px 16px",
    borderBottom: "1px solid #1e2a45",
    alignItems: "center",
    transition: "background 0.12s",
  },
  meterId: {
    fontSize: 12,
    color: "#3b82f6",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  consumerName: {
    fontSize: 13,
    color: "#e2e8f0",
    fontWeight: 500,
  },
  powerValue: {
    fontSize: 14,
    fontWeight: 700,
  },
  alertTag: {
    fontSize: 10,
    fontWeight: 700,
    color: "#ef4444",
  },
  energyValue: {
    fontSize: 13,
    color: "#94a3b8",
  },
  costValue: {
    fontSize: 13,
    fontWeight: 600,
    color: "#e2e8f0",
    textAlign: "right",
  },
  barWrapper: {
    height: 6,
    backgroundColor: "#0a0d14",
    borderRadius: 3,
    overflow: "hidden",
    border: "1px solid #1e2a45",
  },
  barFill: {
    height: "100%",
    borderRadius: 3,
    transition: "width 0.4s ease",
  },
  tariffRef: {
    marginTop: 24,
    backgroundColor: "#161b2e",
    border: "1px solid #1e2a45",
    borderRadius: 10,
    padding: "16px 20px",
  },
  tariffRow: {
    display: "flex",
    gap: 24,
    flexWrap: "wrap",
  },
  tariffItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  tariffRate: {
    fontSize: 14,
    fontWeight: 700,
    color: "#e2e8f0",
  },
  tariffHours: {
    fontSize: 12,
    color: "#475569",
  },
};