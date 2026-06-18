// components/HistoricalChart.jsx
// Reusable historical data chart used on every subsystem detail page.
// Accepts a dataset, a list of parameters to plot, and a time span selector.
// Renders an interactive line chart using Recharts.

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const TIME_SPANS = [
  { label: "1 hr",   value: 2  },
  { label: "6 hrs",  value: 12 },
  { label: "24 hrs", value: 48 },
];

const LINE_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#06b6d4",
  "#ef4444",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={tooltipStyles.box}>
      <p style={tooltipStyles.label}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color, fontSize: 12 }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function HistoricalChart({ title, data, parameters }) {
  // parameters: [{ key: "soc", label: "SOC (%)" }, ...]
  const [selectedParams, setSelectedParams] = useState([parameters[0].key]);
  const [timeSpan, setTimeSpan] = useState(48);

  const slicedData = useMemo(
    () => data.slice(-timeSpan),
    [data, timeSpan]
  );

  const toggleParam = (key) => {
    setSelectedParams((prev) =>
      prev.includes(key)
        ? prev.length > 1
          ? prev.filter((k) => k !== key)
          : prev // always keep at least one selected
        : [...prev, key]
    );
  };

  return (
    <div className="card">
      {/* Header */}
      <div style={styles.header}>
        <p className="section-title" style={{ marginBottom: 0 }}>
          {title}
        </p>

        {/* Time span selector */}
        <div style={styles.timeSelector}>
          {TIME_SPANS.map((span) => (
            <button
              key={span.value}
              style={{
                ...styles.timeBtn,
                ...(timeSpan === span.value ? styles.timeBtnActive : {}),
              }}
              onClick={() => setTimeSpan(span.value)}
            >
              {span.label}
            </button>
          ))}
        </div>
      </div>

      {/* Parameter toggles */}
      <div style={styles.paramToggles}>
        {parameters.map((param, idx) => {
          const isSelected = selectedParams.includes(param.key);
          const color = LINE_COLORS[idx % LINE_COLORS.length];
          return (
            <button
              key={param.key}
              style={{
                ...styles.paramBtn,
                borderColor: isSelected ? color : "#1e2a45",
                backgroundColor: isSelected
                  ? `${color}18`
                  : "transparent",
                color: isSelected ? color : "#475569",
              }}
              onClick={() => toggleParam(param.key)}
            >
              <span
                style={{
                  ...styles.paramDot,
                  backgroundColor: isSelected ? color : "#475569",
                }}
              />
              {param.label}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={slicedData}
          margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2a45" />
          <XAxis
            dataKey="time"
            tick={{ fill: "#475569", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "#1e2a45" }}
            interval={Math.floor(timeSpan / 6)}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#94a3b8", paddingTop: 8 }}
          />
          {parameters.map((param, idx) =>
            selectedParams.includes(param.key) ? (
              <Line
                key={param.key}
                type="monotone"
                dataKey={param.key}
                name={param.label}
                stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const tooltipStyles = {
  box: {
    background: "#161b2e",
    border: "1px solid #1e2a45",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 12,
  },
  label: {
    color: "#94a3b8",
    marginBottom: 6,
    fontSize: 11,
  },
};

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 8,
  },
  timeSelector: {
    display: "flex",
    gap: 4,
  },
  timeBtn: {
    background: "transparent",
    border: "1px solid #1e2a45",
    borderRadius: 5,
    color: "#475569",
    fontSize: 12,
    padding: "3px 10px",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  timeBtnActive: {
    backgroundColor: "#1c2238",
    borderColor: "#3b82f6",
    color: "#3b82f6",
  },
  paramToggles: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  paramBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    border: "1px solid",
    borderRadius: 5,
    fontSize: 12,
    padding: "3px 10px",
    cursor: "pointer",
    transition: "all 0.15s",
    background: "transparent",
  },
  paramDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    flexShrink: 0,
  },
};