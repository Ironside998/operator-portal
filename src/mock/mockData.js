// mock/mockData.js
// Simulates what the real backend API would return for the operator dashboard.
// Replace each exported object with the corresponding axios.get() call
// once the backend is ready.

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const mockOperator = {
  username: "operator1",
  password: "Operator1!",
  token: "mock.operator.jwt.token",
  role: "operator",
};

// ─── SYSTEM OVERVIEW KPIs ────────────────────────────────────────────────────
export const mockSystemKpis = {
  dc_bus_voltage_v: 48.3,
  ac_bus_voltage_v: 231.4,
  ac_bus_frequency_hz: 49.97,
  total_generation_kw: 7.2,
  total_load_kw: 5.8,
  battery_soc_pct: 73,
};

// ─── SUBSYSTEM STATUS ────────────────────────────────────────────────────────
// status: "normal" | "warning" | "fault" | "offline"
export const mockSubsystemStatus = {
  pv:      { label: "PV Array",  status: "normal"  },
  wecs:    { label: "Wind (WECS)", status: "warning" },
  bess:    { label: "Battery (BESS)", status: "normal" },
  dc_bus:  { label: "DC Bus",    status: "normal"  },
  inverter:{ label: "Inverter",  status: "normal"  },
  ac_loads:{ label: "AC Loads",  status: "fault"   },
};

// ─── ALARMS ──────────────────────────────────────────────────────────────────
export const mockAlarms = [
  {
    id: 1,
    timestamp: "2025-06-18T14:32:00Z",
    subsystem: "AC Loads",
    severity: "CRITICAL",
    description: "Consumer MTR-003 load exceeded 6 kW threshold for >5 minutes.",
    acknowledged: false,
    raw_data: { load_kw: 6.4, threshold_kw: 6.0, duration_min: 7 },
  },
  {
    id: 2,
    timestamp: "2025-06-18T13:10:00Z",
    subsystem: "Wind (WECS)",
    severity: "WARNING",
    description: "Wind generator output 35% below forecast for current wind speed.",
    acknowledged: false,
    raw_data: { forecast_kw: 2.1, actual_kw: 1.37, wind_speed_ms: 6.2 },
  },
  {
    id: 3,
    timestamp: "2025-06-18T11:55:00Z",
    subsystem: "Battery (BESS)",
    severity: "WARNING",
    description: "Cell temperature approaching upper limit — 38.2°C (limit: 40°C).",
    acknowledged: true,
    acknowledged_by: "operator1",
    acknowledged_at: "2025-06-18T12:05:00Z",
    raw_data: { cell_temp_c: 38.2, limit_c: 40.0 },
  },
  {
    id: 4,
    timestamp: "2025-06-18T09:20:00Z",
    subsystem: "PV Array",
    severity: "INFO",
    description: "PV output below forecast — possible shading or soiling detected.",
    acknowledged: true,
    acknowledged_by: "operator1",
    acknowledged_at: "2025-06-18T09:35:00Z",
    raw_data: { forecast_kw: 4.5, actual_kw: 3.8, irradiance_wm2: 620 },
  },
  {
    id: 5,
    timestamp: "2025-06-17T22:14:00Z",
    subsystem: "DC Bus",
    severity: "WARNING",
    description: "DC bus voltage dipped to 44.1 V — below nominal 48 V band.",
    acknowledged: true,
    acknowledged_by: "operator1",
    acknowledged_at: "2025-06-17T22:20:00Z",
    raw_data: { voltage_v: 44.1, nominal_v: 48.0, duration_sec: 12 },
  },
];

// ─── BESS LIVE DATA ───────────────────────────────────────────────────────────
export const mockBessLive = {
  bank_voltage_v: 49.1,
  current_a: -18.4,          // negative = discharging
  soc_pct: 73,
  cell_temp_c: 36.8,
  bhs_current: "BHS-2",
  bhs_prediction_72h: "BHS-2 → BHS-3 in ~14 hrs",
  bhs_trend: "up",           // "up" | "stable" | "down"
};

export const mockBessHistory = Array.from({ length: 48 }, (_, i) => ({
  time: `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
  soc: parseFloat((65 + Math.sin(i / 6) * 12 + Math.random() * 3).toFixed(1)),
  voltage: parseFloat((48 + Math.sin(i / 8) * 1.5 + Math.random() * 0.3).toFixed(2)),
  current: parseFloat((-20 + Math.sin(i / 5) * 15 + Math.random() * 2).toFixed(1)),
  temp: parseFloat((35 + Math.sin(i / 10) * 3 + Math.random() * 0.5).toFixed(1)),
}));

// ─── PV LIVE DATA ─────────────────────────────────────────────────────────────
export const mockPvLive = {
  dc_voltage_v: 182.4,
  dc_current_a: 18.6,
  dc_power_kw: 3.39,
  panel_temp_c: 51.2,
};

export const mockPvHistory = Array.from({ length: 48 }, (_, i) => {
  const hour = i / 2;
  const sun = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
  return {
    time: `${String(Math.floor(hour)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
    power: parseFloat((sun * 4.5 + Math.random() * 0.3).toFixed(2)),
    voltage: parseFloat((sun > 0 ? 175 + sun * 15 + Math.random() * 2 : 0).toFixed(1)),
    current: parseFloat((sun * 20 + Math.random() * 0.5).toFixed(1)),
    temp: parseFloat((25 + sun * 30 + Math.random() * 2).toFixed(1)),
  };
});

// ─── WECS LIVE DATA ───────────────────────────────────────────────────────────
export const mockWecsLive = {
  generator_voltage_v: 48.7,
  generator_current_a: 28.3,
  generator_power_kw: 1.38,
  wind_speed_ms: 6.2,
};

export const mockWecsHistory = Array.from({ length: 48 }, (_, i) => ({
  time: `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
  power: parseFloat((1.5 + Math.sin(i / 7) * 0.8 + Math.random() * 0.4).toFixed(2)),
  wind_speed: parseFloat((5 + Math.sin(i / 5) * 2.5 + Math.random() * 0.5).toFixed(1)),
  voltage: parseFloat((47 + Math.random() * 2).toFixed(1)),
  current: parseFloat((25 + Math.random() * 8).toFixed(1)),
}));

// ─── DC BUS LIVE DATA ─────────────────────────────────────────────────────────
export const mockDcBusLive = {
  voltage_v: 48.3,
  total_current_a: 84.2,
};

export const mockDcBusHistory = Array.from({ length: 48 }, (_, i) => ({
  time: `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
  voltage: parseFloat((48 + Math.sin(i / 10) * 1.2 + Math.random() * 0.3).toFixed(2)),
  current: parseFloat((80 + Math.sin(i / 6) * 12 + Math.random() * 3).toFixed(1)),
}));

// ─── AC BUS LIVE DATA ─────────────────────────────────────────────────────────
export const mockAcBusLive = {
  voltage_v: 231.4,
  frequency_hz: 49.97,
  total_current_a: 25.1,
};

export const mockAcBusHistory = Array.from({ length: 48 }, (_, i) => ({
  time: `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
  voltage: parseFloat((230 + Math.sin(i / 8) * 2 + Math.random() * 0.5).toFixed(1)),
  frequency: parseFloat((50 + (Math.random() - 0.5) * 0.08).toFixed(3)),
  current: parseFloat((23 + Math.sin(i / 5) * 4 + Math.random() * 1).toFixed(1)),
}));

// ─── LOADS LIVE DATA ──────────────────────────────────────────────────────────
export const mockLoadsLive = [
  { meter_id: "MTR-001", consumer: "Consumer 1", active_power_kw: 1.8, energy_today_kwh: 9.2,  tariff_band: "Peak"     },
  { meter_id: "MTR-002", consumer: "Consumer 2", active_power_kw: 2.1, energy_today_kwh: 11.4, tariff_band: "Peak"     },
  { meter_id: "MTR-003", consumer: "Consumer 3", active_power_kw: 6.4, energy_today_kwh: 28.7, tariff_band: "Peak"     },
  { meter_id: "MTR-004", consumer: "Consumer 4", active_power_kw: 0.9, energy_today_kwh: 5.1,  tariff_band: "Standard" },
  { meter_id: "MTR-005", consumer: "Consumer 5", active_power_kw: 1.4, energy_today_kwh: 7.8,  tariff_band: "Off-Peak" },
];

// ─── TARIFF (INR) ─────────────────────────────────────────────────────────────
export const mockTariffINR = {
  peak:     { rate: 24, label: "Peak",     hours: "08:00–12:00, 16:00–21:00" },
  standard: { rate: 18, label: "Standard", hours: "06:00–08:00, 12:00–16:00" },
  offpeak:  { rate: 12, label: "Off-Peak", hours: "21:00–06:00"              },
  currency: "₹",
  unit: "kWh",
};