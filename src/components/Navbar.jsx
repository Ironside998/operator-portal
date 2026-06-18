// components/Navbar.jsx
// Persistent top navigation bar for the operator dashboard.
// Shows all subsystem page links, an alarm notification badge,
// the logged-in operator username, and a logout button.

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockAlarms } from "../mock/mockData";

const navLinks = [
  { to: "/overview",  label: "Overview"  },
  { to: "/pv",        label: "PV System" },
  { to: "/wecs",      label: "Wind"      },
  { to: "/bess",      label: "Battery"   },
  { to: "/dc-bus",    label: "DC Bus"    },
  { to: "/ac-bus",    label: "AC Bus"    },
  { to: "/loads",     label: "Loads"     },
];

export default function Navbar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  // Count unacknowledged alarms
  const activeAlarmCount = mockAlarms.filter((a) => !a.acknowledged).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Brand */}
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🔧</span>
          <span style={styles.brandText}>OperatorDash</span>
        </div>

        {/* Nav links */}
        <div style={styles.links}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.linkActive : {}),
              })}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Alarms link with badge */}
          <NavLink
            to="/alarms"
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.linkActive : {}),
              position: "relative",
            })}
          >
            Alarms
            {activeAlarmCount > 0 && (
              <span style={styles.badge}>{activeAlarmCount}</span>
            )}
          </NavLink>
        </div>

        {/* Right side */}
        <div style={styles.right}>
          <span style={styles.username}>{auth?.username ?? "operator"}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#111520",
    borderBottom: "1px solid #1e2a45",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px",
    height: 54,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  brandIcon: {
    fontSize: 18,
  },
  brandText: {
    fontWeight: 700,
    fontSize: 15,
    color: "#e2e8f0",
    letterSpacing: "-0.02em",
    whiteSpace: "nowrap",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    overflowX: "auto",
    flexShrink: 1,
  },
  link: {
    padding: "5px 11px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    color: "#94a3b8",
    whiteSpace: "nowrap",
    transition: "color 0.15s, background 0.15s",
  },
  linkActive: {
    color: "#e2e8f0",
    backgroundColor: "#1c2238",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -2,
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 10,
    padding: "1px 5px",
    lineHeight: 1.4,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  username: {
    fontSize: 12,
    color: "#94a3b8",
    whiteSpace: "nowrap",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #1e2a45",
    borderRadius: 6,
    color: "#94a3b8",
    fontSize: 12,
    padding: "4px 11px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};