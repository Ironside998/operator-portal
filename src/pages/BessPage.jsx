// pages/BessPage.jsx
import React, { useState, useEffect } from "react";
import HistoricalChart from "../components/HistoricalChart";
import api from "../api/axiosInstance";

const BESS_PARAMS = [
  { key: "soc",     label: "SOC (%)"          },
  { key: "voltage", label: "Voltage (V)"      },
  { key: "current", label: "Current (A)"      },
  { key: "temp",    label: "Temperature (°C)" },
];

const trendArrow = {
  up:     { symbol: "↑", color: "#f59e0b" },
  stable: { symbol: "→", color: "#22c55e" },
  down:   { symbol: "↓", color: "#3b82f6" },
};

export default function BessPage() {
  const [live, setLive] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await api.get("/operator/bess/live");
        setLive(res.data);
      } catch (err) { console.error(err); }
    };
    const fetchHistory = async () => {
      try {
        const res = await api.get("/operator/bess/history?hours=24");
        setHistory(res.data.data);
      } catch (err) { console.error(err); }
    };

    fetchLive();
    fetchHistory();
    const li = setInterval(fetchLive, 10000);
    const hi = setInterval(fetchHistory, 30000);
    return () => { clearInterval(li); clearInterval(hi); };
  }, []);

  const trend = trendArrow[live?.bhs_trend] ?? trendArrow.stable;
  const isCharging = (live?.current_a ?? 0) > 0;
  const soc = live?.soc_pct ?? 0;

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Battery — BESS</h2>
          <p style={styles.subtitle}>Battery Energy Storage System · Live data every 10 s</p>
        </div>
        <div style={styles.socBadge}>
          <span style={styles.socValue}>{live ? `${soc}%` : "—"}</span>
          <span style={styles.socLabel}>SOC</span>
        </div>
      </div>

      <div className="subsystem-layout">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p className="section-title">Live Readings</p>
            <div className="live-row">
              <span className="live-label">Bank Voltage</span>
              <span className="live-value" style={{ color: "#06b6d4" }}>{live?.bank_voltage_v ?? "—"} V</span>
            </div>
            <div className="live-row">
              <span className="live-label">Current</span>
              <span className="live-value" style={{ color: isCharging ? "#22c55e" : "#f59e0b" }}>
                {live?.current_a ?? "—"} A
                <span style={{ fontSize: 11, fontWeight: 600, marginLeft: 4 }}>
                  {isCharging ? " ▲ Charging" : " ▼ Discharging"}
                </span>
              </span>
            </div>
            <div className="live-row">
              <span className="live-label">State of Charge</span>
              <span className="live-value">{soc}%</span>
            </div>
            <div style={styles.socBarWrapper}>
              <div style={{ ...styles.socBarFill, width: `${soc}%`, backgroundColor: soc > 50 ? "#22c55e" : soc > 20 ? "#f59e0b" : "#ef4444" }} />
            </div>
            <div className="live-row">
              <span className="live-label">Cell Temperature</span>
              <span className="live-value" style={{ color: (live?.cell_temp_c ?? 0) > 37 ? "#f59e0b" : "#e2e8f0" }}>
                {live?.cell_temp_c ?? "—"} °C
              </span>
            </div>
          </div>

          <div className="card">
            <p className="section-title">Battery Health State (BHS)</p>
            <div className="live-row">
              <span className="live-label">Current BHS</span>
              <span className="live-value" style={{ color: "#a855f7", fontFamily: "monospace" }}>{live?.bhs_current ?? "—"}</span>
            </div>
            <div className="live-row">
              <span className="live-label">BHS Trend</span>
              <span className="live-value" style={{ color: trend.color, fontSize: 18 }}>{trend.symbol}</span>
            </div>
            <div style={styles.bhsPrediction}>
              <span style={styles.bhsPredLabel}>72-hr Prediction</span>
              <span style={styles.bhsPredValue}>{live?.bhs_prediction_72h ?? "—"}</span>
            </div>
          </div>
        </div>

        <HistoricalChart title="Historical Data" data={history} parameters={BESS_PARAMS} />
      </div>
    </div>
  );
}

const styles = {
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 },
  title: { fontSize: 22, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  socBadge: { display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 10, padding: "10px 20px" },
  socValue: { fontSize: 28, fontWeight: 700, color: "#a855f7", lineHeight: 1 },
  socLabel: { fontSize: 11, color: "#94a3b8", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" },
  socBarWrapper: { height: 8, backgroundColor: "#0a0d14", borderRadius: 4, overflow: "hidden", margin: "2px 0 10px", border: "1px solid #1e2a45" },
  socBarFill: { height: "100%", borderRadius: 4, transition: "width 0.6s ease" },
  bhsPrediction: { backgroundColor: "#0a0d14", border: "1px solid #1e2a45", borderRadius: 8, padding: "12px 14px", marginTop: 8, display: "flex", flexDirection: "column", gap: 4 },
  bhsPredLabel: { fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 },
  bhsPredValue: { fontSize: 13, color: "#e2e8f0", fontWeight: 500 },
};