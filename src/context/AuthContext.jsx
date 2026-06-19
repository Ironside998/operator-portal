// context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("operator_auth");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token, role, username: uname } = res.data;

      if (role !== "operator") {
        return { success: false, error: "This dashboard is for operators only." };
      }

      const session = { token, username: uname, role };
      localStorage.setItem("operator_auth", JSON.stringify(session));
      setAuth(session);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid username or password.";
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem("operator_auth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}