// pages/AcBusPage.jsx
import React, { useState, useEffect } from "react";
import HistoricalChart from "../components/HistoricalChart";
import api from "../api/axiosInstance";

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

function BandTable({ bands, currentValue, unit, statusColor }) {
  return (
    <div className="card">
      <p className="section-title">{unit === "V" ? "Voltage" : "Frequency"} Reference Bands</p>
      {bands.map((band) => (
        <div key={band.range} style={styles.bandRow}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: band.color, flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "#e2e8f0", fontFamily: "monospace" }}>{band.range}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, color: band.color }}>{band.label}</span>
        </div>
      ))}
      <div style={styles.currentMarker}>
        <span style={styles.currentMarkerLabel}>Current reading</span>
        <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "monospace", color: statusColor }}>{currentValue} {unit}</span>
      </div>
    </div>
  );
}

export default function AcBusPage() {
  const [live, setLive] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchLive = async () => {
      try { const res = await api.get("/operator/ac-bus/live"); setLive(res.data); }
      catch (err) { console.error(err); }
    };
    const fetchHistory = async () => {
      try { const res = await api.get("/operator/ac-bus/history?hours=24"); setHistory(res.data.data); }
      catch (err) { console.error(err); }
    };
    fetchLive(); fetchHistory();
    const li = setInterval(fetchLive, 10000);
    const hi = setInterval(fetchHistory, 30000);
    return () => { clearInterval(li); clearInterval(hi); };
  }, []);

  const vStatus = voltageStatus(live?.voltage_v ?? 230);
  const fStatus = frequencyStatus(live?.frequency_hz ?? 50);
  const power_kw = live ? ((live.voltage_v * live.total_current_a) / 1000).toFixed(2) : "—";

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>AC Bus</h2>
          <p style={styles.subtitle}>AC distribution bus · Live data every 10 s</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[{ s: vStatus, prefix: "V:" }, { s: fStatus, prefix: "Hz:" }].map(({ s, prefix }) => (
            <div key={prefix} style={{ ...styles.statusBadge, backgroundColor: `${s.color}14`, borderColor: `${s.color}44` }}>
              <span style={{ ...styles.statusDot, backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}` }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: s.color }}>{prefix} {s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="subsystem-layout">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p className="section-title">Live Readings</p>
            <div className="live-row"><span className="live-label">Bus Voltage</span><span className="live-value" style={{ color: vStatus.color }}>{live?.voltage_v ?? "—"} V</span></div>
            <div className="live-row"><span className="live-label">Frequency</span><span className="live-value" style={{ color: fStatus.color }}>{live?.frequency_hz ?? "—"} Hz</span></div>
            <div className="live-row"><span className="live-label">Total Current</span><span className="live-value" style={{ color: "#3b82f6" }}>{live?.total_current_a ?? "—"} A</span></div>
            <div className="live-row"><span className="live-label">Apparent Power</span><span className="live-value" style={{ color: "#a855f7" }}>{power_kw} kW</span></div>
          </div>

          <BandTable
            bands={[
              { range: "> 253 V",   label: "Over-voltage fault",  color: "#ef4444" },
              { range: "240–253 V", label: "High — monitor",      color: "#f59e0b" },
              { range: "220–240 V", label: "Nominal operating",   color: "#22c55e" },
              { range: "210–220 V", label: "Low — monitor",       color: "#f59e0b" },
              { range: "< 210 V",   label: "Under-voltage fault", color: "#ef4444" },
            ]}
            currentValue={live?.voltage_v ?? "—"}
            unit="V"
            statusColor={vStatus.color}
          />

          <BandTable
            bands={[
              { range: "> 50.5 Hz",     label: "Over-frequency fault",  color: "#ef4444" },
              { range: "50.2–50.5 Hz",  label: "High — monitor",        color: "#f59e0b" },
              { range: "49.8–50.2 Hz",  label: "Nominal operating",     color: "#22c55e" },
              { range: "49.5–49.8 Hz",  label: "Low — monitor",         color: "#f59e0b" },
              { range: "< 49.5 Hz",     label: "Under-frequency fault", color: "#ef4444" },
            ]}
            currentValue={live?.frequency_hz ?? "—"}
            unit="Hz"
            statusColor={fStatus.color}
          />
        </div>

        <HistoricalChart title="Historical Data" data={history} parameters={ACBUS_PARAMS} />
      </div>
    </div>
  );
}

const styles = {
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 },
  title: { fontSize: 22, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  statusBadge: { display: "flex", alignItems: "center", gap: 8, border: "1px solid", borderRadius: 10, padding: "8px 14px" },
  statusDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  bandRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #1e2a45" },
  currentMarker: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, backgroundColor: "#0a0d14", border: "1px solid #1e2a45", borderRadius: 8, padding: "9px 14px" },
  currentMarkerLabel: { fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 },
};