// pages/Login.jsx
// Operator login page.
// Same password regex enforcement as the consumer portal.
// On success redirects to /overview.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Username is required.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!PASSWORD_REGEX.test(password)) {
      newErrors.password =
        "Password must be 8+ characters with at least one uppercase letter, one digit, and one special character.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const result = await login(username, password);
    if (result.success) {
      navigate("/overview");
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🔧</span>
          <h1 style={styles.brandName}>OperatorDash</h1>
        </div>
        <p style={styles.subtitle}>
          Microgrid Control & Monitoring System
        </p>
        <div style={styles.accessWarning}>
          ⚠ Authorised personnel only
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Operator Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. operator1"
              autoComplete="username"
            />
            {errors.username && (
              <span className="error-msg">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-msg">{errors.password}</span>
            )}
          </div>

          {serverError && (
            <p className="error-msg" style={{ marginBottom: 12 }}>
              {serverError}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: 4,
              padding: "10px",
            }}
          >
            Sign In
          </button>
        </form>

        {/* Dev hint */}
        <p style={styles.hint}>
          Demo credentials: <strong>operator1</strong> /{" "}
          <strong>Operator1!</strong>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0d14",
    padding: 20,
  },
  card: {
    backgroundColor: "#161b2e",
    border: "1px solid #1e2a45",
    borderRadius: 12,
    padding: "36px 32px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 4px 32px rgba(0,0,0,0.6)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  brandIcon: {
    fontSize: 26,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#e2e8f0",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 16,
  },
  accessWarning: {
    fontSize: 12,
    color: "#f59e0b",
    backgroundColor: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.2)",
    borderRadius: 6,
    padding: "6px 12px",
    marginBottom: 24,
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
  },
};