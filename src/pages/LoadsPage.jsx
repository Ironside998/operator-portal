// pages/LoadsPage.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";

const MAX_LOAD_KW = 8;

const tariffColors = {
  "Peak":     { bg: "rgba(239,68,68,0.1)",  text: "#ef4444", border: "rgba(239,68,68,0.3)"  },
  "Standard": { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.3)" },
  "Off-Peak": { bg: "rgba(59,130,246,0.1)", text: "#3b82f6", border: "rgba(59,130,246,0.3)" },
};

const tariffRates = { "Peak": 24, "Standard": 18, "Off-Peak": 12 };

function TariffPill({ band }) {
  const c = tariffColors[band] ?? tariffColors["Standard"];
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}`, textTransform: "uppercase" }}>
      {band}
    </span>
  );
}

function PowerBar({ value }) {
  const pct = Math.min((value / MAX_LOAD_KW) * 100, 100);
  const color = pct > 85 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ height: 6, backgroundColor: "#0a0d14", borderRadius: 3, overflow: "hidden", border: "1px solid #1e2a45" }}>
      <div style={{ height: "100%", width: `${pct}%`, backgroundColor: color, borderRadius: 3, transition: "width 0.4s ease" }} />
    </div>
  );
}

export default function LoadsPage() {
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const res = await api.get("/operator/loads");
        setLoads(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchLoads();
    const interval = setInterval(fetchLoads, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalLoad = loads.reduce((s, c) => s + c.active_power_kw, 0).toFixed(1);
  const totalEnergy = loads.reduce((s, c) => s + c.energy_today_kwh, 0).toFixed(1);

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Loads</h2>
          <p style={styles.subtitle}>Per-consumer active power and daily energy · Live data every 10 s</p>
        </div>
      </div>

      <div style={styles.kpiRow}>
        <div className="kpi-card"><span className="kpi-label">Total Active Load</span><div style={{ display: "flex", alignItems: "baseline", gap: 5 }}><span className="kpi-value" style={{ color: "#f59e0b" }}>{totalLoad}</span><span className="kpi-unit">kW</span></div></div>
        <div className="kpi-card"><span className="kpi-label">Total Energy Today</span><div style={{ display: "flex", alignItems: "baseline", gap: 5 }}><span className="kpi-value" style={{ color: "#3b82f6" }}>{totalEnergy}</span><span className="kpi-unit">kWh</span></div></div>
        <div className="kpi-card"><span className="kpi-label">Active Consumers</span><div style={{ display: "flex", alignItems: "baseline", gap: 5 }}><span className="kpi-value" style={{ color: "#22c55e" }}>{loads.length}</span></div></div>
        <div className="kpi-card"><span className="kpi-label">Current Peak Rate</span><div style={{ display: "flex", alignItems: "baseline", gap: 5 }}><span className="kpi-value" style={{ color: "#a855f7" }}>₹24</span><span className="kpi-unit">/ kWh</span></div></div>
      </div>

      <div style={{ marginTop: 24 }}>
        <p className="section-title">Consumer Metering Points</p>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={styles.tableHeader}>
            <span>Meter ID</span><span>Consumer</span><span>Active Power</span>
            <span style={{ gridColumn: "span 2" }}>Load Bar</span>
            <span>Energy Today</span><span>Tariff Band</span><span style={{ textAlign: "right" }}>Est. Cost Today</span>
          </div>
          {loads.map((consumer) => {
            const rate = tariffRates[consumer.tariff_band] ?? 18;
            const estCost = (consumer.energy_today_kwh * rate).toFixed(0);
            const isAlert = consumer.active_power_kw > 6;
            return (
              <div key={consumer.meter_id} style={{ ...styles.tableRow, backgroundColor: isAlert ? "rgba(239,68,68,0.05)" : "transparent", borderLeft: isAlert ? "3px solid #ef4444" : "3px solid transparent" }}>
                <span style={{ fontSize: 12, color: "#3b82f6", fontFamily: "monospace", fontWeight: 600 }}>{consumer.meter_id}</span>
                <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{consumer.consumer}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: isAlert ? "#ef4444" : "#e2e8f0" }}>
                  {consumer.active_power_kw} kW{isAlert && <span style={{ fontSize: 10, fontWeight: 700, color: "#ef4444" }}> ⚠ High</span>}
                </span>
                <div style={{ gridColumn: "span 2", padding: "0 4px" }}><PowerBar value={consumer.active_power_kw} /></div>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{consumer.energy_today_kwh} kWh</span>
                <span><TariffPill band={consumer.tariff_band} /></span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", textAlign: "right" }}>₹{estCost}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 },
  title: { fontSize: 22, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  kpiRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 },
  tableHeader: { display: "grid", gridTemplateColumns: "90px 110px 110px 1fr 80px 90px 80px", gap: 12, padding: "8px 16px", backgroundColor: "#0a0d14", borderBottom: "1px solid #1e2a45", fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" },
  tableRow: { display: "grid", gridTemplateColumns: "90px 110px 110px 1fr 80px 90px 80px", gap: 12, padding: "12px 16px", borderBottom: "1px solid #1e2a45", alignItems: "center", transition: "background 0.12s" },
};