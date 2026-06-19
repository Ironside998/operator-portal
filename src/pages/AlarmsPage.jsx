// pages/AlarmsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import AlarmRow from "../components/AlarmRow";
import AlarmModal from "../components/AlarmModal";
import api from "../api/axiosInstance";

const SEVERITIES  = ["ALL", "CRITICAL", "WARNING", "INFO"];
const SUBSYSTEMS  = ["ALL", "PV Array", "Wind (WECS)", "Battery (BESS)", "DC Bus", "AC Bus", "AC Loads"];

export default function AlarmsPage() {
  const [alarms, setAlarms] = useState([]);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [severityFilter,  setSeverityFilter]  = useState("ALL");
  const [subsystemFilter, setSubsystemFilter] = useState("ALL");
  const [statusFilter,    setStatusFilter]    = useState("ALL");

  const fetchAlarms = async () => {
    try {
      const res = await api.get("/operator/alarms");
      setAlarms(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchAlarms();
    const interval = setInterval(fetchAlarms, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = async (id, note) => {
    try {
      await api.post("/operator/alarms/acknowledge", { alarm_id: id, note });
      fetchAlarms();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to acknowledge alarm.");
    }
  };

  const filtered = useMemo(() => {
    return alarms
      .filter((a) => severityFilter  === "ALL" ? true : a.severity  === severityFilter)
      .filter((a) => subsystemFilter === "ALL" ? true : a.subsystem === subsystemFilter)
      .filter((a) => {
        if (statusFilter === "ALL")          return true;
        if (statusFilter === "ACTIVE")       return !a.acknowledged;
        if (statusFilter === "ACKNOWLEDGED") return  a.acknowledged;
        return true;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [alarms, severityFilter, subsystemFilter, statusFilter]);

  const activeCount = alarms.filter((a) => !a.acknowledged).length;

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Alarm History</h2>
          <p style={styles.subtitle}>Full alarm log — filter by subsystem, severity, or status</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ count: activeCount, color: "#ef4444", label: "Active" }, { count: alarms.length - activeCount, color: "#22c55e", label: "Acknowledged" }].map(({ count, color, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: `${color}10`, border: `1px solid ${color}30`, borderRadius: 8, padding: "8px 16px", minWidth: 70, fontSize: 18 }}>
              <span style={{ color, fontWeight: 700 }}>{count}</span>
              <span style={{ color: "#94a3b8", fontSize: 12 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Severity</span>
          <div style={{ display: "flex", gap: 4 }}>
            {SEVERITIES.map((s) => (
              <button key={s} style={{ ...styles.filterBtn, ...(severityFilter === s ? styles.filterBtnActive : {}) }} onClick={() => setSeverityFilter(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Status</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["ALL", "ACTIVE", "ACKNOWLEDGED"].map((s) => (
              <button key={s} style={{ ...styles.filterBtn, ...(statusFilter === s ? styles.filterBtnActive : {}) }} onClick={() => setStatusFilter(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Subsystem</span>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <select value={subsystemFilter} onChange={(e) => setSubsystemFilter(e.target.value)} style={{ fontSize: 12, padding: "5px 10px" }}>
              {SUBSYSTEMS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#475569", marginBottom: 10 }}>
        Showing {filtered.length} of {alarms.length} alarm{alarms.length !== 1 ? "s" : ""}
      </p>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={styles.columnHeaders}>
          <span>Timestamp</span><span>Subsystem</span><span>Severity</span><span>Description</span><span style={{ textAlign: "right" }}>Status</span>
        </div>
        {filtered.length === 0
          ? <div style={{ padding: "28px 16px", fontSize: 14, color: "#475569", textAlign: "center" }}>✅ No alarms match the current filters</div>
          : filtered.map((alarm) => <AlarmRow key={alarm.id} alarm={alarm} onClick={setSelectedAlarm} />)
        }
      </div>

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
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 },
  title: { fontSize: 22, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.02em" },
  subtitle: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  filterBar: { display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-end", backgroundColor: "#161b2e", border: "1px solid #1e2a45", borderRadius: 10, padding: "16px 20px", marginBottom: 16 },
  filterGroup: { display: "flex", flexDirection: "column", gap: 6 },
  filterLabel: { fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" },
  filterBtn: { background: "transparent", border: "1px solid #1e2a45", borderRadius: 5, color: "#475569", fontSize: 12, padding: "4px 10px", cursor: "pointer", transition: "all 0.15s", fontWeight: 500 },
  filterBtnActive: { backgroundColor: "#1c2238", borderColor: "#3b82f6", color: "#3b82f6" },
  columnHeaders: { display: "grid", gridTemplateColumns: "140px 110px 90px 1fr auto", gap: 12, padding: "8px 16px", backgroundColor: "#0a0d14", borderBottom: "1px solid #1e2a45", fontSize: 11, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" },
};